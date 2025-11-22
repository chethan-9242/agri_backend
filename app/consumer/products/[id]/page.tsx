"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  QrCode,
  MapPin,
  Calendar,
  User,
  Truck,
  Store,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"

const getProductDetails = (id: string) => ({
  id,
  name: "Organic Tomato",
  farmer: "Ravi Kumar",
  origin: "Nashik, Maharashtra",
  harvest_date: "20 Nov 2025",
  shelf_life: "7 Days",
  price: 40,
  description: "Fresh organic tomatoes grown using sustainable farming practices. Hand-picked at peak ripeness.",
  image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
  freshness_score: 95,
  quality_grade: "A+",
  journey: [
    {
      stage: "Harvested",
      date: "20 Nov 09:30 AM",
      location: "Nashik Farm",
      icon: User,
      hash: "0x7f...3a21",
      verified: true,
    },
    {
      stage: "Quality Check",
      date: "20 Nov 09:35 AM",
      location: "AI Analysis",
      icon: ShieldCheck,
      hash: "0x8a...4b32",
      verified: true,
      detail: "Grade A+ Verified",
    },
    {
      stage: "Transport",
      date: "21 Nov 10:00 AM",
      location: "In Transit",
      icon: Truck,
      hash: "0x9c...5c43",
      verified: true,
    },
    {
      stage: "At Store",
      date: "22 Nov 08:00 AM",
      location: "Mumbai Retail",
      icon: Store,
      hash: "0x1d...6d54",
      verified: true,
    },
  ],
  price_breakdown: {
    farmer: 25,
    transport: 5,
    retailer: 10,
    total: 40,
  },
})

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = getProductDetails(id)
  const [isPriceOpen, setIsPriceOpen] = useState(true)

  return (
    <DashboardLayout role="consumer">
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-green-500 hover:bg-green-600 border-none">Very Fresh</Badge>
                <Badge variant="outline" className="text-white border-white/50">
                  Grade {product.quality_grade}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="flex items-center gap-2 mt-2 text-white/90">
                <MapPin className="h-4 w-4" /> {product.origin}
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
                      {product.journey.map((event, index) => (
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

            {/* Price Breakdown */}
            <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Transparent Pricing
                    </CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-gray-500">See exactly where your money goes.</p>

                      {/* Progress Bar */}
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${(product.price_breakdown.farmer / product.price_breakdown.total) * 100}%`,
                          }}
                          className="bg-green-600 h-full"
                        />
                        <div
                          style={{
                            width: `${(product.price_breakdown.transport / product.price_breakdown.total) * 100}%`,
                          }}
                          className="bg-blue-500 h-full"
                        />
                        <div
                          style={{
                            width: `${(product.price_breakdown.retailer / product.price_breakdown.total) * 100}%`,
                          }}
                          className="bg-purple-500 h-full"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                        <div>
                          <div className="font-bold text-green-700">₹{product.price_breakdown.farmer}</div>
                          <div className="text-gray-500">Farmer</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">₹{product.price_breakdown.transport}</div>
                          <div className="text-gray-500">Transport</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">₹{product.price_breakdown.retailer}</div>
                          <div className="text-gray-500">Retailer</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>About this Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Harvest Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {product.harvest_date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shelf Life</p>
                    <p className="font-medium">{product.shelf_life}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Farmer</p>
                    <p className="font-medium">{product.farmer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quality Score</p>
                    <p className="font-medium text-green-600">{product.freshness_score}/100</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Current Price</p>
                  <div className="text-4xl font-bold text-gray-900">₹{product.price}</div>
                  <p className="text-sm text-gray-400">per kg</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full py-6 text-lg gap-2">
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
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://farmtrace.com/verify/${product.id}`)}`}
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
