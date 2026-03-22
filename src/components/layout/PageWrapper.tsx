import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function PageWrapper() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      <main className="ml-64 pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
