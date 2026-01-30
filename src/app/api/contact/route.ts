import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, type } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Prepare email content
    const emailContent = {
      to: 'support@appsto.software',
      from: email,
      subject: `[Appsto Contact] ${type ? `[${type.toUpperCase()}]` : ''} ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
              color: white;
              padding: 30px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: 600;
              color: #0B1220;
              margin-bottom: 5px;
            }
            .value {
              background: white;
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .message-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              margin-top: 10px;
              white-space: pre-wrap;
            }
            .footer {
              background: #0B1220;
              color: #9CA3AF;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 12px 12px;
              font-size: 12px;
            }
            .badge {
              display: inline-block;
              background: #22D3EE;
              color: #0B1220;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Submission</h1>
            <div class="badge">${type ? type.toUpperCase() : 'GENERAL'}</div>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">👤 From:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">📝 Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="message-box">${message}</div>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">This email was sent from the Appsto contact form</p>
            <p style="margin: 5px 0 0 0;">Received: ${new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Type: ${type || 'General'}
Subject: ${subject}

Message:
${message}

---
Received: ${new Date().toLocaleString()}
      `
    }

    // In production, you would use a service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Nodemailer with SMTP
    
    // Send email using nodemailer
    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // use TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@appsto.software',
        to: emailContent.to,
        replyTo: emailContent.from,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      console.log('✅ Contact form email sent successfully to:', emailContent.to);
    } catch (emailError) {
      console.error('⚠️ Failed to send email, but logging submission:', emailError);
      // Continue even if email fails - submission is still logged
    }
    
    console.log('Contact form submission:', {
      from: name,
      email,
      type,
      subject,
      timestamp: new Date().toISOString()
    })

    // For demo purposes, return success
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! Our team will respond as soon as possible.',
        data: {
          name,
          email,
          subject,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
