import nodemailer from 'nodemailer'

export interface PurchaseEmailData {
  customerName: string
  customerEmail: string
  productName: string
  planName: string
  devices: number
  amount: number
  currency: string
  licenseKeys: string[]
  downloadUrl: string
  purchaseId: string
  transactionId: string
  purchaseDate: string
}

/**
 * Professional Email Template for License Delivery
 * Follows best practices from companies like Stripe, Lemon Squeezy, Gumroad
 */
export function generatePurchaseEmailHTML(data: PurchaseEmailData): string {
  const {
    customerName,
    productName,
    planName,
    devices,
    amount,
    currency,
    licenseKeys,
    downloadUrl,
    purchaseId,
    transactionId,
    purchaseDate
  } = data

  const currencySymbols: Record<string, string> = {
    USD: '$',
    INR: '₹',
    PKR: 'Rs.',
    EUR: '€',
    GBP: '£'
  }

  const symbol = currencySymbols[currency] || currency

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${productName} License</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: #0F172A;
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      color: #ffffff;
      font-size: 16px;
      margin: 8px 0 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .success-badge {
      display: inline-block;
      background-color: #ECFDF5;
      color: #065F46;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 20px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }
    .greeting {
      font-size: 16px;
      line-height: 1.6;
      color: #4B5563;
      margin-bottom: 30px;
    }
    .info-box {
      background-color: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #E5E7EB;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6B7280;
      font-size: 14px;
    }
    .info-value {
      color: #0F172A;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
    }
    .license-section {
      background: #F8FAFC;
      border: 2px solid #0F172A;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .license-title {
      color: #0F172A;
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .license-key {
      background-color: #ffffff;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 8px 0;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: 600;
      color: #0F172A;
      text-align: center;
      letter-spacing: 1px;
    }
    .button {
      display: inline-block;
      background: #0F172A;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
    }
    .steps {
      margin: 30px 0;
    }
    .step {
      display: flex;
      gap: 16px;
      margin: 16px 0;
      padding: 16px;
      background-color: #F9FAFB;
      border-radius: 8px;
    }
    .step-number {
      background-color: #0F172A;
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 4px;
      font-size: 15px;
    }
    .step-description {
      color: #6B7280;
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    }
    .support-box {
      background-color: #FEF3C7;
      border: 1px solid #FCD34D;
      border-radius: 8px;
      padding: 16px;
      margin: 30px 0;
    }
    .support-title {
      font-weight: 600;
      color: #92400E;
      margin-bottom: 8px;
      font-size: 15px;
    }
    .support-text {
      color: #78350F;
      font-size: 14px;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 40px 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer-text {
      color: #6B7280;
      font-size: 13px;
      line-height: 1.6;
      margin: 8px 0;
    }
    .footer-links {
      margin: 16px 0;
    }
    .footer-link {
      color: #0F172A;
      text-decoration: underline;
      margin: 0 12px;
      font-size: 13px;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: #6B7280;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .header {
        padding: 30px 20px;
      }
      h1 {
        font-size: 24px;
      }
      .info-row {
        flex-direction: column;
        gap: 4px;
      }
      .info-value {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h2 class="logo">Appsto</h2>
      <p class="header-subtitle">The Software Marketplace</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="success-badge">✓ Purchase Successful</div>
      
      <h1>Your ${productName} License is Ready! 🎉</h1>
      
      <p class="greeting">
        Hi ${customerName},<br><br>
        Thank you for purchasing ${productName} ${planName}! Your payment has been processed successfully and your license keys are ready to use.
      </p>

      <!-- Purchase Details -->
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Product</span>
          <span class="info-value">${productName} - ${planName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Device Licenses</span>
          <span class="info-value">${devices} Device${devices > 1 ? 's' : ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Amount Paid</span>
          <span class="info-value">${symbol}${amount.toFixed(2)} ${currency}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Purchase Date</span>
          <span class="info-value">${purchaseDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Transaction ID</span>
          <span class="info-value">${transactionId}</span>
        </div>
      </div>

      <!-- License Keys -->
      <div class="license-section">
        <div class="license-title">
          <span>🔑</span>
          <span>Your License Key${licenseKeys.length > 1 ? 's' : ''}</span>
        </div>
        ${licenseKeys.map(key => `<div class="license-key">${key}</div>`).join('')}
      </div>

      <!-- Download Button -->
      <div class="button-container">
        <a href="${downloadUrl}" class="button">Download ${productName}</a>
      </div>

      <!-- Installation Steps -->
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">Download the Software</div>
            <p class="step-description">Click the download button above to get the latest version of ${productName}.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">Install on Your Device</div>
            <p class="step-description">Run the installer and follow the on-screen instructions.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">Activate Your License</div>
            <p class="step-description">Enter your license key when prompted. Copy and paste from above.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">You're All Set!</div>
            <p class="step-description">Start using ${productName} and enjoy all premium features.</p>
          </div>
        </div>
      </div>

      <!-- Support -->
      <div class="support-box">
        <div class="support-title">Need Help?</div>
        <p class="support-text">
          Our support team is here to help! Visit our <a href="https://appsto.software/support" style="color: #92400E; font-weight: 600;">Support Center</a> or email us at <a href="mailto:support@appsto.software" style="color: #92400E; font-weight: 600;">support@appsto.software</a>
        </p>
      </div>

      <!-- Additional Info -->
      <p class="footer-text" style="text-align: left; color: #6B7280; margin-top: 30px;">
        <strong>Important:</strong><br>
        • Save this email - it contains your license keys<br>
        • You can activate your license on up to ${devices} device${devices > 1 ? 's' : ''}<br>
        • Free lifetime updates included<br>
        • Download link is valid for 30 days
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        <strong>Appsto - The Software Marketplace</strong><br>
        Empowering student entrepreneurs and solo developers worldwide
      </p>
      
      <div class="footer-links">
        <a href="https://appsto.software" class="footer-link">Visit Website</a>
        <a href="https://appsto.software/dashboard" class="footer-link">My Dashboard</a>
        <a href="https://appsto.software/support" class="footer-link">Support</a>
      </div>

      <p class="footer-text">
        Purchase ID: ${purchaseId}<br>
        This is an automated email. Please do not reply.
      </p>

      <div class="social-links">
        <a href="https://twitter.com/appsto" class="social-link">Twitter</a>
        <a href="https://github.com/appsto" class="social-link">GitHub</a>
      </div>

      <p class="footer-text" style="font-size: 11px; margin-top: 20px;">
        © ${new Date().getFullYear()} Appsto. All rights reserved.<br>
        <a href="https://appsto.software/privacy" class="footer-link">Privacy Policy</a>
        <a href="https://appsto.software/terms" class="footer-link">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Send professional purchase confirmation email
 */
export async function sendProfessionalPurchaseEmail(data: PurchaseEmailData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const emailHTML = generatePurchaseEmailHTML(data)

  const mailOptions = {
    from: `"Appsto" <${process.env.EMAIL_FROM || 'support@appsto.software'}>`,
    to: data.customerEmail,
    subject: `Your ${data.productName} License - Order #${data.purchaseId.slice(0, 8).toUpperCase()}`,
    html: emailHTML,
    // Plain text fallback
    text: `
Hi ${data.customerName},

Thank you for purchasing ${data.productName} ${data.planName}!

Your License Key${data.licenseKeys.length > 1 ? 's' : ''}:
${data.licenseKeys.join('\n')}

Download: ${data.downloadUrl}

Amount Paid: ${data.currency} ${data.amount}
Transaction ID: ${data.transactionId}
Purchase Date: ${data.purchaseDate}

Need help? Contact us at support@appsto.software

Best regards,
The Appsto Team
https://appsto.software
    `.trim(),
  }

  return transporter.sendMail(mailOptions)
}
