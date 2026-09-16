/**
 * Server-Side Paddle API Client for Appsto & Skillnavo
 * 
 * Directly queries Paddle's REST API using the production PADDLE_API_KEY.
 * Provides authoritative live pricing, multi-currency conversion, and regional price overrides.
 * Caches responses in-memory for 5 minutes (300 seconds) to prevent API rate limits.
 */

export interface LivePriceItem {
  priceId: string
  amount: number
  currency: string
  formattedPrice: string
}

export interface LivePriceResult {
  success: boolean
  currency: string
  items: Map<string, LivePriceItem>
  source: 'paddle_api' | 'fallback'
}

// In-memory cache keyed by countryCode (TTL: 5 minutes)
interface CacheEntry {
  data: LivePriceResult
  timestamp: number
}

const pricingCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60 * 1000 // 60 seconds for fast synchronization

export async function fetchLivePaddlePricesServer(
  priceIds: string[],
  countryCode?: string
): Promise<LivePriceResult> {
  const cacheKey = (countryCode || 'GLOBAL').toUpperCase()
  const cached = pricingCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const apiKey = process.env.PADDLE_API_KEY
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'production'
  const baseUrl = environment === 'sandbox' ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'

  if (!apiKey) {
    console.warn('[PaddleServerApi] PADDLE_API_KEY not set in environment. Falling back to local prices.')
    return {
      success: false,
      currency: 'USD',
      items: new Map(),
      source: 'fallback',
    }
  }

  try {
    // 1. Try Pricing Preview API (applies regional price overrides & currency for customer country)
    const previewPayload: Record<string, unknown> = {
      items: priceIds.map((id) => ({ price_id: id, quantity: 1 })),
    }

    if (countryCode && countryCode.length === 2) {
      previewPayload.address = { country_code: countryCode.toUpperCase() }
    }

    let previewRes = await fetch(`${baseUrl}/pricing-preview`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(previewPayload),
      cache: 'no-store',
    })

    // If regional preview failed (e.g. PK or unsupported country code in Paddle),
    // retry immediately without address to retrieve authoritative base USD prices
    if (!previewRes.ok && previewPayload.address) {
      delete previewPayload.address
      previewRes = await fetch(`${baseUrl}/pricing-preview`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(previewPayload),
        cache: 'no-store',
      })
    }

    if (previewRes.ok) {
      const json = await previewRes.json()
      const data = json.data
      const lineItems = data?.details?.line_items || []
      const detectedCurrency = data?.currency_code || 'USD'

      const resultMap = new Map<string, LivePriceItem>()

      for (const item of lineItems) {
        const id = item.price?.id
        if (!id) continue

        const totalUnit = item.unit_totals?.total
        const formattedTotal = item.formatted_unit_totals?.total

        // Paddle amounts in unit_totals are integer cents (e.g. 399 for $3.99)
        const numericAmount = totalUnit ? parseFloat(totalUnit) / 100 : 0
        const symbol = detectedCurrency === 'INR' ? '₹' : detectedCurrency === 'USD' ? '$' : detectedCurrency + ' '

        resultMap.set(id, {
          priceId: id,
          amount: numericAmount,
          currency: detectedCurrency,
          formattedPrice: formattedTotal || `${symbol}${numericAmount.toFixed(2)}`,
        })
      }

      const result: LivePriceResult = {
        success: true,
        currency: detectedCurrency,
        items: resultMap,
        source: 'paddle_api',
      }

      pricingCache.set(cacheKey, { data: result, timestamp: Date.now() })
      console.log(`[PaddleServerApi] Successfully fetched ${resultMap.size} live prices for ${cacheKey}`)
      return result
    }

    console.warn(`[PaddleServerApi] pricing-preview returned HTTP ${previewRes.status}, falling back to GET /prices`)

    // 2. Fallback: Query /prices directly using proper repeated id parameters
    const queryParams = priceIds.map((id) => `id=${encodeURIComponent(id)}`).join('&')
    const pricesRes = await fetch(`${baseUrl}/prices?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (pricesRes.ok) {
      const json = await pricesRes.json()
      const pricesList = json.data || []
      const resultMap = new Map<string, LivePriceItem>()
      let primaryCurrency = 'USD'

      for (const p of pricesList) {
        const id = p.id
        const unitPrice = p.unit_price
        if (!id || !unitPrice) continue

        primaryCurrency = unitPrice.currency_code || 'USD'
        const numericAmount = parseFloat(unitPrice.amount) / 100

        // Check if there is a unit_price_override for this country
        let finalAmount = numericAmount
        let finalCurrency = primaryCurrency

        if (countryCode && p.unit_price_overrides) {
          const override = p.unit_price_overrides.find((o: any) =>
            o.country_codes?.includes(countryCode.toUpperCase())
          )
          if (override?.unit_price) {
            finalAmount = parseFloat(override.unit_price.amount) / 100
            finalCurrency = override.unit_price.currency_code || primaryCurrency
          }
        }

        const symbol = finalCurrency === 'INR' ? '₹' : finalCurrency === 'PKR' ? 'Rs.' : '$'
        const formatted = finalAmount.toLocaleString('en-US', {
          minimumFractionDigits: finalAmount % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        })

        resultMap.set(id, {
          priceId: id,
          amount: finalAmount,
          currency: finalCurrency,
          formattedPrice: `${symbol}${formatted}`,
        })
      }

      const result: LivePriceResult = {
        success: true,
        currency: primaryCurrency,
        items: resultMap,
        source: 'paddle_api',
      }

      pricingCache.set(cacheKey, { data: result, timestamp: Date.now() })
      return result
    }
  } catch (err) {
    console.error('[PaddleServerApi] Error communicating with Paddle API:', err)
  }

  return {
    success: false,
    currency: 'USD',
    items: new Map(),
    source: 'fallback',
  }
}
