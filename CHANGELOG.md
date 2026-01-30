# Changelog

All notable changes to appsto.software will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-XX

### 🎨 Added

#### New Pages (5)
- **Privacy Policy** (`/privacy`) - GDPR-compliant privacy policy with 13 comprehensive sections covering data collection, processing, storage, user rights, and international transfers
- **Terms of Service** (`/terms`) - Complete legal terms with 16 sections including detailed license type comparison (one-time vs subscription), prohibited uses, payment terms, and termination clauses
- **Refund Policy** (`/refund-policy`) - Professional refund policy with visual indicators, 14-day guarantee for one-time purchases, 7-day guarantee for new subscriptions, and clear eligibility criteria
- **About** (`/about`) - Brand storytelling page with mission statement, live stats, core values, technology stack showcase, and future roadmap
- **Contact** (`/contact`) - Interactive contact form with validation, 4 dedicated email addresses (hello, support, refunds, business), and response time estimates

#### Email System
- **Email Preview Page** (`/email-preview`) - Developer preview page for viewing the complete license delivery email template with technical implementation details
- **Email Component** (`src/components/email/LicenseEmailPreview.tsx`) - Complete HTML email template mockup with license token display, download buttons, 5-step activation instructions, security warnings, and support links

#### UI Components
- **Trust & Security Section** - Full-width home page section with 3 cards showcasing Paddle secure payments, encrypted license keys, and money-back guarantee
- **Payment Method Badges** - Visual display of supported payment methods (Visa, Mastercard, Amex, PayPal) with Paddle Secure badge
- **Product Type Badges** - Golden "LIFETIME ACCESS" badge for one-time purchase products with gradient background (from-yellow-400 to-orange-500)
- **Dynamic CTA Buttons** - Gradient "Buy Now" button for one-time products, outline "Free Download" button for subscription products
- **Trust Indicators** - Enhanced trust cards with backdrop blur, shadow effects, and hover animations on home page

### 🎨 Enhanced

#### Product Differentiation
- **Product Cards** - Added visual distinction between one-time (blue/green indicators, gradient button) and subscription (purple/orange indicators, outline button) products
- **Product Detail Pages** - Completely redesigned with separate layouts:
  - **One-Time**: Gradient border card (brand-500), "Save 40%" badge, "What You Get" section with 5 CheckCircle items, trust badges grid
  - **Subscription**: Purple border card, "FREE to download" display, blue notice box explaining "How It Works", footer notice about in-app billing
- **Pricing Display** - One-time shows price with strikethrough original price, subscription shows "FREE" with "from $X/mo" subtext
- **Type Indicators** - One-time shows "Instant License • Offline Usage" with green/blue dots, subscription shows "In-App Billing • Cancel Anytime" with purple/orange dots

#### Animations
- Added 9 new animations (total: 12):
  - `slide-left` - Horizontal slide from left
  - `slide-right` - Horizontal slide from right
  - `scale-up` - Scale from 1 to 1.05
  - `glow-pulse` - Pulsing multi-layer shadow effect
  - `bounce-slow` - Gentle vertical bounce
  - `shimmer` - Loading state shimmer effect
  - `gradient` - Animated gradient background
  - `wiggle` - Gentle rotation wiggle
  - `ping-slow` - Slow radar-style ping effect
- All animations optimized for performance with CSS-only implementation (no JavaScript)

#### Footer
- Expanded from 4 to 5 columns with new Legal section
- Added Privacy Policy, Terms of Service, Refund Policy links
- Enhanced brand column with trust badges (Secured by Paddle, Instant Digital Delivery)
- Improved bottom bar with technology credits (Paddle, Vercel, Supabase)
- Added compliance badges (GDPR Compliant, PCI-DSS Level 1, SSL Encrypted)

#### Home Page
- Upgraded trust indicator cards with backdrop blur, rounded corners, shadow effects, and hover scale animations
- Added subtexts to trust cards ("256-bit encryption", "Under 60 seconds", "Works anywhere", "Free forever")
- Added trust badges row (Shield, Lock, CheckCircle icons) with opacity styling
- Created comprehensive Trust & Security section with payment method badges

### 🔐 Database

#### Schema Enhancements
- Added `used_at` timestamp field to `licenses` table for tracking first activation time
- Added check constraint `check_used_consistency` ensuring data integrity:
  - If `is_used = false`, then `used_at` must be NULL
  - If `is_used = true`, then `used_at` must have a timestamp
- Improved lifecycle tracking for security auditing and compliance

### 📚 Documentation

#### New Files
- **ENHANCEMENT_SUMMARY.md** - Comprehensive 600+ line technical documentation covering all v2.0 updates, code examples, visual design improvements, security features, business logic, file structure, production readiness checklist, and design philosophy
- **QUICK_START.md** - User-friendly 450+ line quick reference guide with page map, testing scenarios, animation showcase, color palette, performance targets, troubleshooting, mobile testing guide, and pre-launch checklist
- **CHANGELOG.md** - Version history and migration notes (this file)

