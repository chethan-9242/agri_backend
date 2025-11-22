"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, TrendingUp, ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"

export default function BatchDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { batches, isLoading } = useData()
  const router = useRouter()

  if (isLoading) {
    return (
      <DashboardLayout role="farmer">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  const batch = batches.find((b) => b.id.toString() === id)

  if (!batch) {
    return (
      <DashboardLayout role="farmer">
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Batch Not Found</h1>
          <p className="text-gray-500">The batch you are looking for does not exist.</p>
          <Button asChild>
            <Link href="/farmer/batches">Back to Batches</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const timeline = [
    { event: "Batch Created", date: new Date(batch.createdAt).toLocaleString(), status: "completed" },
    { event: "AI Quality Check", date: new Date(batch.createdAt).toLocaleString(), status: "completed" },
    { event: "Picked up by Distributor", date: "Pending", status: "pending" },
    { event: "In Transit", date: "Pending", status: "pending" },
    { event: "Delivered to Retailer", date: "Pending", status: "pending" },
  ]

  const handleViewBlockchain = () => {
    router.push(`/blockchain?batch=${batch.batchCode}`)
  }

  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/farmer/batches" className="hover:text-primary transition-colors">
            Batches
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{batch.batchCode}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{batch.cropName}</h1>
              <Badge className="text-sm">{batch.status}</Badge>
            </div>
            <p className="text-gray-600 mt-2 font-mono text-sm">Batch Code: {batch.batchCode}</p>
          </div>
          <Button onClick={handleViewBlockchain} className="gap-2 bg-primary hover:bg-primary/90">
            <ExternalLink className="h-4 w-4" />
            View on Blockchain
          </Button>
        </div>

        {/* Batch Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Crop Name</span>
                <span className="font-medium text-gray-900">{batch.cropName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">
                  {batch.quantity} {batch.unit}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Harvest Date</span>
                <span className="font-medium text-gray-900">{batch.harvestDate}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Created On</span>
                <span className="font-medium text-gray-900">{new Date(batch.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-600">Product Image</span>
                {batch.imageUrl && (
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={batch.imageUrl || "/placeholder.svg"}
                      alt={batch.cropName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">AI Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {batch.aiAnalysis ? (
                <>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Freshness</span>
                    <Badge
                      className={
                        batch.aiAnalysis.freshness === "Very Fresh" || batch.aiAnalysis.freshness === "Fresh"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {batch.aiAnalysis.freshness}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Confidence Score</span>
                    <span className="font-medium text-gray-900">{batch.aiAnalysis.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Quality</span>
                    <span className="capitalize font-medium text-gray-900">{batch.aiAnalysis.quality}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-gray-600">Damage</span>
                    <span className="text-sm text-gray-700">{batch.aiAnalysis.damage || "None detected"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Spoilage</span>
                    <span className="text-sm text-gray-700">{batch.aiAnalysis.spoilage || "None detected"}</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <AlertTriangle className="h-8 w-8 mb-2 text-yellow-500" />
                  <p className="text-sm">No AI Analysis available for this batch.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Batch Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        event.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : event.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {event.status === "completed" && <CheckCircle className="h-5 w-5" />}
                      {event.status === "in-progress" && <TrendingUp className="h-5 w-5" />}
                      {event.status === "pending" && <Calendar className="h-5 w-5" />}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 mt-2 ${event.status === "completed" ? "bg-green-200" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="font-semibold text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
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
