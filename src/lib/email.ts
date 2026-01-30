import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendLicenseEmailParams {
  to: string
  productName: string
  licenseToken: string
  downloadUrl: string
  demoVideoUrl?: string
}

export async function sendLicenseEmail({
  to,
  productName,
  licenseToken,
  downloadUrl,
  demoVideoUrl,
}: SendLicenseEmailParams): Promise<void> {
  const emailHtml = generateLicenseEmailTemplate({
    productName,
    licenseToken,
    downloadUrl,
    demoVideoUrl,
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@appsto.software',
    to,
    subject: `Your ${productName} License - appsto.software`,
    html: emailHtml,
  })
}

function generateLicenseEmailTemplate({
  productName,
  licenseToken,
  downloadUrl,
  demoVideoUrl,
}: Omit<SendLicenseEmailParams, 'to'>): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your License</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #0ea5e9;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 20px;
    }
    .license-box {
      background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    .license-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .license-token {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 2px;
      font-family: 'Courier New', monospace;
    }
    .button {
      display: inline-block;
      background-color: #0ea5e9;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 10px 5px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #0284c7;
    }
    .button-secondary {
      background-color: #64748b;
    }
    .button-secondary:hover {
      background-color: #475569;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 15px;
    }
    .steps {
      background-color: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #0ea5e9;
    }
    .step {
      margin-bottom: 15px;
    }
    .step-number {
      display: inline-block;
      width: 28px;
      height: 28px;
      background-color: #0ea5e9;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 28px;
      font-weight: bold;
      margin-right: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 14px;
    }
    .support {
      background-color: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Appsto</div>
      <div class="title">Thank You for Your Purchase! 🎉</div>
      <p>Your <strong>${productName}</strong> is ready to use</p>
    </div>

    <div class="license-box">
      <div class="license-label">YOUR LICENSE TOKEN</div>
      <div class="license-token">${licenseToken}</div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadUrl}" class="button">Download ${productName}</a>
      ${demoVideoUrl ? `<a href="${demoVideoUrl}" class="button button-secondary">Watch Setup Video</a>` : ''}
    </div>

    <div class="section">
      <div class="section-title">📋 Setup Instructions</div>
      <div class="steps">
        <div class="step">
          <span class="step-number">1</span>
          <strong>Download the application</strong> using the button above
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <strong>Install the software</strong> on your computer
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <strong>Launch the application</strong> for the first time
        </div>
        <div class="step">
          <span class="step-number">4</span>
          <strong>Enter your license token</strong> when prompted
        </div>
        <div class="step">
          <span class="step-number">5</span>
          <strong>Activate and enjoy!</strong> The app will verify your license once and work offline forever
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">⚠️ Important Notes</div>
      <ul>
        <li>Your license token is <strong>unique</strong> and can only be used once</li>
        <li>After activation, the app works <strong>100% offline</strong></li>
        <li>Keep this email safe for future reference</li>
        <li>One-time purchase = <strong>lifetime license</strong></li>
      </ul>
    </div>

    <div class="support">
      <strong>Need Help?</strong><br>
      Contact our support team at: <a href="mailto:support@appsto.software">support@appsto.software</a><br>
      We typically respond within 24 hours
    </div>

    <div class="footer">
      <p><strong>Appsto</strong></p>
      <p>Professional Software. One Platform.</p>
      <p style="font-size: 12px; color: #94a3b8;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export async function sendTestEmail(to: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@appsto.software',
    to,
    subject: 'Test Email from appsto.software',
    html: '<p>This is a test email. If you received this, your email configuration is working correctly.</p>',
  })
}
