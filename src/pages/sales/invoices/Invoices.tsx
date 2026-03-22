import { DataPulse } from '@/components/shared'
import { Button } from '@/components/forms'
import { DataTable, SearchInput, StatusBadge } from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState } from 'react'

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  soNumber: string
  customer: string
  grandTotal: number
  amountPaid: number
  status: 'unpaid' | 'partial' | 'paid'
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'RRI-INV-26-03-001',
    date: '2026-03-17',
    dueDate: '2026-03-31',
    soNumber: 'RRI-SO-26-03-001',
    customer: 'PT. Media Citra Nusantara Raya',
    grandTotal: 138750000,
    amountPaid: 50000000,
    status: 'partial',
  },
  {
    id: '2',
    number: 'RRI-INV-26-02-001',
    date: '2026-02-15',
    dueDate: '2026-03-01',
    soNumber: 'RRI-SO-26-02-001',
    customer: 'PT. Digital Global',
    grandTotal: 310800000,
    amountPaid: 310800000,
    status: 'paid',
  },
]

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredInvoices = mockInvoices.filter((inv) =>
    inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      key: 'number',
      header: 'Nomor Invoice',
      render: (row: Invoice) => (
        <span className="font-bold text-primary">{row.number}</span>
      ),
    },
    {
      key: 'soNumber',
      header: 'Ref. SO',
      render: (row: Invoice) => (
        <span className="text-sm text-on-surface-variant">{row.soNumber}</span>
      ),
    },
    {
      key: 'date',
      header: 'Tanggal',
      render: (row: Invoice) => formatDate(row.date),
    },
    {
      key: 'dueDate',
      header: 'Jatuh Tempo',
      render: (row: Invoice) => (
        <span className="text-sm text-on-surface-variant">{formatDate(row.dueDate)}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Pelanggan',
      render: (row: Invoice) => (
        <span className="font-semibold text-on-surface">{row.customer}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Jumlah',
      className: 'text-right',
      render: (row: Invoice) => (
        <div>
          <span className="font-bold text-on-surface">{formatCurrency(row.amountPaid)}</span>
          <span className="text-on-surface-variant text-xs"> / {formatCurrency(row.grandTotal)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Invoice) => <StatusBadge status={row.status} />,
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
            Invoice
          </h1>
          <p className="text-on-surface-variant mt-2">
            Pantau pelunasan dan tagihan pelanggan.
          </p>
        </div>
        <Button>Buat Invoice</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Piutang</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-error">Rp 2.4B</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menunggu Pembayaran</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600">18</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lunas (Bulan Ini)</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-green-600">Rp 1.8B</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari invoice..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredInvoices}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada invoice"
        />
      </div>
    </div>
  )
}
