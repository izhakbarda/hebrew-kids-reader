-- Create a table for global app settings
create table public.app_settings (
  setting_key text primary key,
  setting_value jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users
);

-- Enable RLS
alter table public.app_settings enable row level security;

-- Policy: Everyone can read settings
create policy "Everyone can read app settings"
  on public.app_settings for select
  using (true);

-- Policy: Only specific admin can update settings
-- Note: In a real production app, you'd use a custom claim or roles table.
-- For this specific request, we check the email in the JWT.
create policy "Only admin can update app settings"
  on public.app_settings for update
  using (auth.jwt() ->> 'email' = 'izhak.barda@mapcore.com')
  with check (auth.jwt() ->> 'email' = 'izhak.barda@mapcore.com');

create policy "Only admin can insert app settings"
  on public.app_settings for insert
  with check (auth.jwt() ->> 'email' = 'izhak.barda@mapcore.com');

-- Insert initial row for mandatory book (default null)
insert into public.app_settings (setting_key, setting_value)
values ('mandatory_book_id', 'null'::jsonb)
on conflict (setting_key) do nothing;
