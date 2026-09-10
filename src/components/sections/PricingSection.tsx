'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight, Zap, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { DESKSWEEP_PRICING, SKILLNAVO_PRICING, SKILLNAVO_FREE_PLAN, formatPrice } from '@/lib/currency';
import { usePaddlePrices, PADDLE_PRICE_IDS } from '@/hooks/usePaddlePrices';

export function PricingSection() {
  const [activeProduct, setActiveProduct] = useState<'skillnavo' | 'desksweep'>('skillnavo');
  const [skillnavoBilling, setSkillnavoBilling] = useState<'monthly' | 'annual'>('monthly');
  const { prices: paddlePrices, isLoading } = usePaddlePrices();

  // Filter Skillnavo plans based on active billing cycle (Free + Starter + Pro)
  const starterPlan = SKILLNAVO_PRICING.find((p) =>
    skillnavoBilling === 'monthly' ? p.id === 'starter_monthly' : p.id === 'starter_annual'
  );
  const proPlan = SKILLNAVO_PRICING.find((p) =>
    skillnavoBilling === 'monthly' ? p.id === 'pro_monthly' : p.id === 'pro_annual'
  );

  const displayedSkillnavoPlans = [
    SKILLNAVO_FREE_PLAN,
    starterPlan || SKILLNAVO_PRICING[1],
    proPlan || SKILLNAVO_PRICING[3],
  ];

  const handleOpenPaddleCheckout = (priceId: string | undefined, planSlug: string) => {
    if (!priceId) return;

    if (typeof window !== 'undefined' && window.Paddle && window.Paddle.Checkout) {
      try {
        window.Paddle.Checkout.open({
          settings: {
            displayMode: 'overlay',
            variant: 'one-page',
            theme: 'light',
            locale: 'en',
            allowLogout: false,
            showAddDiscounts: true,
            showAddTaxId: false,
            successUrl: `${window.location.origin}/purchase/success?product=skillnavo&plan=${planSlug}`,
          },
          items: [
            {
              priceId: priceId,
              quantity: 1,
            },
          ],
          customData: {
            product_slug: 'skillnavo',
            plan_slug: planSlug,
          },
        });
      } catch (err) {
        console.error('Paddle overlay checkout error:', err);
        window.location.href = `/skillnavo/checkout?plan=${planSlug}`;
      }
    } else {
      window.location.href = `/skillnavo/checkout?plan=${planSlug}`;
    }
  };

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-100/80 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Product Selector Toggle (Skillnavo Flagship Priority) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveProduct('skillnavo')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeProduct === 'skillnavo'
                  ? 'bg-[#723CFB] text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Skillnavo (Subscription)</span>
            </button>
            <button
              onClick={() => setActiveProduct('desksweep')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeProduct === 'desksweep'
                  ? 'bg-[#060C17] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>DeskSweep (Lifetime)</span>
            </button>
          </div>
        </div>

        {/* Header Content */}
        <div className="flex flex-col items-center mb-12 text-center">
          {activeProduct === 'skillnavo' ? (
            <>
              {/* Feature Pill matching screenshot */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs text-slate-700 font-medium mb-6 flex-wrap justify-center shadow-2xs"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#723CFB]" />
                  14-day Pro trial on signup — no card
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span>14-day money-back guarantee</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-800 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Secure checkout by Paddle
                </span>
              </motion.div>

              <motion.h2
                key="skillnavo-h2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-extrabold mb-3 text-[#060C17] tracking-tight"
              >
                Simple, transparent pricing
              </motion.h2>
              <motion.p
                key="skillnavo-p"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 max-w-2xl text-base sm:text-lg mb-8"
              >
                Start free. Upgrade as your ambitions grow. No hidden fees.
              </motion.p>

              {/* Monthly / Annual Billing Toggle with 16% off pill */}
              <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setSkillnavoBilling('monthly')}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    skillnavoBilling === 'monthly'
                      ? 'bg-white text-[#060C17] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSkillnavoBilling('annual')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    skillnavoBilling === 'annual'
                      ? 'bg-white text-[#723CFB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[11px] bg-purple-100 text-[#723CFB] px-2 py-0.5 rounded-full font-bold">
                    16% off
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <motion.h2
                key="desksweep-h2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-[#060C17]"
              >
                One-time payment.{' '}
                <span className="italic font-serif font-normal">Own it forever.</span>
              </motion.h2>
              <motion.p
                key="desksweep-p"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 max-w-2xl text-lg"
              >
                All plans include ALL features. Choose based on the number of devices you need.
                <br />
                <span className="text-[#060C17] font-semibold">Lifetime license • No recurring subscriptions</span>
              </motion.p>
            </>
          )}
        </div>

        {/* 3-Column Pricing Cards Grid */}
        <div className="grid gap-8 mx-auto items-stretch max-w-6xl md:grid-cols-3">
          {(activeProduct === 'skillnavo' ? displayedSkillnavoPlans : DESKSWEEP_PRICING).map((plan, index) => {
            const isPopular = plan.popular;
            
            // Get Paddle price for this plan
            let paddlePriceId: string | undefined = undefined;
            if (activeProduct === 'desksweep') {
              paddlePriceId = PADDLE_PRICE_IDS[plan.id as keyof typeof PADDLE_PRICE_IDS];
            } else if (plan.paddlePriceId) {
              paddlePriceId = plan.paddlePriceId;
            }

            const paddlePrice = paddlePriceId ? paddlePrices.get(paddlePriceId) : undefined;
            const isFree = plan.isFree;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -6,
                  boxShadow: isPopular
                    ? '0 25px 50px -12px rgba(114, 60, 251, 0.22)'
                    : '0 20px 40px -12px rgba(15, 23, 42, 0.08)',
                }}
                className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all duration-300 bg-white ${
                  isPopular
                    ? 'border-2 border-[#723CFB] shadow-xl shadow-purple-500/10'
                    : 'border border-slate-200 shadow-sm'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 right-6">
                    <span className="bg-[#723CFB] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                      <Zap className="w-3 h-3 fill-white text-white" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Subtitle */}
                  <h3 className="text-2xl font-bold mb-1 text-[#060C17]">
                    {plan.name}
                  </h3>
                  <p className="mb-6 text-sm text-slate-500 min-h-[40px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Pricing Box */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      {isFree ? (
                        <span className="text-5xl font-extrabold text-[#060C17] tracking-tight">
                          Free
                        </span>
                      ) : !isLoading && paddlePrice ? (
                        <span className="text-4xl sm:text-5xl font-extrabold text-[#060C17] tracking-tight">
                          {paddlePrice.formattedPrice}
                        </span>
                      ) : (
                        <span className="text-4xl sm:text-5xl font-extrabold text-[#060C17] tracking-tight">
                          {formatPrice(plan.prices.INR || plan.prices.USD, 'INR')}
                        </span>
                      )}

                      {activeProduct === 'skillnavo' && !isFree && (
                        <span className="text-slate-500 font-medium text-sm">
                          {skillnavoBilling === 'monthly' ? '/ mo' : '/ yr'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {activeProduct === 'skillnavo'
                          ? isFree
                            ? 'Free forever'
                            : plan.description
                          : 'One-time payment • Lifetime'}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-8">
                    {isFree ? (
                      <a
                        href="https://skillnavo.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-xl transition-all border border-slate-200 bg-white text-[#060C17] hover:bg-slate-50 hover:border-slate-300 shadow-xs"
                      >
                        {plan.cta}
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </a>
                    ) : activeProduct === 'skillnavo' ? (
                      <motion.button
                        onClick={() => handleOpenPaddleCheckout(plan.paddlePriceId, plan.id)}
                        className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-xl transition-all ${
                          isPopular
                            ? 'bg-[#723CFB] text-white hover:bg-[#5F27E5] shadow-lg shadow-purple-500/25'
                            : 'bg-[#060C17] text-white hover:bg-slate-800 shadow-sm'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {plan.cta}
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <Link href="/products/desksweep" className="block">
                        <motion.button
                          className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-xl transition-all ${
                            isPopular
                              ? 'bg-[#723CFB] text-white hover:bg-[#5F27E5] shadow-lg shadow-purple-500/25'
                              : 'bg-[#060C17] text-white hover:bg-slate-800 shadow-sm'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {plan.cta}
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.button>
                      </Link>
                    )}
                  </div>

                  {/* Section Header */}
                  {plan.sectionHeader && (
                    <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-4">
                      {plan.sectionHeader}
                    </div>
                  )}

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.03 }}
                      >
                        <CheckCircle
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            isPopular ? 'text-[#723CFB]' : 'text-emerald-600'
                          }`}
                        />
                        <span className="leading-tight text-xs sm:text-sm text-slate-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise / Footer Inquiries Note matching screenshot */}
        {activeProduct === 'skillnavo' ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            All paid plans include access to community discussions, regular content updates, and multi-device sync.{' '}
            <span>Need an enterprise plan with team analytics? </span>
            <a
              href="mailto:helpappsto@gmail.com?subject=Skillnavo%20Enterprise%20Inquiry"
              className="text-[#723CFB] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Contact us <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        ) : (
          /* Trust Indicators for DeskSweep */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>14-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Instant license delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Pay once, use forever</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
