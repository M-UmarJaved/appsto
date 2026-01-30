import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate Limiting Configuration
 * 
 * For production, use a Redis-based solution like @upstash/ratelimit
 * This is a simple in-memory implementation for development
 */

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentication endpoints
  '/api/auth/login': { windowMs: 15 * 60 * 1000, maxRequests: 5 },  // 5 per 15 min
  '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 },  // 3 per hour
  
  // Payment endpoints
  '/api/test/purchase': { windowMs: 5 * 60 * 1000, maxRequests: 10 },  // 10 per 5 min
  '/api/webhooks/paddle': { windowMs: 60 * 1000, maxRequests: 100 },  // 100 per minute
  
  // License endpoints
  '/api/license/activate': { windowMs: 60 * 1000, maxRequests: 10 },  // 10 per minute
  
  // Contact form
  '/api/contact': { windowMs: 60 * 60 * 1000, maxRequests: 5 },  // 5 per hour
  
  // Download endpoint
  '/api/download': { windowMs: 60 * 1000, maxRequests: 20 },  // 20 per minute
  
  // Default for all other endpoints
  'default': { windowMs: 60 * 1000, maxRequests: 60 },  // 60 per minute
};

/**
 * Get client identifier (IP + User-Agent for fingerprinting)
 */
export function getClientId(req: NextRequest): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `${ip}:${userAgent}`;
}

/**
 * Check if request should be rate limited
 * 
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  clientId: string,
  endpoint: string
): { limited: boolean; remaining: number; resetAt: number; retryAfter?: number } {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
  const now = Date.now();
  const key = `${endpoint}:${clientId}`;
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  
  // Reset if window expired
  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) {  // 1% chance
    cleanupRateLimitStore();
  }
  
  // Check if limited
  const limited = entry.count > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const retryAfter = limited ? Math.ceil((entry.resetAt - now) / 1000) : undefined;
  
  return {
    limited,
    remaining,
    resetAt: entry.resetAt,
    retryAfter,
  };
}

/**
 * Clean up expired entries from rate limit store
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit middleware wrapper
 * 
 * @example
 * export const POST = withRateLimit(async (req: NextRequest) => {
 *   // Your handler code
 * }, '/api/test/purchase');
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  endpoint: string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const clientId = getClientId(req);
    const result = checkRateLimit(clientId, endpoint);
    
    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit': (RATE_LIMITS[endpoint] || RATE_LIMITS['default']).maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    };
    
    if (result.limited) {
      console.warn(`⚠️ Rate limit exceeded for ${endpoint} by ${clientId}`);
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': result.retryAfter!.toString(),
          },
        }
      );
    }
    
    // Call the actual handler
    const response = await handler(req);
    
    // Add rate limit headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

/**
 * PRODUCTION NOTE:
 * 
 * For production, replace this in-memory implementation with Redis:
 * 
 * npm install @upstash/ratelimit @upstash/redis
 * 
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 * 
 * const redis = Redis.fromEnv();
 * const ratelimit = new Ratelimit({
 *   redis: redis,
 *   limiter: Ratelimit.slidingWindow(10, "10 s"),
 * });
 * 
 * This provides:
 * - Distributed rate limiting across multiple servers
 * - Persistent rate limit data
 * - Better performance at scale
 */
