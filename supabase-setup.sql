create table if not exists public.site_content (
  id bigint primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read site content"
on public.site_content
for select
to anon
using (true);

create policy "Public can upsert site content"
on public.site_content
for all
to anon
using (true)
with check (true);

insert into public.site_content (id, content)
values (
  1,
  '{}'::jsonb
)
on conflict (id) do nothing;

alter publication supabase_realtime add table public.site_content;
