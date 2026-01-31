# 🔐 SUPABASE AUTHENTICATION - PROFESSIONAL SETUP GUIDE

**Complete guide to configure professional authentication for appsto.software**

---

## 📍 STEP 1: UPDATE REDIRECT/CALLBACK URLS

### A. Supabase Dashboard Configuration

1. **Go to Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: **Appsto** (xdsfmqidnfpvfrdegxum)

2. **Authentication Settings:**
   - Sidebar → **Authentication** → **URL Configuration**
   
3. **Site URL (Update):**
   ```
   https://appsto.software
   ```
   - This is your main application URL
   - Must match your production domain

4. **Redirect URLs (Add these):**
   ```
   https://appsto.software/auth/callback
   https://appsto.software/reset-password
   https://appsto.software/**
   ```
   - **First URL:** OAuth callback (Google, GitHub, etc.)
   - **Second URL:** Password reset email links
   - **Third URL:** Wildcard for flexibility (optional but recommended)

5. **Click "Save"**

---

## 🎨 STEP 2: PROFESSIONAL EMAIL TEMPLATES

### A. Customize Email Templates

1. **In Supabase Dashboard:**
   - Sidebar → **Authentication** → **Email Templates**

### B. Confirm Signup Email

**Subject:** `Welcome to Appsto - Confirm Your Email`

**Template:**
```html
<h2>Welcome to Appsto.Software! 🎉</h2>

<p>Hi there,</p>

<p>Thank you for signing up for Appsto, your marketplace for quality software applications. We're excited to have you on board!</p>

<p>To complete your registration and start exploring our products, please confirm your email address by clicking the button below:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #3B82F6; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
    Confirm Email Address
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #3B82F6;">{{ .ConfirmationURL }}</p>

<p><strong>Why confirm your email?</strong></p>
<ul>
  <li>Access your purchases and downloads</li>
  <li>Receive important updates about your software</li>
  <li>Manage your account and licenses</li>
</ul>

<p>If you didn't create an account with Appsto, you can safely ignore this email.</p>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

<p style="font-size: 12px; color: #9CA3AF;">
  <strong>Appsto.Software</strong><br>
  Muhammad Umar Javed<br>
  GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan<br>
  Email: support@appsto.software<br>
  Website: <a href="https://appsto.software">appsto.software</a>
</p>
```

---

### C. Magic Link Email

**Subject:** `Your Sign In Link for Appsto`

**Template:**
```html
<h2>Sign In to Appsto.Software</h2>

<p>Hi there,</p>

<p>You requested a magic link to sign in to your Appsto account. Click the button below to sign in instantly:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #3B82F6; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
    Sign In to Appsto
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #3B82F6;">{{ .ConfirmationURL }}</p>

<p><strong>Security Notice:</strong></p>
<ul>
  <li>This link expires in 1 hour</li>
  <li>Can only be used once</li>
  <li>If you didn't request this, ignore this email</li>
</ul>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

<p style="font-size: 12px; color: #9CA3AF;">
  <strong>Appsto.Software</strong><br>
  Muhammad Umar Javed<br>
  GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan<br>
  Email: support@appsto.software<br>
  Website: <a href="https://appsto.software">appsto.software</a>
</p>
```

---

### D. Reset Password Email

**Subject:** `Reset Your Appsto Password`

**Template:**
```html
<h2>Reset Your Password</h2>

<p>Hi there,</p>

<p>We received a request to reset the password for your Appsto account. Click the button below to create a new password:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #3B82F6; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
    Reset Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #3B82F6;">{{ .ConfirmationURL }}</p>

<p><strong>Security Information:</strong></p>
<ul>
  <li>This link expires in 1 hour for security</li>
  <li>Your old password will continue to work until you set a new one</li>
  <li>Didn't request this? Your account is still secure - just ignore this email</li>
</ul>

<p>For security reasons, we recommend using a strong, unique password that you don't use on other websites.</p>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

<p style="font-size: 12px; color: #9CA3AF;">
  <strong>Appsto.Software</strong><br>
  Muhammad Umar Javed<br>
  GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan<br>
  Email: support@appsto.software<br>
  Website: <a href="https://appsto.software">appsto.software</a>
</p>
```

