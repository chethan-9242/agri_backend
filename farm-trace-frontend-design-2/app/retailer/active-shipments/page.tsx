"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Box, Tag } from "lucide-react"
import { useData } from "@/lib/data-context"
import Link from "next/link"

export default function RetailerActiveShipmentsPage() {
  const { batches } = useData()

  // Filter batches that are accepted/in inventory
  const activeShipments = batches.filter(
    (batch) => batch.status === "Accepted" || batch.status === "Delivered to Retailer",
  )

  return (
    <DashboardLayout role="retailer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Active Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your stock and update pricing</p>
        </div>

        {activeShipments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Box className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No active inventory</p>
              <p className="text-gray-500">Accept deliveries to see them here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeShipments.map((batch) => (
              <Card key={batch.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Box className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">{batch.cropName}</h3>
                          <Badge variant="outline">{batch.batchCode}</Badge>
                          <Badge className="bg-green-600">In Stock</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Quantity: {batch.quantity} {batch.unit}
                        </p>
                        <p className="text-sm text-gray-600">Price: {batch.price ? `₹${batch.price}/kg` : "Not Set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/retailer/inventory/update-price/${batch.id}`}>
                        <Button variant="outline" className="w-full md:w-auto gap-2 bg-transparent">
                          <Tag className="h-4 w-4" />
                          Update Price
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
