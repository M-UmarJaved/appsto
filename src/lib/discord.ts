/**
 * Discord Webhook Integration
 * Sends beautiful notifications to Discord for purchase events
 */

interface DiscordEmbed {
  title: string
  description?: string
  color: number
  fields?: { name: string; value: string; inline?: boolean }[]
  thumbnail?: { url: string }
  footer?: { text: string }
  timestamp?: string
}

interface PurchaseNotification {
  customerName: string
  customerEmail: string
  productName: string
  planName: string
  amount: number
  currency: string
  licensesCount: number
  purchaseId: string
  productImage?: string
}

/**
 * Send purchase notification to Discord
 */
export async function sendPurchaseNotification(data: PurchaseNotification) {
  console.log('📢 sendPurchaseNotification called with:', {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    productName: data.productName,
    planName: data.planName,
    amount: data.amount,
    currency: data.currency,
  });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  console.log('📢 Discord webhook URL:', webhookUrl ? 'Configured' : 'Missing');

  if (!webhookUrl) {
    console.warn('⚠️ DISCORD_WEBHOOK_URL not configured - skipping Discord notification')
    return
  }

  try {
    // Format currency amount
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
    }).format(data.amount)

    // Create rich embed
    const embed: DiscordEmbed = {
      title: `🎉 New Sale - ${data.productName}`,
      description: `**${data.customerName}** just purchased ${data.productName}!`,
      color: 3447003, // Blue color
      fields: [
        {
          name: '👤 Customer',
          value: data.customerEmail,
          inline: true,
        },
        {
          name: '💰 Amount',
          value: formattedAmount,
          inline: true,
        },
        {
          name: '📦 Plan',
          value: data.planName,
          inline: true,
        },
        {
          name: '🔑 Licenses',
          value: `${data.licensesCount} license${data.licensesCount > 1 ? 's' : ''}`,
          inline: true,
        },
        {
          name: '🆔 Purchase ID',
          value: `\`${data.purchaseId.substring(0, 8)}...\``,
          inline: true,
        },
        {
          name: '⏰ Time',
          value: new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          inline: true,
        },
      ],
      footer: {
        text: 'Appsto Sales Notification',
      },
      timestamp: new Date().toISOString(),
    }

    // Add product thumbnail if available
    if (data.productImage) {
      embed.thumbnail = {
        url: data.productImage,
      }
    }

    // Send to Discord
    console.log('📢 Sending to Discord webhook...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Appsto Sales Bot',
        avatar_url: 'https://appsto.software/Logo.png', // Your logo
        embeds: [embed],
      }),
    })

    console.log('📢 Discord response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Discord webhook failed:', response.status, errorText)
      throw new Error(`Discord webhook failed: ${response.status}`)
    }

    console.log('✅ Discord notification sent successfully')
  } catch (error) {
    console.error('❌ Error sending Discord notification:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error')
    // Don't throw - we don't want to break the purchase flow if Discord fails
  }
}

/**
 * Send test notification to Discord
 */
export async function sendTestNotification() {
  return sendPurchaseNotification({
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    productName: 'DeskSweep',
    planName: 'Solo Plan',
    amount: 29.99,
    currency: 'USD',
    licensesCount: 1,
    purchaseId: 'test-' + Date.now(),
    productImage: 'https://appsto.software/DeskSweep/DeskSweep.png',
  })
}

/**
 * Send error notification to Discord (for monitoring)
 */
export async function sendErrorNotification(error: {
  title: string
  description: string
  context?: Record<string, any>
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) return

  try {
    const fields = error.context
      ? Object.entries(error.context).map(([key, value]) => ({
          name: key,
          value: String(value),
          inline: true,
        }))
      : []

    const embed: DiscordEmbed = {
      title: `⚠️ ${error.title}`,
      description: error.description,
      color: 15158332, // Red color
      fields,
      footer: {
        text: 'Appsto Error Monitor',
      },
      timestamp: new Date().toISOString(),
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Appsto Error Bot',
        embeds: [embed],
      }),
    })
  } catch (err) {
    console.error('Failed to send error notification to Discord:', err)
  }
}
