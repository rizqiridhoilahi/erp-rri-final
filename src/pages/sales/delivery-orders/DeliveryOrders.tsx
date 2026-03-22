import { DataPulse } from '@/components/shared'
import { Button } from '@/components/forms'
import { DataTable, SearchInput, StatusBadge } from '@/components/shared'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

interface DeliveryOrder {
  id: string
  number: string
  date: string
  soNumber: string
  customer: string
  driverName: string
  status: 'draft' | 'pending' | 'in_transit' | 'delivered'
}

const mockDOs: DeliveryOrder[] = [
  {
    id: '1',
    number: 'RRI-SJ-26-03-001',
    date: '2026-03-17',
    soNumber: 'RRI-SO-26-03-001',
    customer: 'PT. Media Citra Nusantara Raya',
    driverName: 'Bambang Setiawan',
    status: 'in_transit',
  },
]

export default function DeliveryOrders() {
  const [searchQuery, setSearchQuery] = useState('')

  const columns = [
    {
      key: 'number',
      header: 'Nomor SJ',
      render: (row: DeliveryOrder) => (
        <span className="font-bold text-primary">{row.number}</span>
      ),
    },
    {
      key: 'soNumber',
      header: 'Ref. SO',
      render: (row: DeliveryOrder) => (
        <span className="text-sm text-on-surface-variant">{row.soNumber}</span>
      ),
    },
    {
      key: 'date',
      header: 'Tanggal',
      render: (row: DeliveryOrder) => formatDate(row.date),
    },
    {
      key: 'customer',
      header: 'Pelanggan',
      render: (row: DeliveryOrder) => (
        <span className="font-semibold text-on-surface">{row.customer}</span>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver',
      render: (row: DeliveryOrder) => (
        <span className="text-sm text-on-surface-variant">{row.driverName}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: DeliveryOrder) => <StatusBadge status={row.status === 'in_transit' ? 'pending' : row.status} />,
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
            Surat Jalan
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola pengiriman barang dan tracking delivery.
          </p>
        </div>
        <Button>Buat Surat Jalan</Button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari nomor SJ..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
        </div>
        <DataTable
          columns={columns}
          data={mockDOs}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada surat jalan"
        />
      </div>
    </div>
  )
}
