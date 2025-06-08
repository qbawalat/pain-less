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
    email TEXT NOT NULL,
    birth_date DATE NOT NULL,
    height DECIMAL(5,2) NOT NULL CHECK (height > 0),
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
    supplement_interactions JSONB DEFAULT '{}',
    last_ai_analysis_at TIMESTAMPTZ,
    last_reminder_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_health_profiles_user_id ON health_profiles(user_id);
CREATE INDEX idx_health_profiles_email ON health_profiles(email);
```

### 3. supplements
```sql
CREATE TABLE supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_supplements_name ON supplements(name);
```

### 4. medical_tests
```sql
CREATE TABLE medical_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    test_name TEXT NOT NULL,
    description TEXT,
    test_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_medical_tests_user_id ON medical_tests(user_id);
CREATE INDEX idx_medical_tests_test_date ON medical_tests(test_date);
```

### 5. alerts
```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    message TEXT NOT NULL,
    is_warning BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
```

### 6. user_supplements
```sql
CREATE TABLE user_supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    supplement_id UUID NOT NULL REFERENCES supplements(id),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Indexes
CREATE INDEX idx_user_supplements_user_id ON user_supplements(user_id);
CREATE INDEX idx_user_supplements_supplement_id ON user_supplements(supplement_id);
CREATE INDEX idx_user_supplements_dates ON user_supplements(start_date, end_date);
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

### medical_tests
```sql
ALTER TABLE medical_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medical tests"
    ON medical_tests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medical tests"
    ON medical_tests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical tests"
    ON medical_tests FOR UPDATE
    USING (auth.uid() = user_id);
```

### alerts
```sql
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
    ON alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
    ON alerts FOR UPDATE
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

2. **medical_tests** to **auth.users**
   - One-to-many relationship
   - Foreign key: `user_id` references `auth.users(id)`

3. **alerts** to **auth.users**
   - One-to-many relationship
   - Foreign key: `user_id` references `auth.users(id)`

4. **user_supplements** to **auth.users**
   - One-to-many relationship
   - Foreign key: `user_id` references `auth.users(id)`

5. **user_supplements** to **supplements**
   - Many-to-many relationship
   - Junction table: `user_supplements`
   - Foreign keys: `user_id` and `supplement_id`

## Additional Notes

1. All tables implement soft delete using `deleted_at` timestamp
2. All tables include `created_at` and `updated_at` timestamps
3. RLS is enabled on all user-related tables
4. JSONB is used for flexible supplement interactions storage
5. Simple CHECK constraints are used for data validation
6. Indexes are created on frequently queried columns
7. No complex indexes on `deleted_at` or `user_id` as per requirements
8. No uniqueness constraints on supplement combinations as per requirements
9. No format validation for test names and descriptions as per requirements 