# 🔧 FIX: OAuth Redirect to localhost:8080 Issue

## ❌ Problem:
When signing in with GitHub/Google, you're redirected to:
```
https://localhost:8080/#access_token=...
```

Instead of:
```
https://appsto.software/auth/callback
```

## ✅ Root Cause:
The OAuth providers (GitHub/Google) have **cached the old redirect URL** from when you tested locally. Even though Supabase is configured correctly, the OAuth apps themselves need to be updated.

---

## 🔧 SOLUTION: Update OAuth Provider Settings

### Step 1: Update GitHub OAuth App

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/developers
   - Click on your OAuth App: **Appsto.Software**

2. **Update Callback URL:**
   
   **Current (wrong):**
   ```
   https://localhost:8080/auth/callback
   ```
   
   **Change to:**
   ```
   https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback
   ```

3. **Update Homepage URL:**
   ```
   https://appsto.software
   ```

4. Click **Update application**

---

### Step 2: Update Google OAuth App (if using)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project: **Appsto Software**

2. **Edit OAuth 2.0 Client:**
   
   **Authorized JavaScript origins:**
   ```
   https://appsto.software
   https://xdsfmqidnfpvfrdegxum.supabase.co
   ```
   
   **Authorized redirect URIs:**
   ```
   https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback
   ```
   
   **Remove:**
   ```
   http://localhost:8080
   http://localhost:3000
   ```

3. Click **Save**

---

### Step 3: Verify Supabase Settings (Double Check)

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Project: **xdsfmqidnfpvfrdegxum**

2. **Authentication → URL Configuration:**
   
   **Site URL:**
   ```
   https://appsto.software
   ```
   
   **Redirect URLs:**
   ```
   https://appsto.software/auth/callback
   https://appsto.software/reset-password
   https://appsto.software/**
   ```

3. **Authentication → Providers → GitHub:**
   - Make sure **Client ID** and **Client Secret** are from your updated GitHub OAuth app
   - Click **Save**

4. **Authentication → Providers → Google (if using):**
   - Make sure **Client ID** and **Client Secret** are from your updated Google OAuth app
   - Click **Save**

---

### Step 4: Verify DigitalOcean Environment Variables

1. **Go to DigitalOcean App Platform:**
   - Visit: https://cloud.digitalocean.com/apps
   - Select your app: **appsto-software**

2. **Settings → Environment Variables:**
   
   Verify these are set correctly:
   ```
   NEXT_PUBLIC_SITE_URL=https://appsto.software
   NEXT_PUBLIC_APP_URL=https://appsto.software
   NEXT_PUBLIC_SUPABASE_URL=https://xdsfmqidnfpvfrdegxum.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your key]
   ```

3. If you changed anything, click **Save** → App will redeploy automatically

---

### Step 5: Clear Browser Cache & Test

1. **Clear browser cache:**
   - Chrome: `Ctrl + Shift + Delete` → Clear cached images and files
   - Or use Incognito/Private mode

2. **Test OAuth sign in:**
   - Go to: https://appsto.software/signin
   - Click "Sign in with GitHub" or "Sign in with Google"
   - Should redirect to: `https://appsto.software/auth/callback`
   - Then redirect to homepage: `https://appsto.software`

---

## 🎯 MOST LIKELY ISSUE:

**Your GitHub OAuth App still has `localhost:8080` as the callback URL.**

This is the #1 cause of this issue. Update it to:
```
https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback
```

---

## 📋 Quick Checklist:

- [ ] GitHub OAuth App callback URL updated to Supabase URL
- [ ] Google OAuth App redirect URIs updated (if using Google)
- [ ] Supabase Site URL set to `https://appsto.software`
- [ ] Supabase Redirect URLs include `/auth/callback`
- [ ] DigitalOcean environment variables verified
- [ ] Browser cache cleared
- [ ] Tested in incognito mode
- [ ] OAuth sign in works and redirects to appsto.software

---

## 🔍 Debug: How to Check Current OAuth URLs

### Check GitHub OAuth App:
```bash
# The URL shown in your GitHub OAuth settings should be:
Callback URL: https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback
Homepage URL: https://appsto.software
```

### Check Supabase Auth Flow:
1. Go to Supabase Dashboard → Authentication → Logs
2. Try signing in with GitHub
3. Look at the redirect URL in the logs
4. If it shows localhost, the OAuth app is misconfigured

---

## ⚠️ IMPORTANT NOTES:

1. **Supabase Callback URL Format:**
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   NOT:
   ```
   https://appsto.software/auth/callback
   ```
   
   The OAuth provider redirects to Supabase first, then Supabase redirects to your app.

2. **After updating OAuth apps:**
   - Changes are instant (no propagation delay)
   - Clear browser cache to remove cached redirects
   - Test in incognito mode to avoid cache issues

3. **Still not working?**
   - Revoke GitHub OAuth app authorization: https://github.com/settings/applications
   - Try signing in again (will prompt for authorization)
   - Check Supabase Auth Logs for actual redirect URL being used

---

## ✅ SUCCESS INDICATORS:

When fixed correctly, you'll see:
1. Click "Sign in with GitHub" → Opens GitHub authorization page
2. Authorize → Redirects to `https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback`
3. Supabase processes token → Redirects to `https://appsto.software/auth/callback`
4. Auth callback route → Redirects to `https://appsto.software` (homepage)
5. You're signed in ✅

---

**The fix is in the OAuth provider settings (GitHub/Google), not in your code!**
