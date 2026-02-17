/**
 * Region-based reviews utility
 * Shows localized reviews based on user's timezone/region
 */

import { Currency, formatPrice } from './currency';

export interface Review {
  id: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  text: string;
  region: 'India' | 'Global';
  price?: number; // If review mentions price
}

// Indian Reviews (INR) - Authentic Indian names
const indianReviews: Review[] = [
  {
    id: 'in-1',
    name: 'Rajesh Kumar',
    title: 'Software Engineer',
    company: 'Tech Solutions India',
    rating: 5,
    text: 'DeskSweep ने मेरे desktop को बिल्कुल साफ कर दिया! Worth every rupee. Best ₹299 investment for productivity.',
    region: 'India',
    price: 299
  },
  {
    id: 'in-2',
    name: 'Priya Sharma',
    title: 'Graphic Designer',
    company: 'Creative Studio Mumbai',
    rating: 5,
    text: 'Incredible tool! My desktop was a mess with hundreds of files. DeskSweep organized everything perfectly. Highly recommend! ₹299 is nothing for this.',
    region: 'India',
    price: 299
  },
  {
    id: 'in-3',
    name: 'Amit Patel',
    title: 'Freelancer',
    company: 'Self-employed',
    rating: 5,
    text: 'Best software for organizing files! As a freelancer, I handle hundreds of client files. DeskSweep saves me hours every week.',
    region: 'India',
    price: 299
  },
  {
    id: 'in-4',
    name: 'Sneha Reddy',
    title: 'Marketing Manager',
    company: 'Digital Marketing Pro',
    rating: 5,
    text: 'Game changer for my workflow! Desktop clutter was affecting my productivity. Now everything is organized automatically. Worth ₹299!',
    region: 'India',
    price: 299
  },
  {
    id: 'in-5',
    name: 'Vikram Singh',
    title: 'Student',
    company: 'IIT Delhi',
    rating: 5,
    text: 'Perfect for students! Keeps all my study materials organized. The duplicate file finder saved me so much storage space.',
    region: 'India',
    price: 299
  },
  {
    id: 'in-6',
    name: 'Kavita Desai',
    title: 'Architect',
    company: 'Design Studio',
    rating: 5,
    text: 'Handles large CAD files beautifully! My desktop is finally organized. DeskSweep is a must-have tool for professionals.',
    region: 'India',
    price: 299
  }
];

// Global Reviews (USD/PKR) - English names
// Used for both Global (USD) and Pakistan (PKR) with different prices
const globalReviews: Review[] = [
  {
    id: 'gl-1',
    name: 'Sarah Connor',
    title: 'Project Manager',
    company: 'Tech Innovations',
    rating: 5,
    text: 'DeskSweep transformed my workflow! My desktop went from chaos to organized in minutes. Best investment I\'ve ever made for productivity.',
    region: 'Global',
    price: 9
  },
  {
    id: 'gl-2',
    name: 'James Martinez',
    title: 'Software Developer',
    company: 'Silicon Valley Startup',
    rating: 5,
    text: 'This tool is a game-changer! Handles thousands of files effortlessly. The automation features are incredible. Worth every penny!',
    region: 'Global',
    price: 9
  },
  {
    id: 'gl-3',
    name: 'Emily Chen',
    title: 'Digital Artist',
    company: 'Creative Studio',
    rating: 5,
    text: 'Perfect for creative professionals! Keeps all my art files, references, and assets organized. My productivity has doubled!',
    region: 'Global',
    price: 9
  },
  {
    id: 'gl-4',
    name: 'Michael Johnson',
    title: 'Marketing Director',
    company: 'Global Marketing Inc',
    rating: 5,
    text: 'Best desktop organizer I\'ve used! Saves me hours every week. The smart sorting is incredibly accurate. Highly recommended!',
    region: 'Global',
    price: 9
  },
  {
    id: 'gl-5',
    name: 'Lisa Anderson',
    title: 'Photographer',
    company: 'Freelance',
    rating: 5,
    text: 'Amazing for managing photo shoots! Organizes thousands of images perfectly. The duplicate finder saved me tons of storage space.',
    region: 'Global',
    price: 9
  },
  {
    id: 'gl-6',
    name: 'David Kim',
    title: 'Data Scientist',
    company: 'AI Research Lab',
    rating: 5,
    text: 'Excellent tool for data professionals! Keeps my datasets, scripts, and notebooks organized. The automation is top-notch!',
    region: 'Global',
    price: 9
  }
];

/**
 * Get reviews based on user's currency/region
 * Pakistan gets English reviews with PKR pricing
 * India gets Indian reviews with INR pricing
 * Global gets English reviews with USD pricing
 */
export function getRegionalReviews(currency: Currency): Review[] {
  switch (currency) {
    case 'INR':
      return indianReviews;
    case 'PKR':
      // Return global reviews with Pakistani pricing
      return globalReviews.map(review => ({
        ...review,
        price: 2500 // PKR price
      }));
    case 'USD':
    default:
      return globalReviews;
  }
}

/**
 * Get a single featured review for homepage based on region
 */
export function getFeaturedReview(currency: Currency): Review {
  const reviews = getRegionalReviews(currency);
  return reviews[0]; // Return first review as featured
}

/**
 * Format review text with proper price display
 */
export function formatReviewText(review: Review, currency: Currency): string {
  if (!review.price) return review.text;
  
  const priceText = formatPrice(review.price, currency);
  
  // Replace price mentions in text with correct currency format
  return review.text
    .replace(/\$\d+/g, priceText)
    .replace(/₹\d+/g, priceText)
    .replace(/Rs\.\s*\d+/g, priceText);
}
