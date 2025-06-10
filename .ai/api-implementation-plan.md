# API Endpoint Implementation Plan: Health Management System

## 1. Przegląd punktu końcowego

System zarządzania zdrowiem z endpointami do obsługi profili zdrowotnych, suplementów, alertów zdrowotnych i analizy AI. Wszystkie endpointy wymagają autentykacji i implementują walidację danych wejściowych.

## 2. Szczegóły żądania

### Health Profiles

- POST /api/health-profiles

  - Metoda: POST
  - Autentykacja: Wymagana
  - Body: HealthProfileCreate
  - Walidacja: Zod schema
  - Response: HealthProfileResponse (201 Created)
  - Obsługa błędów:
    - 400: Nieprawidłowe dane wejściowe
    - 401: Brak autentykacji
    - 409: Profil już istnieje
    - 500: Błąd serwera

- GET /api/health-profiles

  - Metoda: GET
  - Autentykacja: Wymagana
  - Response: HealthProfileResponse
  - Obsługa błędów:
    - 401: Brak autentykacji
    - 404: Profil nie znaleziony
    - 500: Błąd serwera

- PUT /api/health-profiles
  - Metoda: PUT
  - Autentykacja: Wymagana
  - Body: HealthProfileUpdate
  - Walidacja: Zod schema
  - Response: HealthProfileResponse
  - Obsługa błędów:
    - 400: Nieprawidłowe dane wejściowe
    - 401: Brak autentykacji
    - 404: Profil nie znaleziony
    - 500: Błąd serwera

### Supplements

- GET /api/supplements

  - Metoda: GET
  - Autentykacja: Wymagana
  - Query Params: page, limit, search
  - Response: PaginationResponse<SupplementResponse>

- POST /api/supplements
  - Metoda: POST
  - Autentykacja: Wymagana
  - Body: SupplementCreate
  - Response: SupplementResponse

### User Supplements

- GET /api/user-supplements

  - Metoda: GET
  - Autentykacja: Wymagana
  - Query Params: page, limit, status
  - Response: PaginationResponse<UserSupplementResponse>

- POST /api/user-supplements
  - Metoda: POST
  - Autentykacja: Wymagana
  - Body: UserSupplementCreate
  - Response: UserSupplementResponse

### Health Alerts

- GET /api/health-alerts
  - Metoda: GET
  - Autentykacja: Wymagana
  - Query Params: page, limit, status, type
  - Response: PaginationResponse<HealthAlertResponse>

## 3. Wykorzystywane typy

### DTOs

```typescript
// Health Profile
HealthProfileResponse;
HealthProfileCreate;
HealthProfileUpdate;

// Supplements
SupplementResponse;
SupplementCreate;

// User Supplements
UserSupplementResponse;
UserSupplementCreate;
UserSupplementUpdate;

// Health Alerts
HealthAlertResponse;
HealthAlertAcknowledge;

// Common
PaginationResponse<T>;
```

### Zod Schemas

```typescript
// Health Profile
const healthProfileCreateSchema = z.object({
  birth_date: z.date(),
  height: z.number().positive(),
  weight: z.number().positive(),
  medical_conditions: z.array(z.string()).default([]),
  family_conditions: z.array(z.string()).default([]),
});

const healthProfileUpdateSchema = z.object({
  birth_date: z.date().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  medical_conditions: z.array(z.string()).optional(),
  family_conditions: z.array(z.string()).optional(),
});

// Supplement
const supplementSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  interactions: z.array(z.string()),
});

// User Supplement
const userSupplementSchema = z.object({
  supplement_id: z.string().uuid(),
  start_date: z.date(),
  end_date: z.date().optional(),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
});
```

## 4. Przepływ danych

1. Middleware

   - Autentykacja (Hardcoded dla POC)

   ```typescript
   // src/middleware/auth.ts
   export const getCurrentUser = () => {
     return {
       id: "b8d7c922-9f3f-4796-9742-b1b39e0ac588",
       email: "diego@gmail.com",
     };
   };
   ```

