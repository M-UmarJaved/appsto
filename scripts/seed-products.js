#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * Seeds your Supabase database with example products
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sampleProducts = [
  {
    name: 'ProEdit Studio',
    slug: 'proedit-studio',
    description: 'Professional video editing software with advanced AI-powered features for content creators, filmmakers, and video professionals. Create stunning videos with ease.',
    short_description: 'Professional video editing with AI-powered tools',
    price: 149.99,
    currency: 'USD',
    product_type: 'one_time',
    paddle_product_id: 'pro_proedit123',
    features: [
      'AI-powered video editing and automatic scene detection',
      '4K/8K export support with hardware acceleration',
      'Unlimited projects and timeline tracks',
      'Advanced color grading with LUTs support',
      'Motion graphics and animation tools',
      'Multi-cam editing support',
      'Audio mixing and noise reduction',
      'Cloud storage integration',
      'Regular free updates',
      'Priority customer support'
    ],
    screenshots: [],
    demo_video_url: 'https://youtube.com/demo',
    system_requirements: {
      os: ['Windows 10/11 (64-bit)', 'macOS 11+ (Big Sur or later)'],
      processor: 'Intel i5 8th gen or AMD Ryzen 5 equivalent',
      memory: '8GB RAM (16GB recommended)',
      storage: '2GB available space for installation'
    },
    icon_url: '',
    is_active: true
  },
  {
    name: 'DataSync Pro',
    slug: 'datasync-pro',
    description: 'Enterprise-grade data synchronization and backup solution for professionals. Keep your files safe and synchronized across all your devices with military-grade encryption.',
    short_description: 'Automated data sync and backup for professionals',
    price: 89.99,
    currency: 'USD',
    product_type: 'one_time',
    paddle_product_id: 'pro_datasync456',
    features: [
      'Real-time file synchronization',
      'Cloud backup integration (Google Drive, Dropbox, OneDrive)',
      'End-to-end encryption',
      'Scheduled automatic backups',
      'Multi-device support (unlimited devices)',
      'Version history and file recovery',
      'Bandwidth throttling options',
      'Conflict resolution',
      'Email notifications',
      'Lifetime free updates'
    ],
    screenshots: [],
    demo_video_url: 'https://youtube.com/demo',
    system_requirements: {
      os: ['Windows 10/11', 'macOS 10.15+', 'Linux (Ubuntu 20.04+)'],
      processor: 'Dual-core processor 2.0 GHz or faster',
      memory: '4GB RAM minimum',
      storage: '500MB available space'
    },
    icon_url: '',
    is_active: true
  },
  {
    name: 'CodeMaster IDE',
    slug: 'codemaster-ide',
    description: 'Next-generation integrated development environment with AI-powered code completion, built-in debugging tools, and support for over 50 programming languages.',
    short_description: 'Next-gen IDE with AI code completion',
    price: 199.99,
    currency: 'USD',
    product_type: 'one_time',
    paddle_product_id: 'pro_codemaster789',
    features: [
      'AI-powered intelligent code completion',
      'Support for 50+ programming languages',
      'Built-in powerful debugger',
      'Git and version control integration',
      'Plugin marketplace with thousands of extensions',
      'Code refactoring tools',
      'Real-time collaboration',
      'Integrated terminal',
      'Database management tools',
      'Lifetime license with free updates'
    ],
    screenshots: [],
    demo_video_url: 'https://youtube.com/demo',
    system_requirements: {
      os: ['Windows 10/11 (64-bit)', 'macOS 11+', 'Linux (Ubuntu 20.04+)'],
      processor: 'Intel i5 or AMD Ryzen 5 equivalent',
      memory: '8GB RAM minimum (16GB recommended)',
      storage: '3GB available space'
    },
    icon_url: '',
    is_active: true
  }
];

async function seedProducts() {
  console.log('🌱 Seeding database with sample products...\n');

  try {
    // Check if products already exist
    const { data: existing, error: checkError } = await supabase
      .from('products')
      .select('slug');

    if (checkError) {
      console.error('❌ Error checking existing products:', checkError.message);
      return;
    }

    const existingSlugs = existing?.map(p => p.slug) || [];

    // Filter out products that already exist
    const newProducts = sampleProducts.filter(p => !existingSlugs.includes(p.slug));

    if (newProducts.length === 0) {
      console.log('ℹ️  All sample products already exist in the database.');
      console.log('\nExisting products:');
      existing?.forEach(p => console.log(`  - ${p.slug}`));
      return;
    }

    // Insert new products
    const { data, error } = await supabase
      .from('products')
      .insert(newProducts)
      .select();

    if (error) {
      console.error('❌ Error inserting products:', error.message);
      return;
    }

    console.log(`✅ Successfully added ${data?.length || 0} product(s)!\n`);
    
    console.log('Added products:');
    data?.forEach(product => {
      console.log(`  ✓ ${product.name} ($${product.price})`);
    });

    console.log('\n⚠️  IMPORTANT: Update paddle_product_id for each product:');
    console.log('1. Create products in Paddle dashboard');
    console.log('2. Copy the Paddle product IDs');
    console.log('3. Update the products table in Supabase\n');

    console.log('Example SQL:');
    console.log("UPDATE products SET paddle_product_id = 'pro_actual_paddle_id' WHERE slug = 'proedit-studio';\n");

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedProducts().catch(console.error);
