import { useState } from 'react'
import { Plus, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, StatusBadge, SearchInput, DataPulse } from '@/components/shared'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Quotation {
  id: string
  number: string
  date: string
  customer: string
  items: number
  grandTotal: number
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed'
  hasRfq: boolean
  validUntil: string
}

const mockQuotations: Quotation[] = [
  {
    id: '1',
    number: 'RRI-SPH-26-03-001',
    date: '2026-03-15',
    customer: 'PT. Media Citra Nusantara Raya',
    items: 8,
    grandTotal: 125000000,
    status: 'pending_approval',
    hasRfq: true,
    validUntil: '2026-04-15',
  },
  {
    id: '2',
    number: 'RRI-SPH-26-03-002',
    date: '2026-03-18',
    customer: 'CV. Makmur Sejahtera',
    items: 3,
    grandTotal: 45000000,
    status: 'approved',
    hasRfq: false,
    validUntil: '2026-04-18',
  },
  {
    id: '3',
    number: 'RRI-SPH-26-02-001',
    date: '2026-02-10',
    customer: 'PT. Digital Global',
    items: 12,
    grandTotal: 280000000,
    status: 'completed',
    hasRfq: true,
    validUntil: '2026-03-10',
  },
]

export default function Quotations() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredQuotations = mockQuotations.filter((q) =>
    q.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      key: 'number',
      header: 'Nomor SPH',
      render: (row: Quotation) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-bold text-primary">{row.number}</span>
          {row.hasRfq && (
            <span className="text-[10px] bg-tertiary-fixed text-tertiary px-1.5 py-0.5 rounded font-bold">RFQ</span>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Tanggal',
      render: (row: Quotation) => (
        <span className="text-sm text-on-surface-variant">{formatDate(row.date)}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Pelanggan',
      render: (row: Quotation) => (
        <span className="text-sm font-semibold text-on-surface">{row.customer}</span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      className: 'text-center',
      render: (row: Quotation) => (
        <span className="text-sm text-on-surface-variant">{row.items}</span>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Total',
      className: 'text-right',
      render: (row: Quotation) => (
        <span className="font-bold text-on-surface">{formatCurrency(row.grandTotal)}</span>
      ),
    },
    {
      key: 'validUntil',
      header: 'Berlaku Sampai',
      render: (row: Quotation) => (
        <span className="text-sm text-on-surface-variant">{formatDate(row.validUntil)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Quotation) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (row: Quotation) => (
        <div className="flex justify-end gap-1">
          {row.status === 'pending_approval' && (
            <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all" title="Approve">
              <span className="material-symbols-outlined text-lg">check</span>
            </button>
          )}
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all" title="View">
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DataPulse label="Live Data" />
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Surat Penawaran Harga (SPH)
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola quotation dan penawaran harga kepada pelanggan.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
            Import
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Buat SPH Baru
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total SPH</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">156</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menunggu Approval</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600">12</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disetujui</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-green-600">89</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Nilai</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl font-black text-primary">Rp 4.2M</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari nomor SPH atau pelanggan..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-96"
          />
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-xs font-medium text-slate-600 border border-slate-100">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter: Status
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredQuotations}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada quotation yang ditemukan"
        />
      </div>
    </div>
  )
}
