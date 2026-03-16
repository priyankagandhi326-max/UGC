create type public.brand_niche as enum ('lifestyle', 'wellness', 'fashion', 'beauty');

create table if not exists public.brands (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  niche public.brand_niche not null,
  instagram_handle text,
  shopify_url text,
  created_at timestamptz not null default now()
);

alter table public.brands enable row level security;

create policy "Brands can read own profile"
  on public.brands
  for select
  using (auth.uid() = id);

create policy "Brands can insert own profile"
  on public.brands
  for insert
  with check (auth.uid() = id);

create policy "Brands can update own profile"
  on public.brands
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
