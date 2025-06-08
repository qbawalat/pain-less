-- Migration: Disable RLS for POC
-- Description: Temporarily disables Row Level Security on all tables for early POC development.
--              This migration should be reverted before going to production.
-- Author: Claude
-- Date: 2024-03-20
-- Warning: This is a temporary change for POC purposes only. DO NOT use in production!

-- Disable RLS on health_profiles
alter table health_profiles disable row level security;

-- Disable RLS on supplements
alter table supplements disable row level security;

-- Disable RLS on medical_tests
alter table medical_tests disable row level security;

-- Disable RLS on alerts
alter table alerts disable row level security;

-- Disable RLS on user_supplements
alter table user_supplements disable row level security;

-- Note: To revert this migration, create a new migration with the following commands:
-- alter table health_profiles enable row level security;
-- alter table supplements enable row level security;
-- alter table medical_tests enable row level security;
-- alter table alerts enable row level security;
-- alter table user_supplements enable row level security; 