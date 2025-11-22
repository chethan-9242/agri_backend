"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, TrendingUp, ExternalLink } from "lucide-react"
import Link from "next/link"

const mockBatch = {
  id: 1,
  batch_code: "BT001",
  crop: "Tomato",
  quantity: 120,
  unit: "kg",
  status: "In Transit",
  harvest_date: "2025-11-20",
  created_at: "2025-11-20 09:30:00",
  blockchain_txn: "0x7f9a8d...3e4c2b",
  farmer_price: 35,
  ai_quality: {
    freshness: "Very Fresh",
    confidence: 95,
    damage: "None detected",
    spoilage: "None",
  },
  timeline: [
    { event: "Batch Created", date: "2025-11-20 09:30", status: "completed" },
    { event: "AI Quality Check", date: "2025-11-20 09:35", status: "completed" },
    { event: "Picked up by Distributor", date: "2025-11-20 14:00", status: "completed" },
    { event: "In Transit", date: "2025-11-21 08:00", status: "in-progress" },
    { event: "Delivered to Retailer", date: "Pending", status: "pending" },
  ],
}

export default function BatchDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/farmer/batches" className="hover:text-primary">
            Batches
          </Link>
          <span>/</span>
          <span className="text-gray-900">{mockBatch.batch_code}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{mockBatch.crop}</h1>
              <Badge>{mockBatch.status}</Badge>
            </div>
            <p className="text-gray-500 mt-1">{mockBatch.batch_code}</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <ExternalLink className="h-4 w-4" />
            View on Blockchain
          </Button>
        </div>

        {/* Batch Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Crop Name</span>
                <span className="font-medium">{mockBatch.crop}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Quantity</span>
                <span className="font-medium">
                  {mockBatch.quantity} {mockBatch.unit}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Harvest Date</span>
                <span className="font-medium">{mockBatch.harvest_date}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Farmer Price</span>
                <span className="font-medium">₹{mockBatch.farmer_price}/kg</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">Blockchain TX</span>
                <span className="font-mono text-xs text-gray-700">{mockBatch.blockchain_txn}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Freshness</span>
                <Badge variant="default" className="bg-green-600">
                  {mockBatch.ai_quality.freshness}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Confidence Score</span>
                <span className="font-medium">{mockBatch.ai_quality.confidence}%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-500">Damage</span>
                <span className="font-medium text-green-600">{mockBatch.ai_quality.damage}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">Spoilage</span>
                <span className="font-medium text-green-600">{mockBatch.ai_quality.spoilage}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Batch Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockBatch.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : event.status === "in-progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {event.status === "completed" && <CheckCircle className="h-5 w-5" />}
                      {event.status === "in-progress" && <TrendingUp className="h-5 w-5" />}
                      {event.status === "pending" && <Calendar className="h-5 w-5" />}
                    </div>
                    {index < mockBatch.timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${event.status === "completed" ? "bg-green-200" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-gray-900">{event.event}</p>
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
