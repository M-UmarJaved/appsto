'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Shield,
  Zap,
  Star,
  ExternalLink,
  Brain,
  Code2,
  TrendingUp,
  Award,
  Lock,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Clock,
  FolderSync,
  FileText,
} from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { SKILLNAVO_PRICING, SKILLNAVO_FREE_PLAN, formatPrice, detectUserCurrency, type Currency } from '@/lib/currency'
import { usePaddlePrices } from '@/hooks/usePaddlePrices'

export default function SkillnavoProductPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [currency, setCurrency] = useState<Currency>('USD')
  const { prices: paddlePrices, isLoading } = usePaddlePrices()

  // Detect currency on client
  useState(() => {
    if (typeof window !== 'undefined') {
      setCurrency(detectUserCurrency())
    }
  })

  const starterPlan = SKILLNAVO_PRICING.find((p) =>
    billingCycle === 'monthly' ? p.id === 'starter_monthly' : p.id === 'starter_annual'
  )
  const proPlan = SKILLNAVO_PRICING.find((p) =>
    billingCycle === 'monthly' ? p.id === 'pro_monthly' : p.id === 'pro_annual'
  )

  const displayedPlans = [
    SKILLNAVO_FREE_PLAN,
    starterPlan || SKILLNAVO_PRICING[1],
    proPlan || SKILLNAVO_PRICING[3],
  ]

  const handleOpenPaddleCheckout = (priceId: string | undefined, planSlug: string) => {
    // Navigate directly to Appsto's integrated, authentic inline checkout page
    window.location.href = `/skillnavo/checkout?plan=${planSlug}`
  }

  const skillnavoReviews = [
    {
      name: 'Aryan Sharma',
      title: 'Fullstack Engineer @ Fintech',
      rating: 5,
      text: 'Skillnavo completely changed how I prepare for system design and advanced fullstack technical interviews. The AI roadmap pinpointed my knowledge gaps immediately.',
    },
    {
      name: 'Priya Patel',
      title: 'CS Student & Aspiring SDE',
      rating: 5,
      text: 'The code diagnostics are remarkable. Instead of reading endless documentation, I got interactive challenges with step-by-step diagnostic feedback.',
    },
    {
      name: 'David Chen',
      title: 'Principal Software Architect',
      rating: 5,
      text: 'Our engineering team onboarded onto event-driven architecture and cloud native stacks in half the time thanks to Skillnavo’s structured pathways.',
    },
    {
      name: 'Hamza Khan',
      title: 'Backend Systems Developer',
      rating: 5,
      text: 'I earned my verified backend roadmap credential and added the shareable link to my resume. It helped me land interviews with top global software companies.',
    },
    {
      name: 'Sarah Jenkins',
      title: 'Senior Frontend Engineer',
      rating: 5,
      text: 'The streak multipliers and bite-sized daily assessments keep me disciplined every single morning. 75-day learning streak and counting!',
    },
    {
      name: 'Rahul Verma',
      title: 'Software Engineer',
      rating: 5,
      text: 'Best technical career investment I have made. Having AI diagnostics evaluate my reasoning feels like having a senior staff mentor on call 24/7.',
    },
  ]

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <Link
            href="/products"
            className="inline-flex items-center text-slate-700 hover:text-[#723CFB] mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>

          {/* Hero Section - Image and Description (Identical to DeskSweep) */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-lg min-h-[500px] relative">
                <Image
                  src="/Skillnavo/Skillnavo.png"
                  alt="Skillnavo AI Platform"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Right Column - Description Aligned with Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center space-y-6"
            >
              {/* Badges */}
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="text-base font-semibold">
                  💎 SaaS Subscription
                </Badge>
                <div className="bg-[#723CFB] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  FLAGSHIP AI PLATFORM
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#060C17]">
                Skillnavo
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-600 leading-relaxed">
                Personalized AI-powered technical skill roadmaps, interactive code diagnostics, and adaptive practice engineering. Master modern software engineering with tailored curriculums and continuous feedback.
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <span className="text-slate-600 font-medium">4.9 (312 reviews)</span>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-slate-600">14-day guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#723CFB]" />
                  <span className="text-sm text-slate-600">Instant AI access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-sm text-slate-600">Continuous updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-slate-600">Personalized roadmaps</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#723CFB] hover:bg-[#5F27E5] text-white font-semibold rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg transition-all"
                >
                  Choose Your Plan
                </a>
                <a
                  href="https://skillnavo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#060C17] font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  Visit Skillnavo.com
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Pricing Section - Choose Your Plan (Identical structure to DeskSweep) */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
            id="pricing"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#060C17] mb-3">
                Choose Your Plan
              </h2>
              <p className="text-lg text-slate-600">
                Start free. Upgrade as your ambitions grow. No hidden fees.
              </p>
            </div>

            {/* Feature Trust Bar */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium flex-wrap justify-center shadow-2xs">
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
              </div>
            </div>

            {/* Conversion Optimization - Trust Signals */}
            <div className="max-w-4xl mx-auto mb-12 space-y-6">
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-lg font-semibold text-[#060C17]">
                  4.9/5 from 300+ ambitious developers & learners
                </p>
              </motion.div>

              {/* Money-Back Guarantee */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex justify-center"
              >
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md shadow-xs">
                  <Shield className="w-10 h-10 text-emerald-600 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-[#060C17]">14-Day Money-Back Guarantee</p>
                    <p className="text-sm text-slate-600">Try risk-free. Full refund if not satisfied.</p>
                  </div>
                </div>
              </motion.div>

              {/* What You Get Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-[#060C17] mb-3 text-center">
                  What Happens After You Subscribe?
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#060C17]">Instant Access</p>
                      <p className="text-slate-600">AI learning journey unlocked immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#060C17]">Cloud Synchronization</p>
                      <p className="text-slate-600">Progress synced across all devices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#060C17]">Continuous Inferences</p>
                      <p className="text-slate-600">Up to 1,200 AI credits & diagnostic runs</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Security Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>SSL Encrypted</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[#723CFB]" />
                    <span>Secure Payment via Paddle</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Instant Account Provisioning</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Payments processed by Paddle (Authorized Reseller) • Your card details never touch our servers
                </p>
              </motion.div>
            </div>

            {/* Billing Toggle with 16% off pill */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-[#060C17] shadow-xs'
                      : 'text-slate-600 hover:text-[#060C17]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    billingCycle === 'annual'
                      ? 'bg-white text-[#723CFB] shadow-xs'
                      : 'text-slate-600 hover:text-[#060C17]'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[11px] bg-purple-100 text-[#723CFB] px-2 py-0.5 rounded-full font-bold">
                    16% off
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Pricing Cards Grid (Exact DeskSweep card styling) */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {displayedPlans.map((plan, index) => {
                const isPopular = plan.popular
                const isFree = plan.isFree
                const paddlePrice = plan.paddlePriceId ? paddlePrices.get(plan.paddlePriceId) : undefined

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative ${
                      isPopular
                        ? 'bg-white text-[#060C17] border-2 border-[#723CFB] shadow-xl scale-105'
                        : 'bg-white border border-slate-200 text-[#060C17] shadow-sm hover:shadow-md'
                    } rounded-2xl p-8 transition-all flex flex-col justify-between`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#723CFB] text-white px-4 py-1 text-xs font-bold tracking-wider uppercase shadow-md rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Plan Name & Tagline */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2 text-[#060C17]">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-slate-500 min-h-[40px]">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Price Box */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center gap-1">
                          {isFree ? (
                            <span className="text-4xl font-extrabold text-[#060C17]">
                              Free
                            </span>
                          ) : !isLoading && paddlePrice ? (
                            <span className="text-4xl font-extrabold text-[#060C17]">
                              {paddlePrice.formattedPrice}
                            </span>
                          ) : (
                            <span className="text-4xl font-extrabold text-[#060C17]">
                              {formatPrice(plan.prices[currency] || plan.prices.USD, currency)}
                            </span>
                          )}

                          {!isFree && (
                            <span className="text-slate-500 font-medium text-sm">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-2 text-slate-500">
                          {isFree ? 'free forever' : plan.description}
                        </p>
                      </div>

                      {/* CTA Button */}
                      {isFree ? (
                        <a
                          href="https://skillnavo.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full mb-6"
                        >
                          <Button
                            className="w-full font-semibold bg-white text-[#060C17] border border-slate-200 hover:bg-slate-50 shadow-xs"
                          >
                            {plan.cta}
                          </Button>
                        </a>
                      ) : (
                        <Button
                          className={`w-full mb-6 font-semibold ${
                            isPopular
                              ? 'bg-[#723CFB] hover:bg-[#5F27E5] text-white shadow-md shadow-purple-500/20'
                              : 'bg-[#060C17] hover:bg-[#723CFB] text-white shadow-sm'
                          }`}
                          onClick={() => handleOpenPaddleCheckout(plan.paddlePriceId, plan.id)}
                        >
                          {plan.cta}
                        </Button>
                      )}

                      {/* Section Header */}
                      {plan.sectionHeader && (
                        <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-4 text-center">
                          {plan.sectionHeader}
                        </div>
                      )}

                      {/* Features List */}
                      <div className="space-y-3">
                        {plan.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle
                              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                isPopular ? 'text-[#723CFB]' : 'text-emerald-600'
                              }`}
                            />
                            <span className="text-sm text-slate-600">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Enterprise Inquiry note matching screenshot */}
            <div className="text-center text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed mt-12">
              All paid plans include access to community discussions, regular content updates, and multi-device sync.{' '}
              <span>Need an enterprise plan with team analytics? </span>
              <a
                href="mailto:helpappsto@gmail.com?subject=Skillnavo%20Enterprise%20Inquiry"
                className="text-[#723CFB] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Contact us <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.section>

          {/* Customer Reviews - Infinite Scroll (Exact DeskSweep structure) */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 overflow-hidden"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#060C17] mb-4">
                Loved by Thousands
              </h2>
              <p className="text-lg text-slate-600">
                See what our learners and engineers are saying about Skillnavo
              </p>
            </div>

            <div className="relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              {/* Scrolling Reviews Container */}
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -2400],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 40,
                    ease: 'linear',
                  },
                }}
                whileHover={{ animationPlayState: 'paused' }}
              >
                {[...Array(2)].map((_, setIndex: number) => (
                  <div key={setIndex} className="flex gap-6 flex-shrink-0">
                    {skillnavoReviews.map((review: any, idx: number) => (
                      <motion.div
                        key={`${setIndex}-${idx}`}
                        whileHover={{ scale: 1.02, animationPlayState: 'paused' }}
                        className="bg-white rounded-2xl p-6 border border-slate-200 w-[400px] flex-shrink-0 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-1 mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                          ))}
                        </div>
                        <p className="text-slate-700 mb-6 leading-relaxed">
                          &ldquo;{review.text}&rdquo;
                        </p>
                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-[#060C17] font-semibold">{review.name}</p>
                          <p className="text-slate-500 text-sm">{review.title}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Powerful Features Section (Exact DeskSweep 3x2 grid layout) */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#060C17] mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-slate-600">
                Everything you need to accelerate your technical growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Sparkles className="w-8 h-8 text-amber-500" />,
                  title: 'AI Diagnostic Engine',
                  description:
                    'Instantly assess your current skill level and uncover hidden technical gaps with personalized, adaptive evaluations.',
                },
                {
                  icon: <Zap className="w-8 h-8 text-[#723CFB]" />,
                  title: 'Personalized Roadmaps',
                  description:
                    'Dynamic curriculums that tailor next modules to your existing foundations, career ambitions, and daily pace.',
                },
                {
                  icon: <Clock className="w-8 h-8 text-[#10B981]" />,
                  title: 'Interactive Code Quizzes',
                  description:
                    'Practice real-world coding diagnostics right in your browser with immediate intelligent hints and explanations.',
                },
                {
                  icon: <FolderSync className="w-8 h-8 text-[#723CFB]" />,
                  title: 'Habit & Streak Engineering',
                  description:
                    'Stay disciplined with streak tracking, milestone multipliers, weekly progress reports, and daily habit reminders.',
                },
                {
                  icon: <Shield className="w-8 h-8 text-[#06B6D4]" />,
                  title: 'Verifiable Credentials',
                  description:
                    'Earn cryptographically validated certificates of completion with public verification links shareable on LinkedIn.',
                },
                {
                  icon: <FileText className="w-8 h-8 text-[#EF4444]" />,
                  title: 'Cloud Synchronization',
                  description:
                    'Seamless multi-device progress synchronization. Switch between desktop and mobile with instant state persistence.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#723CFB]/40 hover:shadow-md transition-all shadow-sm"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-[#060C17] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}
