'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { DESKSWEEP_PRICING, formatPrice } from '@/lib/currency';
import { usePaddlePrices, PADDLE_PRICE_IDS } from '@/hooks/usePaddlePrices';

export function PricingSection() {
  const { prices: paddlePrices, isLoading } = usePaddlePrices();

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-100/80 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Content */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs text-slate-700 font-medium mb-6 flex-wrap justify-center shadow-2xs"
          >
            <span>One-Time Payment</span>
            <span className="text-slate-300">•</span>
            <span>14-day money-back guarantee</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Secure checkout by Paddle
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-[#060C17]"
          >
            One-time payment.{' '}
            <span className="italic font-serif font-normal">Own it forever.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl text-lg"
          >
            All plans include ALL features. Choose based on the number of devices you need.
            <br />
            <span className="text-[#060C17] font-semibold">Lifetime license • No recurring subscriptions</span>
          </motion.p>
        </div>

        {/* 3-Column Pricing Cards Grid */}
        <div className="grid gap-8 mx-auto items-stretch max-w-6xl md:grid-cols-3">
          {DESKSWEEP_PRICING.map((plan, index) => {
            const isPopular = plan.popular;
            const paddlePriceId = PADDLE_PRICE_IDS[plan.id as keyof typeof PADDLE_PRICE_IDS];
            const paddlePrice = paddlePriceId ? paddlePrices.get(paddlePriceId) : undefined;

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
                  {/* Plan Name & Tagline */}
                  <h3 className="text-2xl font-bold mb-1 text-[#060C17]">
                    {plan.name}
                  </h3>
                  <p className="mb-6 text-sm text-slate-500 min-h-[40px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Pricing Box */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      {!isLoading && paddlePrice ? (
                        <span className="text-4xl sm:text-5xl font-extrabold text-[#060C17] tracking-tight">
                          {paddlePrice.formattedPrice}
                        </span>
                      ) : (
                        <span className="text-4xl sm:text-5xl font-extrabold text-[#060C17] tracking-tight">
                          {formatPrice(plan.prices.INR || plan.prices.USD, 'INR')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500 font-medium">
                        One-time payment • Lifetime access
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-8">
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
                  </div>

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

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
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
      </div>
    </section>
  );
}
