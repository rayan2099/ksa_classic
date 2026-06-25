-- KSA Classics: complete Supabase database schema
-- Run this file in Supabase Dashboard > SQL Editor.

create extension if not exists citext;
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  role text not null default 'sub_admin' check (role in ('super_admin', 'sub_admin')),
  email citext not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  make text not null check (char_length(make) between 1 and 80),
  model text not null check (char_length(model) between 1 and 120),
  year integer not null check (year between 1886 and 2100),
  price numeric(14, 2) not null check (price >= 0),
  mileage integer not null default 0 check (mileage >= 0),
  location text not null default 'Location on request',
  description text not null default '',
  condition text not null default 'available'
    check (condition in ('new_arrival', 'available', 'sold')),
  type text not null default 'classic'
    check (type in ('classic', 'project')),
  images text[] not null default '{}',
  contact_phone text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references public.cars(id) on delete cascade,
  buyer_name text not null check (char_length(buyer_name) between 2 and 120),
  buyer_email citext not null default '',
  buyer_phone text not null default '',
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  confirmation_email_id text,
  confirmation_email_status text not null default 'pending'
    check (confirmation_email_status in ('pending', 'sent', 'failed', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  sender_email citext not null,
  message text not null check (char_length(message) between 1 and 5000),
  email_id text,
  email_status text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  token_hash text primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists cars_created_at_idx
  on public.cars (created_at desc);
create index if not exists cars_condition_idx
  on public.cars (condition);
create index if not exists cars_type_idx
  on public.cars (type);
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);
create index if not exists messages_is_read_idx
  on public.messages (is_read, created_at desc);
create index if not exists messages_car_id_idx
  on public.messages (car_id);
create index if not exists message_replies_message_id_idx
  on public.message_replies (message_id, created_at);
create index if not exists admin_sessions_profile_id_idx
  on public.admin_sessions (profile_id);
create index if not exists admin_sessions_expires_at_idx
  on public.admin_sessions (expires_at);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

drop trigger if exists messages_set_updated_at on public.messages;
create trigger messages_set_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

-- Automatically creates a sub-admin profile when a Supabase Auth user is created.
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    'sub_admin',
    new.email
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_admin_user();

create or replace function public.sync_admin_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email,
      full_name = coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), full_name)
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_admin_user_profile();

alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.messages enable row level security;
alter table public.message_replies enable row level security;
alter table public.admin_sessions enable row level security;

-- The public showroom can read inventory directly if needed.
drop policy if exists "Public can view showroom cars" on public.cars;
create policy "Public can view showroom cars"
on public.cars
for select
to anon, authenticated
using (true);

-- All other table access is intentionally server-only through the service role.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.messages from anon, authenticated;
revoke all on table public.message_replies from anon, authenticated;
revoke all on table public.admin_sessions from anon, authenticated;
revoke all on table public.cars from anon, authenticated;
grant select on table public.cars to anon, authenticated;

-- Public vehicle-image bucket. Upload/delete operations stay server-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images',
  'vehicle-images',
  true,
  15728640,
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view vehicle images" on storage.objects;
create policy "Public can view vehicle images"
on storage.objects
for select
to public
using (bucket_id = 'vehicle-images');
