-- Drop old enquiries table (old schema: source, status columns — not what we need)
drop table if exists enquiries cascade;

-- Create new enquiries table
create table enquiries (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('contact', 'partner')),
  name        text not null,
  company     text,
  email       text not null,
  phone       text,
  country     text,
  sector      text,
  program     text,
  message     text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index for common query patterns
create index enquiries_created_at_idx on enquiries (created_at desc);
create index enquiries_read_idx on enquiries (read);
create index enquiries_type_idx on enquiries (type);

-- RLS
alter table enquiries enable row level security;

-- Public (anon) can insert — form submissions
create policy "Public can insert enquiries"
  on enquiries for insert
  to anon
  with check (true);

-- Authenticated admins can read and update (mark read)
create policy "Authenticated can select enquiries"
  on enquiries for select
  to authenticated
  using (true);

create policy "Authenticated can update enquiries"
  on enquiries for update
  to authenticated
  using (true)
  with check (true);