---

### E. Change Email Address

**Subject:** `Confirm Your New Email Address - Appsto`

**Template:**
```html
<h2>Confirm Email Address Change</h2>

<p>Hi there,</p>

<p>You recently requested to change the email address associated with your Appsto account. To complete this change, please confirm your new email address:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #3B82F6; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
    Confirm New Email
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #3B82F6;">{{ .ConfirmationURL }}</p>

<p><strong>Important:</strong></p>
<ul>
  <li>Once confirmed, you'll use this email to sign in</li>
  <li>Purchase confirmations will be sent here</li>
  <li>This link expires in 24 hours</li>
</ul>

<p>If you didn't request this change, please contact us immediately at support@appsto.software</p>

<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">

<p style="font-size: 12px; color: #9CA3AF;">
  <strong>Appsto.Software</strong><br>
  Muhammad Umar Javed<br>
  GLOSIX, LC 67, Phase 2 Dream Gardens Defense Road Lahore Pakistan<br>
  Email: support@appsto.software<br>
  Website: <a href="https://appsto.software">appsto.software</a>
</p>
```

---

## 🔒 STEP 3: OAUTH PROVIDERS SETUP (OPTIONAL)

### A. Google OAuth Configuration

If you want "Sign in with Google":

1. **Create Google OAuth App:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create new project: "Appsto Software"
   - Create OAuth 2.0 Client ID

2. **Configure OAuth Consent Screen:**
   - **App name:** Appsto.Software
   - **User support email:** support@appsto.software
   - **App logo:** Upload your Appsto logo (512x512 PNG)
   - **Application home page:** https://appsto.software
   - **Application privacy policy:** https://appsto.software/privacy
   - **Application terms of service:** https://appsto.software/terms
   - **Authorized domains:** appsto.software

3. **OAuth Client Configuration:**
   - **Authorized JavaScript origins:**
     ```
     https://appsto.software
     https://xdsfmqidnfpvfrdegxum.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback
     ```

4. **In Supabase Dashboard:**
   - Authentication → Providers → Google
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

---

### B. GitHub OAuth Configuration

If you want "Sign in with GitHub":

1. **Create GitHub OAuth App:**
   - Go to: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Application Details:**
   - **Application name:** Appsto.Software
   - **Homepage URL:** https://appsto.software
   - **Application description:** 
     ```
     Appsto is a marketplace for quality software applications. 
     Sign in to purchase software, manage your licenses, and download products.
     ```
   - **Authorization callback URL:**
     ```
     https://xdsfmqidnfpvfrdegxum.supabase.co/auth/v1/callback
     ```

3. **Upload Logo:**
   - Upload your Appsto logo (square, at least 200x200px)

4. **In Supabase Dashboard:**
   - Authentication → Providers → GitHub
   - Enable GitHub
   - Paste Client ID and Client Secret
   - Save

---

## 🎯 STEP 4: SMTP EMAIL CONFIGURATION

### Current Setup (Already Configured ✅):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=helpappsto@gmail.com
SMTP_PASSWORD=oulq cwis ftkl ceob
EMAIL_FROM=support@appsto.software
```

### Professional Email Sender Configuration:

1. **In Supabase Dashboard:**
   - Authentication → Settings → **SMTP Settings**
   - **Enable Custom SMTP:** ON

2. **SMTP Configuration:**
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: helpappsto@gmail.com
   Password: oulq cwis ftkl ceob
   Sender email: support@appsto.software
   Sender name: Appsto.Software
   ```

3. **Important:** 
   - Use `support@appsto.software` as the FROM email
   - This makes emails look professional (not noreply@supabase.co)

