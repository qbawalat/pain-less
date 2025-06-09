-- Migration: Initial Schema Setup
-- Description: Creates the core tables for the pAIN-less application including health profiles,
--              supplements, user supplements, and health alerts with appropriate RLS policies
-- Author: Claude
-- Date: 2024-03-20

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create health_profiles table
create table health_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    birth_date date not null,
    height decimal(5,2) not null check (height > 0),
    weight decimal(5,2) not null check (weight > 0),
    medical_conditions text[] default array[]::text[],
    family_conditions text[] default array[]::text[],
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create indexes for health_profiles
create index idx_health_profiles_user_id on health_profiles(user_id);

-- Enable RLS on health_profiles
alter table health_profiles enable row level security;

-- RLS Policies for health_profiles
-- Allow authenticated users to view their own health profile
create policy "Users can view own health profile"
    on health_profiles for select
    to authenticated
    using (auth.uid() = user_id);

-- Allow authenticated users to insert their own health profile
create policy "Users can insert own health profile"
    on health_profiles for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Allow authenticated users to update their own health profile
create policy "Users can update own health profile"
    on health_profiles for update
    to authenticated
    using (auth.uid() = user_id);

-- Create supplements table
create table supplements (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    interactions text[] default array[]::text[],
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create indexes for supplements
create index idx_supplements_name on supplements(name);

-- Enable RLS on supplements
alter table supplements enable row level security;

-- RLS Policies for supplements
-- Allow all authenticated users to view supplements
create policy "Authenticated users can view supplements"
    on supplements for select
    to authenticated
    using (true);

-- Create user_supplements table
create table user_supplements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    supplement_id uuid not null references supplements(id),
    start_date date not null,
    end_date date,
    dosage text not null,
    frequency text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint valid_dates check (end_date is null or end_date >= start_date)
);

-- Create indexes for user_supplements
create index idx_user_supplements_user_id on user_supplements(user_id);
create index idx_user_supplements_supplement_id on user_supplements(supplement_id);
create index idx_user_supplements_dates on user_supplements(start_date, end_date);

-- Enable RLS on user_supplements
alter table user_supplements enable row level security;

-- RLS Policies for user_supplements
-- Allow authenticated users to view their own supplements
create policy "Users can view own supplements"
    on user_supplements for select
    to authenticated
    using (auth.uid() = user_id);

-- Allow authenticated users to insert their own supplements
create policy "Users can insert own supplements"
    on user_supplements for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Allow authenticated users to update their own supplements
create policy "Users can update own supplements"
    on user_supplements for update
    to authenticated
    using (auth.uid() = user_id);

-- Allow authenticated users to delete their own supplements
create policy "Users can delete own supplements"
    on user_supplements for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create health_alerts table
create table health_alerts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    alert_type text not null check (alert_type in ('warning', 'info')),
    message text not null,
    status text not null check (status in ('pending', 'acknowledged')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create indexes for health_alerts
create index idx_health_alerts_user_id on health_alerts(user_id);
create index idx_health_alerts_status on health_alerts(status);
create index idx_health_alerts_created_at on health_alerts(created_at);

-- Enable RLS on health_alerts
alter table health_alerts enable row level security;

-- RLS Policies for health_alerts
-- Allow authenticated users to view their own alerts
create policy "Users can view own alerts"
    on health_alerts for select
    to authenticated
    using (auth.uid() = user_id);

-- Allow authenticated users to insert their own alerts
create policy "Users can insert own alerts"
    on health_alerts for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Allow authenticated users to update their own alerts
create policy "Users can update own alerts"
    on health_alerts for update
    to authenticated
    using (auth.uid() = user_id);

-- Allow authenticated users to delete their own alerts
create policy "Users can delete own alerts"
    on health_alerts for delete
    to authenticated
    using (auth.uid() = user_id); 