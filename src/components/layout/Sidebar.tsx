import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Brain,
  Layers,
  Lightbulb,
  FlaskConical,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mountain,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/prediction', label: 'Quality Prediction', icon: Brain },
  { to: '/blend', label: 'Blend Optimization', icon: Layers },
  { to: '/decisions', label: 'Decision Intelligence', icon: Lightbulb },
  { to: '/simulator', label: 'Scenario Simulator', icon: FlaskConical },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
          <Mountain className="h-5 w-5 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-base font-bold text-foreground">Carbon</span>
              <span className="text-base font-light text-primary ml-0.5">Cortex</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-light text-primary border border-sky-200'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-muted'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-3 mt-auto">
        {!collapsed && (
          <div className="mb-3 rounded-lg bg-card-muted px-3 py-2.5">
            <p className="text-xs font-medium text-foreground">SECL · Bilaspur</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">v2.4.1 · Enterprise</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex fixed left-0 top-0 z-30 h-screen flex-col border-r border-border bg-white shadow-sm"
      >
        {sidebarContent}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-50 h-screen w-[260px] flex-col border-r border-border bg-white shadow-xl lg:hidden flex"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
