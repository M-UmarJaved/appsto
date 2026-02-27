# Cloudflare R2 Storage Setup Guide

This guide will help you migrate DeskSweep installer from GitHub to Cloudflare R2 for professional, reliable downloads.

## Why Cloudflare R2?

✅ **Zero egress fees** - Free bandwidth (unlike S3)
✅ **Public access** - No authentication needed
✅ **Fast global CDN** - Cloudflare's edge network
✅ **Simple setup** - Easier than GitHub releases
✅ **Professional** - Custom domain support
✅ **No rate limits** - Unlimited downloads

## Step 1: Create Cloudflare R2 Bucket

1. **Sign up/Login to Cloudflare:**
   - Go to https://dash.cloudflare.com
   - Navigate to **R2** from the left sidebar

2. **Create a bucket:**
   - Click **"Create bucket"**
   - Name: `appsto-installers` (or any name you prefer)
   - Location: Choose closest to your users (Automatic is fine)
   - Click **"Create bucket"**

## Step 2: Upload DeskSweep Installer

1. **Open your bucket:**
   - Click on `appsto-installers`

2. **Upload file:**
   - Click **"Upload"**
   - Select: `DeskSweep_Setup.exe`
   - Wait for upload to complete
   - ✅ File uploaded!

## Step 3: Make File Public

1. **Set bucket to public:**
   - Go to **Settings** tab in your bucket
   - Scroll to **Public Access**
   - Click **"Allow Access"**
   - Confirm public access

2. **Get public URL:**
   - After enabling public access, you'll see a **Public bucket URL**
   - It will look like: `https://pub-xxxxxxxxxxxxx.r2.dev`
   - Your file URL will be: `https://pub-xxxxxxxxxxxxx.r2.dev/DeskSweep_Setup.exe`

## Step 4: Custom Domain (Optional but Recommended)

For a more professional URL like `https://downloads.appsto.software/DeskSweep_Setup.exe`:

### Prerequisites:
⚠️ **Your domain MUST be managed by Cloudflare DNS** (not just proxied)

**Check if your domain is on Cloudflare:**
1. Go to Cloudflare Dashboard → **Websites**
2. Look for `appsto.software` in the list
3. If it's NOT there, you need to add it first (see below)

### Option A: Domain Already on Cloudflare

If `appsto.software` is already listed in your Cloudflare Websites:

1. **In R2 bucket settings:**
   - Go to **Settings** → **Custom Domains**
   - Click **"Connect Domain"**

2. **Add subdomain:**
   - Enter: `downloads.appsto.software`
   - Cloudflare will automatically add DNS records
   - Click **"Continue"**

3. **Wait for DNS propagation:**
   - Usually takes 1-5 minutes
   - ✅ Your custom domain is ready!

### Option B: Add Domain to Cloudflare (If Not Already Added)

If you get the error: *"That domain was not found on your account"*

1. **Add site to Cloudflare:**
   - Cloudflare Dashboard → **Add a Site**
   - Enter: `appsto.software`
   - Choose **Free plan**
   - Click **"Continue"**

2. **Update nameservers:**
   - Cloudflare will show you 2 nameservers (like `ns1.cloudflare.com`)
   - Go to your domain registrar (Namecheap, GoDaddy, etc.)
   - Replace current nameservers with Cloudflare's nameservers
   - Wait 24-48 hours for DNS propagation

3. **After domain is active:**
   - Return to R2 bucket settings
   - Add custom domain: `downloads.appsto.software`

### Option C: Use R2 Public URL (Simpler, Works Immediately)

If you don't want to migrate DNS to Cloudflare, just use the R2 public URL:

```
https://pub-xxxxxxxxxxxxx.r2.dev/DeskSweep_Setup.exe
```

**Pros:**
- ✅ Works immediately, no DNS setup
- ✅ Still uses Cloudflare CDN
- ✅ Free bandwidth
- ✅ Professional enough for most customers

**Cons:**
- ⚠️ URL shows Cloudflare branding (`.r2.dev`)
- ⚠️ Can't change URL if you migrate storage later

**Recommendation:** Use the R2 public URL for now. You can always add a custom domain later when/if you move DNS to Cloudflare.

## Step 5: Update Database

Run this SQL in your Supabase SQL editor:

```sql
-- Update DeskSweep product with R2 URL
UPDATE products 
SET download_url = 'https://pub-xxxxxxxxxxxxx.r2.dev/DeskSweep_Setup.exe'
-- OR with custom domain:
-- SET download_url = 'https://downloads.appsto.software/DeskSweep_Setup.exe'
WHERE slug = 'desksweep';

-- Verify the update
SELECT slug, name, download_url FROM products WHERE slug = 'desksweep';
```

