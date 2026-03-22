import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, SearchInput, StatusBadge } from '@/components/shared'

interface InternalPic {
  id: string
  name: string
  position: string
  email: string
  phone: string
  status: 'active' | 'inactive'
}

const mockInternalPics: InternalPic[] = [
  {
    id: '1',
    name: 'Arya Satria',
    position: 'Direktur Operasional',
    email: 'arya.satria@rri.co.id',
    phone: '+62 812-3456-7890',
    status: 'active',
  },
  {
    id: '2',
    name: 'Budi Pratama',
    position: 'Kepala Divisi Pengadaan',
    email: 'budi.pratama@rri.co.id',
    phone: '+62 811-9988-7766',
    status: 'active',
  },
  {
    id: '3',
    name: 'Dewi Anjani',
    position: 'Manager Keuangan',
    email: 'dewi.anjani@rri.co.id',
    phone: '+62 813-2233-4455',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Rian Kusuma',
    position: 'Legal Officer',
    email: 'rian.kusuma@rri.co.id',
    phone: '+62 856-7788-1122',
    status: 'active',
  },
]

export default function InternalPics() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPics = mockInternalPics.filter((pic) =>
    pic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pic.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pic.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      header: 'Nama Lengkap',
      render: (row: InternalPic) => {
        const initials = row.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <span className="text-sm font-semibold text-on-surface">{row.name}</span>
          </div>
        )
      },
    },
    {
      key: 'position',
      header: 'Jabatan',
      render: (row: InternalPic) => (
        <span className="text-sm text-on-surface-variant">{row.position}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row: InternalPic) => (
        <span className="text-sm text-on-surface-variant font-medium">{row.email}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Nomor Telepon',
      render: (row: InternalPic) => (
        <span className="text-sm text-on-surface-variant">{row.phone}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: InternalPic) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-16',
      render: () => (
        <button className="p-2 text-slate-300 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      ),
    },
  ]

  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">
            <span>Master Data</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">Internal PIC</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Manajemen PIC Internal
          </h1>
          <p className="text-on-surface-variant mt-1">
            Daftar personil internal yang memiliki otorisasi penandatanganan dokumen.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add PIC
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total PIC</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-on-surface">24</span>
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">+2</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktif Signer</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-on-surface">18</span>
          </div>
        </div>
        <div className="col-span-2 bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Health</span>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Live Data Stream</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-8xl">analytics</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari nama, jabatan, atau email..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-96"
          />
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredPics}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada PIC yang ditemukan"
        />
      </div>

      {/* Live Notification */}
      <div className="mt-8 flex justify-end">
        <div className="bg-surface-variant/70 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl flex items-center gap-4 max-w-sm">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider">System Sync</p>
            <p className="text-sm font-medium text-on-surface">All signatures updated successfully.</p>
          </div>
          <button className="ml-4 text-slate-400">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  )
}
