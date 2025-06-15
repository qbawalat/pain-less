-- Migration: Update Supplements Policies
-- Description: Updates supplements table policies to allow any authenticated user to perform CRUD operations
-- Author: Claude
-- Date: 2024-03-20

-- Drop existing supplements policies
drop policy if exists "Authenticated users can view supplements" on supplements;
drop policy if exists "Admin can insert supplements" on supplements;
drop policy if exists "Admin can update supplements" on supplements;
drop policy if exists "Admin can delete supplements" on supplements;

-- Create new policies that allow any authenticated user to perform CRUD operations
create policy "Authenticated users can view supplements"
    on supplements for select
    to authenticated
    using (true);

create policy "Authenticated users can insert supplements"
    on supplements for insert
    to authenticated
    with check (true);

create policy "Authenticated users can update supplements"
    on supplements for update
    to authenticated
    using (true)
    with check (true);

create policy "Authenticated users can delete supplements"
    on supplements for delete
    to authenticated
    using (true); 