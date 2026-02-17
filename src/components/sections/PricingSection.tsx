'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { DESKSWEEP_PRICING } from '@/lib/currency';
import { usePaddlePrices, PADDLE_PRICE_IDS } from '@/hooks/usePaddlePrices';

export function PricingSection() {
  const { prices: paddlePrices, isLoading } = usePaddlePrices();

  return (
    <section className="py-24 bg-[#F9FAFB] dark:bg-[#0B1220] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#22D3EE]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-center mb-4 text-[#0B1220] dark:text-[#E5E7EB]"
          >
            One-time payment.{' '}
            <span className="italic font-serif font-normal">Own it forever.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#9CA3AF] text-center max-w-2xl"
          >
            All plans include ALL features. Choose based on the number of devices you need.
            <br />
            <span className="text-[#3B82F6] font-medium">Lifetime license • No subscriptions</span>
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {DESKSWEEP_PRICING.map((plan, index) => {
            const isPopular = plan.popular;
            
            // Get Paddle price for this plan
            const paddlePriceId = PADDLE_PRICE_IDS[plan.id as keyof typeof PADDLE_PRICE_IDS];
            const paddlePrice = paddlePrices.get(paddlePriceId);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow: isPopular
                    ? '0 25px 50px -12px rgba(59, 130, 246, 0.5)'
                    : '0 25px 50px -12px rgba(59, 130, 246, 0.3)',
                }}
                className={`rounded-3xl p-8 shadow-lg relative overflow-hidden ${
                  isPopular
                    ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] border-2 border-[#22D3EE]'
                    : 'bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937]'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-4 right-4">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="bg-[#22D3EE] text-[#0B1220] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      BEST VALUE
                    </motion.span>
                  </div>
                )}

                {/* Plan Badge */}
                <motion.span
                  className={`inline-block px-4 py-2 text-sm font-medium rounded-full mb-4 ${
                    isPopular
                      ? 'bg-white/20 backdrop-blur-sm text-white'
                      : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {plan.name}
                </motion.span>

                {/* Plan Info */}
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isPopular ? 'text-white' : 'text-[#0B1220] dark:text-[#E5E7EB]'
                  }`}
                >
                  {plan.tagline}
                </h3>
                <p
                  className={`mb-6 text-sm ${
                    isPopular ? 'text-white/80' : 'text-[#9CA3AF]'
                  }`}
                >
                  {plan.description}
                </p>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {!isLoading && paddlePrice ? (
                      <span
                        className={`text-5xl font-bold ${
                          isPopular ? 'text-white' : 'text-[#0B1220] dark:text-[#E5E7EB]'
                        }`}
                      >
                        {paddlePrice.formattedPrice}
                      </span>
                    ) : (
                      <span className="text-5xl font-bold text-[#9CA3AF]">
                        {isLoading ? 'Loading...' : 'N/A'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-sm ${
                        isPopular ? 'text-white/70' : 'text-[#9CA3AF]'
                      }`}
                    >
                      one-time payment
                    </span>
                  </div>
                  {plan.badge && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className={`text-xs font-medium mt-2 ${
                        isPopular ? 'text-[#22D3EE]' : 'text-[#3B82F6]'
                      }`}
                    >
                      {plan.badge}
                    </motion.p>
                  )}
                </div>

                {/* CTA Button */}
                <Link href="/products/desksweep">
                  <motion.button
                    className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-xl mb-8 ${
                      isPopular
                        ? 'bg-white text-[#3B82F6] hover:shadow-lg'
                        : 'bg-[#3B82F6] text-white hover:shadow-lg'
                    }`}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: isPopular
                        ? '0 0 20px rgba(255, 255, 255, 0.3)'
                        : '0 0 20px rgba(59, 130, 246, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className={`flex items-start gap-3 text-sm ${
                        isPopular ? 'text-white/90' : 'text-[#9CA3AF]'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <CheckCircle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isPopular ? 'text-[#22D3EE]' : 'text-[#10B981]'
                        }`}
                      />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span>Instant license delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span>Lifetime updates included</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
