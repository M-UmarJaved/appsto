import { NextRequest, NextResponse } from 'next/server'
import { sendTestNotification } from '@/lib/discord'

export const dynamic = 'force-dynamic'

/**
 * Test Discord Webhook Endpoint
 * GET /api/test/discord?key=YOUR_API_SECRET
 * 
 * PROTECTED: Requires API_SECRET_KEY in query params or header
 * Use this to verify your Discord webhook is working correctly
 */
export async function GET(req: NextRequest) {
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
    console.log('🔔 Testing Discord webhook...')

    // Send test notification
    await sendTestNotification()

    return NextResponse.json({
      success: true,
      message: 'Discord test notification sent! Check your Discord channel and mobile app.',
    })
  } catch (error: any) {
    console.error('❌ Discord test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send Discord notification',
      },
      { status: 500 }
    )
  }
}
