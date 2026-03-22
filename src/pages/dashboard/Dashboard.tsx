import { Link } from 'react-router-dom'
import { BentoCard, DataPulse } from '@/components/shared'

const masterDataModules = [
  {
    title: 'Produk',
    description: 'Daftar inventori & katalog',
    value: '2,482',
    suffix: 'SKU',
    icon: 'inventory_2',
    href: '/master-data/products',
  },
  {
    title: 'Pelanggan',
    description: 'Database klien & kemitraan',
    value: '856',
    suffix: 'Klien Aktif',
    icon: 'groups',
    href: '/master-data/customers',
  },
  {
    title: 'Supplier',
    description: 'Penyedia logistik & bahan',
    value: '124',
    suffix: 'Vendor',
    icon: 'local_shipping',
    href: '/master-data/suppliers',
  },
  {
    title: 'PIC Internal',
    description: 'Penanggung jawab modul',
    value: '42',
    suffix: 'Personel',
    icon: 'badge',
    href: '/master-data/internal-pics',
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'product',
    action: 'Penambahan Produk Baru',
    name: 'Indo-Steel 400x400',
    user: 'Bambang Irawan',
    time: '10 Menit yang lalu',
  },
  {
    id: 2,
    type: 'supplier',
    action: 'Update Profil Supplier',
    name: 'PT. Global Logistik',
    user: 'Sistem Automasi',
    time: '45 Menit yang lalu',
  },
  {
    id: 3,
    type: 'customer',
    action: 'Verifikasi Pelanggan Baru',
    name: 'CV. Maju Jaya',
    user: 'PIC Finance',
    time: '2 Jam yang lalu',
  },
]

export default function Dashboard() {
  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DataPulse label="System Live Status" />
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-headline)' }}>
            Halaman Depan Master Data
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Kelola entitas inti perusahaan Anda dalam satu platform terpusat.
          </p>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant text-xs uppercase mb-1">Terakhir Diperbarui</p>
          <p className="font-bold text-primary">21 Mar 2026, 14:30 WIB</p>
        </div>
      </div>

      {/* Bento Grid Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {masterDataModules.map((module) => (
          <Link key={module.title} to={module.href}>
            <BentoCard
              title={module.title}
              description={module.description}
              value={module.value}
              suffix={module.suffix}
              icon={module.icon}
              className="h-full"
            />
          </Link>
        ))}
      </div>

      {/* Activity & Stats */}
      <div className="grid grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="col-span-2 bg-surface-container-low p-10 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
            Aktivitas Data Terbaru
          </h3>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-white/60 rounded-xl hover:bg-white transition-colors"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    {activity.action}: <span className="text-primary">{activity.name}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Oleh {activity.user} • {activity.time}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-primary/10 text-primary rounded">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col gap-6">
          {/* Data Quality */}
          <div className="bg-primary p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
                Kualitas Data
              </h4>
              <p className="text-primary-fixed/80 text-sm mt-1">
                Skor validitas master data saat ini.
              </p>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-extrabold">98.4%</span>
                <span className="material-symbols-outlined text-blue-200 pb-1">trending_up</span>
              </div>
              <p className="text-xs text-primary-fixed/80 mt-4">
                Peningkatan 0.4% dari bulan lalu
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined opacity-30 text-4xl">verified_user</span>
            </div>
          </div>

          {/* Help */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100">
            <h4 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
              Butuh Bantuan?
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <p className="text-sm font-bold">Bantuan Teknis</p>
                <p className="text-xs text-on-surface-variant">24/7 Support Master Data</p>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-50 text-primary font-bold text-xs rounded-lg hover:bg-slate-100 transition-colors uppercase tracking-wider">
              Hubungi Support
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 primary-gradient text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
      </button>
    </div>
  )
}
