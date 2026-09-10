import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'lifetime' | 'subscription' | 'neutral' | 'accent'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors',
        {
          'bg-slate-100 text-slate-800 border border-slate-200': variant === 'default',
          'bg-purple-100 text-[#723CFB] border border-purple-200': variant === 'accent',
          'bg-emerald-100 text-emerald-800 border border-emerald-200': variant === 'success',
          'bg-amber-100 text-amber-800 border border-amber-200': variant === 'warning',
          'bg-rose-100 text-rose-800 border border-rose-200': variant === 'error',
          'bg-amber-50 text-amber-800 border border-amber-200': variant === 'lifetime',
          'bg-purple-50 text-[#723CFB] border border-purple-200': variant === 'subscription',
          'bg-slate-100 text-slate-700 border border-slate-200': variant === 'neutral',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
