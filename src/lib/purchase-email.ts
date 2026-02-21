import * as nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { formatPrice, type Currency } from './currency';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface PurchaseEmailData {
  purchaseId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  planName: string;
  subtotal: number;
  discount: number;
  amount: number;
  currency: string;
  licenseKeys: string[];
  downloadUrl: string;
  downloadExpiryDays: number;
}

/**
 * Send purchase confirmation email with license keys and download link
 */
export async function sendPurchaseConfirmationEmail(data: PurchaseEmailData) {
  console.log('📧 sendPurchaseConfirmationEmail called with:', {
    purchaseId: data.purchaseId,
    customerEmail: data.customerEmail,
    productName: data.productName,
    licenseCount: data.licenseKeys.length,
  });

  const {
    purchaseId,
    customerName,
    customerEmail,
    productName,
    planName,
    subtotal,
    discount,
    amount,
    currency,
    licenseKeys,
    downloadUrl,
    downloadExpiryDays,
  } = data;

  console.log('📧 SMTP Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    hasPassword: !!process.env.SMTP_PASSWORD,
  });

  const subject = `Your ${productName} Purchase is Complete! 🎉`;
  
  const licenseKeysHTML = licenseKeys
    .map(
      (key, index) => `
        <div style="background: #f8f9fa; padding: 12px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #6366f1;">
          <strong style="color: #374151;">License ${index + 1}:</strong>
          <code style="font-family: 'Courier New', monospace; font-size: 16px; color: #6366f1; display: block; margin-top: 4px;">${key}</code>
        </div>
      `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🎉 Purchase Complete!
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                Thank you for choosing ${productName}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${customerName || 'there'},
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Your purchase of <strong>${productName} (${planName})</strong> is complete! You're all set to start organizing your desktop like a pro. 🚀
              </p>

              <!-- Order Summary Box -->
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                  📋 Order Summary
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0;">Product:</td>
                    <td align="right" style="color: #1f2937; font-weight: 600; padding: 8px 0;">${productName}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0;">Plan:</td>
                    <td align="right" style="color: #1f2937; font-weight: 600; padding: 8px 0;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0;">Licenses:</td>
                    <td align="right" style="color: #1f2937; font-weight: 600; padding: 8px 0;">${licenseKeys.length}</td>
                  </tr>
                  <tr style="${discount > 0 ? '' : 'display: none;'}">
                    <td style="color: #6b7280; padding: 8px 0; border-top: 1px solid #e5e7eb; padding-top: 12px;">Subtotal:</td>
                    <td align="right" style="color: #1f2937; font-weight: 600; padding: 8px 0; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                      ${formatPrice(subtotal, currency as Currency)}
                    </td>
                  </tr>
                  <tr style="${discount > 0 ? '' : 'display: none;'}">
                    <td style="color: #6b7280; padding: 8px 0;">Discount:</td>
                    <td align="right" style="color: #10b981; font-weight: 600; padding: 8px 0;">
                      -${formatPrice(discount, currency as Currency)}
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0; ${discount > 0 ? '' : 'border-top: 1px solid #e5e7eb; padding-top: 12px;'}">Total Paid:</td>
                    <td align="right" style="color: #6366f1; font-weight: 700; font-size: 20px; padding: 8px 0; ${discount > 0 ? '' : 'border-top: 1px solid #e5e7eb; padding-top: 12px;'}">
                      ${formatPrice(amount, currency as Currency)}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- License Keys -->
              <div style="margin: 0 0 30px 0;">
                <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                  🔑 Your License Keys
                </h2>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
                  Save these license keys - you'll need them to activate ${productName}:
                </p>
                ${licenseKeysHTML}
                <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0; font-style: italic;">
                  💡 Keep these keys safe! You can also find them in your account dashboard anytime.
                </p>
              </div>

              <!-- Download Button -->
              <div style="text-align: center; margin: 0 0 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/download/desksweep" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                  ⬇️ Download ${productName}
                </a>
                <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
                  Download link never expires - access anytime from your account
                </p>
              </div>

              <!-- Installation Steps -->
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                <h3 style="color: #1e40af; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                  📦 Quick Installation Guide
                </h3>
                <ol style="color: #1f2937; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Click the download button above</li>
                  <li>Run the installer (DeskSweep-Setup.exe)</li>
                  <li>Follow the installation wizard</li>
                  <li>Launch DeskSweep from your desktop</li>
                  <li>Enter your license key when prompted</li>
                  <li>Enjoy a clean, organized desktop! ✨</li>
                </ol>
              </div>

              <!-- Support -->
              <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">
                  💬 Need Help?
                </h3>
                <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.6;">
                  We're here to help! If you have any questions or run into issues:
                </p>
                <ul style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Email us at <a href="mailto:support@appsto.software" style="color: #6366f1;">support@appsto.software</a></li>
                  <li>Visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #6366f1;">Help Center</a></li>
                  <li>Check the <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #6366f1;">Documentation</a></li>
                </ul>
              </div>

              <!-- Closing -->
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                Happy organizing! 🎯<br>
                <strong>The Appsto Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                Order ID: ${purchaseId}
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} Appsto. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #6366f1; text-decoration: none;">Visit Website</a> • 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #6366f1; text-decoration: none;">My Account</a> • 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color: #6366f1; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    console.log('📧 Attempting to send email...');
    console.log('📧 From:', `"Appsto" <${process.env.EMAIL_FROM}>`);
    console.log('📧 To:', customerEmail);
    console.log('📧 Subject:', subject);
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Appsto" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject,
      html,
      text: `
Your ${productName} Purchase is Complete!

Hi ${customerName || 'there'},

Thank you for purchasing ${productName} (${planName})!

Order Summary:
- Product: ${productName}
- Plan: ${planName}
- Licenses: ${licenseKeys.length}
- Amount: ${formatPrice(amount, currency as Currency)}

Your License Keys:
${licenseKeys.map((key, i) => `${i + 1}. ${key}`).join('\n')}

Download: ${downloadUrl}
(Link expires in ${downloadExpiryDays} days)

Installation:
1. Download the software
2. Run the installer
3. Enter your license key
4. Start organizing!

Need help? Email us at support@appsto.software

Happy organizing!
The Appsto Team

Order ID: ${purchaseId}
      `.trim(),
    });

    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    console.log('📧 Email info:', JSON.stringify(info, null, 2));

    // Log email in database
    await supabase.from('email_logs').insert({
      purchase_id: purchaseId,
      recipient_email: customerEmail,
      email_type: 'purchase_confirmation',
      subject,
      status: 'sent',
      sent_at: new Date().toISOString(),
      message_id: info.messageId,
      provider_response: {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      },
    });

    console.log('✅ Purchase confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending purchase confirmation email:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Log failed email
    await supabase.from('email_logs').insert({
      purchase_id: purchaseId,
      recipient_email: customerEmail,
      email_type: 'purchase_confirmation',
      subject,
      status: 'failed',
      failed_reason: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

/**
 * Send refund confirmation email
 */
export async function sendRefundConfirmationEmail(data: {
  purchaseId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  currency: string;
  reason?: string;
}) {
  const { purchaseId, customerName, customerEmail, productName, amount, currency, reason } = data;

  const subject = `Refund Processed - ${productName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: #ef4444; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                Refund Processed
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${customerName || 'there'},
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Your refund for ${productName} has been processed successfully.
              </p>

              <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #991b1b; margin: 0;">
                  <strong>Refund Amount:</strong> ${formatPrice(amount, currency as Currency)}
                </p>
                ${reason ? `<p style="color: #991b1b; margin: 10px 0 0 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                The refund should appear in your account within 5-10 business days, depending on your payment provider.
              </p>

              <p style="color: #374151; font-size: 16px; margin-top: 30px;">
                We're sorry to see you go. If you have any feedback or concerns, please don't hesitate to reach out.
              </p>

              <p style="color: #374151; font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong>The Appsto Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Order ID: ${purchaseId}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: `"Appsto" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject,
      html,
    });

    await supabase.from('email_logs').insert({
      purchase_id: purchaseId,
      recipient_email: customerEmail,
      email_type: 'refund_confirmation',
      subject,
      status: 'sent',
      sent_at: new Date().toISOString(),
      message_id: info.messageId,
    });

    console.log('✅ Refund confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending refund email:', error);

    await supabase.from('email_logs').insert({
      purchase_id: purchaseId,
      recipient_email: customerEmail,
      email_type: 'refund_confirmation',
      subject,
      status: 'failed',
      failed_reason: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

/**
 * Resend license keys email
 */
export async function resendLicenseEmail(purchaseId: string) {
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*, licenses(*), product:products(name)')
    .eq('id', purchaseId)
    .single();

  if (!purchase) {
    throw new Error('Purchase not found');
  }

  const licenseKeys = purchase.licenses.map((l: any) => l.license_key);
  const downloadUrl = await generateDownloadUrl(purchase.product_id, purchaseId);

  return sendPurchaseConfirmationEmail({
    purchaseId: purchase.id,
    customerName: purchase.customer_name || '',
    customerEmail: purchase.customer_email,
    productName: purchase.product.name,
    planName: 'Your Plan',
    subtotal: purchase.amount,
    discount: 0, // Historical data - discount info not stored in database
    amount: purchase.amount,
    currency: purchase.currency,
    licenseKeys,
    downloadUrl,
    downloadExpiryDays: 7,
  });
}

/**
 * Generate a secure download URL
 */
async function generateDownloadUrl(productId: string, purchaseId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/download?product=${productId}&purchase=${purchaseId}`;
}
