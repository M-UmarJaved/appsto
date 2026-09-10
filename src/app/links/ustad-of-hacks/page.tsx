'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Send, MessageCircle } from 'lucide-react';

const trackClick = (linkName: string) => {
  // Google Analytics event tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'click', {
      event_category: 'Links',
      event_label: linkName,
      value: 'ustad-of-hacks',
    });
  }
};

export default function UstadOfHacksLinks() {
  const links = [
    {
      title: '🚀 DeskSweep - Organize Your Desktop',
      url: 'https://appsto.software/products/desksweep',
      subtitle: 'Auto-organize files • Clean workspace • Boost productivity',
      featured: true,
      track: 'desksweep',
    },
    {
      title: 'Follow on Instagram',
      url: 'https://instagram.com/ustadofhacks',
      icon: <Instagram className="w-5 h-5" />,
      color: 'from-purple-600 to-pink-600',
      track: 'instagram',
    },
    {
      title: 'Follow on TikTok',
      url: 'https://tiktok.com/@ustadofhacks',
      icon: <Send className="w-5 h-5" />,
      color: 'from-black to-gray-800',
      track: 'tiktok',
    },
    {
      title: 'Subscribe on YouTube',
      url: 'https://youtube.com/@ustadofhacks',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: 'from-red-600 to-red-700',
      track: 'youtube',
    },
    {
      title: 'Follow on Facebook',
      url: 'https://facebook.com/ustadofhacks',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'from-blue-600 to-blue-700',
      track: 'facebook',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#0F172A] flex items-center justify-center p-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-slate-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Profile Section */}
        <div className="text-center mb-8 animate-fade-in-up mt-8">
          {/* Logo - Circular */}
          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
              <Image
                src="/UOH/logo.png"
                alt="Ustad of Hacks"
                width={128}
                height={128}
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Profile Info */}
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Ustad of Hacks
          </h1>
          <p className="text-lg text-white/90 mb-4 drop-shadow">
            Tech Hacks & Productivity Tools
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
              <p className="text-white font-semibold text-sm">
                ⭐ 4.8/5 Rating
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
              <p className="text-white font-semibold text-sm">
                👥 2,400+ Users
              </p>
            </div>
          </div>

          <p className="text-white/80 text-sm">
            Trusted by developers, creators, and tech enthusiasts
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.track)}
              className={`block group ${
                link.featured
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-2xl hover:scale-105'
                  : 'bg-white/95 backdrop-blur-md hover:bg-white'
              } rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/20`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                {link.icon && (
                  <div className={`${link.featured ? 'text-white' : 'text-purple-600'}`}>
                    {link.icon}
                  </div>
                )}
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      link.featured ? 'text-white text-lg' : 'text-gray-900 text-base'
                    } group-hover:translate-x-1 transition-transform duration-300`}
                  >
                    {link.title}
                  </h3>
                  {link.subtitle && (
                    <p
                      className={`text-sm mt-1 ${
                        link.featured ? 'text-white/90' : 'text-gray-600'
                      }`}
                    >
                      {link.subtitle}
                    </p>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 ${
                    link.featured ? 'text-white' : 'text-gray-400'
                  } group-hover:translate-x-1 transition-transform duration-300`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>Powered by <Link href="/" className="text-white hover:underline">Appsto</Link></p>
        </div>
      </div>
    </div>
  );
}
