/**
 * Currency detection and pricing utility for DeskSweep
 * Supports USD (Global), INR (India), PKR (Pakistan)
 */

export type Currency = 'USD' | 'INR' | 'PKR';

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  description: string;
  devices?: number;
  prices: {
    USD: number;
    INR: number;
    PKR: number;
  };
  originalPrices?: {
    USD?: number;
    INR?: number;
    PKR?: number;
  };
  cta: string;
  badge?: string;
  savings?: string;
  features: string[];
  popular?: boolean;
  sectionHeader?: string;
  billingPeriod?: string;
  paddlePriceId?: string;
  isFree?: boolean;
}

export const DESKSWEEP_PRICING: PricingPlan[] = [
  {
    id: 'solo',
    name: 'SOLO',
    tagline: 'Best for Individuals',
    description: 'Students, Freelancers',
    devices: 1,
    prices: {
      USD: 9,
      INR: 299,
      PKR: 2500,
    },
    cta: 'Buy Now',
    features: [
      'Automatic file organization',
      'Real-time file monitoring',
      'Custom organizing rules (unlimited)',
      'Multiple watched folders',
      'File preview before moving',
      'Scheduled daily cleanup',
      'Activity history & statistics',
      'Desktop & system tray operation',
      'Start with Windows option',
      'Offline operation (after activation)',
      'Automatic license backup & recovery',
      'Lifetime license (pay once, use forever)',
      '1 device activation',
    ],
  },
  {
    id: 'squad',
    name: 'SQUAD',
    tagline: 'Best Value - Save 33%',
    description: 'Small Groups, Friends',
    devices: 5,
    prices: {
      USD: 29,
      INR: 999,
      PKR: 8000,
    },
    originalPrices: {
      USD: 45,
      INR: 1500,
      PKR: 12500,
    },
    cta: 'Get Squad Pack',
    badge: 'Buy 3, Get 2 Free',
    popular: true,
    features: [
      'All SOLO features included',
      'Export/Import Rules (Share with team)',
      '5 Device Activations',
      'Team collaboration features',
      'Priority support',
      'Automatic file organization',
      'Real-time file monitoring',
      'Custom organizing rules (unlimited)',
      'Multiple watched folders',
      'File preview before moving',
      'Scheduled daily cleanup',
      'Activity history & statistics',
      'Lifetime license (pay once, use forever)',
    ],
  },
  {
    id: 'studio',
    name: 'STUDIO',
    tagline: 'For Agencies',
    description: 'Design Agencies, Computer Labs, Offices',
    devices: 20,
    prices: {
      USD: 79,
      INR: 2999,
      PKR: 22000,
    },
    cta: 'Get Studio License',
    badge: 'Equip your entire team',
    features: [
      'All SQUAD features included',
      'Bulk Folder Import (.txt file)',
      'Studio Premium Badge (Gold)',
      '20 Device Activations',
      'Priority VIP support',
      'Advanced team management',
      'Export/Import Rules',
      'Automatic file organization',
      'Real-time file monitoring',
      'Custom organizing rules (unlimited)',
      'Scheduled daily cleanup',
      'Offline operation (after activation)',
      'Lifetime license (pay once, use forever)',
    ],
  },
];

/**
 * Detect user's currency based on their location
 * Uses timezone and language detection (fast, reliable, privacy-friendly)
 */
export function detectUserCurrency(): Currency {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return 'USD'; // Default for SSR
  }

  // Try to get from localStorage (user preference)
  const savedCurrency = localStorage.getItem('preferred_currency');
  if (savedCurrency && ['USD', 'INR', 'PKR'].includes(savedCurrency)) {
    return savedCurrency as Currency;
  }

  // Try timezone detection
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes('Karachi') || timezone.includes('Pakistan')) {
    return 'PKR';
  }
  if (timezone.includes('Kolkata') || timezone.includes('Calcutta') || timezone.includes('India')) {
    return 'INR';
  }

  // Try language detection
  const language = navigator.language || navigator.languages?.[0] || '';
  if (language.toLowerCase().includes('ur') || language.toLowerCase().includes('pk')) {
    return 'PKR';
  }
  if (language.toLowerCase().includes('hi') || language.toLowerCase().includes('in')) {
    return 'INR';
  }

  // Default to USD
  return 'USD';
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: Currency): string {
  const symbols = {
    USD: '$',
    INR: '₹',
    PKR: 'Rs.',
  };

  const formatted = amount.toLocaleString('en-US');
  
  if (currency === 'PKR') {
    return `${symbols[currency]} ${formatted}`;
  }
  
  return `${symbols[currency]}${formatted}`;
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: Currency): string {
  const names = {
    USD: 'US Dollar',
    INR: 'Indian Rupee',
    PKR: 'Pakistani Rupee',
  };
  return names[currency];
}

/**
 * Save user's preferred currency
 */
export function savePreferredCurrency(currency: Currency): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred_currency', currency);
  }
}

