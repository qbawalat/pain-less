-- Migration: Re-enable RLS and Add Comprehensive CRUD Policies
-- Description: Re-enables Row Level Security and adds comprehensive CRUD policies for all tables
-- Author: Claude
-- Date: 2024-03-20

-- Re-enable RLS on all tables
alter table health_profiles enable row level security;
alter table supplements enable row level security;
alter table user_supplements enable row level security;
alter table health_alerts enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Users can view own health profile" on health_profiles;
drop policy if exists "Users can insert own health profile" on health_profiles;
drop policy if exists "Users can update own health profile" on health_profiles;
drop policy if exists "Users can delete own health profile" on health_profiles;

drop policy if exists "Authenticated users can view supplements" on supplements;
drop policy if exists "Authenticated users can insert supplements" on supplements;
drop policy if exists "Authenticated users can update supplements" on supplements;
drop policy if exists "Authenticated users can delete supplements" on supplements;

drop policy if exists "Users can view own supplements" on user_supplements;
drop policy if exists "Users can insert own supplements" on user_supplements;
drop policy if exists "Users can update own supplements" on user_supplements;
drop policy if exists "Users can delete own supplements" on user_supplements;

drop policy if exists "Users can view own alerts" on health_alerts;
drop policy if exists "Users can insert own alerts" on health_alerts;
drop policy if exists "Users can update own alerts" on health_alerts;
drop policy if exists "Users can delete own alerts" on health_alerts;

-- Health Profiles Policies
create policy "Users can view own health profile"
    on health_profiles for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own health profile"
    on health_profiles for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own health profile"
    on health_profiles for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete own health profile"
    on health_profiles for delete
    to authenticated
    using (auth.uid() = user_id);

-- Supplements Policies (Read-only for authenticated users, admin-only for modifications)
create policy "Authenticated users can view supplements"
    on supplements for select
    to authenticated
    using (true);

create policy "Admin can insert supplements"
    on supplements for insert
    to authenticated
    with check (auth.jwt()->>'role' = 'admin');

create policy "Admin can update supplements"
    on supplements for update
    to authenticated
    using (auth.jwt()->>'role' = 'admin')
    with check (auth.jwt()->>'role' = 'admin');

create policy "Admin can delete supplements"
    on supplements for delete
    to authenticated
    using (auth.jwt()->>'role' = 'admin');

-- User Supplements Policies
create policy "Users can view own supplements"
    on user_supplements for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own supplements"
    on user_supplements for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own supplements"
    on user_supplements for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete own supplements"
    on user_supplements for delete
    to authenticated
    using (auth.uid() = user_id);

-- Health Alerts Policies
create policy "Users can view own alerts"
    on health_alerts for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own alerts"
    on health_alerts for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own alerts"
    on health_alerts for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete own alerts"
    on health_alerts for delete
    to authenticated
    using (auth.uid() = user_id); 