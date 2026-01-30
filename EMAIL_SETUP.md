# Email Configuration Setup

The contact form now sends all messages to **support@appsto.software** using SMTP.

---

## ⚡ TL;DR - Quick Setup (5 Minutes)

**You're using email forwarding from name.com? Perfect! Here's all you need:**

1. **On name.com**: Set up forwarding `support@appsto.software` → `your_email@gmail.com`
2. **On Gmail**: Get app password from https://myaccount.google.com/apppasswords
3. **In your project**: Create `.env.local` with:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=helpappsto@gmail.com
   SMTP_PASSWORD=ssnv zsse efgv fjfp
   EMAIL_FROM=support@appsto.software
   ```
4. **Test it**: `node scripts/test-email.js`

Done! Contact form messages will arrive in your Gmail inbox. ✅

---

## 🎯 Using Email Forwarding (Recommended for Small Teams)

**Perfect for your setup with name.com email forwarding!**

If you've set up email forwarding where `support@appsto.software` forwards to your personal email (e.g., your Gmail), you only need to configure the SMTP settings to **send** emails. Name.com will automatically forward incoming emails to your real inbox.

### Quick Setup with Email Forwarding:

1. **Set up email forwarding on name.com** (if not done already):
   - Go to name.com → Your Domain → Email Forwarding
   - Create forward: `support@appsto.software` → `your_real_email@gmail.com`
   - Verify the forwarding is working

2. **Configure SMTP to send FROM your personal email**:
   
   Add to `.env.local`:
   ```env
   # Use your personal Gmail/email to SEND emails
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_real_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   EMAIL_FROM=support@appsto.software
   ```

3. **How it works**:
   - User fills contact form → API sends email to `support@appsto.software`
   - Name.com receives email at `support@appsto.software`
   - Name.com automatically forwards to `your_real_email@gmail.com`
   - You receive it in your regular inbox! ✅

### Setting up Gmail App Password:

1. Enable 2-Factor Authentication on your Gmail
2. Go to: https://myaccount.google.com/apppasswords
3. Create app password for "Mail"
4. Copy the 16-character password
5. Use it as `SMTP_PASSWORD` in your `.env.local`

### Example Configuration:

```env
# Email Configuration with Forwarding
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com          # Your actual Gmail
SMTP_PASSWORD=abcd efgh ijkl mnop      # Gmail app password (16 chars)
EMAIL_FROM=support@appsto.software     # Professional display name
```

### Testing Your Setup:

```bash
# Test the email sending
node scripts/test-email.js
```

Or test through the contact form directly - submit a message and check if it arrives in your inbox!

### ✅ Advantages of This Setup:

- **Simple**: No need to set up a real support@appsto.software mailbox
- **Professional**: Users see support@appsto.software
- **Centralized**: All emails land in your existing inbox
- **Free**: No additional email hosting costs
- **Reply-friendly**: When you reply, it comes from your Gmail (with reply-to set to user's email)

---

## Setup Instructions

### 1. Configure Environment Variables

Add these to your `.env.local` file (or production environment):

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@appsto.software
```

### 2. Gmail Setup (Recommended)

If using Gmail with email forwarding:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASSWORD`

3. Update `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_real_email@gmail.com    # Your actual Gmail account
SMTP_PASSWORD=xxxx xxxx xxxx xxxx      # Your 16-char app password
EMAIL_FROM=support@appsto.software     # Professional sender address
```

**Note**: Emails will be sent TO `support@appsto.software`, which name.com forwards to your Gmail. The SMTP credentials are just for sending the email - name.com handles the receiving/forwarding automatically.

### 2.1. Name.com Email Forwarding Setup

**Step-by-step guide for name.com:**

1. **Log into name.com**
   - Go to: https://www.name.com/account/domain
   - Select your domain: `appsto.software`

2. **Set up Email Forwarding**
   - Click on "Email" or "Email Forwarding" tab
   - Click "Add Email Forward"
   - **Alias**: `support` (creates support@appsto.software)
   - **Forward to**: Your personal email (e.g., `your_email@gmail.com`)
   - Click "Add Forward"

3. **Verify Forwarding (Important!)**
   - Name.com will send verification email to your personal email
   - Click the verification link in that email
   - Status should change to "Active" ✅

4. **Test the Forwarding**
   - Send a test email from any email to `support@appsto.software`
   - Check if it arrives in your personal inbox
   - If yes, you're all set! 🎉

**Common Issues:**
- If verification email doesn't arrive, check spam folder
- Make sure your personal email is correct and accessible
- Forwarding activation can take 5-10 minutes after verification

---

### 3. Custom Email Provider

For professional setup with support@appsto.software:

#### Option A: Gmail with Custom Domain
- Set up Gmail for your domain via Google Workspace
- Use the same SMTP settings as above

#### Option B: Custom SMTP Provider
Popular options:
- **SendGrid** (Free: 100 emails/day)
- **AWS SES** (Very cheap, $0.10/1000 emails)
- **Mailgun** (Free: 5,000 emails/month)
- **Resend** (Free: 3,000 emails/month)

Example for SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=support@appsto.software
```

