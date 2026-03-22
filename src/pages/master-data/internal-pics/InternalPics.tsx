import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/forms'
import { DataTable, SearchInput, Modal } from '@/components/shared'
import { cn } from '@/lib/utils'
import {
  useInternalPics,
  useCreateInternalPic,
  useUpdateInternalPic,
  useDeleteInternalPic,
} from '@/lib/hooks'
import type { InternalPic } from '@/db/schema'

export default function InternalPics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPic, setSelectedPic] = useState<InternalPic | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
  })

  const { data: pics = [], isLoading } = useInternalPics()
  const createPic = useCreateInternalPic()
  const updatePic = useUpdateInternalPic()
  const deletePic = useDeleteInternalPic()

  const handleOpenAdd = () => {
    setSelectedPic(null)
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (pic: InternalPic) => {
    setSelectedPic(pic)
    setFormData({
      name: pic.name,
      position: pic.position,
      email: pic.email,
      phone: pic.phone,
    })
    setIsModalOpen(true)
  }

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.position.trim() || !formData.email.trim()) {
      setSubmitStatus('error')
      setSubmitMessage('Nama, jabatan, dan email wajib diisi')
      return
    }
    
    setSubmitStatus('loading')
    setSubmitMessage('Menyimpan...')
    
    try {
      const submitData: Record<string, unknown> = {
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone || null,
      }
      
      if (selectedPic) {
        await updatePic.mutateAsync({ id: selectedPic.id, ...submitData })
      } else {
        await createPic.mutateAsync(submitData)
      }
      
      setSubmitStatus('success')
      setSubmitMessage('Berhasil disimpan!')
      setTimeout(() => setIsModalOpen(false), 1000)
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Gagal: ' + (error as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus PIC ini?')) {
      await deletePic.mutateAsync(id)
    }
  }

  const filteredPics = pics.filter((pic) =>
    pic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pic.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pic.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPics = pics.length

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const columns = [
    {
      key: 'name',
      header: 'Nama Lengkap',
      render: (row: InternalPic) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
            {getInitials(row.name)}
          </div>
          <span className="text-sm font-semibold text-on-surface">{row.name}</span>
        </div>
      ),
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
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (row: InternalPic) => (
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
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add PIC
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total PIC</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-on-surface">{totalPics}</span>
          </div>
        </div>
        <div className="col-span-2 bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Health</span>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Live Data</span>
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
          isLoading={isLoading}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPic ? 'Edit PIC Internal' : 'Tambah PIC Internal Baru'}
        description="Lengkapi informasi personil internal"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Nama Lengkap <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nama lengkap"
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Jabatan <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Contoh: Kepala Divisi Pengadaan"
              className="w-full bg-surface-container-low border-0 rounded-md py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Email <span className="text-error">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@rri.co.id"
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

          {submitMessage && (
            <div className={cn(
              "text-sm font-medium text-center py-2 px-4 rounded-lg",
              submitStatus === 'success' && "bg-green-100 text-green-700",
              submitStatus === 'error' && "bg-red-100 text-red-700",
              submitStatus === 'loading' && "bg-blue-100 text-blue-700"
            )}>
              {submitMessage}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={submitStatus === 'loading'}
            >
              {selectedPic ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
