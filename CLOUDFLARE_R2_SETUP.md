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

**Issue: 404 Not Found**
- Check bucket is set to public access
- Verify file name spelling exactly matches URL
- Check DNS propagation for custom domains

**Issue: Slow downloads**
- Add custom domain for better CDN routing
- Check file is in optimal region

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
