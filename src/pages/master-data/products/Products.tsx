import { useState } from 'react'
import { Plus, Upload, Edit, Trash2, Image as ImageIcon, Package } from 'lucide-react'
import { Button } from '@/components/forms'
import { ProductForm, CategoryModal, type ProductFormData } from '@/components/forms'
import { DataTable, StatusBadge, SearchInput } from '@/components/shared'
import { cn, formatCurrency } from '@/lib/utils'
import {
  useProducts,
  useCategories,
  useSuppliers,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateCategory,
  useDeleteCategory,
} from '@/lib/hooks'
import type { Product, Category, Supplier } from '@/db/schema'

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const { data: products = [], isLoading: isLoadingProducts } = useProducts()
  const { data: categories = [] } = useCategories('product')
  const { data: suppliers = [] } = useSuppliers()
  
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()

  const handleOpenAdd = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(true)
  }

  const handleOpenEdit = (product: Product & { category?: Category; supplier?: Supplier }) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleSubmitProduct = async (data: ProductFormData) => {
    const productData = {
      ...data,
      sellingPrice: String(data.sellingPrice),
      purchasePrice: data.purchasePrice ? String(data.purchasePrice) : null,
    }
    
    if (selectedProduct) {
      await updateProduct.mutateAsync({ id: selectedProduct.id, ...productData })
    } else {
      await createProduct.mutateAsync(productData)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      await deleteProduct.mutateAsync(id)
    }
  }

  const handleAddCategory = async (name: string) => {
    await createCategory.mutateAsync({ name, type: 'product' })
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      await deleteCategory.mutateAsync({ id, type: 'product' })
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product as Product & { category?: Category }).category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const lowStockProducts = products.filter(p => (p.currentStock ?? 0) <= (p.minStockLimit ?? 0)).length
  const inactiveProducts = products.filter(p => p.status === 'inactive').length

  const columns = [
    {
      key: 'image',
      header: '',
      className: 'w-16',
      render: (row: Product & { category?: Category; supplier?: Supplier }) => (
        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} className="w-full h-full object-cover" />
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
      render: (row: Product & { category?: Category; supplier?: Supplier }) => (
        <div>
          <p className="font-bold text-on-surface">{row.name}</p>
          <p className="text-xs text-on-surface-variant">{row.brand || '-'}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (row: Product & { category?: Category }) => (
        <span className="text-on-surface-variant">
          {row.category?.name || '-'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Harga Jual',
      className: 'text-right',
      render: (row: Product) => (
        <span className="font-bold text-on-surface">{formatCurrency(Number(row.sellingPrice))}</span>
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
            (row.currentStock ?? 0) <= (row.minStockLimit ?? 0) ? "text-error" : "text-on-surface"
          )}>
            {row.currentStock ?? 0}
          </span>
          <span className="text-on-surface-variant text-xs"> / {row.unit}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Product) => <StatusBadge status={row.status as 'active' | 'inactive' | 'archived'} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (row: Product) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleOpenEdit(row as Product & { category?: Category; supplier?: Supplier })}
            className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id)}
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
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add Produk
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Produk</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">{totalProducts}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">{activeProducts}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stok Rendah</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-error">{lowStockProducts}</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between h-32">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nonaktif</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-on-surface">{inactiveProducts}</span>
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
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-xs font-medium text-slate-600 border border-slate-100 hover:bg-surface-container transition-colors"
            >
              <Package className="w-4 h-4" />
              Kelola Kategori
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg text-xs font-medium text-slate-600 border border-slate-100">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter: Semua
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredProducts as (Product & { category?: Category; supplier?: Supplier })[]}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada produk yang ditemukan"
          isLoading={isLoadingProducts}
        />
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setSelectedProduct(null)
        }}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        categories={categories}
        suppliers={suppliers}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
        isAdding={createCategory.isPending}
      />
    </div>
  )
}
