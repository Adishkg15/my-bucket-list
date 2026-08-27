-- Bucket List — Phase 1 database schema
-- Safe to run on a fresh Supabase project. Also safe to re-run: table
-- creation, indexes, and policies are all idempotent.
--
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run.

-- gen_random_uuid() lives in pgcrypto. Supabase enables it by default, but
-- this makes the script self-contained regardless.
create extension if not exists pgcrypto;

-- 1. Table -------------------------------------------------------------

create table if not exists public.bucket_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null check (char_length(trim(title)) > 0),
  description   text,
  genre         text not null check (
                  genre in (
                    'travel',
                    'adventure',
                    'career',
                    'money',
                    'relationships',
                    'skills',
                    'health',
                    'creativity',
                    'random_af'
                  )
                ),
  completed     boolean not null default false,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

-- Every dashboard load filters "my items", and every mutation checks
-- ownership — this index keeps both fast as the table grows.
create index if not exists bucket_items_user_id_idx
  on public.bucket_items (user_id);

-- Dashboard also sorts/filters by genre within a user's items.
create index if not exists bucket_items_user_id_genre_idx
  on public.bucket_items (user_id, genre);

-- 2. Row Level Security --------------------------------------------------

alter table public.bucket_items enable row level security;

-- Drop-then-create so this script can be re-run safely if policies change.
drop policy if exists "Users can view their own bucket items" on public.bucket_items;
drop policy if exists "Users can insert their own bucket items" on public.bucket_items;
drop policy if exists "Users can update their own bucket items" on public.bucket_items;
drop policy if exists "Users can delete their own bucket items" on public.bucket_items;

create policy "Users can view their own bucket items"
  on public.bucket_items
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own bucket items"
  on public.bucket_items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own bucket items"
  on public.bucket_items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own bucket items"
  on public.bucket_items
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- No policy exists for the `anon` role, so unauthenticated requests get
-- zero rows back — RLS defaults to deny when no policy matches.