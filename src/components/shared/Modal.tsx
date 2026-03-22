import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}: ModalProps) {
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-surface-container-lowest rounded-2xl shadow-elevated overflow-hidden",
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-8 py-6 border-b border-slate-100">
            <div className="flex items-start justify-between">
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
        )}

        {/* Content */}
        <div className="px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
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
