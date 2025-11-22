"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, AlertCircle, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

// ... existing mockBatches ...
const mockBatches = [
  {
    id: 1,
    crop: "Tomato",
    quantity: 120,
    status: "Created",
    date: "2025-11-20",
    freshness: "Very Fresh",
    confidence: 95,
  },
  {
    id: 2,
    crop: "Potato",
    quantity: 200,
    status: "In Transit",
    date: "2025-11-18",
    freshness: "Fresh",
    confidence: 88,
  },
  { id: 3, crop: "Mango", quantity: 85, status: "Delivered", date: "2025-11-15", freshness: "Fresh", confidence: 92 },
]

const mockAlerts = [
  { id: 1, type: "Quality Check", message: "Batch #1023 quality analysis complete", severity: "info" },
  { id: 2, type: "Price Alert", message: "Tomato prices below market average", severity: "warning" },
]

const yieldData = [
  { month: "Jan", yield: 4000 },
  { month: "Feb", yield: 3000 },
  { month: "Mar", yield: 5000 },
  { month: "Apr", yield: 4500 },
  { month: "May", yield: 6000 },
  { month: "Jun", yield: 7500 },
]

const qualityData = [
  { batch: "B-101", score: 85 },
  { batch: "B-102", score: 92 },
  { batch: "B-103", score: 88 },
  { batch: "B-104", score: 95 },
  { batch: "B-105", score: 82 },
]

export default function FarmerDashboard() {
  // ... existing auth logic ...
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || user?.role !== "farmer")) {
      router.push("/auth/login?role=farmer")
    }
  }, [isAuthenticated, user, router, isLoading, mounted])

  if (!mounted || isLoading || !isAuthenticated || user?.role !== "farmer") {
    return null
  }

  return (
    <DashboardLayout role="farmer">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your harvests today.</p>
          </div>
          <Link href="/farmer/batches/new">
            <Button size="lg" className="gap-2 bg-[#0F7A5D] hover:bg-[#0F7A5D]/90">
              <Plus className="h-5 w-5" />
              Create New Batch
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Batches" value={mockBatches.length} icon={Package} iconColor="text-primary" />
          <StatCard
            title="Active Batches"
            value={mockBatches.filter((b) => b.status !== "Delivered").length}
            icon={TrendingUp}
            iconColor="text-blue-600"
            trend={{ value: "12% from last month", isPositive: true }}
          />
          <StatCard title="Alerts" value={mockAlerts.length} icon={AlertCircle} iconColor="text-accent" />
          <StatCard
            title="Earnings (Est.)"
            value="₹45,000"
            icon={DollarSign}
            iconColor="text-green-600"
            trend={{ value: "8% from last month", isPositive: true }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Harvest Yield Trends</CardTitle>
              <CardDescription>Monthly production in kg over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F7A5D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F7A5D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="yield" stroke="#0F7A5D" fillOpacity={1} fill="url(#colorYield)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Batch Quality</CardTitle>
              <CardDescription>AI-verified quality scores for recent harvests.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="batch" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#F9A826" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <Card>
          {/* ... existing card header ... */}
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Your latest harvest batches and their status</CardDescription>
            </div>
            <Link href="/farmer/batches">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{batch.crop}</h3>
                        <Badge variant={batch.status === "Delivered" ? "secondary" : "default"} className="text-xs">
                          {batch.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {batch.quantity} kg • {batch.date}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">AI Quality:</span>
                        <span className="text-xs font-medium text-primary">
                          {batch.freshness} ({batch.confidence}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/farmer/batches/${batch.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Important notifications about your batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
