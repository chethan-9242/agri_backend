"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, ShoppingBag, AlertCircle, IndianRupee } from "lucide-react"
import Link from "next/link"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// ... existing mock data ...
const mockInventory = [
  {
    id: 3,
    batch_code: "BT003",
    crop: "Mango",
    quantity: 85,
    price: 180,
    stock_left: 45,
    freshness: "Good",
    status: "Selling",
  },
  {
    id: 7,
    batch_code: "BT007",
    crop: "Tomato",
    quantity: 150,
    price: 40,
    stock_left: 120,
    freshness: "Excellent",
    status: "Selling",
  },
]

const mockIncoming = [
  { id: 4, batch_code: "BT004", crop: "Onion", quantity: 150, origin: "Pune", eta: "Today" },
  { id: 8, batch_code: "BT008", crop: "Potato", quantity: 200, origin: "Nashik", eta: "Tomorrow" },
]

const salesData = [
  { category: "Vegetables", sales: 4500, margin: 1200 },
  { category: "Fruits", sales: 5200, margin: 1500 },
  { category: "Dairy", sales: 3800, margin: 800 },
  { category: "Grains", sales: 2400, margin: 600 },
]

export default function RetailerDashboard() {
  // ... existing auth logic ...
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || user?.role !== "retailer")) {
      router.push("/auth/login?role=retailer")
    }
  }, [isAuthenticated, user, router, isLoading, mounted])

  if (!mounted || isLoading || !isAuthenticated || user?.role !== "retailer") {
    return null
  }

  return (
    <DashboardLayout role="retailer">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage inventory, pricing, and sales</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Stock" value={mockInventory.length} icon={Store} iconColor="text-purple-600" />
          <StatCard
            title="Daily Sales"
            value="₹12,450"
            icon={IndianRupee}
            iconColor="text-green-600"
            trend={{ value: "15% vs yesterday", isPositive: true }}
          />
          <StatCard title="Incoming Orders" value={mockIncoming.length} icon={ShoppingBag} iconColor="text-blue-600" />
          <StatCard title="Low Stock Items" value="2" icon={AlertCircle} iconColor="text-red-600" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sales vs Margin by Category</CardTitle>
              <CardDescription>Performance analysis of current inventory categories.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} prefix="$" />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="sales" fill="#9333ea" radius={[4, 4, 0, 0]} name="Total Sales" />
                  <Bar dataKey="margin" fill="#d8b4fe" radius={[4, 4, 0, 0]} name="Profit Margin" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Inventory */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Current Inventory</CardTitle>
                <CardDescription>Stock levels and pricing</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Manage All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{item.crop}</h4>
                          <Badge variant="outline">{item.batch_code}</Badge>
                        </div>
                        <div className="flex gap-4 mt-1 text-sm text-gray-500">
                          <span>
                            Stock: {item.stock_left}/{item.quantity} kg
                          </span>
                          <span>Price: ₹{item.price}/kg</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/retailer/batches/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Update Price
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Incoming Shipments */}
          <Card>
            {/* ... existing content ... */}
            <CardHeader>
              <CardTitle>Incoming Shipments</CardTitle>
              <CardDescription>Batches arriving soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIncoming.map((item) => (
                  <div key={item.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.crop}</h4>
                      <Badge className="bg-blue-600">In Transit</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.quantity} kg from {item.origin}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-800">ETA: {item.eta}</span>
                      <Link href={`/retailer/incoming/${item.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <Link href="/retailer/incoming" className="block">
                  <Button variant="outline" className="w-full border-dashed bg-transparent">
                    View All Incoming
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
