import { useState, useEffect } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import { Button, Input } from '@/components/forms'
import { Modal } from '@/components/shared'
import { cn } from '@/lib/utils'
import imageCompression from 'browser-image-compression'
import type { Product, Category, Supplier } from '@/db/schema'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  product?: Product | null
  categories: Category[]
  suppliers: Supplier[]
  isLoading?: boolean
}

export interface ProductFormData {
  sku: string
  name: string
  brand: string
  categoryId: string
  supplierId: string
  sellingPrice: number
  purchasePrice: number
  unit: string
  currentStock: number
  minStockLimit: number
  isContractProduct: boolean
  imageUrl: string
  description: string
}

const UNIT_OPTIONS = [
  { value: 'PCS', label: 'PCS' },
  { value: 'BUNDLE', label: 'BUNDLE' },
  { value: 'BAG', label: 'BAG' },
  { value: 'PAIL', label: 'PAIL' },
  { value: 'ROLL', label: 'ROLL' },
  { value: 'BOX', label: 'BOX' },
  { value: 'SET', label: 'SET' },
  { value: 'KG', label: 'KG' },
  { value: 'METER', label: 'METER' },
]

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  suppliers,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    brand: '',
    categoryId: '',
    supplierId: '',
    sellingPrice: 0,
    purchasePrice: 0,
    unit: 'PCS',
    currentStock: 0,
    minStockLimit: 5,
    isContractProduct: false,
    imageUrl: '',
    description: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  useEffect(() => {
    const p = product as Record<string, unknown> | null
    
    if (p) {
      setFormData({
        sku: (p.sku as string) || '',
        name: (p.name as string) || '',
        brand: (p.brand as string) || '',
        categoryId: (p.category_id as string) || '',
        supplierId: (p.supplier_id as string) || '',
        sellingPrice: Number(p.selling_price) || 0,
        purchasePrice: Number(p.purchase_price) || 0,
        unit: (p.unit as string) || 'PCS',
        currentStock: (p.current_stock as number) || 0,
        minStockLimit: (p.min_stock_limit as number) || 5,
        isContractProduct: (p.is_contract_product as boolean) || false,
        imageUrl: (p.image_url as string) || '',
        description: (p.description as string) || '',
      })
      setImagePreview((p.image_url as string) || '')
    } else {
      setFormData({
        sku: '',
        name: '',
        brand: '',
        categoryId: '',
        supplierId: '',
        sellingPrice: 0,
        purchasePrice: 0,
        unit: 'PCS',
        currentStock: 0,
        minStockLimit: 5,
        isContractProduct: false,
        imageUrl: '',
        description: '',
      })
      setImagePreview('')
    }
    setErrors({})
  }, [product, isOpen])

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      })

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(compressedFile)
      
      setFormData((prev) => ({ ...prev, imageUrl: file.name }))
    } catch (error) {
      console.error('Image compression error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU wajib diisi'
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi'
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori wajib dipilih'
    }
    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Harga jual wajib diisi'
    }
    if (!formData.unit) {
      newErrors.unit = 'Satuan wajib dipilih'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setSubmitError('')
    
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      setSubmitError('Gagal menyimpan: ' + (error as Error).message)
    }
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('id-ID')
  }

  const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Produk' : 'Tambah Produk Baru'}
      description="Lengkapi informasi produk di bawah ini"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="flex gap-6">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="product-image"
              disabled={isUploading}
            />
            <label
              htmlFor="product-image"
              className={cn(
                "w-32 h-32 bg-surface-container rounded-xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors overflow-hidden",
                isUploading && "opacity-50 cursor-wait"
              )}
            >
              {imagePreview && !imageError ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                  <p className="text-xs text-on-surface-variant">Upload</p>
                </div>
              )}
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview('')
                  setFormData((prev) => ({ ...prev, imageUrl: '' }))
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-lg hover:bg-error/90"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="SKU / Kode Produk"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="RRI-XXX-001"
                error={errors.sku}
                required
              />
              <Input
                label="Merek"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Nama Merek"
              />
            </div>
            
            <Input
              label="Nama Produk"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama lengkap produk"
              error={errors.name}
              required
            />
          </div>
        </div>

        {/* Category & Supplier */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Kategori <span className="text-error">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={cn(
                "w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20",
                errors.categoryId && "ring-2 ring-error/20"
              )}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-error">{errors.categoryId}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Supplier
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Pilih Supplier</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Harga Jual <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">Rp</span>
              <input
                type="text"
                value={formatCurrency(formData.sellingPrice)}
                onChange={(e) => setFormData({ ...formData, sellingPrice: parseCurrency(e.target.value) })}
                className={cn(
                  "w-full bg-surface-container-low border-0 rounded-md py-2.5 pl-10 pr-4 text-sm font-medium text-right focus:ring-2 focus:ring-primary/20",
                  errors.sellingPrice && "ring-2 ring-error/20"
                )}
              />
            </div>
            {errors.sellingPrice && (
              <p className="text-xs text-error">{errors.sellingPrice}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Harga Beli
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">Rp</span>
              <input
                type="text"
                value={formatCurrency(formData.purchasePrice)}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseCurrency(e.target.value) })}
                className="w-full bg-surface-container-low border-0 rounded-md py-2.5 pl-10 pr-4 text-sm font-medium text-right focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Unit & Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Satuan <span className="text-error">*</span>
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Stok Awal
            </label>
            <input
              type="number"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
              min="0"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Min. Stok
            </label>
            <input
              type="number"
              value={formData.minStockLimit}
              onChange={(e) => setFormData({ ...formData, minStockLimit: parseInt(e.target.value) || 0 })}
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
              min="0"
            />
          </div>
        </div>

        {/* Contract Product */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isContractProduct"
            checked={formData.isContractProduct}
            onChange={(e) => setFormData({ ...formData, isContractProduct: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isContractProduct" className="text-sm font-medium text-on-surface">
            Produk Kontrak (Prioritas harga dari tabel kontrak)
          </label>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Deskripsi
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Deskripsi produk (opsional)"
            rows={3}
            className="w-full bg-surface-container-low border-0 rounded-md py-3 px-4 text-sm font-medium resize-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Footer */}
        {submitError && (
          <div className="mt-4 text-sm font-medium text-center py-2 px-4 rounded-lg bg-red-100 text-red-700">
            {submitError}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {product ? 'Simpan Perubahan' : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
