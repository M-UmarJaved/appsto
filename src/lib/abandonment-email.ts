import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendRecoveryEmailParams {
  to: string
  customerName?: string | null
  planSlug: string
  recoveryUrl: string
}

export async function sendCartRecoveryEmail({
  to,
  customerName,
  planSlug,
  recoveryUrl,
}: SendRecoveryEmailParams): Promise<boolean> {
  const planName = planSlug.toLowerCase().includes('pro') ? 'Skillnavo Pro' : 'Skillnavo Starter'
  const greeting = customerName ? `Hi ${customerName},` : 'Hi there,'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #060C17; padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #94a3b8; font-size: 14px; margin: 6px 0 0; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .body-text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .offer-box { background: #f5f3ff; border: 1px dashed #7c3aed; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .offer-title { font-size: 13px; font-weight: 700; color: #6d28d9; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .offer-desc { font-size: 18px; font-weight: 800; color: #1e1b4b; margin: 0 0 4px; }
    .offer-sub { font-size: 13px; color: #64748b; margin: 0; }
    .btn-wrap { text-align: center; margin: 28px 0; }
    .cta-btn { display: inline-block; background: #723CFB; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 50px; box-shadow: 0 4px 14px rgba(114, 60, 251, 0.35); }
    .guarantee { display: flex; align-items: center; justify-content: center; font-size: 13px; color: #64748b; margin-top: 16px; text-align: center; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Skillnavo</h1>
      <p>Your AI Technical Learning Journey</p>
    </div>
    <div class="content">
      <p class="greeting">${greeting}</p>
      <p class="body-text">
        We noticed you started upgrading to <strong>${planName}</strong> on Skillnavo, but your checkout was not completed.
      </p>
      <p class="body-text">
        Whether you ran out of time or encountered an issue, we don't want anything to hold your learning back. To help you take the leap, we've prepared an exclusive welcome offer:
      </p>

      <div class="offer-box">
        <div class="offer-title">Special Recovery Offer</div>
        <div class="offer-desc">Save 10% on your first subscription</div>
        <div class="offer-sub">Valid for the next 24 hours only</div>
      </div>

      <div class="btn-wrap">
        <a href="${recoveryUrl}" class="cta-btn">Complete Checkout &amp; Claim Offer &rarr;</a>
      </div>

      <div class="guarantee">
        <span>🛡️ 14-day full money-back guarantee • Cancel any time</span>
      </div>
    </div>
    <div class="footer">
      <p>Appsto Software Marketplace &amp; Skillnavo Platform • Secure payments processed by Paddle</p>
      <p>If you did not initiate this checkout, please disregard this email.</p>
    </div>
  </div>
</body>
</html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'support@appsto.software',
      to,
      subject: `Complete your ${planName} upgrade on Skillnavo (+ 10% off)`,
      html,
    })
    console.log(`[AbandonmentRecovery] Recovery email successfully sent to ${to}`)
    return true
  } catch (err) {
    console.error(`[AbandonmentRecovery] Failed to send recovery email to ${to}:`, err)
    return false
  }
}
