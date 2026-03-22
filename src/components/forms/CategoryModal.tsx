import { useState, useEffect } from 'react'
import { Trash2, Folder } from 'lucide-react'
import { Button, Input } from '@/components/forms'
import { Modal } from '@/components/shared'
import type { Category } from '@/db/schema'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onAdd: (name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isAdding?: boolean
}

export function CategoryModal({
  isOpen,
  onClose,
  categories,
  onAdd,
  onDelete,
  isAdding,
}: CategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setNewCategoryName('')
    }
  }, [isOpen])

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return
    
    await onAdd(newCategoryName.trim())
    setNewCategoryName('')
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kelola Kategori"
      description="Tambah atau hapus kategori produk"
      size="md"
    >
      <div className="space-y-6">
        {/* Add New Category */}
        <div className="flex gap-3">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nama kategori baru..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd()
              }
            }}
          />
          <Button
            onClick={handleAdd}
            disabled={!newCategoryName.trim() || isAdding}
            isLoading={isAdding}
          >
            Tambah
          </Button>
        </div>

        {/* Category List */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Kategori Produk ({categories.length})
          </p>
          
          {categories.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada kategori</p>
              <p className="text-xs mt-1">Tambah kategori baru di atas</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">folder</span>
                    <span className="text-sm font-medium text-on-surface">{category.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="p-2 text-slate-400 hover:text-error hover:bg-error-container/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button onClick={onClose}>
            Selesai
          </Button>
        </div>
      </div>
    </Modal>
  )
}