### 4. Testing Email Configuration

Run the test script:

```bash
node scripts/test-email.js
```

This will:
- Verify SMTP connection
- Send a test email
- Confirm configuration is working

### 5. What Happens Now

When someone submits the contact form:

1. **Form Validation** - Client-side checks for required fields
2. **API Processing** - `/api/contact` receives the submission
3. **Email Sending** - Nodemailer sends formatted email to `support@appsto.software`
4. **User Feedback** - Success message shown to user
5. **Fallback Logging** - If email fails, submission is still logged in console

### 6. Production Checklist

- [ ] Create `support@appsto.software` email address
- [ ] Configure SMTP credentials in production environment
- [ ] Test email delivery with `node scripts/test-email.js`
- [ ] Set up email forwarding/monitoring
- [ ] Configure spam filters to accept emails from contact form
- [ ] Test reply functionality (replyTo is set to user's email)

### 7. Email Features

The contact form now includes:

✅ **Unified Email** - All inquiries go to support@appsto.software
✅ **Professional Templates** - Formatted HTML emails with branding
✅ **Reply-To Support** - Click reply to respond directly to user
✅ **Type Categorization** - Subject line includes inquiry type (GENERAL, SUPPORT, etc.)
✅ **Error Handling** - Graceful fallback if email service is down
✅ **No Response Time Promises** - Avoids negative impact from delayed responses

### 8. Email Template

Emails sent to support@appsto.software include:

- **Header** with Appsto branding
- **Badge** showing inquiry type (GENERAL, SUPPORT, REFUND, etc.)
- **User Details** (Name, Email, Subject)
- **Message** in formatted box
- **Timestamp** of submission
- **Professional Footer**

### 9. Troubleshooting

**Email not sending?**
- Check SMTP credentials in `.env.local`
- For Gmail: Use app password, not regular password (get it from https://myaccount.google.com/apppasswords)
- Check firewall/antivirus blocking port 587
- Run test script: `node scripts/test-email.js`

**Emails not arriving at your inbox?**
- Check name.com email forwarding is set up: `support@appsto.software` → `your_email@gmail.com`
- Check spam folder in your personal email
- Verify forwarding on name.com dashboard
- Send a test email directly to support@appsto.software to test forwarding

**Emails going to spam?**
- This is expected when using email forwarding from different domain
- Add support@appsto.software to your contacts
- Mark test emails as "Not Spam"
- For production, consider SPF/DKIM records (optional for small scale)

**Testing locally?**
- Emails will send from your local machine
- Use Gmail app password for development
- Consider using Mailtrap.io for testing without sending real emails

## 📊 Visual Flow with Email Forwarding

Here's how your setup works:

```
┌─────────────────────────────────────────────────────────────┐
│  User fills contact form on appsto.software                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js API (/api/contact)                                 │
│  - Validates form data                                      │
│  - Creates email with nodemailer                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Gmail SMTP Server (smtp.gmail.com)                         │
│  - Uses your Gmail credentials                              │
│  - Sends email TO: support@appsto.software                  │
│  - FROM: support@appsto.software                            │
│  - REPLY-TO: user's email                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Name.com Email Forwarding                                  │
│  - Receives: support@appsto.software                        │
│  - Forwards to: your_real_email@gmail.com                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Your Personal Gmail Inbox ✅                                │
│  - See professional sender: support@appsto.software         │
│  - Reply goes directly to customer (reply-to header)        │
│  - All in one place, easy to manage                         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start Checklist (With Email Forwarding)

- [ ] Set up email forwarding on name.com: `support@appsto.software` → `your_email@gmail.com`
- [ ] Verify forwarding is active (check for verification email)
- [ ] Enable 2FA on your Gmail account
- [ ] Create Gmail app password at https://myaccount.google.com/apppasswords
- [ ] Add SMTP settings to `.env.local` file
- [ ] Test with: `node scripts/test-email.js`
- [ ] Test contact form on your website
- [ ] Check if email arrives in your inbox
- [ ] Try replying to ensure reply-to works correctly

## 💡 Pro Tips

1. **Keep it Simple**: Email forwarding is perfect for startups/small teams
2. **Professional Appearance**: Users see support@appsto.software (looks professional!)
3. **Centralized**: Everything in your existing inbox (no need to check multiple places)
4. **Cost-Effective**: Free with your domain purchase from name.com
5. **Scalable**: When you grow, easily switch to Google Workspace or Microsoft 365

---

## Alternative: Serverless Email Services

For easier setup without SMTP:

### Resend (Recommended)
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@appsto.software',
  to: 'support@appsto.software',
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### SendGrid
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: 'support@appsto.software',
  from: 'noreply@appsto.software',
  subject: emailContent.subject,
  html: emailContent.html,
});
```

---

**Need Help?** Check the DEPLOYMENT.md file for more production setup guidance.
