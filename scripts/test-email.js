#!/usr/bin/env node

/**
 * Email Testing Script
 * 
 * Tests your email configuration by sending a test email
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('📧 Testing Email Configuration...\n');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Test connection
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\nPlease check your SMTP credentials in .env file\n');
    return;
  }

  // Send test email
  const testEmail = process.env.SMTP_USER;
  console.log(`Sending test email to: ${testEmail}\n`);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@appsto.software',
      to: testEmail,
      subject: 'Test Email from appsto.software',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0ea5e9;">✅ Email Configuration Working!</h1>
          <p>This is a test email from your appsto.software marketplace.</p>
          <p>If you're seeing this, your email configuration is working correctly.</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #64748b; font-size: 14px;">
            <strong>SMTP Settings:</strong><br>
            Host: ${process.env.SMTP_HOST}<br>
            Port: ${process.env.SMTP_PORT}<br>
            User: ${process.env.SMTP_USER}
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox (and spam folder) for the test email.\n');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.log('\nPlease check:');
    console.log('1. SMTP credentials are correct');
    console.log('2. "Less secure app access" enabled (for Gmail)');
    console.log('3. Using App Password (for Gmail with 2FA)');
    console.log('4. Firewall/antivirus not blocking SMTP\n');
  }
}

testEmail().catch(console.error);
