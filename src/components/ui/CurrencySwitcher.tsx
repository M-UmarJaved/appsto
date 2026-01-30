'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Currency, 
  detectUserCurrency, 
  savePreferredCurrency, 
  getAvailableCurrencies 
} from '@/lib/currency';

interface CurrencySwitcherProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySwitcher({ value, onChange }: CurrencySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currencies = getAvailableCurrencies();
  const currentCurrency = currencies.find(c => c.code === value);

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    savePreferredCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#3B82F6] transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-[#9CA3AF]" />
        <span className="text-sm font-medium text-[#0B1220] dark:text-[#E5E7EB]">
          {currentCurrency?.symbol} {currentCurrency?.code}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 z-50 w-48 rounded-lg bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl overflow-hidden"
            >
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency.code)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors ${
                    currency.code === value ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/20' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium text-[#0B1220] dark:text-[#E5E7EB]">
                      {currency.name}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {currency.symbol} {currency.code}
                    </div>
                  </div>
                  {currency.code === value && (
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook to manage currency state with auto-detection
 * Uses timezone detection (instant, reliable, privacy-friendly)
 */
export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detected = detectUserCurrency();
    setCurrency(detected);
    setIsLoading(false);
  }, []);

  return { currency, setCurrency, isLoading };
}