2. Service Layer

   ```typescript
   // HealthProfileService
   class HealthProfileService {
     private readonly userId = "b8d7c922-9f3f-4796-9742-b1b39e0ac588";

     async createProfile(data: HealthProfileCreate): Promise<HealthProfileResponse> {
       // Sprawdź czy profil już istnieje
       const existingProfile = await this.getProfile();
       if (existingProfile) {
         throw new ConflictError("Health profile already exists");
       }

       // Walidacja danych
       const validatedData = healthProfileCreateSchema.parse(data);

       // Utwórz profil
       const profile = await this.db.health_profiles.create({
         data: {
           user_id: this.userId,
           ...validatedData,
         },
       });

       return this.mapToResponse(profile);
     }

     async getProfile(): Promise<HealthProfileResponse> {
       const profile = await this.db.health_profiles.findUnique({
         where: { user_id: this.userId },
       });

       if (!profile) {
         throw new NotFoundError("Health profile not found");
       }

       return this.mapToResponse(profile);
     }

     async updateProfile(data: HealthProfileUpdate): Promise<HealthProfileResponse> {
       // Sprawdź czy profil istnieje
       await this.getProfile();

       // Walidacja danych
       const validatedData = healthProfileUpdateSchema.parse(data);

       // Aktualizuj profil
       const profile = await this.db.health_profiles.update({
         where: { user_id: this.userId },
         data: validatedData,
       });

       return this.mapToResponse(profile);
     }

     private mapToResponse(profile: any): HealthProfileResponse {
       return {
         id: profile.id,
         birth_date: profile.birth_date,
         height: profile.height,
         weight: profile.weight,
         medical_conditions: profile.medical_conditions,
         family_conditions: profile.family_conditions,
         created_at: profile.created_at,
         updated_at: profile.updated_at,
       };
     }
   }

   // SupplementService
   class SupplementService {
     private readonly userId = "b8d7c922-9f3f-4796-9742-b1b39e0ac588";

     async listSupplements(params: PaginationParams): Promise<PaginationResponse<SupplementResponse>>;
     async createSupplement(data: SupplementCreate): Promise<SupplementResponse>;
   }

   // UserSupplementService
   class UserSupplementService {
     private readonly userId = "b8d7c922-9f3f-4796-9742-b1b39e0ac588";

     async listUserSupplements(params: PaginationParams): Promise<PaginationResponse<UserSupplementResponse>>;
     async addUserSupplement(data: UserSupplementCreate): Promise<UserSupplementResponse>;
   }

   // HealthAlertService
   class HealthAlertService {
     private readonly userId = "b8d7c922-9f3f-4796-9742-b1b39e0ac588";

     async listAlerts(params: PaginationParams): Promise<PaginationResponse<HealthAlertResponse>>;
     async acknowledgeAlert(alertId: string): Promise<void>;
   }
   ```

3. Database Layer
   - Supabase client
   - RLS policies
   - Transactions where needed

## 5. Względy bezpieczeństwa

1. Autentykacja (POC)

   - Hardcoded user dla celów POC:
     ```typescript
     const POC_USER = {
       id: "b8d7c922-9f3f-4796-9742-b1b39e0ac588",
       email: "diego@gmail.com",
     };
     ```
   - TODO: Implementacja pełnej autentykacji Supabase w przyszłości
   - TODO: Implementacja JWT validation
   - TODO: Implementacja session management

2. Autoryzacja

   - RLS policies
   - User context validation
   - Resource ownership checks

3. Walidacja danych

   - Zod schemas
   - Input sanitization
   - Type checking

4. Rate Limiting
   - AI endpoints: 10 req/min
   - Other endpoints: 100 req/min

## 6. Obsługa błędów

1. HTTP Status Codes

   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 409: Conflict
   - 422: Validation Error
   - 429: Rate Limit Exceeded
   - 500: Server Error

2. Error Response Structure

   ```typescript
   interface ErrorResponse {
     code: string;
     message: string;
     details?: unknown;
   }
   ```

3. Error Logging
   - Request context
   - User information
   - Stack trace
   - Timestamp

## 7. Rozważania dotyczące wydajności

1. Caching

   - Redis for supplement catalog
   - Response caching where appropriate

2. Database Optimization

   - Proper indexes
   - Query optimization
   - Connection pooling

3. Pagination
   - Cursor-based pagination
   - Limit on page size
   - Efficient count queries

## 8. Etapy wdrożenia

1. Setup

   - Create API routes structure
   - Configure middleware with hardcoded user
   - Setup error handling

2. Database

   - Implement RLS policies
   - Create indexes
   - Setup migrations

3. Services

   - Implement service layer
   - Add validation
   - Setup error handling

4. API Endpoints

   - Implement routes
   - Add request validation
   - Setup response formatting

5. Testing

   - Unit tests
   - Integration tests
   - Load testing

6. Documentation

   - API documentation
   - Error handling guide
   - Security guidelines

7. Monitoring
   - Setup logging
   - Add metrics
   - Configure alerts
