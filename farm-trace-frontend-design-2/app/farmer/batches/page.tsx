"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import Link from "next/link"
import { useData } from "@/lib/data-context"

export default function FarmerBatchesPage() {
  const { batches } = useData()

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
          {batches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">{batch.cropName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {batch.batchCode}
                        </Badge>
                        <Badge variant={batch.status === "Delivered to Retailer" ? "secondary" : "default"}>
                          {batch.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {batch.quantity} {batch.unit} • Harvested {batch.harvestDate}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Status:</span>
                        <span className="text-xs font-medium text-primary">{batch.status}</span>
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
          {batches.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No batches yet</h3>
              <p className="text-gray-500 mt-1">Create your first harvest batch to get started.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
