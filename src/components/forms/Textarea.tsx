import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-md py-3 px-4 text-sm font-medium resize-none transition-all",
            error && "ring-2 ring-error/20",
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea'
