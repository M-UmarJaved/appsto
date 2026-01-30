#!/usr/bin/env node

/**
 * Setup Script for appsto.software
 * 
 * This script helps you set up your environment quickly
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🚀 Welcome to appsto.software Setup!\n');
  console.log('This wizard will help you configure your marketplace.\n');

  // Check if .env already exists
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n📝 Let\'s configure your environment...\n');

  // Site Configuration
  const siteUrl = await question('Site URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  // Supabase
  console.log('\n🗄️  Supabase Configuration (get from supabase.com):');
  const supabaseUrl = await question('Supabase Project URL: ');
  const supabaseAnonKey = await question('Supabase Anon Key: ');
  const supabaseServiceKey = await question('Supabase Service Role Key: ');

  // Paddle
  console.log('\n💳 Paddle Configuration (get from paddle.com):');
  const paddleVendorId = await question('Paddle Vendor ID: ');
  const paddleEnv = await question('Environment (sandbox/production, default: sandbox): ') || 'sandbox';
  const paddleApiKey = await question('Paddle API Key: ');
  const paddleWebhookSecret = await question('Paddle Webhook Secret: ');

  // Email
  console.log('\n📧 Email Configuration:');
  const smtpHost = await question('SMTP Host (default: smtp.gmail.com): ') || 'smtp.gmail.com';
  const smtpPort = await question('SMTP Port (default: 587): ') || '587';
  const smtpUser = await question('SMTP Username/Email: ');
  const smtpPassword = await question('SMTP Password (App Password for Gmail): ');
  const emailFrom = await question('From Email (default: noreply@appsto.software): ') || 'noreply@appsto.software';

  // Security
  console.log('\n🔒 Generating secure keys...');
  const licenseSecret = generateSecureKey();
  const apiSecret = generateSecureKey();

  // Create .env content
  const envContent = `# Site Configuration
NEXT_PUBLIC_SITE_URL=${siteUrl}
NEXT_PUBLIC_SITE_NAME=appsto.software

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Paddle Configuration
NEXT_PUBLIC_PADDLE_VENDOR_ID=${paddleVendorId}
NEXT_PUBLIC_PADDLE_ENVIRONMENT=${paddleEnv}
PADDLE_API_KEY=${paddleApiKey}
PADDLE_WEBHOOK_SECRET=${paddleWebhookSecret}

# Email Configuration
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_USER=${smtpUser}
SMTP_PASSWORD=${smtpPassword}
EMAIL_FROM=${emailFrom}

# License Token Secret
LICENSE_SECRET_KEY=${licenseSecret}

# API Keys
API_SECRET_KEY=${apiSecret}
`;

  // Write .env file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration saved to .env\n');
  console.log('🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Set up your Supabase database (run schema.sql)');
  console.log('3. Start development: npm run dev');
  console.log('\nFor detailed instructions, see QUICKSTART.md\n');

  rl.close();
}

function generateSecureKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

setup().catch(console.error);
