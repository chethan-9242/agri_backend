"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, MapPin, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

// ... existing mock data ...
const mockActiveShipments = [
  {
    id: 1,
    batch_code: "BT002",
    crop: "Potato",
    quantity: 200,
    origin: "Nashik",
    destination: "Mumbai Warehouse",
    status: "In Transit",
    eta: "4 hours",
  },
  {
    id: 4,
    batch_code: "BT004",
    crop: "Onion",
    quantity: 150,
    origin: "Pune",
    destination: "Nagpur Retailer",
    status: "At Warehouse",
    eta: "1 day",
  },
]

const mockIncomingRequests = [
  {
    id: 1,
    batch_code: "BT001",
    crop: "Tomato",
    quantity: 120,
    origin: "Nashik Farm",
    farmer: "Ravi Kumar",
    date: "2025-11-20",
  },
  {
    id: 5,
    batch_code: "BT005",
    crop: "Mango",
    quantity: 300,
    origin: "Ratnagiri",
    farmer: "Suresh Patil",
    date: "2025-11-22",
  },
]

const deliveryData = [
  { day: "Mon", deliveries: 12 },
  { day: "Tue", deliveries: 19 },
  { day: "Wed", deliveries: 15 },
  { day: "Thu", deliveries: 22 },
  { day: "Fri", deliveries: 28 },
  { day: "Sat", deliveries: 10 },
  { day: "Sun", deliveries: 5 },
]

const fleetStatusData = [
  { name: "On Route", value: 8, color: "#3b82f6" },
  { name: "Loading", value: 4, color: "#f59e0b" },
  { name: "Idle", value: 3, color: "#10b981" },
  { name: "Maintenance", value: 1, color: "#ef4444" },
]

export default function DistributorDashboard() {
  // ... existing auth logic ...
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || user?.role !== "distributor")) {
      router.push("/auth/login?role=distributor")
    }
  }, [isAuthenticated, user, router, isLoading, mounted])

  if (!mounted || isLoading || !isAuthenticated || user?.role !== "distributor") {
    return null
  }

  return (
    <DashboardLayout role="distributor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Logistics Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your fleet and track active shipments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Shipments"
            value={mockActiveShipments.length}
            icon={Truck}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Pending Pickups"
            value={mockIncomingRequests.length}
            icon={Clock}
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Completed Trips"
            value="142"
            icon={CheckCircle}
            iconColor="text-green-600"
            trend={{ value: "24 this month", isPositive: true }}
          />
          <StatCard title="Total Distance" value="12.5k km" icon={MapPin} iconColor="text-purple-600" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Delivery Volume</CardTitle>
              <CardDescription>Number of completed deliveries over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="deliveries" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Fleet Status</CardTitle>
              <CardDescription>Current operational status of your vehicles.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fleetStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {fleetStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 flex flex-col justify-center h-full text-sm space-y-2">
                {fleetStatusData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Shipments */}
          <Card>
            {/* ... existing content ... */}
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Shipments</CardTitle>
                <CardDescription>Currently in transit</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActiveShipments.map((shipment) => (
                  <div key={shipment.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{shipment.batch_code}</h4>
                          <Badge
                            variant={shipment.status === "In Transit" ? "default" : "secondary"}
                            className={shipment.status === "In Transit" ? "bg-blue-600" : ""}
                          >
                            {shipment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {shipment.crop} • {shipment.quantity} kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500">ETA</p>
                        <p className="text-sm font-bold text-gray-900">{shipment.eta}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{shipment.origin}</span>
                      <span className="text-gray-300">→</span>
                      <span>{shipment.destination}</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/distributor/shipments/${shipment.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          Update Status
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pickup Requests */}
          <Card>
            {/* ... existing content ... */}
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pickup Requests</CardTitle>
                <CardDescription>Batches ready for collection</CardDescription>
              </div>
              <Link href="/distributor/incoming">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIncomingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-yellow-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {request.crop} ({request.quantity} kg)
                        </h4>
                        <p className="text-sm text-gray-500">
                          {request.farmer} • {request.origin}
                        </p>
                      </div>
                    </div>
                    <Link href={`/distributor/incoming/${request.id}`}>
                      <Button size="sm">Pickup</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
