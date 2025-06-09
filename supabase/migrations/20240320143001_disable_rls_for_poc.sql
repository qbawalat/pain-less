-- Migration: Disable RLS for POC
-- Description: Temporarily disables Row Level Security on all tables for POC development
-- WARNING: This migration is for POC purposes only and should NOT be used in production
-- Author: Claude
-- Date: 2024-03-20

-- Disable RLS on health_profiles
alter table health_profiles disable row level security;

-- Disable RLS on supplements
alter table supplements disable row level security;

-- Disable RLS on user_supplements
alter table user_supplements disable row level security;

-- Disable RLS on health_alerts
alter table health_alerts disable row level security;

-- Note: To re-enable RLS in the future, use the following commands:
-- alter table health_profiles enable row level security;
-- alter table supplements enable row level security;
-- alter table user_supplements enable row level security;
-- alter table health_alerts enable row level security; 