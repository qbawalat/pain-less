# OpenRouter Service Implementation Plan

## 1. Service Description

The OpenRouter service is a TypeScript-based service that interfaces with the OpenRouter API to provide LLM-based chat functionality. It's designed to be integrated with the Astro/React frontend and will handle all communication with various LLM models through the OpenRouter API.

### Key Features
- Integration with multiple LLM models through OpenRouter API
- Structured response handling with JSON schema validation
- System and user message management
- Model parameter configuration
- Error handling and rate limiting
- Secure API key management

## 2. Constructor Description

```typescript
interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  maxRetries?: number;
  timeout?: number;
}

class OpenRouterService {
  constructor(config: OpenRouterConfig) {
    // Implementation details
  }
}
```

### Configuration Parameters
- `apiKey`: OpenRouter API key (required)
- `baseUrl`: API base URL (optional, defaults to OpenRouter's URL)
- `defaultModel`: Default model to use (optional)
- `maxRetries`: Maximum number of retry attempts (optional)
- `timeout`: Request timeout in milliseconds (optional)

## 3. Public Methods and Fields

### Methods

#### `sendMessage`
```typescript
async sendMessage(params: {
  messages: Message[];
  model?: string;
  responseFormat?: ResponseFormat;
  temperature?: number;
  maxTokens?: number;
}): Promise<ChatResponse>
```

#### `getAvailableModels`
```typescript
async getAvailableModels(): Promise<Model[]>
```

#### `validateResponse`
```typescript
validateResponse(response: any, schema: JSONSchema): boolean
```

### Fields
- `config`: Readonly configuration object
- `models`: Cached list of available models
- `rateLimiter`: Rate limiting state

## 4. Private Methods and Fields

### Methods

#### `_makeRequest`
```typescript
private async _makeRequest(endpoint: string, options: RequestOptions): Promise<any>
```

#### `_handleError`
```typescript
private _handleError(error: Error): never
```

#### `_validateConfig`
```typescript
private _validateConfig(config: OpenRouterConfig): void
```

### Fields
- `_apiKey`: Private storage for API key
- `_requestQueue`: Request queue for rate limiting
- `_cache`: Response cache

## 5. Error Handling

### Error Types
1. `OpenRouterError`: Base error class
2. `AuthenticationError`: API key related errors
3. `RateLimitError`: Rate limiting errors
4. `ValidationError`: Schema validation errors
5. `NetworkError`: Network-related errors

### Error Handling Strategy
1. Retry mechanism for transient errors
2. Circuit breaker for persistent failures
3. Detailed error logging
4. User-friendly error messages

## 6. Security Considerations

### API Key Management
1. Store API key in environment variables
2. Never expose API key in client-side code
3. Implement key rotation mechanism

### Request Security
1. Validate all input data
2. Implement request signing
3. Use HTTPS for all API calls
4. Implement rate limiting

### Data Protection
1. Sanitize all user inputs
2. Implement response validation
3. Secure storage of conversation history

## 7. Step-by-Step Implementation Plan

### Phase 1: Basic Setup
1. Create service class structure
2. Implement configuration validation
3. Set up error handling framework
4. Implement basic API communication

### Phase 2: Core Functionality
1. Implement message sending
2. Add response format handling
3. Implement model selection
4. Add parameter configuration

### Phase 3: Advanced Features
1. Implement rate limiting
2. Add response caching
3. Implement retry mechanism
4. Add comprehensive logging

### Phase 4: Integration
1. Create React hooks for frontend integration
2. Implement error boundary components
3. Add loading states
4. Create example usage documentation

## 8. Example Usage

### Basic Message Sending
```typescript
const openRouter = new OpenRouterService({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultModel: 'anthropic/claude-3-opus'
});

const response = await openRouter.sendMessage({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  responseFormat: {
    type: 'json_schema',
    json_schema: {
      name: 'chat_response',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          confidence: { type: 'number' }
        }
      }
    }
  }
});
```

### Model Selection
```typescript
const models = await openRouter.getAvailableModels();
const selectedModel = models.find(m => m.id === 'anthropic/claude-3-opus');
```

## 9. Testing Strategy

### Unit Tests
1. Configuration validation
2. Error handling
3. Response formatting
4. Rate limiting

### Integration Tests
1. API communication
2. Model selection
3. Message handling
4. Error scenarios

### End-to-End Tests
1. Complete conversation flow
2. Error recovery
3. Rate limit handling
4. Cache behavior

## 10. Monitoring and Maintenance

### Metrics to Track
1. API response times
2. Error rates
3. Rate limit hits
4. Cache hit rates

### Maintenance Tasks
1. Regular API key rotation
2. Model availability checks
3. Cache cleanup
4. Log rotation 