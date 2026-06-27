import { useNavigate } from 'react-router-dom'
import { Bell, Search, Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { clearAuthUser, getAuthUser, defaultAuthUser } from '@/lib/auth'

interface TopbarProps {
  onMenuClick: () => void
  sidebarCollapsed: boolean
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate()
  const user = getAuthUser() ?? defaultAuthUser

  const handleLogout = () => {
    clearAuthUser()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-white/95 backdrop-blur-md px-4 lg:px-6 shadow-sm">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mines, reports, recommendations..."
          className="pl-10 bg-card-muted border-border"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:flex items-center gap-3 pl-3 border-l border-border outline-none rounded-lg hover:bg-card-muted/60 px-2 py-1.5 transition-colors">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role} · {user.mine}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light border border-sky-200">
                <User className="h-4 w-4 text-primary" />
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Signed in as {user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-danger focus:text-danger">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-danger focus:text-danger">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
