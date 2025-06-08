-- Migration: Initial Schema Setup
-- Description: Creates the core tables for the pAIN-less application including health profiles,
--              supplements, medical tests, alerts, and user supplements with appropriate
--              indexes and RLS policies.
-- Author: Claude
-- Date: 2024-03-20

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create health_profiles table
create table health_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    email text not null,
    birth_date date not null,
    height decimal(5,2) not null check (height > 0),
    weight decimal(5,2) not null check (weight > 0),
    supplement_interactions jsonb default '{}',
    last_ai_analysis_at timestamptz,
    last_reminder_date timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- Create indexes for health_profiles
create index idx_health_profiles_user_id on health_profiles(user_id);
create index idx_health_profiles_email on health_profiles(email);

-- Enable RLS on health_profiles
alter table health_profiles enable row level security;

-- Create RLS policies for health_profiles
create policy "Users can view own health profile"
    on health_profiles for select
    using (auth.uid() = user_id);

create policy "Users can update own health profile"
    on health_profiles for update
    using (auth.uid() = user_id);

-- Create supplements table
create table supplements (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- Create indexes for supplements
create index idx_supplements_name on supplements(name);

-- Enable RLS on supplements
alter table supplements enable row level security;

-- Create RLS policies for supplements (public read access)
create policy "Anyone can view supplements"
    on supplements for select
    using (true);

-- Create medical_tests table
create table medical_tests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    test_name text not null,
    description text,
    test_date date not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- Create indexes for medical_tests
create index idx_medical_tests_user_id on medical_tests(user_id);
create index idx_medical_tests_test_date on medical_tests(test_date);

-- Enable RLS on medical_tests
alter table medical_tests enable row level security;

-- Create RLS policies for medical_tests
create policy "Users can view own medical tests"
    on medical_tests for select
    using (auth.uid() = user_id);

create policy "Users can insert own medical tests"
    on medical_tests for insert
    with check (auth.uid() = user_id);

create policy "Users can update own medical tests"
    on medical_tests for update
    using (auth.uid() = user_id);

-- Create alerts table
create table alerts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    message text not null,
    is_warning boolean not null default false,
    status text not null check (status in ('pending', 'accepted')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- Create indexes for alerts
create index idx_alerts_user_id on alerts(user_id);
create index idx_alerts_status on alerts(status);
create index idx_alerts_created_at on alerts(created_at);

-- Enable RLS on alerts
alter table alerts enable row level security;

-- Create RLS policies for alerts
create policy "Users can view own alerts"
    on alerts for select
    using (auth.uid() = user_id);

create policy "Users can update own alerts"
    on alerts for update
    using (auth.uid() = user_id);

-- Create user_supplements table
create table user_supplements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    supplement_id uuid not null references supplements(id),
    start_date date not null,
    end_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    constraint valid_dates check (end_date is null or end_date >= start_date)
);

-- Create indexes for user_supplements
create index idx_user_supplements_user_id on user_supplements(user_id);
create index idx_user_supplements_supplement_id on user_supplements(supplement_id);
create index idx_user_supplements_dates on user_supplements(start_date, end_date);

-- Enable RLS on user_supplements
alter table user_supplements enable row level security;

-- Create RLS policies for user_supplements
create policy "Users can view own supplements"
    on user_supplements for select
    using (auth.uid() = user_id);

create policy "Users can manage own supplements"
    on user_supplements for all
    using (auth.uid() = user_id); 