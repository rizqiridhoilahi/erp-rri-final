import { useState } from 'react'
import { Plus, Upload, Star } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, SearchInput } from '@/components/shared'
import { cn } from '@/lib/utils'

interface Supplier {
  id: string
  name: string
  category: string
  status: 'active' | 'inactive'
  picName: string
  picContact: string
  rating: number
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PT. Sinar Teknologi Utama',
    category: 'Perangkat IT',
    status: 'active',
    picName: 'Bambang Susanto',
    picContact: 'bambang@sinar-tek.id',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'CV. Makmur Sejahtera',
    category: 'Alat Kantor',
    status: 'inactive',
    picName: 'Siti Aminah',
    picContact: 'siti.a@makmur.com',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'PT. Media Nusantara',
    category: 'Layanan Media',
    status: 'active',
    picName: 'Andi Wijaya',
    picContact: 'andi.w@media-nusantara.co.id',
    rating: 5.0,
  },
  {
    id: '4',
    name: 'PT. Global Logistik',
    category: 'Logistik',
    status: 'active',
    picName: 'Rizky Ramadhan',
    picContact: 'r.ramadhan@global-log.id',
    rating: 4.5,
  },
]

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSuppliers = mockSuppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      header: 'Nama Supplier',
      render: (row: Supplier) => {
        const initials = row.name.split(' ').slice(0, 2).map(w => w[0]).join('')
        const colorIndex = row.id.charCodeAt(0) % 5
        const colors = ['bg-blue-50 text-blue-700', 'bg-orange-50 text-orange-700', 'bg-emerald-50 text-emerald-700', 'bg-indigo-50 text-indigo-700', 'bg-pink-50 text-pink-700']
        return (
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs", colors[colorIndex])}>
              {initials}
            </div>
            <div>
              <p className="font-bold text-on-surface">{row.name}</p>
              <p className="text-[11px] text-slate-400">ID: SUP-2024-{row.id.padStart(3, '0')}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (row: Supplier) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
          {row.category}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Supplier) => (
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", row.status === 'active' ? "bg-green-500" : "bg-slate-300")} />
          <span className="text-sm text-on-surface font-medium">
            {row.status === 'active' ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
      ),
    },
    {
      key: 'pic',
      header: 'PIC Supplier',
      render: (row: Supplier) => (
        <div>
          <p className="text-sm font-semibold text-on-surface">{row.picName}</p>
          <p className="text-[11px] text-slate-400">{row.picContact}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row: Supplier) => (
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold text-on-surface">{row.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: () => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all" title="Edit">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-error hover:bg-white rounded-lg transition-all" title="Delete">
            <span className="material-symbols-outlined text-lg">delete</span>
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
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2">
            Enterprise Resource Planning
          </p>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Manajemen Supplier
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola database supplier dan vendor perusahaan.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
            Export CSV
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">groups</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Supplier</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">1,284</span>
            <span className="text-green-600 text-xs font-bold mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">arrow_upward</span> 12%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">verified</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supplier Aktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">1,120</span>
            <div className="h-1.5 w-24 bg-slate-100 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-blue-600 w-[87%]" />
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">payments</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Transaksi (Bln)</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-on-surface">Rp 4.2B</span>
            <span className="text-blue-600 text-xs font-bold mb-1">Growth</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">pending_actions</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Review</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">14</span>
            <span className="text-error text-xs font-bold mb-1 px-2 py-0.5 bg-error-container rounded">Urgent</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari supplier..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-xs font-medium text-slate-600 border border-slate-100">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter: Category
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-xs font-medium text-slate-600 border border-slate-100">
              Status: Semua
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSuppliers}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada supplier yang ditemukan"
        />
      </div>
    </div>
  )
}
