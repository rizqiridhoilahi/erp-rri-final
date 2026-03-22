import { cn } from '@/lib/utils'

interface DataPulseProps {
  label?: string
  variant?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DataPulse({
  label,
  variant = 'primary',
  size = 'sm',
  className,
}: DataPulseProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn(sizeClasses[size], colorClasses[variant], "rounded-full")} />
        <div
          className={cn(
            sizeClasses[size],
            colorClasses[variant],
            "rounded-full absolute inset-0 animate-ping opacity-75"
          )}
        />
      </div>
      {label && (
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          {label}
        </span>
      )}
    </div>
  )
}
