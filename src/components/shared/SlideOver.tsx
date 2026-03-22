import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlideOverProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SlideOver({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}: SlideOverProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-xl',
    lg: 'w-full max-w-3xl',
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />
      
      {/* Panel */}
      <div
        className={cn(
          "relative h-full bg-surface-container-lowest shadow-elevated overflow-hidden flex flex-col animate-slideInRight",
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-headline)' }}>
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-on-surface-variant mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-surface-container-low border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-on-surface-variant font-bold text-sm rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}
