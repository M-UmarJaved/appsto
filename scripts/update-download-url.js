#!/usr/bin/env node

/**
 * Update Product Download URL
 * 
 * This script updates the download_url for a product in the database.
 * Use this after setting up Cloudflare R2 or any other storage.
 * 
 * Usage:
 *   node scripts/update-download-url.js
 * 
 * Or directly:
 *   node scripts/update-download-url.js "https://pub-xxxxx.r2.dev/DeskSweep_Setup.exe"
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateDownloadUrl() {
  console.log('\n📦 Update Product Download URL\n');
  console.log('This will update the download_url in your products table.');
  console.log('Use this after uploading your installer to Cloudflare R2.\n');

  try {
    // Get download URL from command line arg or prompt
    let downloadUrl = process.argv[2];

    if (!downloadUrl) {
      downloadUrl = await question('Enter new download URL (e.g., https://pub-xxxxx.r2.dev/DeskSweep_Setup.exe):\n> ');
    }

    downloadUrl = downloadUrl.trim();

    if (!downloadUrl) {
      console.error('❌ Download URL is required');
      rl.close();
      process.exit(1);
    }

    // Validate URL format
    try {
      new URL(downloadUrl);
    } catch {
      console.error('❌ Invalid URL format');
      rl.close();
      process.exit(1);
    }

    // List available products
    console.log('\n📋 Fetching products...\n');
    const { data: products, error: listError } = await supabase
      .from('products')
      .select('slug, name, download_url')
      .order('name');

    if (listError) {
      console.error('❌ Error fetching products:', listError.message);
      rl.close();
      process.exit(1);
    }

    if (!products || products.length === 0) {
      console.error('❌ No products found in database');
      rl.close();
      process.exit(1);
    }

    console.log('Available products:\n');
    products.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.slug})`);
      if (p.download_url) {
        console.log(`     Current: ${p.download_url}`);
      } else {
        console.log(`     Current: (not set)`);
      }
      console.log('');
    });

    // Ask which product to update
    const productChoice = await question('Which product to update? (enter number or slug):\n> ');
    
    let selectedProduct;
    const choiceNum = parseInt(productChoice);
    
    if (!isNaN(choiceNum) && choiceNum >= 1 && choiceNum <= products.length) {
      selectedProduct = products[choiceNum - 1];
    } else {
      selectedProduct = products.find(p => p.slug === productChoice.trim());
    }

    if (!selectedProduct) {
      console.error('❌ Invalid product selection');
      rl.close();
      process.exit(1);
    }

    console.log(`\n📝 Updating: ${selectedProduct.name} (${selectedProduct.slug})`);
    console.log(`   Old URL: ${selectedProduct.download_url || '(not set)'}`);
    console.log(`   New URL: ${downloadUrl}`);

    const confirm = await question('\nProceed with update? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Update cancelled');
      rl.close();
      process.exit(0);
    }

    // Update the product
    const { data: updated, error: updateError } = await supabase
      .from('products')
      .update({ 
        download_url: downloadUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', selectedProduct.slug)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating product:', updateError.message);
      rl.close();
      process.exit(1);
    }

    console.log('\n✅ Successfully updated!');
    console.log(`\n🔗 Test download:`);
    console.log(`   ${process.env.NEXT_PUBLIC_APP_URL || 'https://appsto.software'}/api/download/${selectedProduct.slug}`);
    console.log('\n💡 Tip: Test in an incognito window to verify it works without authentication\n');

    rl.close();

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the script
updateDownloadUrl();
