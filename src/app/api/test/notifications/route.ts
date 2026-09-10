import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseConfirmationEmail } from '@/lib/purchase-email'
import { sendPurchaseNotification } from '@/lib/discord'

export const dynamic = 'force-dynamic'

/**
 * Test endpoint to verify email and Discord notifications work
 * Usage: POST http://localhost:3000/api/test/notifications
 * Production: Requires x-api-key header or key query param
 */
export async function POST(req: NextRequest) {
  // SECURITY: Check for API key in production
  if (process.env.NODE_ENV === 'production') {
    const apiKey = req.nextUrl.searchParams.get('key') || req.headers.get('x-api-key')
    const validKey = process.env.API_SECRET_KEY

    if (!apiKey || !validKey || apiKey !== validKey) {
      console.warn('⚠️ Unauthorized test endpoint access attempt')
      return NextResponse.json(
        { error: 'Unauthorized - API key required' },
        { status: 401 }
      )
    }
  }

  try {
    const body = await req.json()
    const { email = 'test@example.com', testType = 'both' } = body

    console.log('🧪 Testing notifications...')
    console.log('🧪 Test type:', testType)
    console.log('🧪 Email:', email)

    const testData = {
      purchaseId: 'test-' + Date.now(),
      customerName: 'Test Customer',
      customerEmail: email,
      productName: 'DeskSweep',
      planName: 'Solo Plan',
      subtotal: 9.0,
      discount: 6.0,
      amount: 3.0,
      currency: 'USD',
      licenseKeys: ['TEST-AAAA-BBBB-CCCC-DDDD'],
      downloadUrl: 'https://appsto.software/api/download?token=test',
      downloadExpiryDays: 7,
      licensesCount: 1,
      productImage: 'https://appsto.software/DeskSweep/DeskSweep.png',
    }

    const results: any = {}

    // Test email
    if (testType === 'email' || testType === 'both') {
      console.log('📧 Testing email...')
      try {
        const emailResult = await sendPurchaseConfirmationEmail(testData)
        results.email = { ...emailResult, success: true }
        console.log('✅ Email test passed')
      } catch (error) {
        results.email = { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
        console.error('❌ Email test failed:', error)
      }
    }

    // Test Discord
    if (testType === 'discord' || testType === 'both') {
      console.log('📢 Testing Discord...')
      try {
        await sendPurchaseNotification(testData)
        results.discord = { success: true }
        console.log('✅ Discord test passed')
      } catch (error) {
        results.discord = { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
        console.error('❌ Discord test failed:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tests completed',
      results,
      env: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_USER: process.env.SMTP_USER,
        EMAIL_FROM: process.env.EMAIL_FROM,
        hasSmtpPassword: !!process.env.SMTP_PASSWORD,
        hasDiscordWebhook: !!process.env.DISCORD_WEBHOOK_URL,
      }
    })
  } catch (error) {
    console.error('❌ Test endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Allow GET for easy browser testing
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Email & Discord Notification Test Endpoint',
    usage: 'POST /api/test/notifications',
    body: {
      email: 'your-email@example.com',
      testType: 'both | email | discord',
    },
    example: `
      curl -X POST http://localhost:3000/api/test/notifications \\
        -H "Content-Type: application/json" \\
        -d '{"email": "your@email.com", "testType": "both"}'
    `,
  })
}
