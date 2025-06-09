import { z } from "zod";

// Error types
export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export class AuthenticationError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NetworkError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

// Types
export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ResponseFormat {
  type: "text" | "json_schema";
  json_schema?: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
}

export interface ChatResponse {
  message: string;
  confidence?: number;
  [key: string]: unknown;
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
}

// Configuration schema
const OpenRouterConfigSchema = z.object({
  baseUrl: z.string().url().optional(),
  defaultModel: z.string().optional(),
  maxRetries: z.number().int().positive().optional(),
  timeout: z.number().int().positive().optional(),
});

type OpenRouterConfig = z.infer<typeof OpenRouterConfigSchema>;

// Default configuration
const DEFAULT_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1",
  maxRetries: 3,
  timeout: 30000,
} as const;

// Types for interceptors and metrics
type RequestInterceptor = (request: RequestInit) => Promise<RequestInit> | RequestInit;

type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

interface Metrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastResponseTime: number;
  cacheHits: number;
  cacheMisses: number;
}

export class OpenRouterService {
  private readonly _apiKey: string;
  private readonly _baseUrl: string;
  private readonly _defaultModel?: string;
  private readonly _maxRetries: number;
  private readonly _timeout: number;
  private _models: Model[] = [];
  private _requestQueue: Promise<unknown>[] = [];
  private _lastRequestTime = 0;
  private readonly _minRequestInterval: number = 100;
  private _requestInterceptors: RequestInterceptor[] = [];
  private _responseInterceptors: ResponseInterceptor[] = [];
  private _cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly _cacheTTL: number = 5 * 60 * 1000; // 5 minutes
  private _metrics: Metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    lastResponseTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  constructor(config: OpenRouterConfig) {
    this._validateConfig(config);
    this._apiKey = import.meta.env.OPENROUTER_API_KEY;
    if (!this._apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }
    this._baseUrl = config.baseUrl ?? DEFAULT_CONFIG.baseUrl;
    this._defaultModel = config.defaultModel;
    this._maxRetries = config.maxRetries ?? DEFAULT_CONFIG.maxRetries;
    this._timeout = config.timeout ?? DEFAULT_CONFIG.timeout;
  }

