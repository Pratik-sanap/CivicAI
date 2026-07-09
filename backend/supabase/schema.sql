begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone_number text,
  role text not null default 'citizen' check (role in ('citizen', 'municipal_authority', 'ngo', 'housing_society', 'admin')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  contact_email text,
  contact_phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  complaint_number text not null unique default ('CIV-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  user_id uuid not null references public.users(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  title text not null,
  description text not null,
  category text not null check (category in ('pothole', 'garbage', 'streetlight', 'water_leakage', 'illegal_parking', 'broken_road', 'traffic_signal', 'open_drain', 'construction_waste', 'fallen_tree', 'unknown')),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  confidence numeric(4,3) not null default 0.750 check (confidence >= 0 and confidence <= 1),
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'submitted' check (status in ('submitted', 'in_review', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed')),
  impact text not null,
  complaint_text text not null,
  analysis jsonb not null default '{}'::jsonb,
  image_url text,
  image_path text,
  location_address text,
  ward text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  officer_notes text,
  assigned_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  action text not null check (action in ('created', 'analyzed', 'assigned', 'status_updated', 'comment_added', 'resolved', 'reopened')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_departments_code on public.departments(code);
create index if not exists idx_complaints_user_id on public.complaints(user_id);
create index if not exists idx_complaints_department_id on public.complaints(department_id);
create index if not exists idx_complaints_status on public.complaints(status);
create index if not exists idx_complaints_created_at on public.complaints(created_at desc);
create index if not exists idx_activity_logs_complaint_id on public.activity_logs(complaint_id);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_departments_updated_at
before update on public.departments
for each row execute function public.set_updated_at();

create trigger set_complaints_updated_at
before update on public.complaints
for each row execute function public.set_updated_at();

insert into public.departments (code, name, description, contact_email, is_active)
values
  ('road_works', 'Road Works', 'Road repair, potholes, and street surface maintenance.', 'roadworks@civicai.local', true),
  ('sanitation', 'Sanitation', 'Garbage removal, litter cleanup, and waste disposal.', 'sanitation@civicai.local', true),
  ('electricity', 'Electricity', 'Streetlight outages and electrical infrastructure issues.', 'electricity@civicai.local', true),
  ('water_supply', 'Water Supply', 'Leaks, bursts, and water infrastructure.', 'watersupply@civicai.local', true),
  ('traffic', 'Traffic', 'Signals, enforcement, and traffic management.', 'traffic@civicai.local', true),
  ('public_works', 'Public Works', 'Drainage, roads, and municipal maintenance works.', 'publicworks@civicai.local', true),
  ('parks_and_trees', 'Parks and Trees', 'Tree removal, landscaping, and park maintenance.', 'parks@civicai.local', true),
  ('enforcement', 'Enforcement', 'Illegal parking and civic compliance enforcement.', 'enforcement@civicai.local', true),
  ('general_civic', 'General Civic', 'General intake and issue triage.', 'support@civicai.local', true)
on conflict (code) do nothing;

commit;
