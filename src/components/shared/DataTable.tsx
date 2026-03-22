import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  isLoading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'Tidak ada data',
  isLoading,
  pagination,
  className,
}: DataTableProps<T>) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1

  if (isLoading) {
    return (
      <div className={cn("bg-surface-container-lowest rounded-xl overflow-hidden", className)}>
        <div className="p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-on-surface-variant">Memuat data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-on-surface-variant">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className={cn(
                    "hover:bg-surface-container-low transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-6 py-5 text-sm", col.className)}
                    >
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-8 py-4 bg-slate-50/50 flex justify-between items-center text-sm">
          <p className="text-slate-500 font-medium">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} entries
          </p>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-30"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.page <= 3) {
                pageNum = i + 1
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = pagination.page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-colors",
                    pagination.page === pageNum
                      ? "bg-primary text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-white"
                  )}
                  onClick={() => pagination.onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              className="w-8 h-8 rounded flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-30"
              disabled={pagination.page === totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
