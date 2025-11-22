"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const getShipmentDetails = (id: string) => ({
  id,
  batch_code: "BT002",
  crop: "Potato",
  quantity: 200,
  origin: "Nashik",
  destination: "Mumbai Warehouse",
  status: "In Transit",
  driver: "Rajesh Kumar",
  vehicle: "MH 15 XY 9876",
  pickup_time: "2025-11-21 10:00 AM",
  logs: [
    { status: "Picked Up", time: "2025-11-21 10:00 AM", location: "Nashik Farm" },
    { status: "In Transit", time: "2025-11-21 12:30 PM", location: "Highway 60" },
  ],
})

export default function ShipmentStatusPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [shipment, setShipment] = useState(getShipmentDetails(id))

  useEffect(() => {
    setShipment(getShipmentDetails(id))
  }, [id])

  const [status, setStatus] = useState(shipment.status)
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Status Updated",
      description: `Shipment marked as ${status}.`,
    })

    setIsUpdating(false)
    // Ideally refresh data or redirect if delivered
    if (status === "Delivered") {
      router.push("/distributor/dashboard")
    }
  }

  return (
    <DashboardLayout role="distributor">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Shipment</h1>
            <p className="text-gray-500 mt-1">Update status and location logs</p>
          </div>
          <Badge className="text-lg px-4 py-1 bg-blue-600">{shipment.status}</Badge>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="At Warehouse">Reached Warehouse</SelectItem>
                      <SelectItem value="Delivered">Delivered to Retailer</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Current Location</Label>
                  <Input
                    placeholder="e.g. Mumbai Outskirts"
                    className="mt-1"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Notes / Remarks</Label>
                <Textarea
                  placeholder="Any incidents or checks during transit..."
                  className="mt-1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button className="w-full md:w-auto" onClick={handleUpdate} disabled={isUpdating || !location}>
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Batch Code</span>
                  <span className="font-medium">{shipment.batch_code}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Crop</span>
                  <span className="font-medium">{shipment.crop}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium">{shipment.quantity} kg</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-medium">{shipment.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Driver</span>
                  <span className="font-medium">{shipment.driver}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative pl-4 border-l-2 border-gray-100">
                  {shipment.logs.map((log, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{log.status}</span>
                        <span className="text-sm text-gray-500">{log.location}</span>
                        <span className="text-xs text-gray-400 mt-1">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
