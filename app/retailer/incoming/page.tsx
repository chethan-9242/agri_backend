"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

const mockIncoming = [
  {
    id: 4,
    batch_code: "BT004",
    crop: "Onion",
    quantity: 150,
    origin: "Pune",
    farmer: "Amit Deshmukh",
    eta: "Today",
    status: "At Warehouse",
  },
  {
    id: 8,
    batch_code: "BT008",
    crop: "Potato",
    quantity: 200,
    origin: "Nashik",
    farmer: "Ravi Kumar",
    eta: "Tomorrow",
    status: "In Transit",
  },
  {
    id: 9,
    batch_code: "BT009",
    crop: "Rice",
    quantity: 500,
    origin: "Konkan",
    farmer: "Suresh Patil",
    eta: "2 Days",
    status: "In Transit",
  },
]

export default function RetailerIncomingPage() {
  return (
    <DashboardLayout role="retailer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Incoming Deliveries</h1>
          <p className="text-gray-500 mt-1">Review and accept incoming batch deliveries</p>
        </div>

        <div className="grid gap-4">
          {mockIncoming.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{batch.crop}</h3>
                        <Badge variant="outline">{batch.batch_code}</Badge>
                        <Badge className={batch.status === "At Warehouse" ? "bg-yellow-600" : "bg-blue-600"}>
                          {batch.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {batch.origin} ({batch.farmer})
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          ETA: {batch.eta}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/retailer/incoming/${batch.id}`}>
                      <Button className="w-full md:w-auto">Accept Delivery</Button>
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
