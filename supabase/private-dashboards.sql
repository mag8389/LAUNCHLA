-- Run once in the Supabase SQL editor. No email addresses belong in this file.
begin;
create table public.dashboard_members (
 email text primary key check (email = lower(btrim(email))),
 enabled boolean not null default true
);
alter table public.dashboard_members enable row level security;
revoke all on public.dashboard_members from anon, authenticated;

-- Read the verified account from auth.users, not a user-editable metadata field.
create function public.is_dashboard_member() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (
  select 1 from auth.users u join public.dashboard_members m on m.email=lower(u.email)
  where u.id=(select auth.uid()) and u.email_confirmed_at is not null and m.enabled
 );
$$;
revoke all on function public.is_dashboard_member() from public, anon;
grant execute on function public.is_dashboard_member() to authenticated;

create table public.private_dashboards (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null check (jsonb_typeof(data)='object' and octet_length(data::text)<=5000000),
 revision bigint not null default 1 check (revision>0),
 updated_at timestamptz not null default now()
);
alter table public.private_dashboards enable row level security;
alter table public.private_dashboards force row level security;
revoke all on public.private_dashboards from anon, authenticated;
grant select, insert on public.private_dashboards to authenticated;
grant update (data, revision, updated_at) on public.private_dashboards to authenticated;
create policy own_dashboard_select on public.private_dashboards for select to authenticated
 using (user_id=(select auth.uid()) and (select public.is_dashboard_member()));
create policy own_dashboard_insert on public.private_dashboards for insert to authenticated
 with check (user_id=(select auth.uid()) and (select public.is_dashboard_member()));
create policy own_dashboard_update on public.private_dashboards for update to authenticated
 using (user_id=(select auth.uid()) and (select public.is_dashboard_member()))
 with check (user_id=(select auth.uid()) and (select public.is_dashboard_member()));

-- The caller never supplies an owner ID. Each operation also rechecks membership.
create function public.load_private_dashboard() returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare row_data jsonb; row_revision bigint;
begin
 if not public.is_dashboard_member() then raise exception 'Dashboard access is not enabled for this account' using errcode='42501'; end if;
 select d.data,d.revision into row_data,row_revision from public.private_dashboards d where d.user_id=(select auth.uid());
 return jsonb_build_object('data',row_data,'revision',coalesce(row_revision,0));
end;
$$;
create function public.save_private_dashboard(payload jsonb, expected_revision bigint) returns bigint
language plpgsql security invoker set search_path = '' as $$
declare new_revision bigint;
begin
 if not public.is_dashboard_member() then raise exception 'Dashboard access is not enabled for this account' using errcode='42501'; end if;
 if expected_revision=0 then
  insert into public.private_dashboards(user_id,data) values ((select auth.uid()),payload)
   on conflict (user_id) do nothing returning revision into new_revision;
 else
  update public.private_dashboards set data=payload,revision=revision+1,updated_at=now()
   where user_id=(select auth.uid()) and revision=expected_revision returning revision into new_revision;
 end if;
 if new_revision is null then raise exception 'Dashboard changed in another session; reload before saving' using errcode='40001'; end if;
 return new_revision;
end;
$$;
revoke all on function public.load_private_dashboard() from public, anon;
revoke all on function public.save_private_dashboard(jsonb,bigint) from public, anon;
grant execute on function public.load_private_dashboard() to authenticated;
grant execute on function public.save_private_dashboard(jsonb,bigint) to authenticated;
commit;
