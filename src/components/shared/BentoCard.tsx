import { cn } from '@/lib/utils'

interface BentoCardProps {
  title: string
  description?: string
  value: string | number
  suffix?: string
  trend?: {
    value: number
    label?: string
  }
  icon?: string
  progress?: number
  className?: string
  onClick?: () => void
}

export function BentoCard({
  title,
  description,
  value,
  suffix,
  trend,
  icon,
  progress,
  className,
  onClick,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer",
        onClick && "hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      {/* Decorative Icon */}
      {icon && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl">{icon}</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        
        <div className="flex items-end gap-2">
          <span className="text-3xl font-extrabold text-on-surface">{value}</span>
          {suffix && <span className="text-sm font-medium text-on-surface-variant mb-1">{suffix}</span>}
        </div>

        {description && (
          <p className="text-[10px] uppercase text-on-surface-variant tracking-wider mt-1">{description}</p>
        )}

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn(
              "text-xs font-bold flex items-center",
              trend.value >= 0 ? "text-green-600" : "text-red-600"
            )}>
              <span className="material-symbols-outlined text-sm">
                {trend.value >= 0 ? "arrow_upward" : "arrow_downward"}
              </span>
              {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="text-[10px] text-on-surface-variant">{trend.label}</span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
