import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Execute real PostgreSQL RLS/functions against two independent user identities.
test('private dashboards enforce verified membership and per-user isolation', async () => {
  const db = new PGlite();
  const alice = '00000000-0000-4000-8000-000000000001';
  const bob = '00000000-0000-4000-8000-000000000002';
  const outsider = '00000000-0000-4000-8000-000000000003';
  const unverified = '00000000-0000-4000-8000-000000000004';
  try {
    await db.exec(`
      create role anon nologin; create role authenticated nologin;
      create schema auth;
      create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to authenticated,anon;
      grant execute on function auth.uid() to authenticated,anon;
      insert into auth.users values
        ('${alice}','alice@example.test',now()),('${bob}','bob@example.test',now()),
        ('${outsider}','outsider@example.test',now()),('${unverified}','unverified@example.test',null);
    `);
    await db.exec(await readFile(new URL('../supabase/private-dashboards.sql', import.meta.url), 'utf8'));
    await db.exec(`insert into public.dashboard_members(email) values ('alice@example.test'),('bob@example.test'),('unverified@example.test');`);
    async function asUser(id, sql, params = []) {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
      await db.exec('set role authenticated');
      return db.query(sql, params);
    }
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from public.private_dashboards'), /permission denied/);
    await assert.rejects(db.query('select public.load_private_dashboard()'), /permission denied/);
    await assert.rejects(asUser(outsider,'select public.load_private_dashboard()'), /not enabled/);
    await assert.rejects(asUser(unverified,'select public.load_private_dashboard()'), /not enabled/);
    await assert.rejects(asUser(alice,'select * from public.dashboard_members'), /permission denied/);
    assert.deepEqual((await asUser(alice,'select public.load_private_dashboard() as result')).rows[0].result, { data: null, revision: 0 });
    const save = 'select public.save_private_dashboard($1::jsonb,$2) as revision';
    assert.equal((await asUser(alice,save,[JSON.stringify({ secret:'Alice only' }),0])).rows[0].revision,1);
    assert.equal((await asUser(bob,save,[JSON.stringify({ secret:'Bob only' }),0])).rows[0].revision,1);
    assert.deepEqual((await asUser(bob,'select data from public.private_dashboards')).rows,[{data:{secret:'Bob only'}}]);
    assert.deepEqual((await asUser(alice,'select data from public.private_dashboards')).rows,[{data:{secret:'Alice only'}}]);
    assert.equal((await asUser(bob,`select * from public.private_dashboards where user_id='${alice}'`)).rows.length,0);
    assert.equal((await asUser(bob,`update public.private_dashboards set data='{}' where user_id='${alice}' returning user_id`)).rows.length,0);
    await assert.rejects(asUser(outsider,`insert into public.private_dashboards(user_id,data) values ('${outsider}','{}')`),/row-level security/);
    await assert.rejects(asUser(alice,`delete from public.private_dashboards`),/permission denied/);
    await assert.rejects(asUser(alice,save,[JSON.stringify({lost:'update'}),0]), /changed in another session/);
    assert.equal((await asUser(alice,save,[JSON.stringify({secret:'Alice updated'}),1])).rows[0].revision,2);
    await assert.rejects(asUser(alice,save,[JSON.stringify({lost:'update'}),1]), /changed in another session/);
    assert.deepEqual((await asUser(alice,'select public.load_private_dashboard() as result')).rows[0].result,{data:{secret:'Alice updated'},revision:2});
    await db.exec("reset role; update public.dashboard_members set enabled=false where email='alice@example.test'");
    await assert.rejects(asUser(alice,'select public.load_private_dashboard()'),/not enabled/);
    await assert.rejects(asUser(alice,save,['{}',2]),/not enabled/);
    assert.equal((await asUser(alice,'select * from public.private_dashboards')).rows.length,0);
  } finally { await db.close(); }
});
