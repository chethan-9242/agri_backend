"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, MapPin, Calendar, User, Truck, Store, CheckCircle, ShieldCheck } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { batches } = useData()
  const [isPriceOpen, setIsPriceOpen] = useState(true)

  // Find batch by ID
  const batch = batches.find((b) => b.id === Number(id))

  // Fallback/Mock data if batch not found (or for demo purposes if ID doesn't match)
  if (!batch) {
    return (
      <DashboardLayout role="consumer">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Determine image based on crop name if placeholder
  let displayImage = batch.imageUrl
  if (batch.imageUrl === "/placeholder.svg" || !batch.imageUrl) {
    const cropLower = batch.cropName.toLowerCase()
    if (cropLower.includes("tomato"))
      displayImage = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80"
    else if (cropLower.includes("potato"))
      displayImage = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80"
    else if (cropLower.includes("mango"))
      displayImage = "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80"
    else if (cropLower.includes("onion"))
      displayImage = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1200&q=80"
    else if (cropLower.includes("rice"))
      displayImage = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80"
  }

  const price = batch.price || 45 // Default price if not set

  const journey = [
    {
      stage: "Harvested",
      date: new Date(batch.createdAt).toLocaleString(),
      location: "Farm",
      icon: User,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      verified: true,
    },
    {
      stage: "Quality Check",
      date: new Date(new Date(batch.createdAt).getTime() + 3600000).toLocaleString(), // +1 hour
      location: "AI Analysis",
      icon: ShieldCheck,
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      verified: true,
      detail: batch.aiAnalysis ? `Grade: ${batch.aiAnalysis.quality}` : "Verified",
    },
    // Conditionally add other stages based on status
    ...(batch.status !== "Created"
      ? [
          {
            stage: "Transport",
            date: "In Transit",
            location: "Logistics",
            icon: Truck,
            hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
            verified: true,
          },
        ]
      : []),
    ...(batch.status === "Accepted" || batch.status === "Delivered to Retailer"
      ? [
          {
            stage: "At Store",
            date: "Retailer Inventory",
            location: "Retail Store",
            icon: Store,
            hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
            verified: true,
          },
        ]
      : []),
  ]

  return (
    <DashboardLayout role="consumer">
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <img src={displayImage || "/placeholder.svg"} alt={batch.cropName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-green-500 hover:bg-green-600 border-none text-white">
                  {batch.aiAnalysis?.freshness || "Fresh"}
                </Badge>
                <Badge variant="outline" className="text-white border-white/50">
                  Grade {batch.aiAnalysis?.quality || "A"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{batch.cropName}</h1>
              <p className="flex items-center gap-2 mt-2 text-white/90">
                <MapPin className="h-4 w-4" /> Origin: Farmer #{batch.farmerId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-2 border-[#0F7A5D]/10 overflow-hidden">
              <CardHeader className="bg-[#0F7A5D]/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0F7A5D]" />
                    Verified Provenance
                  </CardTitle>
                  <Badge variant="outline" className="border-[#0F7A5D] text-[#0F7A5D]">
                    Blockchain Secured
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-6 relative">
                    {/* Connector Line */}
                    <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-gray-200" />

                    <div className="space-y-8 relative">
                      {journey.map((event, index) => (
                        <div key={index} className="flex gap-4 relative">
                          <div className="relative z-10 flex-none">
                            <div className="h-10 w-10 rounded-full bg-white border-2 border-[#0F7A5D] flex items-center justify-center text-[#0F7A5D] shadow-sm">
                              <event.icon className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{event.stage}</h4>
                              <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                {event.hash}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Calendar className="h-3.5 w-3.5" />
                              {event.date}
                              <span className="text-gray-300">•</span>
                              <MapPin className="h-3.5 w-3.5" />
                              {event.location}
                            </div>
                            {event.detail && (
                              <Badge variant="secondary" className="mb-2 bg-green-50 text-green-700 border-green-200">
                                {event.detail}
                              </Badge>
                            )}
                            {event.verified && (
                              <div className="flex items-center gap-1 text-xs text-[#0F7A5D] font-medium">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Blockchain Verified
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>About this Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  High-quality {batch.cropName.toLowerCase()} harvested with care.
                  {batch.aiAnalysis?.quality === "excellent"
                    ? " This batch has been rated Excellent by our AI quality control system."
                    : ""}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Harvest Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {batch.harvestDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Batch ID</p>
                    <p className="font-medium">{batch.batchCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Farmer ID</p>
                    <p className="font-medium">#{batch.farmerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quality Score</p>
                    <p className="font-medium text-green-600">{batch.aiAnalysis?.confidence || 90}/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Current Price</p>
                  <div className="text-4xl font-bold text-gray-900">₹{price}</div>
                  <p className="text-sm text-gray-400">per kg</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full py-6 text-lg gap-2 font-semibold shadow-sm hover:shadow-md transition-all">
                      <QrCode className="h-5 w-5" />
                      Show QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center">Scan to Verify</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://farmtrace.com/verify/${batch.id}`)}`}
                          alt="Product QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-500 max-w-xs">
                        Scan this code to view the complete blockchain history and verify authenticity.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Verified Origin</p>
                      <p className="text-xs text-green-700 mt-1">This product has been verified on the blockchain.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
