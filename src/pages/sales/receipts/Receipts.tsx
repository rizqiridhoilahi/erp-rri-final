import { DataPulse } from '@/components/shared'
import { Button } from '@/components/forms'
import { DataTable, SearchInput, StatusBadge } from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState } from 'react'

interface Receipt {
  id: string
  number: string
  date: string
  invoiceNumber: string
  customer: string
  amount: number
  paymentMethod: string
  status: 'issued' | 'printed'
}

const mockReceipts: Receipt[] = [
  {
    id: '1',
    number: 'RRI-KWT-26-03-001',
    date: '2026-03-20',
    invoiceNumber: 'RRI-INV-26-02-001',
    customer: 'PT. Digital Global',
    amount: 310800000,
    paymentMethod: 'Transfer Bank',
    status: 'printed',
  },
]

export default function Receipts() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReceipts = mockReceipts.filter((r) =>
    r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      key: 'number',
      header: 'Nomor Kwitansi',
      render: (row: Receipt) => (
        <span className="font-bold text-primary">{row.number}</span>
      ),
    },
    {
      key: 'invoiceNumber',
      header: 'Ref. Invoice',
      render: (row: Receipt) => (
        <span className="text-sm text-on-surface-variant">{row.invoiceNumber}</span>
      ),
    },
    {
      key: 'date',
      header: 'Tanggal',
      render: (row: Receipt) => formatDate(row.date),
    },
    {
      key: 'customer',
      header: 'Pelanggan',
      render: (row: Receipt) => (
        <span className="font-semibold text-on-surface">{row.customer}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Jumlah',
      className: 'text-right',
      render: (row: Receipt) => (
        <span className="font-bold text-on-surface">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Metode',
      render: (row: Receipt) => (
        <span className="text-sm text-on-surface-variant">{row.paymentMethod}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Receipt) => <StatusBadge status={row.status === 'printed' ? 'completed' : 'draft'} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: () => (
        <div className="flex justify-end gap-1">
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all" title="Print">
            <span className="material-symbols-outlined text-lg">print</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all" title="View">
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
        </div>
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
            Kwitansi Pembayaran
          </h1>
          <p className="text-on-surface-variant mt-2">
            Bukti transaksi dan dokumen pembayaran.
          </p>
        </div>
        <Button variant="outline" leftIcon={<span className="material-symbols-outlined text-sm">print</span>}>
          Print Preview
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Kwitansi (Bulan Ini)</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-primary">Rp 1.8B</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jumlah Kwitansi</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">24</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari kwitansi..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredReceipts}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada kwitansi"
        />
      </div>
    </div>
  )
}