**Replace** `https://pub-xxxxxxxxxxxxx.r2.dev` with YOUR actual R2 public URL!

## Step 6: Test Download

```bash
# Test in browser or curl
curl -I "https://appsto.software/api/download/desksweep"

# Should redirect to R2 URL and download file
```

## Step 7: Remove GitHub Token (Optional)

Since you're no longer using GitHub for downloads, you can remove the `GITHUB_TOKEN` from Digital Ocean environment variables.

## File Organization Tips

Organize your R2 bucket like this:

```
appsto-installers/
├── desksweep/
│   ├── DeskSweep_Setup.exe          (latest)
│   ├── DeskSweep_Setup_v1.0.0.exe   (versioned backup)
│   └── DeskSweep_Setup_v1.1.0.exe
├── proedit/
│   └── ProEdit_Setup.exe
└── datasync/
    └── DataSync_Setup.exe
```

Update URLs to include folder:
```
https://pub-xxxxxxxxxxxxx.r2.dev/desksweep/DeskSweep_Setup.exe
```

## Cost Comparison

| Service | Storage (10GB) | Egress (100GB) | Total/month |
|---------|---------------|----------------|-------------|
| **Cloudflare R2** | $0.15 | **$0.00** | **$0.15** |
| AWS S3 | $0.23 | $9.00 | $9.23 |
| GitHub (Private) | Free | Free* | Free* |

*GitHub has authentication issues and rate limits

## Advantages Over GitHub

1. **No Authentication** - Public files, anyone can download
2. **No 404 Errors** - Works when users are signed out
3. **Better Performance** - Cloudflare global CDN
4. **Version Control** - Keep multiple versions easily
5. **Analytics** - Better download tracking
6. **Professional URLs** - Custom domain support
7. **No Rate Limits** - Unlimited bandwidth
8. **API Access** - Programmatic uploads/updates

## Updating Installers

When you release a new version:

1. **Upload new file to R2:**
   - Overwrite `DeskSweep_Setup.exe` (customers get latest automatically)
   - OR upload as versioned file and update database URL

2. **No code changes needed!** - Your Next.js app automatically serves the new file

## Security Note

While the R2 URL is public, you can still:
- Track downloads via your API (already implemented)
- Add purchase validation in the future (commented code in download route)
- Use signed URLs for time-limited access (advanced)

## Troubleshooting

**Issue: "That domain was not found on your account"**
- **Cause**: Your domain is not managed by Cloudflare DNS
- **Solution**: Either:
  1. Add domain to Cloudflare and change nameservers (Option B above)
  2. Use R2 public URL instead: `https://pub-xxxxx.r2.dev/...`
  3. Use CNAME workaround (see below)

**CNAME Workaround (Keep Current DNS Provider):**

If you want `downloads.appsto.software` but don't want to move DNS:

1. **Get R2 public URL first:**
   ```
   Example: https://pub-abc123xyz.r2.dev/DeskSweep_Setup.exe
   ```

2. **In your current DNS provider** (Digital Ocean, Namecheap, etc.):
   ```
   Type: CNAME
   Name: downloads
   Value: pub-abc123xyz.r2.dev
   TTL: 3600
   ```

3. **Access via custom domain:**
   ```
   https://downloads.appsto.software/DeskSweep_Setup.exe
   ```

⚠️ **Note**: This bypasses Cloudflare's custom domain feature but still works!

**Issue: 404 Not Found**
- Check bucket is set to public access
- Verify file name spelling exactly matches URL
- Check DNS propagation for custom domains: `nslookup downloads.appsto.software`

**Issue: Slow downloads**
- R2 public URLs use Cloudflare CDN automatically (always fast)
- Custom domains also use CDN if domain is on Cloudflare
- CNAME workaround depends on your DNS provider's routing

**Issue: CORS errors**
- Not applicable for direct downloads
- Only matters if you're using JavaScript fetch

## Next Steps

1. ✅ Create R2 bucket
2. ✅ Upload DeskSweep_Setup.exe
3. ✅ Enable public access
4. ✅ Get public URL
5. ✅ Update Supabase database
6. ✅ Test download from email
7. ✅ (Optional) Set up custom domain
8. ✅ Remove GitHub token from env vars

## Support

Your download API at `/api/download/desksweep` will automatically work with R2 URLs since they're public. No code changes needed!

The simplified flow:
1. Customer clicks email download button → `https://appsto.software/api/download/desksweep`
2. API logs download analytics
3. API redirects to → `https://pub-xxxxx.r2.dev/DeskSweep_Setup.exe`
4. Customer gets instant download from Cloudflare CDN ⚡

Done! 🎉
