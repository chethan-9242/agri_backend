"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Calendar } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useToast } from "@/hooks/use-toast"

export default function RetailerIncomingPage() {
  const { batches, updateBatchStatus } = useData()
  const { toast } = useToast()

  // Filter batches that are relevant to retailer incoming
  const incomingBatches = batches.filter((batch) => batch.status === "In Transit" || batch.status === "At Warehouse")

  const handleAcceptDelivery = async (id: number) => {
    try {
      await updateBatchStatus(id, "Accepted")
      toast({
        title: "Delivery Accepted",
        description: "The batch has been added to your inventory.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept delivery.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout role="retailer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Incoming Deliveries</h1>
          <p className="text-gray-500 mt-1">Review and accept incoming batch deliveries</p>
        </div>

        {incomingBatches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Truck className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No incoming deliveries</p>
              <p className="text-gray-500">New shipments will appear here when they are on the way.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {incomingBatches.map((batch) => (
              <Card key={batch.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Truck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">{batch.cropName}</h3>
                          <Badge variant="outline">{batch.batchCode}</Badge>
                          <Badge className={batch.status === "At Warehouse" ? "bg-yellow-600" : "bg-blue-600"}>
                            {batch.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            Origin: Farmer #{batch.farmerId}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            Harvest: {batch.harvestDate}
                          </div>
                        </div>
                        {batch.status === "In Transit" && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded w-fit">
                            <Truck className="h-3 w-3" />
                            On the way - Cannot accept yet
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleAcceptDelivery(batch.id)}
                        disabled={batch.status === "In Transit"}
                        className="w-full md:w-auto"
                      >
                        Accept Delivery
                      </Button>
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
