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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-semibold text-[#060C17]">
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
              className="absolute top-full mt-2 right-0 z-50 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden"
            >
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleSelect(currency.code)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currency.code === value ? 'bg-purple-50 font-semibold' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-[#060C17]">
                      {currency.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {currency.symbol} {currency.code}
                    </div>
                  </div>
                  {currency.code === value && (
                    <div className="w-2 h-2 rounded-full bg-[#723CFB]" />
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
