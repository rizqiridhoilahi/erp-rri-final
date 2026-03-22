import { cn } from '@/lib/utils'

type StatusType = 'active' | 'inactive' | 'archived' | 'draft' | 'pending' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'paid' | 'partial' | 'unpaid' | 'in_transit' | 'delivered' | 'issued' | 'printed'

interface StatusBadgeProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: 'Aktif',
    className: 'bg-green-100 text-green-700',
  },
  inactive: {
    label: 'Nonaktif',
    className: 'bg-slate-100 text-slate-500',
  },
  archived: {
    label: 'Arsip',
    className: 'bg-slate-100 text-slate-400',
  },
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-600',
  },
  pending: {
    label: 'Tertunda',
    className: 'bg-amber-100 text-amber-700',
  },
  pending_approval: {
    label: 'Menunggu Approval',
    className: 'bg-amber-100 text-amber-700',
  },
  approved: {
    label: 'Disetujui',
    className: 'bg-green-100 text-green-700',
  },
  rejected: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-700',
  },
  cancelled: {
    label: 'Dibatalkan',
    className: 'bg-red-100 text-red-600',
  },
  completed: {
    label: 'Selesai',
    className: 'bg-blue-100 text-blue-700',
  },
  paid: {
    label: 'Lunas',
    className: 'bg-green-100 text-green-700',
  },
  partial: {
    label: 'Sebagian',
    className: 'bg-amber-100 text-amber-700',
  },
  unpaid: {
    label: 'Belum Bayar',
    className: 'bg-red-100 text-red-700',
  },
  in_transit: {
    label: 'Dalam Perjalanan',
    className: 'bg-blue-100 text-blue-700',
  },
  delivered: {
    label: 'Terkirim',
    className: 'bg-green-100 text-green-700',
  },
  issued: {
    label: 'Diterbitkan',
    className: 'bg-blue-100 text-blue-700',
  },
  printed: {
    label: 'Dicetak',
    className: 'bg-slate-100 text-slate-600',
  },
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-600' }

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded uppercase tracking-wider",
        config.className,
        size === 'sm' && "px-2 py-0.5 text-[10px]",
        size === 'md' && "px-3 py-1 text-xs",
        size === 'lg' && "px-4 py-1.5 text-sm",
        className
      )}
    >
      {config.label}
    </span>
  )
}
