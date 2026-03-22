import { useState } from 'react'
import { Plus, Upload, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, StatusBadge, SearchInput, Modal } from '@/components/shared'
import { cn } from '@/lib/utils'
import {
  useSuppliers,
  useCategories,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '@/lib/hooks'
import type { Supplier, Category } from '@/db/schema'

type SupplierWithCategory = Supplier & { category: Category | null }

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithCategory | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    status: 'active' as 'active' | 'inactive' | 'archived',
    picName: '',
    picEmail: '',
    picPhone: '',
    officeAddress: '',
    warehouseAddress: '',
    storeUrl: '',
    notes: '',
  })

  const { data: suppliers = [], isLoading } = useSuppliers()
  const { data: categories = [] } = useCategories('supplier')
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const handleOpenAdd = () => {
    setSelectedSupplier(null)
    setFormData({
      name: '',
      categoryId: '',
      status: 'active',
      picName: '',
      picEmail: '',
      picPhone: '',
      officeAddress: '',
      warehouseAddress: '',
      storeUrl: '',
      notes: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (supplier: SupplierWithCategory) => {
    setSelectedSupplier(supplier)
    setFormData({
      name: supplier.name,
      categoryId: supplier.categoryId ?? '',
      status: supplier.status ?? 'active',
      picName: supplier.picName ?? '',
      picEmail: supplier.picEmail ?? '',
      picPhone: supplier.picPhone ?? '',
      officeAddress: supplier.officeAddress ?? '',
      warehouseAddress: supplier.warehouseAddress ?? '',
      storeUrl: supplier.storeUrl ?? '',
      notes: supplier.notes ?? '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return
    
    const submitData = {
      name: formData.name,
      categoryId: formData.categoryId || null,
      status: formData.status,
      picName: formData.picName || null,
      picEmail: formData.picEmail || null,
      picPhone: formData.picPhone || null,
      officeAddress: formData.officeAddress || null,
      warehouseAddress: formData.warehouseAddress || null,
      storeUrl: formData.storeUrl || null,
      notes: formData.notes || null,
    }
    
    if (selectedSupplier) {
      await updateSupplier.mutateAsync({ id: selectedSupplier.id, ...submitData })
    } else {
      await createSupplier.mutateAsync(submitData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      await deleteSupplier.mutateAsync(id)
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (supplier.category?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (supplier.picName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length
  const inactiveSuppliers = suppliers.filter(s => s.status === 'inactive').length

  const getInitials = (name: string) => {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-blue-50 text-blue-700',
      'bg-orange-50 text-orange-700',
      'bg-emerald-50 text-emerald-700',
      'bg-indigo-50 text-indigo-700',
      'bg-pink-50 text-pink-700',
    ]
    return colors[id.charCodeAt(0) % 5]
  }

  const columns = [
    {
      key: 'name',
      header: 'Nama Supplier',
      render: (row: SupplierWithCategory) => (
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs", getAvatarColor(row.id))}>
            {getInitials(row.name)}
          </div>
          <div>
            <p className="font-bold text-on-surface">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (row: SupplierWithCategory) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
          {row.category?.name || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: SupplierWithCategory) => (
        <StatusBadge status={row.status ?? 'active'} />
      ),
    },
    {
      key: 'pic',
      header: 'PIC Supplier',
      render: (row: SupplierWithCategory) => (
        <div>
          <p className="text-sm font-semibold text-on-surface">{row.picName || '-'}</p>
          <p className="text-[11px] text-slate-400">{row.picEmail || '-'}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Kontak PIC',
      render: (row: SupplierWithCategory) => (
        <span className="text-sm text-on-surface-variant">{row.picPhone || '-'}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (row: SupplierWithCategory) => (
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
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
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
            <span className="text-3xl font-black text-on-surface">{totalSuppliers}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">verified</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supplier Aktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">{activeSuppliers}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supplier Nonaktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">{inactiveSuppliers}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px]">pending_actions</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">{categories.length}</span>
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
              Filter
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSuppliers}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada supplier yang ditemukan"
          isLoading={isLoading}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
        description="Lengkapi informasi supplier"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Nama Supplier <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="PT. Contoh Indonesia"
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Kategori
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'archived' })}
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Informasi PIC</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Nama PIC
                </label>
                <input
                  type="text"
                  value={formData.picName}
                  onChange={(e) => setFormData({ ...formData, picName: e.target.value })}
                  placeholder="Nama lengkap PIC"
                  className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Telepon PIC
                </label>
                <input
                  type="tel"
                  value={formData.picPhone}
                  onChange={(e) => setFormData({ ...formData, picPhone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Email PIC
                </label>
                <input
                  type="email"
                  value={formData.picEmail}
                  onChange={(e) => setFormData({ ...formData, picEmail: e.target.value })}
                  placeholder="pic@supplier.com"
                  className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Alamat & Lainnya</p>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Alamat Kantor
                </label>
                <textarea
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  placeholder="Alamat lengkap kantor"
                  rows={2}
                  className="w-full bg-surface-container-low border-0 rounded-md py-3 px-4 text-sm font-medium resize-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  URL Toko / Website
                </label>
                <input
                  type="url"
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                  placeholder="https://contoh.com"
                  className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={createSupplier.isPending || updateSupplier.isPending}
          >
            {selectedSupplier ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
