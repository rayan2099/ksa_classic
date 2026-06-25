-- Run this migration if schema.sql was already installed before Resend support.

alter table public.messages
  alter column car_id drop not null;

alter table public.messages
  add column if not exists confirmation_email_id text,
  add column if not exists confirmation_email_status text not null default 'pending';

alter table public.message_replies
  add column if not exists email_id text,
  add column if not exists email_status text not null default 'pending';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'messages_confirmation_email_status_check'
  ) then
    alter table public.messages
      add constraint messages_confirmation_email_status_check
      check (confirmation_email_status in ('pending', 'sent', 'failed', 'skipped'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'message_replies_email_status_check'
  ) then
    alter table public.message_replies
      add constraint message_replies_email_status_check
      check (email_status in ('pending', 'sent', 'failed', 'skipped'));
  end if;
end
$$;

