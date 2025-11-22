"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

const mockBatches = [
  {
    id: 1,
    batch_code: "BT001",
    crop: "Tomato",
    quantity: 120,
    origin: "Nashik Farm",
    farmer: "Ravi Kumar",
    date: "2025-11-20",
    status: "Ready for Pickup",
  },
  {
    id: 5,
    batch_code: "BT005",
    crop: "Mango",
    quantity: 300,
    origin: "Ratnagiri",
    farmer: "Suresh Patil",
    date: "2025-11-22",
    status: "Ready for Pickup",
  },
  {
    id: 6,
    batch_code: "BT006",
    crop: "Rice",
    quantity: 1000,
    origin: "Konkan",
    farmer: "Anil Deshmukh",
    date: "2025-11-21",
    status: "Ready for Pickup",
  },
]

export default function IncomingBatchesPage() {
  return (
    <DashboardLayout role="distributor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available for Pickup</h1>
          <p className="text-gray-500 mt-1">Batches ready to be transported from farms</p>
        </div>

        <div className="grid gap-4">
          {mockBatches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{batch.crop}</h3>
                        <Badge variant="outline">{batch.batch_code}</Badge>
                        <Badge className="bg-green-600">{batch.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {batch.origin} ({batch.farmer})
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="h-4 w-4 text-gray-400" />
                          {batch.quantity} kg
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Ready since {batch.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/distributor/incoming/${batch.id}`}>
                      <Button className="w-full md:w-auto">Accept Pickup</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
