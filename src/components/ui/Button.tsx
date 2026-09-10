import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'marketplace' | 'skillnavo' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'relative overflow-hidden group',
          {
            // Primary, Accent, and Skillnavo variants (#723CFB)
            'bg-[#723CFB] text-white hover:bg-[#5F27E5] focus:ring-[#723CFB] shadow-sm shadow-purple-500/20':
              variant === 'primary' || variant === 'accent' || variant === 'skillnavo',
            // Marketplace variant (Crisp Dark Slate)
            'bg-[#060C17] text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm':
              variant === 'marketplace',
            // Secondary variant
            'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300':
              variant === 'secondary',
            // Outline variant
            'border border-slate-300 text-slate-800 hover:bg-slate-50 focus:ring-slate-300':
              variant === 'outline',
            // Ghost variant
            'text-slate-700 hover:bg-slate-100 focus:ring-slate-300':
              variant === 'ghost',
            // Sizes
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Ripple effect */}
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
