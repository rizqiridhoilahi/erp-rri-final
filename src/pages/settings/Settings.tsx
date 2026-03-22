import { useState } from 'react'
import { DataPulse } from '@/components/shared'

export default function Settings() {
  const [activeSection, setActiveSection] = useState('identitas')

  const sections = [
    { id: 'identitas', label: 'Identitas Perusahaan', icon: 'domain' },
    { id: 'financial', label: 'Financial Settings', icon: 'account_balance_wallet' },
    { id: 'database', label: 'Database Maintenance', icon: 'storage' },
    { id: 'access', label: 'User Access Management', icon: 'group' },
  ]

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
          Global Settings
        </h1>
        <p className="text-on-surface-variant max-w-2xl mt-2">
          Kelola identitas perusahaan, konfigurasi keuangan, pemeliharaan database, dan kontrol akses pengguna dalam satu panel terpusat.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="xl:col-span-3 space-y-2 sticky top-28">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`block w-full text-left px-4 py-3 rounded transition-all border-l-4 ${
                activeSection === section.id
                  ? 'bg-surface-container-lowest shadow-sm text-primary font-bold text-sm border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low font-medium text-sm border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-lg mr-2 align-middle">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Main Forms Area */}
        <div className="xl:col-span-9 space-y-8">
          {/* Identitas Perusahaan */}
          <section className="bg-surface-container-lowest p-8 shadow-sm" id="identitas">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary-fixed p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">domain</span>
              </div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>Identitas Perusahaan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Logo Perusahaan</label>
                  <div className="relative group w-32 h-32 bg-surface-container-low flex items-center justify-center border-2 border-dashed border-outline-variant/30 overflow-hidden rounded-lg">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">upload_file</span>
                    <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white">upload_file</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">Format: PNG, JPG (Maks. 2MB)</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nama RRI</label>
                  <input
                    className="w-full px-4 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 text-sm font-medium rounded-md"
                    type="text"
                    defaultValue="Radio Republik Indonesia (Kantor Pusat)"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Alamat Lengkap</label>
                  <textarea
                    className="w-full px-4 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none rounded-md"
                    rows={4}
                    defaultValue="Jl. Medan Merdeka Barat No. 4-5, Gambir, Jakarta Pusat, DKI Jakarta 10110"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Kontak (Telepon)</label>
                    <input
                      className="w-full px-4 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 text-sm font-medium rounded-md"
                      type="text"
                      defaultValue="+62 21 3844545"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Email Resmi</label>
                    <input
                      className="w-full px-4 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 text-sm font-medium rounded-md"
                      type="email"
                      defaultValue="info@rri.co.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Settings */}
          <section className="bg-surface-container-lowest p-8 shadow-sm border-l-4 border-tertiary">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-tertiary-fixed p-3 rounded-lg">
                <span className="material-symbols-outlined text-tertiary">account_balance_wallet</span>
              </div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>Financial Settings</h2>
            </div>
            <div className="max-w-md space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nilai PPN Default</label>
                  <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded">Aktif (PPN 11%)</span>
                </div>
                <div className="relative">
                  <input
                    className="w-full pl-4 pr-12 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-tertiary/20 text-sm font-bold rounded-md"
                    type="number"
                    defaultValue="11"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">%</span>
                </div>
                <p className="text-[10px] text-on-surface-variant italic">Nilai ini akan diterapkan otomatis pada modul Sales dan Invoicing.</p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mata Uang Dasar</label>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-tertiary text-white text-xs font-bold rounded shadow-sm">IDR (Rupiah)</button>
                  <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded">USD (Dollar)</button>
                </div>
              </div>
            </div>
          </section>

          {/* Database Maintenance */}
          <section className="bg-surface-container-lowest p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-secondary-container p-3 rounded-lg">
                <span className="material-symbols-outlined text-secondary">storage</span>
              </div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>Database Maintenance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-surface-container-low rounded-xl space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">backup</span>
                  Backup System
                </h3>
                <p className="text-xs text-on-surface-variant">Lakukan pencadangan data secara manual untuk mengamankan informasi transaksi terakhir.</p>
                <button className="w-full py-2 bg-white border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-slate-50 transition-colors uppercase tracking-wider rounded">
                  Run Manual Backup
                </button>
              </div>
              <div className="p-6 bg-surface-container-low rounded-xl space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-base">cleaning_services</span>
                  Clean Cache
                </h3>
                <p className="text-xs text-on-surface-variant">Bersihkan data sementara untuk mengoptimalkan kecepatan akses aplikasi ERP.</p>
                <button className="w-full py-2 bg-white border border-outline-variant/30 text-error text-xs font-bold hover:bg-error-container/10 transition-colors uppercase tracking-wider rounded">
                  Purge Cache Now
                </button>
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <footer className="flex items-center justify-end gap-4 py-8 border-t border-outline-variant/20">
            <button className="px-6 py-2.5 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors rounded-lg">
              Discard
            </button>
            <button className="px-8 py-3 primary-gradient text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform rounded-lg">
              Save Settings
            </button>
          </footer>
        </div>
      </div>

      {/* Data Pulse Indicator */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-xl border border-white/50">
        <DataPulse label="System Synced" />
      </div>
    </div>
  )
}
