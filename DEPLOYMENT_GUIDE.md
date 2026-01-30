# Appsto Deployment Guide - DigitalOcean + Custom Domain

## 🚀 Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to DigitalOcean App Platform

1. **Create App:**
   - Go to [DigitalOcean Cloud](https://cloud.digitalocean.com)
   - Click "Create" → "Apps"
   - Select your GitHub repository: `Appsto`
   - Branch: `main`
   - Click "Next"

2. **Configure Build Settings:**
   - **Name:** `appsto-software`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Run Command:** `npm start`
   - **HTTP Port:** `3000`
   - Auto-detected as Next.js app ✅

3. **Add Environment Variables:**
   Click "Environment Variables" and add all from `.env`:
   
   ```env
   # Supabase - Main Database (Appsto)
   NEXT_PUBLIC_SUPABASE_URL=https://mujxrhixbtgxdyksbnwe.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   
   # Supabase - Products Database (My Softwares)
   PRODUCT_DB_SUPABASE_URL=https://aaipaxugbybgsymmqomm.supabase.co
   PRODUCT_DB_SUPABASE_KEY=eyJhbGc...
   
   # Paddle Payment Gateway
   PADDLE_VENDOR_ID=your_vendor_id
   PADDLE_API_KEY=your_api_key
   PADDLE_PUBLIC_KEY=your_public_key
   PADDLE_WEBHOOK_SECRET=your_webhook_secret
   PADDLE_ENVIRONMENT=sandbox
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_FROM=Appsto <your-email@gmail.com>
   
   # App URL (IMPORTANT - Update after domain setup)
   NEXT_PUBLIC_APP_URL=https://appsto.software
   ```

4. **Select Plan:**
   - **Basic Plan:** $12/month (recommended for start)
   - 1 GB RAM, 512 MB vCPU
   - Perfect for 1000+ users
   - Covered by your DigitalOcean credits

5. **Click "Create Resources"**
   - Deployment takes ~5 minutes
   - You'll get a temporary URL: `https://appsto-software-xxxxx.ondigitalocean.app`

### 3. Configure Custom Domain

1. **Add Domain to DigitalOcean:**
   - In App Platform dashboard → Settings → Domains
   - Click "Add Domain"
   - Enter: `appsto.software` (root domain)
   - Also add: `www.appsto.software` (redirect to root)

2. **Update DNS Records:**
   Go to your domain registrar (where you bought appsto.software) and add:
   
   ```
   Type: CNAME
   Name: @
   Value: appsto-software-xxxxx.ondigitalocean.app
   TTL: 3600
   
   Type: CNAME
   Name: www
   Value: appsto-software-xxxxx.ondigitalocean.app
   TTL: 3600
   ```
   
   **OR use DigitalOcean Nameservers (easier):**
   ```
   ns1.digitalocean.com
   ns2.digitalocean.com
   ns3.digitalocean.com
   ```

3. **Wait for SSL Certificate (automatic)**
   - DigitalOcean auto-generates free SSL via Let's Encrypt
   - Takes 5-15 minutes
   - Your site will be HTTPS-enabled automatically

4. **Update Environment Variable:**
   - After domain is active, update `NEXT_PUBLIC_APP_URL` in App Platform
   - Change from temporary URL to `https://appsto.software`
   - Redeploy the app

### 4. Verify URLs for Paddle

Once deployment is complete, verify these pages are accessible:

- ✅ Homepage: https://appsto.software
- ✅ Refund Policy: https://appsto.software/refund-policy
- ✅ Terms: https://appsto.software/terms
- ✅ Privacy: https://appsto.software/privacy
- ✅ Test Purchase: https://appsto.software/test-purchase.html

### 5. Configure Paddle Account

Login to Paddle and add these URLs:

1. **Seller Information:**
   - Website URL: `https://appsto.software`
   
2. **Legal Pages:**
   - Refund Policy: `https://appsto.software/refund-policy`
   - Terms & Conditions: `https://appsto.software/terms`
   - Privacy Policy: `https://appsto.software/privacy`

3. **Webhook URL (Important!):**
   - URL: `https://appsto.software/api/paddle/webhook`
   - This is how Paddle notifies your app about purchases

### 6. Test Everything

1. **Test Purchase Flow:**
   - Visit: https://appsto.software/test-purchase.html
   - Create test purchase with TEST100 coupon
   - Verify licenses are generated
   - Check email delivery

2. **Test Download:**
   - Click download link in email
   - Verify auto-download works
   - Check download logs in database

3. **Update Database with GitHub Release URL:**
   ```sql
   UPDATE products 
   SET download_url = 'https://github.com/umarjaved190/appsto-software-releases/releases/download/desksweep-v1.0.0/DeskSweep_Setup.exe'
   WHERE slug = 'desksweep';
   ```

## 📊 Monitoring & Maintenance

### App Platform Features:
- **Auto-scaling:** Handles traffic spikes automatically
- **CI/CD:** Auto-deploys when you push to GitHub
- **Logs:** View real-time application logs
- **Metrics:** CPU, memory, bandwidth usage
- **Alerts:** Get notified of issues

### Cost Estimate:
- **App Platform:** $12/month (~$144/year)
- **Your Credits:** $200 = ~16 months free hosting 🎉
- **Domain:** Varies by registrar (~$12/year)
- **Total First Year:** ~$12 (domain only, hosting free via credits)

## 🔧 Troubleshooting

### If Build Fails:
```bash
# Ensure package.json has correct scripts
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

### If Environment Variables Don't Work:
- Redeploy the app after adding variables
- Check variable names match exactly (no typos)
- Don't add quotes around values in DigitalOcean UI

### If Domain Doesn't Connect:
- Wait 30-60 minutes for DNS propagation
- Use `nslookup appsto.software` to check DNS
- Ensure SSL certificate shows as "Active" in DigitalOcean

## 🎯 Next Steps After Deployment

1. ✅ Verify Paddle account with live URLs
2. ✅ Switch Paddle from sandbox to production mode
3. ✅ Test real purchase flow
4. ✅ Configure email properly (fix Gmail App Password)
5. ✅ Add product pages and checkout UI
6. ✅ Implement user dashboard
7. ✅ Add analytics (Google Analytics or Plausible)

## 📞 Support

- DigitalOcean Docs: https://docs.digitalocean.com/products/app-platform/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Paddle Integration: https://developer.paddle.com/

---

**Professional Setup = Custom Domain + Managed Hosting + SSL + Auto-scaling** ✅

You're using industry-standard infrastructure (same as used by startups raising millions). This setup will scale from 0 to 100,000 users without any changes needed.
