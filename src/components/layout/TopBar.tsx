import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  className?: string
}

export function TopBar({ className }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className={cn("fixed top-0 left-64 right-0 z-40 h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex justify-between items-center px-8 shadow-[0_4px_20px_-10px_rgba(11,28,48,0.04)]", className)}>
      {/* Left side */}
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-[#0b1c30]" style={{ fontFamily: 'var(--font-headline)' }}>ERP RRI System</span>
        
        {/* Search */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            placeholder="Search data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <a className="text-[#424752] hover:text-[#0b1c30] transition-colors" href="#">Analytics</a>
          <a className="text-[#00478d] border-b-2 border-[#00478d] pb-1" href="#">Reporting</a>
          <a className="text-[#424752] hover:text-[#0b1c30] transition-colors" href="#">Archives</a>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-100"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface leading-none">Admin RRI</p>
            <p className="text-[10px] text-on-surface-variant">Super User</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs">
            AR
          </div>
        </div>
      </div>
    </header>
  )
}