---

## 🌐 STEP 5: RATE LIMITING & SECURITY

### A. Rate Limiting Configuration

1. **In Supabase Dashboard:**
   - Authentication → Rate Limits

2. **Recommended Settings:**
   ```
   Email signups per hour: 10 per IP
   Email signins per hour: 10 per IP
   SMS signups per hour: 5 per IP (if using SMS)
   Password recovery per hour: 5 per email
   ```

### B. Security Settings

1. **Enable Email Confirmations:**
   - Authentication → Settings
   - **Enable email confirmations:** ON
   - Users must verify email before accessing account

2. **Password Requirements:**
   - Minimum length: 8 characters
   - Consider requiring: uppercase, lowercase, number

3. **Session Settings:**
   ```
   JWT expiry: 3600 seconds (1 hour)
   Refresh token rotation: Enabled
   ```

---

## 📱 STEP 6: PROFESSIONAL CONSENT SCREEN

### What Users Will See:

When signing in with OAuth (Google/GitHub), users see:

**✅ Professional Elements:**
- Your app name: **Appsto.Software**
- Your app logo (upload in OAuth settings)
- Clear description of what you're requesting
- Links to Privacy Policy and Terms

**❌ Avoid:**
- Generic names like "My App"
- No logo (uses default icon)
- Unclear descriptions
- Missing legal links

### Make It Professional:

1. **Upload High-Quality Logo:**
   - Square format (512x512px minimum)
   - Professional design
   - Clear branding

2. **Write Clear Description:**
   ```
   Appsto.Software is a marketplace for quality productivity software. 
   We need access to your email address to create your account and 
   send you purchase confirmations and download links.
   ```

3. **Add Legal Links:**
   - Privacy Policy: https://appsto.software/privacy
   - Terms of Service: https://appsto.software/terms

---

## ✅ STEP 7: TESTING CHECKLIST

### Test All Flows:

- [ ] **Sign Up with Email:**
  - Sign up with new email
  - Check spam folder for confirmation email
  - Confirm email link works
  - Redirects to https://appsto.software

- [ ] **Sign In with Email:**
  - Sign in with confirmed account
  - Check redirect to dashboard
  - Session persists across pages

- [ ] **Password Reset:**
  - Click "Forgot Password"
  - Receive reset email at support@appsto.software
  - Reset link works
  - Redirects to https://appsto.software/reset-password
  - Can set new password

- [ ] **Google OAuth (if enabled):**
  - Click "Sign in with Google"
  - See professional consent screen
  - Approve and redirect works
  - Account created successfully

- [ ] **Email Appearance:**
  - Emails come from support@appsto.software
  - Professional formatting
  - All links work
  - Business address visible

---

## 🔧 STEP 8: CODE VERIFICATION

### Your code is already configured correctly! ✅

**Callback Route:** `src/app/auth/callback/route.ts`
```typescript
// Already set to redirect to home after auth
return NextResponse.redirect(new URL('/', requestUrl.origin))
```

**Auth Context:** `src/contexts/AuthContext.tsx`
```typescript
// Already using dynamic origin
redirectTo: `${window.location.origin}/auth/callback`
```

**Environment Variables:** `.env`
```env
NEXT_PUBLIC_SITE_URL=https://appsto.software  ✅
NEXT_PUBLIC_APP_URL=https://appsto.software/  ✅
```

**No code changes needed!** Everything will work once Supabase dashboard is configured.

---

## 🚀 STEP 9: GO LIVE CHECKLIST

### Before Production:

- [ ] Update Supabase Site URL to production domain
- [ ] Add all redirect URLs (callback, reset-password)
- [ ] Configure custom SMTP with support@appsto.software
- [ ] Customize all 4 email templates with branding
- [ ] Test email delivery (check spam folder)
- [ ] Set up OAuth providers (optional)
- [ ] Configure OAuth consent screens (if using OAuth)
- [ ] Enable email confirmation requirement
- [ ] Set rate limiting policies
- [ ] Test complete sign up flow
- [ ] Test password reset flow
- [ ] Verify all emails arrive professionally branded
- [ ] Check mobile responsiveness of emails

