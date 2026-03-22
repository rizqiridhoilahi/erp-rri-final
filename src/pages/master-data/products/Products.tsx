import { useState } from 'react'
import { Plus, Upload, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, StatusBadge, SearchInput, Modal } from '@/components/shared'
import { cn, formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  sku: string
  name: string
  brand: string
  category: string
  sellingPrice: number
  unit: string
  currentStock: number
  minStockLimit: number
  status: 'active' | 'inactive' | 'archived'
  imageUrl?: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'RRI-MTL-001',
    name: 'Steel Beam H-200',
    brand: 'IndoSteel',
    category: 'Material Konstruksi',
    sellingPrice: 2500000,
    unit: 'PCS',
    currentStock: 150,
    minStockLimit: 20,
    status: 'active',
  },
  {
    id: '2',
    sku: 'RRI-MTL-012',
    name: 'Reinforcement Bar 12mm',
    brand: 'KS',
    category: 'Besi Beton',
    sellingPrice: 85000,
    unit: 'BUNDLE',
    currentStock: 45,
    minStockLimit: 10,
    status: 'active',
  },
  {
    id: '3',
    sku: 'RRI-ACC-221',
    name: 'Concrete Spacer 50mm',
    brand: 'Prima',
    category: 'Aksesoris',
    sellingPrice: 15000,
    unit: 'BAG',
    currentStock: 500,
    minStockLimit: 100,
    status: 'active',
  },
  {
    id: '4',
    sku: 'RRI-FIN-003',
    name: 'Cat Dinding Eksterior 20L',
    brand: 'Nippon Paint',
    category: 'Finishing',
    sellingPrice: 485000,
    unit: 'PAIL',
    currentStock: 3,
    minStockLimit: 10,
    status: 'active',
  },
]

const columns = [
  {
    key: 'image',
    header: '',
    className: 'w-16',
    render: (row: Product) => (
      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
        {row.imageUrl ? (
          <img src={row.imageUrl} alt={row.name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <ImageIcon className="w-5 h-5 text-on-surface-variant" />
        )}
      </div>
    ),
  },
  {
    key: 'sku',
    header: 'SKU',
    render: (row: Product) => (
      <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{row.sku}</span>
    ),
  },
  {
    key: 'name',
    header: 'Nama Produk',
    render: (row: Product) => (
      <div>
        <p className="font-bold text-on-surface">{row.name}</p>
        <p className="text-xs text-on-surface-variant">{row.brand}</p>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Kategori',
    render: (row: Product) => (
      <span className="text-on-surface-variant">{row.category}</span>
    ),
  },
  {
    key: 'price',
    header: 'Harga Jual',
    className: 'text-right',
    render: (row: Product) => (
      <span className="font-bold text-on-surface">{formatCurrency(row.sellingPrice)}</span>
    ),
  },
  {
    key: 'stock',
    header: 'Stok',
    className: 'text-center',
    render: (row: Product) => (
      <div>
        <span className={cn(
          "font-bold",
          row.currentStock <= row.minStockLimit ? "text-error" : "text-on-surface"
        )}>
          {row.currentStock}
        </span>
        <span className="text-on-surface-variant text-xs"> / {row.unit}</span>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Product) => <StatusBadge status={row.status} />,
  },
  {
    key: 'actions',
    header: '',
    className: 'w-20',
    render: () => (
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all" title="Edit">
          <Edit className="w-4 h-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-error hover:bg-white rounded-lg transition-all" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
]

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2">
            Enterprise Resource Planning
          </p>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Master Produk
          </h1>
          <p className="text-on-surface-variant mt-2">
            Kelola daftar produk dan inventori perusahaan.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
            Export CSV
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Add Produk
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Produk</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">2,482</span>
            <span className="text-green-600 text-xs font-bold mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">arrow_upward</span> 12%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">2,120</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stok Rendah</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-error">24</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nonaktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">338</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <SearchInput
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-80"
          />
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-xs font-medium text-slate-600 border border-slate-100">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter: Semua
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredProducts}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada produk yang ditemukan"
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Produk Baru"
        description="Lengkapi informasi produk di bawah ini"
        size="lg"
      >
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors group">
              <div className="text-center">
                <Upload className="w-8 h-8 text-on-surface-variant mx-auto mb-2 group-hover:text-primary transition-colors" />
                <p className="text-xs text-on-surface-variant">Upload Gambar</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    SKU / Kode Produk <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-md py-2.5 px-4 text-sm font-medium"
                    placeholder="RRI-XXX-001"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Merek
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-md py-2.5 px-4 text-sm font-medium"
                    placeholder="Nama Merek"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Nama Produk <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-md py-2.5 px-4 text-sm font-medium"
                  placeholder="Nama lengkap produk"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Kategori <span className="text-error">*</span>
              </label>
              <div className="flex gap-2">
                <select className="flex-1 bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium">
                  <option value="">Pilih Kategori</option>
                  <option value="material">Material Konstruksi</option>
                  <option value="besi">Besi Beton</option>
                  <option value="aksesoris">Aksesoris</option>
                </select>
                <button className="px-3 py-2 bg-surface-container text-primary rounded-md hover:bg-surface-container-high transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Supplier
              </label>
              <select className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium">
                <option value="">Pilih Supplier</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Harga Jual <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">Rp</span>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border-0 rounded-md py-2.5 pl-10 pr-4 text-sm font-medium text-right"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Satuan <span className="text-error">*</span>
              </label>
              <select className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium">
                <option value="PCS">PCS</option>
                <option value="BUNDLE">BUNDLE</option>
                <option value="BAG">BAG</option>
                <option value="PAIL">PAIL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Stok Awal
              </label>
              <input
                type="number"
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="contractProduct" className="w-4 h-4 rounded border-slate-300" />
            <label htmlFor="contractProduct" className="text-sm font-medium text-on-surface">
              Produk Kontrak (Prioritas harga dari tabel kontrak)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button>
              Simpan Produk
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