  private _validateConfig(config: OpenRouterConfig): void {
    try {
      OpenRouterConfigSchema.parse(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid configuration: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this._requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this._responseInterceptors.push(interceptor);
  }

  public getMetrics(): Metrics {
    return { ...this._metrics };
  }

  public clearCache(): void {
    this._cache.clear();
  }

  private async _applyRequestInterceptors(request: RequestInit): Promise<RequestInit> {
    let modifiedRequest = { ...request };
    for (const interceptor of this._requestInterceptors) {
      modifiedRequest = await interceptor(modifiedRequest);
    }
    return modifiedRequest;
  }

  private async _applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;
    for (const interceptor of this._responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  private _getCacheKey(endpoint: string, options: RequestInit): string {
    return `${endpoint}:${JSON.stringify(options)}`;
  }

  private _updateMetrics(startTime: number, success: boolean, cacheHit: boolean): void {
    const responseTime = Date.now() - startTime;

    this._metrics.totalRequests++;
    if (success) {
      this._metrics.successfulRequests++;
    } else {
      this._metrics.failedRequests++;
    }

    // Update average response time
    this._metrics.averageResponseTime =
      (this._metrics.averageResponseTime * (this._metrics.totalRequests - 1) + responseTime) /
      this._metrics.totalRequests;

    this._metrics.lastResponseTime = responseTime;

    if (cacheHit) {
      this._metrics.cacheHits++;
    } else {
      this._metrics.cacheMisses++;
    }
  }

  private async _makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    // Check cache for GET requests
    if (options.method === "GET") {
      const cacheKey = this._getCacheKey(endpoint, options);
      const cached = this._cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this._cacheTTL) {
        console.log("[OpenRouter] Cache hit");
        this._updateMetrics(startTime, true, true);
        return new Response(JSON.stringify(cached.data));
      }
    }

    for (let attempt = 0; attempt <= this._maxRetries; attempt++) {
      try {
        await this._waitForRateLimit();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this._timeout);

        try {
          console.log(`[OpenRouter] Making request to ${endpoint} (attempt ${attempt + 1}/${this._maxRetries + 1})`);

          // Apply request interceptors
          const modifiedOptions = await this._applyRequestInterceptors(options);

          const response = await fetch(`${this._baseUrl}${endpoint}`, {
            ...modifiedOptions,
            headers: {
              Authorization: `Bearer ${this._apiKey}`,
              "Content-Type": "application/json",
              ...modifiedOptions.headers,
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            const error = await this._handleResponseError(response);
            if (this._shouldRetry(error, attempt)) {
              console.warn(`[OpenRouter] Retrying after error: ${error.message}`);
              lastError = error;
              continue;
            }
            throw error;
          }

          // Apply response interceptors
          const modifiedResponse = await this._applyResponseInterceptors(response);

          // Cache successful GET responses
          if (options.method === "GET") {
            const cacheKey = this._getCacheKey(endpoint, options);
            const data = await modifiedResponse.clone().json();
            this._cache.set(cacheKey, { data, timestamp: Date.now() });
          }

          console.log(`[OpenRouter] Request successful (attempt ${attempt + 1})`);
          this._updateMetrics(startTime, true, false);
          return modifiedResponse;
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        if (error instanceof OpenRouterError) {
          if (this._shouldRetry(error, attempt)) {
            console.warn(`[OpenRouter] Retrying after error: ${error.message}`);
            lastError = error;
            continue;
          }
          throw error;
        }
        if (error instanceof Error) {
          if (this._shouldRetry(error, attempt)) {
            console.warn(`[OpenRouter] Retrying after network error: ${error.message}`);
            lastError = error;
            continue;
          }
          throw new NetworkError(`Network error: ${error.message}`);
        }
        throw new NetworkError("Unknown network error occurred");
      }
    }

    this._updateMetrics(startTime, false, false);
    throw lastError || new NetworkError("Max retries exceeded");
  }

  private async _waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this._lastRequestTime;

    if (timeSinceLastRequest < this._minRequestInterval) {
      const waitTime = this._minRequestInterval - timeSinceLastRequest;
      console.log(`[OpenRouter] Rate limiting: waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this._lastRequestTime = Date.now();
  }

  private _shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this._maxRetries) {
      return false;
    }

    // Retry on network errors and rate limits
    if (error instanceof NetworkError || error instanceof RateLimitError) {
      return true;
    }

    // Don't retry on validation or authentication errors
    if (error instanceof ValidationError || error instanceof AuthenticationError) {
      return false;
    }

    return false;
  }

  private async _handleResponseError(response: Response): Promise<OpenRouterError> {
    const status = response.status;
    let errorMessage: string;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || `API request failed with status ${status}`;
    } catch {
      errorMessage = `API request failed with status ${status}`;
    }

    switch (status) {
      case 401:
        return new AuthenticationError("Invalid API key");
      case 429:
        return new RateLimitError("Rate limit exceeded");
      default:
        return new NetworkError(errorMessage);
    }
  }

  private _handleError(error: unknown): never {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new OpenRouterError(error.message);
    }
    throw new OpenRouterError("An unknown error occurred");
  }

  public async sendMessage(params: {
    messages: Message[];
    model?: string;
    responseFormat?: ResponseFormat;
    temperature?: number;
    maxTokens?: number;
  }): Promise<ChatResponse> {
    try {
      // Validate messages
      if (!params.messages || params.messages.length === 0) {
        throw new ValidationError("At least one message is required");
      }

      // Prepare request body
      const body = {
        model: params.model || this._defaultModel,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens,
        response_format: params.responseFormat,
      };

      // Make API request
      const response = await this._makeRequest("/chat/completions", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsedContent = JSON.parse(content);

      return {
        message: content,
        confidence: data.choices[0].finish_reason === "stop" ? 1 : 0.5,
        ...parsedContent,
      };
    } catch (error) {
      return this._handleError(error);
    }
  }

  public validateResponse(response: unknown, schema: Record<string, unknown>): boolean {
    try {
      // Extract the content from the response
      const content = typeof response === "string" ? JSON.parse(response) : response;

      // Create a Zod schema from the provided JSON schema
      const zodSchema = z.object({
        choices: z.array(
          z.object({
            message: z.object({
              content: z.string(),
            }),
          })
        ),
      });

      // First validate the basic response structure
      zodSchema.parse(content);

      // Then validate the content against the provided schema
      const contentSchema = z.object(schema as Record<string, z.ZodType>);
      const parsedContent = JSON.parse(content.choices[0].message.content);
      contentSchema.parse(parsedContent);

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Response validation failed: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }
}
