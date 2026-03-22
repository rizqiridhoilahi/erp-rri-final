import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'dashboard' },
  { 
    name: 'Master Data', 
    href: '/master-data', 
    icon: 'database',
    children: [
      { name: 'Produk', href: '/master-data/products', icon: 'inventory_2' },
      { name: 'Pelanggan', href: '/master-data/customers', icon: 'groups' },
      { name: 'Supplier', href: '/master-data/suppliers', icon: 'local_shipping' },
      { name: 'PIC Internal', href: '/master-data/internal-pics', icon: 'badge' },
    ]
  },
  { 
    name: 'Sales', 
    href: '/sales', 
    icon: 'shopping_cart',
    children: [
      { name: 'Quotation (SPH)', href: '/sales/quotations', icon: 'description' },
      { name: 'Sales Order', href: '/sales/sales-orders', icon: 'receipt' },
      { name: 'Surat Jalan', href: '/sales/delivery-orders', icon: 'local_shipping' },
      { name: 'Invoice', href: '/sales/invoices', icon: 'request_quote' },
      { name: 'Kwitansi', href: '/sales/receipts', icon: 'payments' },
    ]
  },
  { name: 'Settings', href: '/settings', icon: 'settings' },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("fixed left-0 top-0 h-full w-64 bg-slate-50 flex flex-col border-r border-slate-100", className)}>
      {/* Logo */}
      <div className="px-6 py-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 primary-gradient rounded-lg flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
          </div>
          <div>
            <h1 className="font-black text-blue-900 leading-none" style={{ fontFamily: 'var(--font-headline)' }}>ERP RRI</h1>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Enterprise Resource</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  item.children
                    ? "text-slate-600 hover:bg-blue-50"
                    : isActive
                    ? "bg-white text-blue-700 shadow-sm font-bold"
                    : "text-slate-600 hover:bg-blue-50"
                )
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
            
            {/* Submenu */}
            {item.children && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.name}
                    to={child.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
                        isActive
                          ? "bg-white text-blue-700 shadow-sm font-semibold"
                          : "text-slate-500 hover:text-slate-700 hover:bg-blue-50/50"
                      )
                    }
                  >
                    <span className="material-symbols-outlined text-lg">{child.icon}</span>
                    <span>{child.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Entry</span>
        </button>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined">help</span>
          <span className="text-sm font-medium">Help Center</span>
        </a>
      </div>
    </aside>
  )
}
