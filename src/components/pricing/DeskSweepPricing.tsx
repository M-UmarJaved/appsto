'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Download, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { useCurrency } from '@/components/ui/CurrencySwitcher';
import { DESKSWEEP_PRICING, formatPrice } from '@/lib/currency';

interface DeskSweepPricingProps {
  onPurchase?: (planId: string) => void;
  purchasing?: boolean;
}

export function DeskSweepPricing({ onPurchase, purchasing }: DeskSweepPricingProps) {
  const { currency, isLoading } = useCurrency();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#0B1220] dark:text-[#E5E7EB]">
          Choose Your Plan
        </h2>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Prices automatically adjusted to your location
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-4">
        {DESKSWEEP_PRICING.map((plan) => {
          const price = plan.prices[currency];
          const originalPrice = plan.originalPrices?.[currency];
          const isPopular = plan.popular;

          return (
            <Card
              key={plan.id}
              className={`transition-all ${
                isPopular
                  ? 'border-2 border-[#3B82F6] bg-gradient-to-br from-white to-[#EFF6FF] dark:from-[#111827] dark:to-[#0F172A] shadow-lg'
                  : 'border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:border-[#3B82F6]'
              }`}
            >
              <CardContent className="p-5 relative">
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#3B82F6] text-white px-3 py-1 text-xs font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
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
                            ? 'bg-[#3B82F6] text-white'
                            : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                        }`}
                      >
                        {plan.name}
                      </Badge>
                      <h3 className="text-lg font-bold text-[#0B1220] dark:text-[#E5E7EB]">
                        {plan.tagline}
                      </h3>
                      <p className="text-sm text-[#9CA3AF] mt-1">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-1">
                    {!isLoading && (
                      <>
                        <span className="text-3xl font-bold text-[#3B82F6]">
                          {formatPrice(price, currency)}
                        </span>
                        {originalPrice && (
                          <span className="text-lg line-through text-[#9CA3AF]">
                            {formatPrice(originalPrice, currency)}
                          </span>
                        )}
                      </>
                    )}
                    {isLoading && <span className="text-3xl font-bold text-[#9CA3AF]">...</span>}
                  </div>
                  <p className="text-sm text-[#9CA3AF]">
                    One-time payment • {plan.devices} device{plan.devices > 1 ? 's' : ''}
                  </p>
                  {originalPrice && !isLoading && (
                    <p className="text-xs text-[#10B981] font-medium mt-1">
                      Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  size="sm"
                  className={`w-full mb-4 ${
                    isPopular
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8]'
                      : 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10'
                  }`}
                  variant={isPopular ? 'primary' : 'outline'}
                  onClick={() => onPurchase?.(plan.id)}
                  isLoading={purchasing}
                >
                  {purchasing ? 'Processing...' : plan.cta}
                </Button>

                {/* Features List */}
                <div className="space-y-2 text-sm">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="text-[#9CA3AF]">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trust Badges */}
      <Card className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937]">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 text-[#10B981] mb-1" />
              <p className="text-xs font-semibold text-[#0B1220] dark:text-[#E5E7EB]">
                Secure Payment
              </p>
              <p className="text-xs text-[#9CA3AF]">SSL Encrypted</p>
            </div>
            <div className="flex flex-col items-center">
              <Download className="w-6 h-6 text-[#3B82F6] mb-1" />
              <p className="text-xs font-semibold text-[#0B1220] dark:text-[#E5E7EB]">
                Instant Delivery
              </p>
              <p className="text-xs text-[#9CA3AF]">Via Email</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money-back Guarantee */}
      <div className="text-center">
        <p className="text-sm text-[#9CA3AF]">
          <CheckCircle className="w-4 h-4 inline text-[#10B981] mr-1" />
          14-day money-back guarantee • Lifetime updates included
        </p>
      </div>
    </div>
  );
}
