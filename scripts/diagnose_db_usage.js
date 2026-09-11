const { Client } = require('pg');
const connectionString = 'postgresql://postgres.xdsfmqidnfpvfrdegxum:qxUn2yMGyDmBnSBJ@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

async function diagnoseUsage() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');

    // 1. Check if pg_stat_statements extension is available and get top queries by total time
    try {
      const topQueries = await client.query(`
        SELECT 
          calls, 
          round(total_exec_time::numeric, 2) as total_time_ms, 
          round(mean_exec_time::numeric, 2) as mean_time_ms, 
          round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) as percentage_cpu,
          rows, 
          query
        FROM pg_stat_statements
        ORDER BY total_exec_time DESC
        LIMIT 10;
      `);
      console.log('\n--- TOP QUERIES BY TOTAL EXECUTION TIME ---');
      console.log(JSON.stringify(topQueries.rows, null, 2));
    } catch(e) {
      console.log('pg_stat_statements query note:', e.message);
    }

    // 2. Check all active/idle connections and client applications
    const connections = await client.query(`
      SELECT 
        application_name,
        client_addr,
        state,
        count(*) as connection_count
      FROM pg_stat_activity
      GROUP BY application_name, client_addr, state
      ORDER BY connection_count DESC;
    `);
    console.log('\n--- CONNECTION BREAKDOWN ---');
    console.log(JSON.stringify(connections.rows, null, 2));

    // 3. Check pooler settings or max_connections
    const settings = await client.query(`
      SELECT name, setting, unit, short_desc 
      FROM pg_settings 
      WHERE name IN ('max_connections', 'shared_buffers', 'work_mem', 'statement_timeout', 'idle_in_transaction_session_timeout');
    `);
    console.log('\n--- DB SETTINGS ---');
    console.log(JSON.stringify(settings.rows, null, 2));

    // 4. Check replication and WAL / vacuum status
    const autovacuum = await client.query(`
      SELECT relname, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze, n_dead_tup, n_live_tup
      FROM pg_stat_user_tables
      ORDER BY n_dead_tup DESC;
    `);
    console.log('\n--- AUTOVACUUM & DEAD TUPLES ---');
    console.log(JSON.stringify(autovacuum.rows, null, 2));

  } catch(e) {
    console.error('Usage diagnostic error:', e);
  } finally {
    await client.end();
  }
}

diagnoseUsage();
