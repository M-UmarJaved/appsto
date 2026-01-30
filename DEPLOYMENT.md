# Deployment Guide - appsto.software

Complete guide for deploying your SaaS marketplace to production.

## 🎯 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] All environment variables configured
- [ ] Production Supabase project created
- [ ] Production Paddle account set up
- [ ] Domain registered (appsto.software)
- [ ] SSL certificate ready (handled by host)
- [ ] Email service configured

### 2. Code Preparation
- [ ] All tests passing
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in production build
- [ ] Environment-specific configs reviewed
- [ ] Git repository clean and up to date

### 3. Database Setup
- [ ] Supabase schema applied
- [ ] Initial products added
- [ ] RLS policies configured
- [ ] Backup strategy planned

## 🚀 DigitalOcean Deployment

### Step 1: Prepare Repository

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/appsto-marketplace.git
git branch -M main
git push -u origin main
```

### Step 2: Create DigitalOcean App

1. **Login to DigitalOcean**
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)

2. **Create New App**
   - Click "Create" → "Apps"
   - Select "GitHub"
   - Authorize DigitalOcean to access your repo
   - Select your repository
   - Select branch: `main`

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Run Command: npm start
   HTTP Port: 3000
   Environment: Node.js
   ```

4. **Set Environment Variables**
   Go to Settings → Environment Variables, add all from `.env`:

   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://appsto.software
   NEXT_PUBLIC_SUPABASE_URL=your_production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   NEXT_PUBLIC_PADDLE_VENDOR_ID=your_vendor_id
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
   PADDLE_API_KEY=your_api_key
   PADDLE_WEBHOOK_SECRET=your_webhook_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASSWORD=your_password
   EMAIL_FROM=noreply@appsto.software
   LICENSE_SECRET_KEY=your_secret_key
   API_SECRET_KEY=your_api_secret
   ```

5. **Choose Plan**
   - Recommended: Basic ($12/month) or Professional ($24/month)
   - More resources = better performance

6. **Deploy**
   - Click "Create Resources"
   - Wait 5-10 minutes for initial build

### Step 3: Configure Domain

1. **Add Custom Domain**
   - In App settings → Domains
   - Add `appsto.software`
   - Add `www.appsto.software` (optional)

2. **Update DNS Records**
   Go to your domain registrar (Namecheap, GoDaddy, etc.):

   ```
   Type: A
   Host: @
   Value: [DigitalOcean IP from dashboard]
   TTL: 300

   Type: CNAME
   Host: www
   Value: [DigitalOcean app domain]
   TTL: 300
   ```

3. **Wait for DNS Propagation** (5-30 minutes)

4. **SSL Certificate**
   - DigitalOcean auto-provisions Let's Encrypt SSL
   - Verify HTTPS works: https://appsto.software

### Step 4: Configure Paddle Webhook

1. **Get Your Webhook URL**
   ```
   https://appsto.software/api/webhooks/paddle
   ```

2. **Add in Paddle Dashboard**
   - Login to Paddle
   - Go to Developer Tools → Webhooks
   - Add endpoint URL
   - Copy webhook secret
   - Update `PADDLE_WEBHOOK_SECRET` in DigitalOcean env vars

3. **Test Webhook**
   - Make test purchase with 100% coupon
   - Check logs in DigitalOcean
   - Verify email received

## 🔄 Vercel Deployment (Alternative)

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables through dashboard
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... repeat for all env vars

# Deploy to production
vercel --prod
```

### Configure Custom Domain

```bash
vercel domains add appsto.software
```

Follow Vercel's DNS instructions.

## 🐳 Docker Deployment (Advanced)

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Deploy to DigitalOcean Container Registry

```bash
# Build
docker build -t appsto-marketplace .

# Tag
docker tag appsto-marketplace registry.digitalocean.com/your-registry/appsto:latest

# Push
docker push registry.digitalocean.com/your-registry/appsto:latest

# Deploy via DigitalOcean Container Service
```

## 📊 Post-Deployment

### 1. Verify Everything Works

- [ ] Homepage loads correctly
- [ ] Products page displays products
- [ ] Product detail pages work
- [ ] Paddle checkout opens
- [ ] Make test purchase
- [ ] Verify email received
- [ ] Check license token generated
- [ ] Test license activation API

### 2. Monitor

**DigitalOcean Logs:**
```bash
# Install doctl CLI
doctl apps logs YOUR_APP_ID --follow
```

**Key things to watch:**
- Webhook events logged
- Email sending success
- License generation
- API errors

### 3. Set Up Alerts

Create alerts in DigitalOcean for:
- High error rate
- High CPU usage
- High memory usage
- Slow response times

## 🔒 Security Hardening

### 1. Enable Rate Limiting

Create middleware (`src/middleware.ts`):

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimits = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  
  const limit = rateLimits.get(ip)
  
  if (limit && limit.resetTime > now) {
    if (limit.count > 100) {
      return new NextResponse('Too many requests', { status: 429 })
    }
    limit.count++
  } else {
    rateLimits.set(ip, { count: 1, resetTime: now + 60000 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

### 2. Verify Paddle Webhooks

Update `src/app/api/webhooks/paddle/route.ts`:

```typescript
// Enable proper signature verification in production
if (process.env.NODE_ENV === 'production') {
  if (!verifyPaddleWebhook(signature, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
}
```

### 3. Environment Variables

- Never commit `.env` file
- Use strong random strings for secrets
- Rotate keys regularly

## 📈 Scaling

### When to Scale

Monitor these metrics:
- Response time > 500ms consistently
- CPU usage > 80%
- Memory usage > 80%
- Request queue building up

### How to Scale

**DigitalOcean:**
- Upgrade app plan
- Add more containers
- Enable CDN

**Database:**
- Upgrade Supabase plan
- Add read replicas
- Optimize queries with indexes

## 🔧 Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor email delivery rate
- Verify webhook health

**Monthly:**
- Review and clean old logs
- Check for security updates: `npm audit`
- Update dependencies: `npm update`

**Quarterly:**
- Backup database
- Review and optimize performance
- Security audit

## 🐛 Common Issues

### Build Fails

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Webhook Not Receiving

1. Verify URL is accessible publicly
2. Check firewall settings
3. Test with curl:
```bash
curl -X POST https://appsto.software/api/webhooks/paddle \
  -H "Content-Type: application/json" \
  -d '{"event_type":"test"}'
```

### Email Not Sending

1. Check SMTP credentials
2. Verify from address
3. Test email service separately
4. Check spam score of emails

## 📞 Support

If you encounter issues during deployment:

1. Check DigitalOcean/Vercel status page
2. Review application logs
3. Test locally with production env vars
4. Contact hosting provider support

## ✅ Deployment Complete!

Your SaaS marketplace is now live at https://appsto.software

Next steps:
- [ ] Add real products
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Launch marketing
- [ ] Monitor sales and licenses

---

**Congratulations! Your marketplace is production-ready! 🎉**
