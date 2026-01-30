# Quick Start Guide

Get your SaaS marketplace running in 10 minutes!

## 📦 Prerequisites

Make sure you have:
- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd "d:\University\CS 2024-2028\SP\Appsto"
npm install
```

This installs all required packages. Wait 2-3 minutes.

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Open `.env` and add your credentials. **For now, use placeholder values to test locally:**

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=appsto.software

# Supabase (create free account at supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

# Paddle (create account at paddle.com)
NEXT_PUBLIC_PADDLE_VENDOR_ID=12345
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
PADDLE_API_KEY=your_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret

# Email (use Gmail for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@appsto.software

# Security
LICENSE_SECRET_KEY=change_this_to_random_string
API_SECRET_KEY=change_this_to_another_random_string
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 🎨 What You'll See

### ✅ Working Features (Without Database)

Even without Supabase setup, you'll see:
- ✅ Beautiful animated homepage
- ✅ Products page with mock data
- ✅ Product detail pages
- ✅ Full UI/UX with animations
- ✅ Responsive design

### ⏳ Features Requiring Setup

These need Supabase & Paddle:
- ⏳ Real products from database
- ⏳ Purchase functionality
- ⏳ License generation
- ⏳ Email delivery

## 🗄️ Set Up Database (5 minutes)

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Create a new project
4. Wait for project to initialize (2-3 min)

### 2. Run Database Schema

1. In Supabase dashboard, click "SQL Editor"
2. Open the file: `supabase/schema.sql`
3. Copy all the SQL code
4. Paste in Supabase SQL Editor
5. Click "Run"

You now have tables:
- ✅ products
- ✅ licenses  
- ✅ purchases

### 3. Get API Keys

1. In Supabase, go to Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Update in `.env`

### 4. Add Test Product

In Supabase SQL Editor:

```sql
INSERT INTO products (
  name, slug, description, short_description,
  price, currency, product_type, paddle_product_id,
  features, system_requirements
) VALUES (
  'Test App',
  'test-app',
  'A test application for demonstration',
  'Test application',
  99.99,
  'USD',
  'one_time',
  'pro_test123',
  '["Feature 1", "Feature 2", "Feature 3"]'::jsonb,
  '{"os": ["Windows 10+", "macOS 11+"], "processor": "Intel i5", "memory": "8GB RAM", "storage": "1GB"}'::jsonb
);
```

Restart your dev server:
```bash
# Ctrl+C to stop
npm run dev
```

Your test product now appears!

## 💳 Set Up Payments (5 minutes)

### 1. Create Paddle Account

1. Go to [paddle.com](https://paddle.com)
2. Sign up for sandbox account (free)
3. Complete verification

### 2. Create Product in Paddle

1. In Paddle dashboard → Catalog → Products
2. Click "Add Product"
3. Fill in:
   - Name: Test App
   - Price: $99.99
   - Type: Standard
4. Copy the Product ID (format: `pro_xxxxx`)

### 3. Update Database

In Supabase, update your product:

```sql
UPDATE products 
SET paddle_product_id = 'pro_xxxxx'  -- Your actual Paddle ID
WHERE slug = 'test-app';
```

### 4. Configure Webhook (Important!)

For local testing with webhooks, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok (in new terminal)
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
```

In Paddle:
1. Developer Tools → Webhooks
2. Add endpoint: `https://abc123.ngrok.io/api/webhooks/paddle`
3. Copy webhook secret → update `PADDLE_WEBHOOK_SECRET` in `.env`

## 📧 Set Up Email (3 minutes)

### Using Gmail (Easiest)

1. **Enable 2-Step Verification**
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select app: Mail
   - Select device: Other (custom) → "Appsto"
   - Copy the generated password

3. **Update .env**
   ```env
   SMTP_USER=your.email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # The app password
   ```

## 🧪 Test Everything

### 1. Test Purchase Flow

1. Go to http://localhost:3000/products/test-app
2. Click "Buy Now"
3. Paddle checkout should open
4. Use test card: `4242 4242 4242 4242`
   - Or create 100% discount coupon in Paddle

### 2. Verify License Generated

After purchase, check:
- ✅ Redirected to success page
- ✅ Email received (check spam folder)
- ✅ Email contains license token: `APPSTO-XXXX-XXXX-XXXX`

In Supabase, check:
```sql
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 1;
SELECT * FROM licenses ORDER BY created_at DESC LIMIT 1;
```

### 3. Test License Activation

```bash
curl -X POST http://localhost:3000/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{"token":"APPSTO-XXXX-XXXX-XXXX","deviceInfo":{}}'
```

Should return success!

## 🎉 You're Ready!

Your marketplace is now fully functional locally!

## 🚀 Next Steps

1. **Add More Products**
   - Insert via Supabase dashboard
   - Match Paddle product IDs

2. **Customize Branding**
   - Edit colors in `tailwind.config.ts`
   - Update content in page files

3. **Deploy to Production**
   - Follow `DEPLOYMENT.md`
   - Use DigitalOcean, Vercel, or AWS

4. **Go Live**
   - Switch Paddle to production mode
   - Update environment variables
   - Launch!

## 📞 Need Help?

### Common Issues

**"npm install fails"**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**"Supabase connection error"**
- Check API keys are correct
- Verify project URL has no trailing slash

**"Paddle checkout not opening"**
- Check vendor ID is correct
- Ensure Paddle.js script loaded
- Open browser console for errors

**"Email not sending"**
- Verify Gmail app password (not regular password)
- Check SMTP settings
- Look for errors in terminal

### Get Support

- Read full docs: `README.md`
- Testing guide: `TESTING.md`
- Deployment: `DEPLOYMENT.md`

---

**Congratulations! You're building a professional SaaS marketplace! 🎉**
