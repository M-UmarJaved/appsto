const { Client } = require('pg');

const connectionString = "postgresql://postgres.xdsfmqidnfpvfrdegxum:qxUn2yMGyDmBnSBJ@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function inspect() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres!");

    // List all public tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log("Tables in public schema:", tablesRes.rows.map(r => r.table_name));

    // Check products table columns
    const prodCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'products'
      ORDER BY ordinal_position;
    `);
    console.log("\nProducts Columns:", prodCols.rows.map(r => `${r.column_name} (${r.data_type})`));

    // Check pricing_plans columns
    const planCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'pricing_plans'
      ORDER BY ordinal_position;
    `);
    console.log("\nPricing Plans Columns:", planCols.rows.map(r => `${r.column_name} (${r.data_type})`));

    // Check existing products
    const prods = await client.query(`SELECT id, name, slug, product_type, paddle_product_id FROM public.products;`);
    console.log("\nExisting Products:", prods.rows);

    // Check existing pricing plans
    const plans = await client.query(`
      SELECT p.name as product_name, pp.plan_name, pp.plan_slug, pp.price_usd, pp.paddle_price_id_usd 
      FROM public.pricing_plans pp 
      JOIN public.products p ON pp.product_id = p.id;
    `);
    console.log("\nExisting Pricing Plans:", plans.rows);

  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await client.end();
  }
}

inspect();