#### Updated Files
- **README.md** - Complete rewrite with v2.0 features, enhanced sections for legal compliance, product differentiation, email system, animations, security checklist, troubleshooting guide, and next steps

### 🎨 Design System

#### Visual Improvements
- Enhanced color contrast for better accessibility (WCAG 2.1 AA compliant)
- Improved typography hierarchy with consistent font sizes and weights
- Better spacing and alignment throughout all pages
- Mobile-first responsive design with optimized breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px)
- Dark mode support on all pages with proper color scheme

#### Brand Elements
- Consistent gradient usage (brand-600 to brand-700, yellow-400 to orange-500)
- Standardized border styles (border-2 for emphasis, border for subtle)
- Icon consistency using Lucide React library
- Hover effects on interactive elements (scale-105, shadow-2xl)

### 🛡️ Security & Trust

#### Compliance Features
- GDPR-compliant Privacy Policy with user data rights section
- PCI-DSS Level 1 compliance through Paddle integration
- SSL encryption indicators throughout site
- Secure license token generation with 256-bit encryption
- Enhanced database constraints for data integrity

#### Trust Signals
- Paddle Secure Payment badges on home and product pages
- 14-Day Money Back Guarantee prominently displayed
- Payment method logos for credibility
- Security badges in footer (GDPR, PCI-DSS, SSL)
- Professional email template with security warnings

### 🚀 Performance

#### Optimizations
- CSS-only animations for better performance (no JavaScript overhead)
- Lazy loading of images with proper alt text
- Optimized Tailwind CSS bundle with purge configuration
- Server-side rendering for static pages (Privacy, Terms, Refund, About)
- Client-side rendering only where needed (Contact form, Product pages)

### 🔧 Developer Experience

#### Tooling
- Email preview page for visual development
- Comprehensive documentation with code examples
- Quick start guide with testing scenarios
- Troubleshooting section in README
- File structure comments in all major files

## [1.0.0] - 2024-XX-XX

### Added
- Initial release with core marketplace functionality
- Product listing and detail pages
- Paddle payment integration
- License generation system
- Email delivery with Nodemailer
- Supabase database integration
- Basic animations (fade-in, slide-up, slide-down, scale-in, glow, float)
- Navbar and footer components
- Support page
- Purchase success page

---

## Migration Guide

### From v1.0.0 to v2.0.0

#### Database Migration

Run the following SQL to add the enhanced license tracking:

```sql
-- Add used_at field to licenses table
ALTER TABLE licenses ADD COLUMN used_at TIMESTAMPTZ;

-- Add check constraint for data consistency
ALTER TABLE licenses ADD CONSTRAINT check_used_consistency
  CHECK (
    (is_used = false AND used_at IS NULL) OR
    (is_used = true AND used_at IS NOT NULL)
  );

-- Update existing used licenses with timestamp (optional, for historical data)
UPDATE licenses SET used_at = updated_at WHERE is_used = true AND used_at IS NULL;
```

#### Configuration Updates

1. **No breaking changes** to environment variables
2. **No breaking changes** to API endpoints
3. **New routes added** - All existing routes remain functional

#### Content Updates Required

1. **Legal Pages**: Review and customize with your company information
   - Update company name in Privacy Policy
   - Update jurisdiction in Terms of Service
   - Update contact information in all legal pages
   - **Important**: Have a lawyer review before production

2. **About Page**: Customize with your information
   - Update mission statement
   - Update live stats (users, products, uptime)
   - Update core values if needed
   - Update technology stack section

3. **Contact Page**: Update contact information
   - Update email addresses (hello@, support@, refunds@, business@)
   - Update response time estimates if needed
   - Configure form submission endpoint (currently simulated)

4. **Email Template**: Customize branding
   - Update logo URL in LicenseEmailPreview component
   - Update company name and contact info
   - Update demo video URL if available

#### Testing Required

- [ ] Test product card display for both one-time and subscription types
- [ ] Test product detail page flows for both types
- [ ] Test license generation and email delivery
- [ ] Test all legal pages on mobile and desktop
- [ ] Test contact form submission
- [ ] Verify email preview page displays correctly
- [ ] Test all 12 animations in different browsers
- [ ] Verify footer displays all 5 columns correctly
- [ ] Test dark mode on all pages

#### Performance Considerations

- Clear browser cache after deployment
- Verify Tailwind CSS purge is working (check production bundle size)
- Test page load times (aim for < 3s TTI)
- Monitor database performance with new constraints

---

**Need help?** See [QUICK_START.md](./QUICK_START.md) for troubleshooting or contact support@appsto.software
