'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck,
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from "@/components/ui/scroll-top"
import { useAuth } from '@/lib/hooks/use-auth'
import { useState } from 'react'

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    title: 'Overview',
    items: [
      { 
        title: 'Dashboard', 
        href: '/dashboard', 
        icon: LayoutDashboard,
        roles: ['buyer', 'seller', 'driver', 'company']
      },
    ],
  },
  {
    title: 'Shopping',
    items: [
      { 
        title: 'Products', 
        href: '/products', 
        icon: Package,
        roles: ['buyer', 'seller', 'driver', 'company']
      },
      { 
        title: 'Cart', 
        href: '/cart', 
        icon: ShoppingCart,
        roles: ['buyer']
      },
      { 
        title: 'Orders', 
        href: '/orders', 
        icon: Truck,
        roles: ['buyer', 'seller', 'driver', 'company']
      },
    ],
  },
  {
    title: 'Management',
    items: [
      { 
        title: 'My Products', 
        href: '/seller/products', 
        icon: Package,
        roles: ['seller']
      },
      { 
        title: 'Deliveries', 
        href: '/driver/confirm-delivery', 
        icon: Truck,
        roles: ['driver']
      },
      { 
        title: 'Invitations', 
        href: '/driver/invitations', 
        icon: Users,
        roles: ['driver']
      },
      { 
        title: 'Company Dashboard', 
        href: '/company/confirm-package', 
        icon: LayoutDashboard,
        roles: ['company']
      },
      { 
        title: 'Marketplace Orders', 
        href: '/company/marketplace-orders', 
        icon: Truck,
        roles: ['company']
      },
      { 
        title: 'Drivers', 
        href: '/company/drivers', 
        icon: Users,
        roles: ['company']
      },
      { 
        title: 'Driver Directory', 
        href: '/company/driver-directory', 
        icon: Users,
        roles: ['company']
      },
    ],
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNavigation = navigation.map(section => ({
    ...section,
    items: section.items.filter(item => 
      user?.role && item.roles.includes(user.role)
    )
  })).filter(section => section.items.length > 0)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
          collapsed ? '-translate-x-full md:w-16' : 'w-64',
          'md:translate-x-0',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">Alaba</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex"
            >
              <ChevronLeft className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )} />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-6">
              {filteredNavigation.map((section) => (
                <div key={section.title}>
                  {!collapsed && (
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || 
                        pathname.startsWith(item.href + '/')
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            collapsed && 'justify-center'
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3">
            {!collapsed && user && (
              <div className="mb-3 rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">{user.firstName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-xs capitalize text-primary">
                  {user.role}
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              <Link
                href="/settings"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center'
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Settings</span>}
              </Link>
              
              <button
                onClick={logout}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center'
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  )
}

