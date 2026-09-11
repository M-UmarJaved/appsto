const { Client } = require('pg');
const connectionString = 'postgresql://postgres.xdsfmqidnfpvfrdegxum:qxUn2yMGyDmBnSBJ@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

async function diagnose() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');

    // 1. Check triggers on auth.users and public.users
    const authTriggers = await client.query(`
      SELECT 
        pg_namespace.nspname as schema_name,
        pg_class.relname as table_name,
        pg_trigger.tgname as trigger_name,
        pg_proc.proname as function_name,
        pg_proc.prosrc as function_definition
      FROM pg_trigger
      JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
      JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
      JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
      WHERE (pg_namespace.nspname = 'auth' AND pg_class.relname = 'users')
         OR (pg_namespace.nspname = 'public' AND pg_class.relname = 'users')
         OR (pg_namespace.nspname = 'public' AND pg_class.relname = 'profiles');
    `);
    console.log('\n--- TRIGGERS ON users / profiles ---');
    console.log(JSON.stringify(authTriggers.rows, null, 2));

    // 2. Check public.users columns
    const usersCols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users';
    `);
    console.log('\n--- public.users COLUMNS ---');
    console.log(usersCols.rows);

    // 3. Check public.profiles columns if exists
    const profilesCols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles';
    `);
    console.log('\n--- public.profiles COLUMNS ---');
    console.log(profilesCols.rows);

    // 4. Check active queries and connections (High CPU / Load source)
    const activeQueries = await client.query(`
      SELECT pid, usename, state, wait_event_type, wait_event, query_start, now() - query_start as duration, query
      FROM pg_stat_activity
      WHERE state != 'idle' AND pid != pg_backend_pid()
      ORDER BY duration DESC
      LIMIT 15;
    `);
    console.log('\n--- ACTIVE QUERIES / HIGH USAGE ---');
    console.log(JSON.stringify(activeQueries.rows, null, 2));

    // 5. Total connections count
    const connCount = await client.query(`
      SELECT count(*), state FROM pg_stat_activity GROUP BY state;
    `);
    console.log('\n--- CONNECTION COUNTS ---');
    console.log(connCount.rows);

    // 6. Check database size and table sizes
    const tableSizes = await client.query(`
      SELECT 
        table_name, 
        pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as total_size
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC
      LIMIT 10;
    `);
    console.log('\n--- TOP 10 TABLE SIZES ---');
    console.log(tableSizes.rows);

  } catch(e) {
    console.error('Diagnostic error:', e);
  } finally {
    await client.end();
  }
}

diagnose();
