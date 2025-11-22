"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Package, Calendar, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data fetch based on ID
const getBatchDetails = (id: string) => ({
  id,
  batch_code: "BT001",
  crop: "Tomato",
  quantity: 120,
  origin: "Nashik Farm",
  farmer: "Ravi Kumar",
  farmer_contact: "+91 98765 43210",
  date: "2025-11-20",
  status: "Ready for Pickup",
})

export default function PickupDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [batch, setBatch] = useState(getBatchDetails(id))
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [driverName, setDriverName] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setBatch(getBatchDetails(id))
  }, [id])

  const handlePickup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!vehicleNumber || !driverName || !pickupTime) {
      toast({
        title: "Missing Details",
        description: "Please fill in all transport details to confirm pickup.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Pickup Scheduled",
      description: `Pickup for Batch ${batch.batch_code} confirmed with vehicle ${vehicleNumber}.`,
    })

    router.push("/distributor/dashboard")
  }

  return (
    <DashboardLayout role="distributor">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Confirm Pickup</h1>
          <p className="text-gray-500 mt-1">Assign vehicle and driver for this batch</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Batch Info */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Batch Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{batch.crop}</h3>
                  <Badge variant="outline" className="mt-1">
                    {batch.batch_code}
                  </Badge>
                </div>
                <Badge className="bg-green-600">Ready</Badge>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{batch.farmer}</p>
                    <p className="text-xs text-gray-500">{batch.farmer_contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{batch.origin}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span>{batch.quantity} kg</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>Ready since {batch.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Form */}
          <Card>
            <CardHeader>
              <CardTitle>Transport Details</CardTitle>
              <CardDescription>Enter logistics information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePickup} className="space-y-4">
                <div>
                  <Label htmlFor="vehicle">Vehicle Number *</Label>
                  <div className="relative mt-1">
                    <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="vehicle"
                      placeholder="MH 15 AB 1234"
                      className="pl-9"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="driver">Driver Name *</Label>
                  <Input
                    id="driver"
                    placeholder="Driver name"
                    className="mt-1"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Pickup Time *</Label>
                  <Input
                    id="time"
                    type="datetime-local"
                    className="mt-1"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Confirming..." : "Confirm Pickup"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
