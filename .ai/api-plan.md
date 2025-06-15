# REST API Plan

## 1. Resources

### Health Profiles

- Base table: `health_profiles`
- Related to: `auth.users` (one-to-one)

### Supplements

- Base table: `supplements`
- Related to: `user_supplements` (one-to-many)

### User Supplements

- Base table: `user_supplements`
- Related to: `auth.users` and `supplements` (many-to-many)

### Health Alerts

- Base table: `health_alerts`
- Related to: `auth.users` (one-to-many)

## 2. Endpoints

### Health Profiles

#### GET /api/health-profiles

- Description: Get current user's health profile
- Response: 200 OK

```json
{
  "id": "uuid",
  "birth_date": "date",
  "height": "decimal",
  "weight": "decimal",
  "medical_conditions": ["string"],
  "family_conditions": ["string"],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### PUT /api/health-profiles

- Description: Update current user's health profile
- Request Body:

```json
{
  "birth_date": "date",
  "height": "decimal",
  "weight": "decimal",
  "medical_conditions": ["string"],
  "family_conditions": ["string"]
}
```

- Response: 200 OK
- Validation:
  - height > 0
  - weight > 0
  - birth_date is required
  - height is required
  - weight is required

### Supplements

#### GET /api/supplements

- Description: List all supplements
- Query Parameters:
  - page: number
  - limit: number
  - search: string
- Response: 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "interactions": ["string"]
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### POST /api/supplements

- Description: Create a new supplement
- Request Body:

```json
{
  "name": "string",
  "description": "string",
  "interactions": ["string"]
}
```

- Response: 201 Created
- Validation:
  - name is required and must be unique
  - description is optional
  - interactions must be an array of strings
- Response Body:

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "interactions": ["string"],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### User Supplements

#### GET /api/user-supplements

- Description: List current user's supplements
- Query Parameters:
  - page: number
  - limit: number
  - status: "active" | "inactive"
- Response: 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "supplement": {
        "id": "uuid",
        "name": "string",
        "description": "string"
      },
      "start_date": "date",
      "end_date": "date",
      "dosage": "string",
      "frequency": "string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### POST /api/user-supplements

- Description: Add new supplement to user's list
- Request Body:

```json
{
  "supplement_id": "uuid",
  "start_date": "date",
  "end_date": "date",
  "dosage": "string",
  "frequency": "string"
}
```

- Response: 201 Created
- Validation:
  - end_date >= start_date
  - dosage is required
  - frequency is required

#### PUT /api/user-supplements/:id

- Description: Update user's supplement
- Request Body: Same as POST
- Response: 200 OK

#### DELETE /api/user-supplements/:id

- Description: Remove supplement from user's list
- Response: 204 No Content

### Health Alerts

#### GET /api/health-alerts

- Description: List current user's health alerts
- Query Parameters:
  - page: number
  - limit: number
  - status: "pending" | "acknowledged"
  - type: "warning" | "info"
- Response: 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "alert_type": "warning" | "info",
      "message": "string",
      "status": "pending" | "acknowledged",
      "created_at": "timestamp"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### PUT /api/health-alerts/:id/acknowledge

- Description: Acknowledge a health alert
- Response: 200 OK

### AI-Powered Endpoints

#### GET /api/supplement-plans/generate

- Description: Generate personalized supplement plan
- Response: 200 OK

```json
{
  "plan": {
    "recommendations": [
      {
        "supplement_id": "uuid",
        "confidence_score": "number",
        "reasoning": "string",
        "potential_interactions": ["string"]
      }
    ],
    "generated_at": "timestamp"
  }
}
```

#### GET /api/health-analysis

- Description: Request AI health analysis
- Response: 200 OK

```json
{
  "analysis": {
    "alerts": [
      {
        "type": "warning" | "info",
        "message": "string",
        "confidence_score": "number"
      }
    ],
    "generated_at": "timestamp"
  }
}
```

## 3. Authentication and Authorization

### Authentication

- Supabase Auth integration
- JWT-based authentication
- All endpoints require valid authentication token
- Token must be included in Authorization header:
  ```
  Authorization: Bearer <token>
  ```

#### POST /api/auth/forgot-password

- Description: Send password reset link to user's email
- Request Body:

```json
{
  "email": "string"
}
```

- Response: 200 OK
- Validation:
  - email is required and must be valid
- Response Body:

```json
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

- Security:
  - Always return success even if email doesn't exist (prevents email enumeration)
  - Rate limit: 3 requests per hour per IP
  - Reset link expires in 1 hour

### Authorization

- Row Level Security (RLS) policies enforced at database level
- Users can only access their own data
- No admin endpoints in MVP

## 4. Validation and Business Logic

### Validation Rules

1. Health Profiles:

   - Height and weight must be positive numbers
   - Birth date must be valid date
   - Medical and family conditions must be arrays of strings

2. User Supplements:

   - End date must be after start date
   - Dosage and frequency are required
   - Supplement must exist in supplements table

3. Health Alerts:
   - Alert type must be "warning" or "info"
   - Status must be "pending" or "acknowledged"
   - Message is required

### Business Logic Implementation

1. Supplement Plan Generation:

   - AI analyzes user's health profile
   - Checks for potential interactions
   - Generates confidence scores
   - Returns personalized recommendations

2. Health Analysis:

   - Regular AI analysis of user's health data
   - Generates alerts based on analysis
   - Requires user acknowledgment

3. Calendar Integration:
   - Automatic event marking from health profile
   - Supplement period visualization
   - 95% accuracy requirement for event marking

### Error Handling

- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 422 Unprocessable Entity: Validation errors
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server-side errors

### Rate Limiting

- AI endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute
- Rate limit headers included in responses:
  ```
  X-RateLimit-Limit: <limit>
  X-RateLimit-Remaining: <remaining>
  X-RateLimit-Reset: <reset_timestamp>
  ```
