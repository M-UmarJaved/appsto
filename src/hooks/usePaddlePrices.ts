/**
 * Custom hook to fetch and manage Paddle prices
 * Automatically fetches localized prices from Paddle API based on user's location
 */

import { useState, useEffect } from 'react';
import { fetchPaddlePrices } from '@/lib/paddle-api';

// Declare Paddle types
declare global {
  interface Window {
    Paddle?: any;
  }
}

interface PaddlePriceData {
  priceId: string;
  amount: string;
  currency: string;
  formattedPrice: string;
}

interface UsePaddlePricesResult {
  prices: Map<string, PaddlePriceData>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Global flag to track Paddle initialization
let globalPaddleInitialized = false;
let globalPaddleInitializing = false;

// Price IDs for DeskSweep plans - PRODUCTION
export const PADDLE_PRICE_IDS = {
  solo: 'pri_01khb858xxexa8chhc45gvdvwk',
  squad: 'pri_01khb8e6ez5hm3afq5y39ksx4c',
  studio: 'pri_01khb8rm4c5rs6vxw4byzyhhnw',
};

export function usePaddlePrices(priceIds?: string[]): UsePaddlePricesResult {
  const [prices, setPrices] = useState<Map<string, PaddlePriceData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paddleInitialized, setPaddleInitialized] = useState(globalPaddleInitialized);

  // Initialize Paddle once when component mounts
  useEffect(() => {
    const initPaddle = async () => {
      // If Paddle is already initialized globally, just mark as ready
      if (globalPaddleInitialized) {
        console.log('✅ Paddle already initialized globally');
        setPaddleInitialized(true);
        return;
      }

      // If another component is initializing, wait for it
      if (globalPaddleInitializing) {
        console.log('⏳ Waiting for global Paddle initialization...');
        // Wait for initialization to complete
        let attempts = 0;
        while (!globalPaddleInitialized && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        if (globalPaddleInitialized) {
          setPaddleInitialized(true);
        }
        return;
      }

      // Mark as initializing
      globalPaddleInitializing = true;
      // Wait for Paddle.js to load
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (attempts < maxAttempts) {
        if (typeof window !== 'undefined' && window.Paddle) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (typeof window === 'undefined' || !window.Paddle) {
        console.warn('⚠️ Paddle.js not loaded after waiting');
        setError('Paddle.js not loaded');
        setIsLoading(false);
        globalPaddleInitializing = false;
        return;
      }

      try {
        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (!token) {
          console.error('❌ NEXT_PUBLIC_PADDLE_CLIENT_TOKEN not set');
          setError('Paddle token not configured');
          setIsLoading(false);
          globalPaddleInitializing = false;
          return;
        }

        // Initialize Paddle with same config as product detail page
        console.log('🚀 Initializing Paddle with token:', token.substring(0, 10) + '...');
        window.Paddle.Initialize({
          token: token,
          
          // Basic checkout settings (required for proper initialization)
          checkout: {
            settings: {
              displayMode: 'overlay',
              variant: 'one-page',
              theme: 'light',
              locale: 'en',
              allowLogout: false,
              showAddDiscounts: true,
              showAddTaxId: false,
            }
          },
          
          eventCallback: function(event: any) {
            // Basic event logging
            if (event.name === 'checkout.error') {
              console.error('Paddle checkout error:', event);
            }
          }
        });

        // Set environment
        const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox';
        if (environment === 'sandbox') {
          window.Paddle.Environment.set('sandbox');
          console.log('✅ Paddle environment set to SANDBOX');
        } else {
          console.log('✅ Paddle environment set to PRODUCTION');
        }

        setPaddleInitialized(true);
        globalPaddleInitialized = true;
        globalPaddleInitializing = false;
        console.log('✅ Paddle initialized successfully');
      } catch (initError) {
        console.error('❌ Paddle initialization error:', initError);
        setError('Failed to initialize Paddle');
        setIsLoading(false);
        globalPaddleInitializing = false;
      }
    };

    initPaddle();
  }, []);

  const fetchPrices = async () => {
    if (!paddleInitialized) {
      console.log('⏳ Waiting for Paddle to initialize...');
      return;
    }

    // Use default price IDs if none provided
    const idsToFetch = priceIds || Object.values(PADDLE_PRICE_IDS);

    // Validate price IDs
    if (!idsToFetch || idsToFetch.length === 0) {
      console.error('❌ No price IDs to fetch');
      setIsLoading(false);
      return;
    }

    // Check if price IDs are valid strings
    const invalidIds = idsToFetch.filter(id => !id || typeof id !== 'string' || !id.startsWith('pri_'));
    if (invalidIds.length > 0) {
      console.error('❌ Invalid price IDs detected:', invalidIds);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('💰 Fetching prices for:', idsToFetch);
      const priceData = await fetchPaddlePrices(idsToFetch);
      setPrices(priceData);
      console.log('✅ Prices fetched successfully:', priceData);
    } catch (err) {
      console.error('❌ Error fetching Paddle prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paddleInitialized) {
      fetchPrices();
    }
  }, [paddleInitialized, priceIds?.join(',')]); // Fetch when Paddle is ready and price IDs change

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices,
  };
}
