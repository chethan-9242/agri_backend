"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import Link from "next/link"

const mockBatches = [
  {
    id: 1,
    batch_code: "BT001",
    crop: "Tomato",
    quantity: 120,
    status: "Created",
    date: "2025-11-20",
    freshness: "Very Fresh",
    confidence: 95,
  },
  {
    id: 2,
    batch_code: "BT002",
    crop: "Potato",
    quantity: 200,
    status: "In Transit",
    date: "2025-11-18",
    freshness: "Fresh",
    confidence: 88,
  },
  {
    id: 3,
    batch_code: "BT003",
    crop: "Mango",
    quantity: 85,
    status: "Delivered",
    date: "2025-11-15",
    freshness: "Fresh",
    confidence: 92,
  },
  {
    id: 4,
    batch_code: "BT004",
    crop: "Onion",
    quantity: 150,
    status: "At Warehouse",
    date: "2025-11-22",
    freshness: "Very Fresh",
    confidence: 97,
  },
]

export default function FarmerBatchesPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Batches</h1>
            <p className="text-gray-500 mt-1">View and manage all your harvest batches</p>
          </div>
          <Link href="/farmer/batches/new">
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              New Batch
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockBatches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">{batch.crop}</h3>
                        <Badge variant="outline" className="text-xs">
                          {batch.batch_code}
                        </Badge>
                        <Badge variant={batch.status === "Delivered" ? "secondary" : "default"}>{batch.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {batch.quantity} kg • Harvested {batch.date}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">AI Quality:</span>
                        <span className="text-xs font-medium text-primary">
                          {batch.freshness} ({batch.confidence}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/farmer/batches/${batch.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
