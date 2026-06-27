import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          'flex flex-col flex-1 min-h-screen min-w-0 transition-all duration-300',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
        )}
      >
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          sidebarCollapsed={collapsed}
        />
        <main className="flex-1 w-full p-6 lg:p-8">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
