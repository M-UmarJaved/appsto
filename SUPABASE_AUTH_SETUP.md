# Supabase Authentication Setup Guide

## Step 1: Database Setup (5 minutes)

### 1.1 Create Profiles Table
Go to **Supabase Dashboard → SQL Editor** and run this:

```sql
-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Step 2: Enable Email Authentication

1. Go to **Authentication → Providers**
2. Find **Email** provider
3. Enable **"Email provider"**
4. ✅ Enable **"Confirm email"** (recommended to prevent spam)
5. Click **Save**

---

## Step 3: Google OAuth Setup (10 minutes)

### 3.1 Configure OAuth Consent Screen (Create Brand)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Go to **APIs & Services → OAuth consent screen**
4. Choose **External** (for public apps) or **Internal** (if using Google Workspace)
5. Click **Create**
6. Fill in required fields:
   - **App name:** Your App Name (e.g., "Appsto")
   - **User support email:** Your email address
   - **Developer contact email:** Your email address
7. Click **Save and Continue**
8. **Scopes:** Skip this (click **Save and Continue**)
9. **Test users:** Add your email for testing (click **Add Users**)
10. Click **Save and Continue**
11. Review and click **Back to Dashboard**

### 3.2 Get Google Credentials
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth 2.0 Client ID**
3. Select **Web application**
4. Give it a name (e.g., "Appsto Web Client")
5. Add authorized redirect URI:
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
   (Replace `YOUR_SUPABASE_PROJECT` with your actual project ID from Supabase URL)

6. Click **Create**
7. Copy **Client ID** and **Client Secret**

### 3.3 Configure in Supabase
1. Go to **Authentication → Providers**
2. Find **Google** provider and click **Enable**
3. Paste:
   - **Client ID**
   - **Client Secret**
4. Click **Save**

---

## Step 4: GitHub OAuth Setup (5 minutes)

### 4.1 Get GitHub Credentials
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Your App Name
   - **Homepage URL:** `https://your-domain.com` (or `http://localhost:3000` for dev)
   - **Authorization callback URL:**
     ```
     https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID**
6. Click **Generate a new client secret** and copy it

### 4.2 Configure in Supabase
1. Go to **Authentication → Providers**
2. Find **GitHub** provider and click **Enable**
3. Paste:
   - **Client ID**
   - **Client Secret**
4. Click **Save**

---

## Step 5: Update Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get these from **Supabase Dashboard → Settings → API**

---

## Step 6: Email Templates (Optional but Recommended)

### 6.1 Customize Confirmation Email
1. Go to **Authentication → Email Templates**
2. Select **Confirm signup** template
3. Customize the design/copy (optional)
4. Use these variables:
   - `{{ .ConfirmationURL }}` - Verification link
   - `{{ .Token }}` - Verification code
   - `{{ .SiteURL }}` - Your site URL

---

## Step 7: URL Configuration

1. Go to **Authentication → URL Configuration**
2. Set **Site URL:** `http://localhost:3000` (dev) or `https://your-domain.com` (prod)
3. Add **Redirect URLs:**
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

---

## Testing Checklist

### Email Signup:
- [ ] Create account with email/password
- [ ] Receive confirmation email
- [ ] Click confirmation link
- [ ] Redirected to home page
- [ ] User appears in **Authentication → Users**

### Google OAuth:
- [ ] Click "Continue with Google"
- [ ] Redirected to Google login
- [ ] After login, redirected to home page
- [ ] Profile created in `profiles` table

### GitHub OAuth:
- [ ] Click "Continue with GitHub"
- [ ] Redirected to GitHub authorization
- [ ] After authorization, redirected to home page
- [ ] Profile created in `profiles` table

---

## Common Issues & Fixes

### Issue: "Invalid redirect URL"
**Fix:** Make sure you added the exact callback URL in both Google/GitHub OAuth apps AND Supabase URL Configuration.

### Issue: Email not sending
**Fix:** Check **Authentication → Email Templates → SMTP Settings**. By default, Supabase uses their SMTP (limited). For production, configure your own SMTP.

### Issue: "User already registered"
**Fix:** This is expected. Check **Authentication → Users** to verify the account exists.

### Issue: OAuth popup blocked
**Fix:** Browser blocking popups. User needs to allow popups for your domain.

---

## Security Checklist

- [x] Row Level Security (RLS) enabled on profiles table
- [x] Email confirmation enabled (prevents fake accounts)
- [x] HTTPS required for OAuth redirects (production)
- [ ] Rate limiting configured (Supabase does this automatically)
- [ ] Configure SMTP for production (not Supabase default)

---

## Next Steps

1. Update Navbar to show user info when logged in
2. Create protected routes (dashboard, account settings)
3. Add sign out functionality
4. Create user profile page
5. Implement password reset flow

---

## Support Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [GitHub OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-github)