---

## 📞 TROUBLESHOOTING

### Emails Not Arriving:

1. **Check Spam Folder** - Gmail often filters authentication emails
2. **Verify SMTP Settings** - Make sure credentials are correct
3. **Check Supabase Logs** - Authentication → Logs for errors
4. **Test SMTP Connection** - Send test email from Supabase dashboard

### Redirect Not Working:

1. **Verify URLs Match Exactly:**
   - Supabase Site URL: `https://appsto.software`
   - Redirect URL: `https://appsto.software/auth/callback`
   - No trailing slashes inconsistency

2. **Clear Browser Cache** - Old redirects might be cached

3. **Check Environment Variables:**
   ```bash
   # Make sure these match production
   NEXT_PUBLIC_SUPABASE_URL=https://xdsfmqidnfpvfrdegxum.supabase.co
   NEXT_PUBLIC_SITE_URL=https://appsto.software
   ```

### OAuth Errors:

1. **"redirect_uri_mismatch":**
   - Check OAuth app redirect URI matches Supabase callback URL exactly

2. **Consent screen not showing:**
   - Verify OAuth app is published (not in testing mode)
   - Add test users if in testing mode

---

## 📊 PROFESSIONAL SETUP SUMMARY

| Component | Current Status | Professional Status |
|-----------|---------------|-------------------|
| Site URL | ✅ Set | ✅ https://appsto.software |
| Redirect URLs | ⚠️ Needs Update | Update in Supabase dashboard |
| Email Templates | ⚠️ Default | Customize with branding |
| SMTP Sender | ✅ Configured | Use support@appsto.software |
| OAuth Providers | ❌ Not Set Up | Optional (Google, GitHub) |
| Email Confirmation | ✅ Enabled | Keep enabled for security |
| Rate Limiting | ✅ Enabled | Default settings OK |
| Business Branding | ⚠️ Partial | Add to email templates |

---

## 🎯 IMMEDIATE ACTION ITEMS

### Priority 1 (Do Now):

1. **Update Supabase Redirect URLs:**
   - Go to Supabase Dashboard
   - Add: `https://appsto.software/auth/callback`
   - Add: `https://appsto.software/reset-password`
   - Add: `https://appsto.software/**`

2. **Customize Email Templates:**
   - Update all 4 templates with professional branding
   - Add business address
   - Use support@appsto.software in footer

3. **Configure Custom SMTP:**
   - Set sender name: "Appsto.Software"
   - Set sender email: support@appsto.software

### Priority 2 (Optional):

4. **Set Up OAuth (if desired):**
   - Google OAuth with professional consent screen
   - GitHub OAuth with app description

---

## ✅ COMPLETION CHECKLIST

- [ ] Updated Supabase Site URL
- [ ] Added all redirect URLs
- [ ] Customized all 4 email templates
- [ ] Configured custom SMTP sender
- [ ] Tested sign up flow
- [ ] Tested sign in flow
- [ ] Tested password reset flow
- [ ] Verified emails arrive professionally
- [ ] Checked emails in spam folder
- [ ] Set up OAuth providers (optional)
- [ ] Configured OAuth consent screens (optional)
- [ ] Tested on mobile device
- [ ] Verified all redirects work correctly

---

**YOUR AUTHENTICATION SYSTEM WILL NOW BE 100% PROFESSIONAL! 🎉**

Users will see:
- ✅ Branded emails from support@appsto.software
- ✅ Professional consent screens (if using OAuth)
- ✅ Proper redirects to your domain
- ✅ Business address in all communications
- ✅ Secure, rate-limited authentication
