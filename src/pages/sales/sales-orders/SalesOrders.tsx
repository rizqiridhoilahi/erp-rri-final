import { DataPulse } from '@/components/shared'
import { Button } from '@/components/forms'
import { DataTable, SearchInput, StatusBadge } from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState } from 'react'

interface SalesOrder {
  id: string
  number: string
  date: string
  customer: string
  sphNumber: string
  grandTotal: number
  status: 'draft' | 'pending_approval' | 'approved' | 'completed' | 'cancelled'
}

const mockOrders: SalesOrder[] = [
  {
    id: '1',
    number: 'RRI-SO-26-03-001',
    date: '2026-03-16',
    customer: 'PT. Media Citra Nusantara Raya',
    sphNumber: 'RRI-SPH-26-03-001',
    grandTotal: 125000000,
    status: 'approved',
  },
  {
    id: '2',
    number: 'RRI-SO-26-03-002',
    date: '2026-03-19',
    customer: 'CV. Makmur Sejahtera',
    sphNumber: 'RRI-SPH-26-03-002',
    grandTotal: 45000000,
    status: 'pending_approval',
  },
]

export default function SalesOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredOrders = mockOrders.filter((o) =>
    o.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      key: 'number',
      header: 'Nomor SO',
      render: (row: SalesOrder) => (
        <span className="font-bold text-primary">{row.number}</span>
      ),
    },
    {
      key: 'sphNumber',
      header: 'Ref. SPH',
      render: (row: SalesOrder) => (
        <span className="text-sm text-on-surface-variant">{row.sphNumber}</span>
      ),
    },
    {
      key: 'date',
      header: 'Tanggal',
      render: (row: SalesOrder) => formatDate(row.date),
    },
    {
      key: 'customer',
      header: 'Pelanggan',
      render: (row: SalesOrder) => (
        <span className="font-semibold text-on-surface">{row.customer}</span>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Total',
      className: 'text-right',
      render: (row: SalesOrder) => (
        <span className="font-bold text-on-surface">{formatCurrency(row.grandTotal)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: SalesOrder) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: () => (
        <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all">
          <span className="material-symbols-outlined text-lg">visibility</span>
        </button>
      ),
    },
  ]

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DataPulse label="Live Data" />
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Sales Order
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola pesanan penjualan dan konversi dari SPH.
          </p>
        </div>
        <Button>Buat Sales Order</Button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari nomor SO..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredOrders}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada sales order"
        />
      </div>
    </div>
  )
}
