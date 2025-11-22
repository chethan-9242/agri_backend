"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Leaf, LayoutDashboard, Package, Bell, Settings, LogOut, Menu, Blocks } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardLayoutProps {
  children: ReactNode
  role: "farmer" | "distributor" | "retailer" | "consumer"
}

const roleColors = {
  farmer: "bg-[#0F7A5D]",
  distributor: "bg-blue-600",
  retailer: "bg-purple-600",
  consumer: "bg-[#F9A826]",
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const navigation = {
    farmer: [
      { name: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
      { name: "Batches", href: "/farmer/batches", icon: Package },
      { name: "Alerts", href: "/farmer/alerts", icon: Bell },
      { name: "Blockchain Ledger", href: "/blockchain", icon: Blocks },
    ],
    distributor: [
      { name: "Dashboard", href: "/distributor/dashboard", icon: LayoutDashboard },
      { name: "Available Batches", href: "/distributor/incoming", icon: Package },
      { name: "Blockchain Ledger", href: "/blockchain", icon: Blocks },
    ],
    retailer: [
      { name: "Dashboard", href: "/retailer/dashboard", icon: LayoutDashboard },
      { name: "Incoming Batches", href: "/retailer/incoming", icon: Package },
      { name: "Blockchain Ledger", href: "/blockchain", icon: Blocks },
    ],
    consumer: [
      { name: "Products", href: "/consumer/products", icon: Package },
      { name: "Blockchain Ledger", href: "/blockchain", icon: Blocks },
    ],
  }

  const navItems = navigation[role]

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
          <div className={`${roleColors[role]} text-white p-1.5 rounded-md`}>
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">FarmTrace</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
            <div className={`${roleColors[role]} text-white p-1 rounded-md`}>
              <Leaf className="h-4 w-4" />
            </div>
            <span className="font-bold">FarmTrace</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-screen">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b">
            <h1 className="text-lg font-semibold capitalize">{role} Portal</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
