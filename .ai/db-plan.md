# Database Schema Plan - pAIN-less

## Tables

### 1. users (Supabase Auth)
```sql
-- Managed by Supabase Auth
-- Table: auth.users
-- Contains: id, email, encrypted_password, email_confirmed_at, created_at, updated_at, etc.
-- No direct modifications needed - managed by Supabase Auth
```

### 2. health_profiles
```sql
CREATE TABLE health_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    birth_date DATE NOT NULL,
    height DECIMAL(5,2) NOT NULL CHECK (height > 0),
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
    medical_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    family_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_health_profiles_user_id ON health_profiles(user_id);
```

### 3. supplements
```sql
CREATE TABLE supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    interactions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_supplements_name ON supplements(name);
```

### 4. user_supplements
```sql
CREATE TABLE user_supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    supplement_id UUID NOT NULL REFERENCES supplements(id),
    start_date DATE NOT NULL,
    end_date DATE,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Indexes
CREATE INDEX idx_user_supplements_user_id ON user_supplements(user_id);
CREATE INDEX idx_user_supplements_supplement_id ON user_supplements(supplement_id);
CREATE INDEX idx_user_supplements_dates ON user_supplements(start_date, end_date);
```

### 5. health_alerts
```sql
CREATE TABLE health_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    alert_type TEXT NOT NULL CHECK (alert_type IN ('warning', 'info')),
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'acknowledged')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_health_alerts_user_id ON health_alerts(user_id);
CREATE INDEX idx_health_alerts_status ON health_alerts(status);
CREATE INDEX idx_health_alerts_created_at ON health_alerts(created_at);
```

## Row Level Security (RLS) Policies

### health_profiles
```sql
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health profile"
    ON health_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own health profile"
    ON health_profiles FOR UPDATE
    USING (auth.uid() = user_id);
```

### health_alerts
```sql
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
    ON health_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
    ON health_alerts FOR UPDATE
    USING (auth.uid() = user_id);
```

### user_supplements
```sql
ALTER TABLE user_supplements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own supplements"
    ON user_supplements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own supplements"
    ON user_supplements FOR ALL
    USING (auth.uid() = user_id);
```

## Relationships

1. **health_profiles** to **auth.users**
   - One-to-one relationship
   - Foreign key: `user_id` references `auth.users(id)`

2. **health_alerts** to **auth.users**
   - One-to-many relationship
   - Foreign key: `user_id` references `auth.users(id)`

3. **user_supplements** to **auth.users**
   - One-to-many relationship
   - Foreign key: `user_id` references `auth.users(id)`

4. **user_supplements** to **supplements**
   - Many-to-many relationship
   - Junction table: `user_supplements`
   - Foreign keys: `user_id` and `supplement_id`

## Additional Notes

1. Simplified schema for POC with focus on core functionality
2. Removed soft delete functionality to simplify the schema
3. Replaced JSONB with array types for better type safety and query performance
4. Added specific fields for supplement dosage and frequency
5. Simplified alert system with basic warning/info types
6. All tables include `created_at` and `updated_at` timestamps
7. RLS is enabled on all user-related tables
8. Indexes are created on frequently queried columns
9. Added appropriate CHECK constraints for data validation 