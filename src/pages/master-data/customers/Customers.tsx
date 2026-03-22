import { useState } from 'react'
import { Plus, Building2, User, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, StatusBadge, SearchInput, Modal } from '@/components/shared'
import { cn } from '@/lib/utils'
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '@/lib/hooks'
import type { Customer } from '@/db/schema'

interface CustomerWithCounts extends Customer {
  picCount: number
  addressCount: number
  hasContract: boolean
}

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customerType, setCustomerType] = useState<'all' | 'individual' | 'corporate'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithCounts | null>(null)
  
  const [formData, setFormData] = useState({
    type: 'corporate' as 'individual' | 'corporate',
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const { data: customers = [], isLoading } = useCustomers()
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const deleteCustomer = useDeleteCustomer()

  const handleOpenAdd = () => {
    setSelectedCustomer(null)
    setFormData({
      type: 'corporate',
      name: '',
      email: '',
      phone: '',
      notes: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (customer: CustomerWithCounts) => {
    setSelectedCustomer(customer)
    setFormData({
      type: customer.type,
      name: customer.name,
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      notes: customer.notes ?? '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return
    
    if (selectedCustomer) {
      await updateCustomer.mutateAsync({ id: selectedCustomer.id, ...formData })
    } else {
      await createCustomer.mutateAsync(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      await deleteCustomer.mutateAsync(id)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = customerType === 'all' || customer.type === customerType
    return matchesSearch && matchesType
  })

  const totalCustomers = customers.length
  const corporateCustomers = customers.filter(c => c.type === 'corporate').length
  const individualCustomers = customers.filter(c => c.type === 'individual').length
  const contractCustomers = customers.filter(c => c.hasContract).length

  const columns = [
    {
      key: 'customerId',
      header: 'ID',
      render: (row: CustomerWithCounts) => (
        <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{row.customerId}</span>
      ),
    },
    {
      key: 'type',
      header: 'Tipe',
      className: 'w-16',
      render: (row: CustomerWithCounts) => (
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
      render: (row: CustomerWithCounts) => (
        <div>
          <p className="font-bold text-on-surface">{row.name}</p>
          <p className="text-xs text-on-surface-variant">{row.email || '-'}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (row: CustomerWithCounts) => (
        <span className="text-on-surface-variant">{row.phone || '-'}</span>
      ),
    },
    {
      key: 'data',
      header: 'Data',
      render: (row: CustomerWithCounts) => (
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
      render: (row: CustomerWithCounts) => (
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
      render: (row: CustomerWithCounts) => <StatusBadge status={row.status ?? 'active'} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (row: CustomerWithCounts) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-slate-400 hover:text-error hover:bg-white rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
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
            Customer Relationship Management
          </p>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Master Pelanggan
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola database klien dan kemitraan perusahaan.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Pelanggan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pelanggan</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">{totalCustomers}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bisnis (Corporate)</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">{corporateCustomers}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Perorangan</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-on-surface">{individualCustomers}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kontrak Aktif</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black text-primary">{contractCustomers}</span>
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
          isLoading={isLoading}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
        description="Lengkapi informasi pelanggan"
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Tipe Pelanggan
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'corporate' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-colors",
                  formData.type === 'corporate'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                )}
              >
                <Building2 className="w-4 h-4" />
                <span className="font-bold text-sm">Corporate</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'individual' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-colors",
                  formData.type === 'individual'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                )}
              >
                <User className="w-4 h-4" />
                <span className="font-bold text-sm">Individual</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Nama {formData.type === 'corporate' ? 'Perusahaan' : 'Lengkap'} <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={formData.type === 'corporate' ? 'PT. Contoh Indonesia' : 'Nama lengkap'}
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@contoh.com"
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan tambahan..."
              rows={3}
              className="w-full bg-surface-container-low border-0 rounded-md py-3 px-4 text-sm font-medium resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={createCustomer.isPending || updateCustomer.isPending}
          >
            {selectedCustomer ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
