/**
 * Paddle API Client
 * 
 * Fetches pricing information directly from Paddle API.
 * This ensures prices shown on website always match Paddle's configuration,
 * including regional price overrides for Pakistan, India, etc.
 */

interface PaddlePriceData {
  priceId: string
  amount: string
  currency: string
  formattedPrice: string
}

interface PaddlePrice {
  id: string
  product_id: string
  description: string
  name: string | null
  unit_price: {
    amount: string
    currency_code: string
  }
  billing_cycle: {
    interval: string
    frequency: number
  } | null
}

interface PaddlePricesResponse {
  data: PaddlePrice[]
}

interface PaddlePricePreviewItem {
  price: {
    id: string
    unitPrice: {
      amount: string
      currencyCode: string
    }
  }
  formattedUnitTotals: {
    subtotal: string
    discount: string
    tax: string
    total: string
  }
  unitTotals: {
    subtotal: string
    total: string
  }
}

interface PaddlePricePreviewResponse {
  data: {
    details: {
      lineItems: PaddlePricePreviewItem[]
    }
    currencyCode: string
    customerIpAddress?: string
  }
}

/**
 * Fetch price preview from Paddle (includes regional pricing)
 * This is the CLIENT-SIDE method using Paddle.js
 * Paddle automatically detects customer location and applies regional overrides
 * 
 * @param priceIds - Array of Paddle price IDs
 * @param currencyCode - Optional currency code (only Paddle-supported currencies)
 * @param countryCode - Optional 2-letter country code for testing (PK, IN, US, etc.)
 * @returns Promise with localized price data
 */
export async function fetchPaddlePrices(priceIds: string[], currencyCode?: string, countryCode?: string): Promise<Map<string, PaddlePriceData>> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.Paddle) {
      console.warn('⚠️ Paddle.js not loaded, cannot fetch prices')
      resolve(new Map())
      return
    }

    try {
      console.log('🔍 Checking Paddle initialization status...');
      
      // Paddle should already be initialized by usePaddlePrices hook
      // Just verify it's ready
      if (!window.Paddle.Environment) {
        console.error('❌ Paddle not properly initialized');
        resolve(new Map());
        return;
      }
      
      console.log('✅ Paddle is ready, fetching prices...');
      // Paddle supported currencies (PKR is NOT supported)
      const PADDLE_SUPPORTED_CURRENCIES = [
        'USD', 'EUR', 'GBP', 'INR', 'AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'COP',
        'CZK', 'DKK', 'HKD', 'HUF', 'ILS', 'JPY', 'KRW', 'MXN', 'NOK', 'NZD',
        'PLN', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'VND', 'ZAR', 'ARS'
      ]
      
      // Map countries to their local currencies
      const COUNTRY_CURRENCY_MAP: { [key: string]: string } = {
        'GB': 'GBP', 'UK': 'GBP', // United Kingdom
        'EU': 'EUR', 'DE': 'EUR', 'FR': 'EUR', 'ES': 'EUR', 'IT': 'EUR', 'NL': 'EUR', // Europe
        'AU': 'AUD', // Australia
        'CA': 'CAD', // Canada
        'JP': 'JPY', // Japan
        'IN': 'INR', // India
        'BR': 'BRL', // Brazil
        'MX': 'MXN', // Mexico
        'ZA': 'ZAR', // South Africa
        'SG': 'SGD', // Singapore
        'HK': 'HKD', // Hong Kong
        'SE': 'SEK', // Sweden
        'NO': 'NOK', // Norway
        'DK': 'DKK', // Denmark
        'PL': 'PLN', // Poland
        'CH': 'CHF', // Switzerland
        'KR': 'KRW', // South Korea
        'TW': 'TWD', // Taiwan
        'TH': 'THB', // Thailand
        'TR': 'TRY', // Turkey
        'US': 'USD', // United States
      }
      
      // Use Paddle.js PricePreview to get localized prices
      // Paddle detects location via IP and applies regional price overrides
      const request: any = {
        items: priceIds.map(id => ({ priceId: id, quantity: 1 }))
      }
      
      console.log('📋 PricePreview request:', JSON.stringify(request, null, 2));
      console.log('📋 Price IDs being requested:', priceIds);
      
      // DON'T pass currencyCode - let Paddle auto-detect based on IP location
      // Paddle will return prices in customer's local currency automatically
      // if multi-currency pricing is enabled in Paddle Dashboard
      
      console.log('🌍 Requesting prices (Paddle will auto-detect location and currency)')
      
      window.Paddle.PricePreview(request).then((result: PaddlePricePreviewResponse) => {
        console.log('✅ Paddle price preview result:', result)
        console.log('🌍 Currency detected:', result.data.currencyCode)
        console.log('📍 IP address:', result.data.customerIpAddress)
        
        const priceMap = new Map<string, PaddlePriceData>()
        
        // Extract line items with localized prices
        if (result.data.details && result.data.details.lineItems) {
          result.data.details.lineItems.forEach((item) => {
            const priceId = item.price.id
            const unitTotals = item.unitTotals
            const formattedUnitTotals = item.formattedUnitTotals
            
            console.log(`💰 Price for ${priceId}:`, {
              amount: unitTotals.total,
              currency: result.data.currencyCode,
              formatted: formattedUnitTotals.total
            })
            
            priceMap.set(priceId, {
              priceId: priceId,
              amount: unitTotals.total,
              currency: result.data.currencyCode,
              formattedPrice: formattedUnitTotals.total
            })
          })
        }
        
        console.log('✅ Price map created:', priceMap)
        resolve(priceMap)
      }).catch((error: any) => {
        console.error('❌ Paddle price preview error:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        if (error.error) {
          console.error('❌ Error object:', error.error)
          console.error('❌ Error code:', error.error.code)
          console.error('❌ Error message:', error.error.detail)
        }
        resolve(new Map())
      })
      
    } catch (error) {
      console.error('❌ Error fetching prices from Paddle.js:', error)
      resolve(new Map())
    }
  })
}
