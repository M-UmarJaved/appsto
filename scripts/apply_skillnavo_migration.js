const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres.xdsfmqidnfpvfrdegxum:qxUn2yMGyDmBnSBJ@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function applyMigration() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres!");

    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260910_skillnavo_production_paddle.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log("Executing migration...");
    await client.query(sqlContent);
    console.log("Migration executed successfully!");

    // Verify insertion
    const prods = await client.query(`SELECT id, name, slug, product_type, paddle_product_id, paddle_price_ids FROM public.products WHERE slug = 'skillnavo';`);
    console.log("\nSkillnavo Product in DB:", JSON.stringify(prods.rows, null, 2));

    const plans = await client.query(`
      SELECT pp.id, pp.plan_name, pp.plan_slug, pp.price_usd, pp.price_inr, pp.price_pkr, pp.paddle_price_id_usd, pp.is_popular
      FROM public.pricing_plans pp 
      JOIN public.products p ON pp.product_id = p.id
      WHERE p.slug = 'skillnavo'
      ORDER BY pp.price_usd ASC;
    `);
    console.log("\nSkillnavo Pricing Plans in DB:", JSON.stringify(plans.rows, null, 2));

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

applyMigration();
