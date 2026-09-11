const { Client } = require('pg');

const connectionString = 'postgresql://postgres.xdsfmqidnfpvfrdegxum:qxUn2yMGyDmBnSBJ@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

async function fixAuth() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');

    console.log('1. Creating public.profiles table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT,
        avatar_url TEXT,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ public.profiles table created!');

    console.log('2. Enabling RLS & Policies on public.profiles...');
    await client.query(`
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
      CREATE POLICY "Public profiles are viewable by everyone." 
        ON public.profiles FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
      CREATE POLICY "Users can insert their own profile." 
        ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

      DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
      CREATE POLICY "Users can update own profile." 
        ON public.profiles FOR UPDATE USING (auth.uid() = id);
    `);
    console.log('✅ RLS and policies applied!');

    console.log('3. Updating handle_new_user() trigger function with EXCEPTION handler...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, avatar_url, email)
        VALUES (
          NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
          COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
          NEW.email
        )
        ON CONFLICT (id) DO UPDATE SET
          full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
          avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
          email = COALESCE(EXCLUDED.email, public.profiles.email),
          updated_at = NOW();
        RETURN NEW;
      EXCEPTION WHEN OTHERS THEN
        -- CRITICAL: Never block auth.users signup/OAuth if profile insert hits an issue
        RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✅ handle_new_user() trigger function updated with safe EXCEPTION block!');

    console.log('4. Ensuring trigger exists on auth.users...');
    await client.query(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);
    console.log('✅ on_auth_user_created trigger confirmed on auth.users!');

    console.log('5. Backfilling any existing auth.users into public.profiles...');
    const backfill = await client.query(`
      INSERT INTO public.profiles (id, full_name, avatar_url, email)
      SELECT 
        id,
        COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
        COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
        email
      FROM auth.users
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log(`✅ Backfilled ${backfill.rowCount || 0} existing users into public.profiles!`);

    // Verify profiles table
    const checkProfiles = await client.query(`SELECT count(*) FROM public.profiles;`);
    console.log('\nTotal profiles count:', checkProfiles.rows[0].count);

  } catch (err) {
    console.error('Error applying fix:', err);
  } finally {
    await client.end();
  }
}

fixAuth();
