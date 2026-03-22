import { forwardRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string
  error?: string
  hint?: string
  value?: number | string
  onChange?: (value: number) => void
  currencySymbol?: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, hint, value, onChange, currencySymbol = 'Rp', className, id, ...props }, ref) => {
    const inputId = id || props.name
    const [displayValue, setDisplayValue] = useState('')

    useEffect(() => {
      if (value !== undefined && value !== '') {
        const num = typeof value === 'string' ? parseFloat(value) : value
        setDisplayValue(num.toLocaleString('id-ID'))
      } else {
        setDisplayValue('')
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '')
      const num = parseInt(rawValue) || 0
      setDisplayValue(num.toLocaleString('id-ID'))
      onChange?.(num)
    }

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-variant">
            {currencySymbol}
          </span>
          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            className={cn(
              "w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-md py-2.5 pl-10 pr-4 text-sm font-medium text-right transition-all",
              error && "ring-2 ring-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-on-surface-variant">{hint}</p>
        )}
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'
