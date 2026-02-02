import { NextResponse } from 'next/server'
import { sendTestNotification } from '@/lib/discord'

/**
 * Test Discord Webhook Endpoint
 * GET /api/test/discord
 * 
 * Use this to verify your Discord webhook is working correctly
 */
export async function GET() {
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
