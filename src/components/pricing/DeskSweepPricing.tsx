'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Download, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { DESKSWEEP_PRICING, formatPrice } from '@/lib/currency';
import { usePaddlePrices, PADDLE_PRICE_IDS } from '@/hooks/usePaddlePrices';

interface DeskSweepPricingProps {
  onPurchase?: (planId: string) => void;
  purchasing?: boolean;
}

export function DeskSweepPricing({ onPurchase, purchasing }: DeskSweepPricingProps) {
  const { prices: paddlePrices, isLoading } = usePaddlePrices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#060C17]">
          Choose Your Plan
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Prices automatically adjusted to your location
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-4">
        {DESKSWEEP_PRICING.map((plan) => {
          const isPopular = plan.popular;
          
          // Get Paddle price for this plan
          const paddlePriceId = PADDLE_PRICE_IDS[plan.id as keyof typeof PADDLE_PRICE_IDS];
          const paddlePrice = paddlePrices.get(paddlePriceId);

          return (
            <Card
              key={plan.id}
              className={`transition-all bg-white ${
                isPopular
                  ? 'border-2 border-[#723CFB] shadow-lg shadow-purple-500/10'
                  : 'border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <CardContent className="p-5 relative">
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#723CFB] text-white px-3 py-1 text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3 fill-current" />
                      {plan.badge?.toUpperCase()}
                    </Badge>
                  </div>
                )}

                <div className="mb-4">
                  {/* Plan Name and Tagline */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge
                        className={`mb-2 ${
                          isPopular
                            ? 'bg-purple-100 text-[#723CFB] border border-purple-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {plan.name}
                      </Badge>
                      <h3 className="text-lg font-bold text-slate-900">
                        {plan.tagline}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-1">
                    {!isLoading && paddlePrice ? (
                      <>
                        <span className="text-3xl font-extrabold text-[#060C17]">
                          {paddlePrice.formattedPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-[#060C17]">
                        {formatPrice(plan.prices.USD, 'USD')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    One-time payment • {plan.devices || 1} device{(plan.devices || 1) > 1 ? 's' : ''}
                  </p>
                  {plan.badge && !isLoading && (
                    <p className="text-xs text-[#723CFB] font-semibold mt-1">
                      {plan.badge}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  size="sm"
                  className={`w-full mb-4 font-semibold ${
                    isPopular
                      ? 'bg-[#723CFB] hover:bg-[#5F27E5] text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                  onClick={() => onPurchase?.(plan.id)}
                  isLoading={purchasing}
                >
                  {purchasing ? 'Processing...' : plan.cta}
                </Button>

                {/* Features List */}
                <div className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${isPopular ? 'text-[#723CFB]' : 'text-emerald-600'}`} />
                      <span className="text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trust Badges */}
      <Card className="bg-white border border-slate-200 shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 text-emerald-600 mb-1" />
              <p className="text-xs font-semibold text-slate-900">
                Secure Payment
              </p>
              <p className="text-xs text-slate-500">SSL Encrypted</p>
            </div>
            <div className="flex flex-col items-center">
              <Download className="w-6 h-6 text-[#723CFB] mb-1" />
              <p className="text-xs font-semibold text-slate-900">
                Instant Delivery
              </p>
              <p className="text-xs text-slate-500">Via Email</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money-back Guarantee */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          <CheckCircle className="w-4 h-4 inline text-emerald-600 mr-1" />
          14-day money-back guarantee • Lifetime updates included
        </p>
      </div>
    </div>
  );
}
