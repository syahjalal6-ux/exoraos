import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from '../../features/dashboard/components/DashboardSidebar.jsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-muted">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar onClose={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} />

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen">

        {/* Hamburger button - mobile only */}
        <div className="md:hidden flex items-center px-4 h-14 border-b border-surface-border bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-ink-faint hover:bg-surface-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
