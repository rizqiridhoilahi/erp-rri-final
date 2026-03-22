import { useState } from 'react'
import { Plus, Building2, User } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, StatusBadge, SearchInput } from '@/components/shared'
import { cn } from '@/lib/utils'

interface Customer {
  id: string
  customerId: string
  type: 'individual' | 'corporate'
  name: string
  email: string
  phone: string
  picCount: number
  addressCount: number
  hasContract: boolean
  status: 'active' | 'inactive'
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    customerId: 'CUST-001',
    type: 'corporate',
    name: 'PT. Media Citra Nusantara Raya',
    email: 'info@mediacitra.co.id',
    phone: '(021) 5761234',
    picCount: 3,
    addressCount: 2,
    hasContract: true,
    status: 'active',
  },
  {
    id: '2',
    customerId: 'CUST-002',
    type: 'individual',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '081234567890',
    picCount: 1,
    addressCount: 2,
    hasContract: false,
    status: 'active',
  },
  {
    id: '3',
    customerId: 'CUST-003',
    type: 'corporate',
    name: 'CV. Makmur Sejahtera',
    email: 'admin@makmur sejahtera.co.id',
    phone: '(031) 1234567',
    picCount: 2,
    addressCount: 1,
    hasContract: false,
    status: 'active',
  },
  {
    id: '4',
    customerId: 'CUST-004',
    type: 'corporate',
    name: 'PT. Digital Global',
    email: 'procurement@digitalglobal.id',
    phone: '(021) 7890123',
    picCount: 4,
    addressCount: 3,
    hasContract: true,
    status: 'active',
  },
]

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customerType, setCustomerType] = useState<'all' | 'individual' | 'corporate'>('all')

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = customerType === 'all' || customer.type === customerType
    return matchesSearch && matchesType
  })

  const columns = [
    {
      key: 'customerId',
      header: 'ID',
      render: (row: Customer) => (
        <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{row.customerId}</span>
      ),
    },
    {
      key: 'type',
      header: 'Tipe',
      className: 'w-16',
      render: (row: Customer) => (
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          row.type === 'corporate' ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
        )}>
          {row.type === 'corporate' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Nama Pelanggan',
      render: (row: Customer) => (
        <div>
          <p className="font-bold text-on-surface">{row.name}</p>
          <p className="text-xs text-on-surface-variant">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (row: Customer) => (
        <span className="text-on-surface-variant">{row.phone}</span>
      ),
    },
    {
      key: 'data',
      header: 'Data',
      render: (row: Customer) => (
        <div className="flex gap-4">
          <span className="text-xs text-on-surface-variant">
            {row.picCount} PIC • {row.addressCount} Alamat
          </span>
        </div>
      ),
    },
    {
      key: 'contract',
      header: 'Kontrak',
      render: (row: Customer) => (
        row.hasContract ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-sm">description</span>
            Aktif
          </span>
        ) : (
          <span className="text-xs text-on-surface-variant">-</span>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Customer) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-16',
      render: () => (
        <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all">
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      ),
    },
  ]

  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2">
            Customer Relationship Management
          </p>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Master Pelanggan
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola database klien dan kemitraan perusahaan.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add Pelanggan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pelanggan</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">856</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bisnis (Corporate)</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">624</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Perorangan</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">232</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kontrak Aktif</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-primary">48</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari pelanggan..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setCustomerType('all')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-colors",
                customerType === 'all' ? "bg-primary text-white" : "bg-surface text-slate-600 hover:bg-surface-container"
              )}
            >
              Semua
            </button>
            <button
              onClick={() => setCustomerType('corporate')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1",
                customerType === 'corporate' ? "bg-primary text-white" : "bg-surface text-slate-600 hover:bg-surface-container"
              )}
            >
              <Building2 className="w-3 h-3" /> Corporate
            </button>
            <button
              onClick={() => setCustomerType('individual')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1",
                customerType === 'individual' ? "bg-primary text-white" : "bg-surface text-slate-600 hover:bg-surface-container"
              )}
            >
              <User className="w-3 h-3" /> Individual
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredCustomers}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada pelanggan yang ditemukan"
        />
      </div>
    </div>
  )
}