/**
 * Get all available currencies
 */
export function getAvailableCurrencies(): { code: Currency; name: string; symbol: string }[] {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs.' },
  ];
}

export const SKILLNAVO_PADDLE_PRICE_IDS: Record<string, string> = {
  starter_monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_MONTHLY || 'pri_01m252y0prb2nrjmay8ecgc1q0',
  starter_annual: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_ANNUAL || 'pri_01m2531e1n85b5hx6zfmphp1rz',
  pro_monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || 'pri_01m2535m78g4tpvj5bwzvnbhhh',
  pro_annual: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL || 'pri_01m2538wa1msvncrk76528d433',
};

export const SKILLNAVO_FREE_PLAN: PricingPlan = {
  id: 'free',
  name: 'Free',
  tagline: 'Explore the platform and test core features.',
  description: 'Free forever',
  isFree: true,
  prices: {
    USD: 0,
    INR: 0,
    PKR: 0,
  },
  cta: 'Create free account',
  sectionHeader: 'INCLUDED IN FREE',
  features: [
    '1 active path',
    '25 AI credits / month',
    'Up to 2 AI roadmaps or 5 quizzes',
    '3 chat msgs / day',
    'Full curated library',
    'Streaks & checkpoints',
    'Certificate',
  ],
};

export const SKILLNAVO_PRICING: PricingPlan[] = [
  SKILLNAVO_FREE_PLAN,
  {
    id: 'starter_monthly',
    name: 'Starter',
    tagline: 'For consistent learners building new skills.',
    description: 'Billed monthly',
    badge: 'MOST POPULAR',
    popular: true,
    prices: {
      USD: 4.00,
      INR: 399,
      PKR: 1399,
    },
    paddlePriceId: SKILLNAVO_PADDLE_PRICE_IDS.starter_monthly,
    cta: 'Get Starter',
    sectionHeader: 'EVERYTHING IN FREE, PLUS',
    features: [
      '3 active paths',
      '300 AI credits / month',
      'Up to 30 roadmaps or 60 quizzes',
      '15 chat msgs / day',
      'Personalized roadmap engine',
      'Weekly reports',
      'Certificate',
      'Priority updates',
    ],
  },
  {
    id: 'starter_annual',
    name: 'Starter',
    tagline: 'For consistent learners building new skills.',
    description: 'Billed annually — ₹3,999 / yr • 16% less',
    badge: 'MOST POPULAR',
    popular: true,
    savings: '16% off',
    prices: {
      USD: 40.00,
      INR: 3999,
      PKR: 11199,
    },
    originalPrices: {
      USD: 48.00,
      INR: 4788,
      PKR: 16788,
    },
    paddlePriceId: SKILLNAVO_PADDLE_PRICE_IDS.starter_annual,
    cta: 'Get Starter',
    sectionHeader: 'EVERYTHING IN FREE, PLUS',
    features: [
      '3 active paths',
      '300 AI credits / month',
      'Up to 30 roadmaps or 60 quizzes',
      '15 chat msgs / day',
      'Personalized roadmap engine',
      'Weekly reports',
      'Certificate',
      'Priority updates',
    ],
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    tagline: 'For professionals seeking mastery and speed.',
    description: 'Billed monthly',
    prices: {
      USD: 8.00,
      INR: 699,
      PKR: 2799,
    },
    paddlePriceId: SKILLNAVO_PADDLE_PRICE_IDS.pro_monthly,
    cta: 'Get Pro',
    sectionHeader: 'EVERYTHING IN STARTER, PLUS',
    features: [
      'Unlimited paths',
      '1,200 credits / month',
      'Up to 120 roadmaps or 240 quizzes',
      'AI learning assistant (50 msgs / day)',
      'Advanced AI models',
      'Skill progress breakdown',
      'Verifiable certificates with share link',
      'Full analytics dashboard',
      'Priority support',
    ],
  },
  {
    id: 'pro_annual',
    name: 'Pro',
    tagline: 'For professionals seeking mastery and speed.',
    description: 'Billed annually — ₹6,999 / yr • 17% less',
    savings: '17% off',
    prices: {
      USD: 80.00,
      INR: 6999,
      PKR: 21999,
    },
    originalPrices: {
      USD: 96.00,
      INR: 8388,
      PKR: 33588,
    },
    paddlePriceId: SKILLNAVO_PADDLE_PRICE_IDS.pro_annual,
    cta: 'Get Pro',
    sectionHeader: 'EVERYTHING IN STARTER, PLUS',
    features: [
      'Unlimited paths',
      '1,200 credits / month',
      'Up to 120 roadmaps or 240 quizzes',
      'AI learning assistant (50 msgs / day)',
      'Advanced AI models',
      'Skill progress breakdown',
      'Verifiable certificates with share link',
      'Full analytics dashboard',
      'Priority support',
    ],
  },
];


