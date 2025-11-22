"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Info, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const getBatchDetails = (id: string) => ({
  id,
  batch_code: "BT004",
  crop: "Onion",
  quantity: 150,
  farmer_price: 25,
  transport_cost: 5,
  origin: "Pune",
  quality_score: 92,
  freshness: "Excellent",
  min_price: 40,
  max_price: 80,
  market_price: 55,
})

export default function AcceptBatchPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [batch, setBatch] = useState(getBatchDetails(id))

  useEffect(() => {
    setBatch(getBatchDetails(id))
  }, [id])

  const [sellingPrice, setSellingPrice] = useState<string>(batch.market_price.toString())
  const [discount, setDiscount] = useState("0")
  const [accepted, setAccepted] = useState(false)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const baseCost = batch.farmer_price + batch.transport_cost
  const price = Number.parseFloat(sellingPrice) || 0
  const margin = price - baseCost
  const marginPercent = ((margin / price) * 100).toFixed(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accepted) {
      toast({
        title: "Inspection Required",
        description: "Please certify that you have inspected the goods before accepting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Batch Accepted",
      description: `${batch.crop} added to inventory at ₹${sellingPrice}/kg.`,
    })

    router.push("/retailer/dashboard")
  }

  return (
    <DashboardLayout role="retailer">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Accept Delivery & Set Price</h1>
          <p className="text-gray-500 mt-1">Verify quality and set your selling price</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Batch Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{batch.crop}</h3>
                    <Badge variant="outline" className="mt-1">
                      {batch.batch_code}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-600 mb-1">{batch.freshness}</Badge>
                    <p className="text-xs text-gray-500">AI Quality Score: {batch.quality_score}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-gray-500">Quantity Received</p>
                    <p className="font-medium">{batch.quantity} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium">{batch.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Farmer Price</p>
                    <p className="font-medium">₹{batch.farmer_price}/kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transport Cost</p>
                    <p className="font-medium">₹{batch.transport_cost}/kg</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700">Total Cost Price</span>
                  <span className="font-bold text-gray-900">₹{baseCost}/kg</span>
                </div>
              </CardContent>
            </Card>

            <Card className={!accepted ? "border-orange-200 bg-orange-50/50" : "border-green-200 bg-green-50/50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Condition Check
                  {!accepted && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-100">
                      Required
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Verify the condition upon arrival to proceed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg border bg-white">
                  <Checkbox
                    id="condition"
                    checked={accepted}
                    onCheckedChange={(c) => setAccepted(!!c)}
                    className="mt-1"
                  />
                  <label htmlFor="condition" className="text-sm font-medium leading-relaxed cursor-pointer">
                    I certify that I have inspected the goods and they match the quality description.
                    <span className="block text-xs text-gray-500 font-normal mt-1">
                      This action creates an immutable record on the blockchain.
                    </span>
                  </label>
                </div>
                <Textarea
                  placeholder="Any notes on condition (e.g. 'Slight bruising on bottom layer')"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Pricing */}
          <div className="space-y-6">
            <Card className="border-purple-200 shadow-sm">
              <CardHeader className="bg-purple-50 border-b border-purple-100">
                <CardTitle className="text-purple-900">Set Selling Price</CardTitle>
                <CardDescription className="text-purple-700">Manage your margin</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label>Selling Price (₹/kg)</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      className="pl-9 font-bold text-lg"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Market Range: ₹{batch.min_price} - ₹{batch.max_price}
                  </p>
                  {price < batch.min_price && (
                    <p className="text-xs text-red-600 mt-1">Price is below market average</p>
                  )}
                  {price > batch.max_price && (
                    <p className="text-xs text-yellow-600 mt-1">Price is above market average</p>
                  )}
                </div>

                <div>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    max="100"
                    min="0"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margin</span>
                    <span className={margin > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      ₹{margin.toFixed(2)}/kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margin %</span>
                    <span className={margin > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {marginPercent}%
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding to Inventory..." : "Accept & Add Stock"}
                </Button>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Smart Pricing</AlertTitle>
              <AlertDescription className="text-xs">
                AI suggests a price of ₹{batch.market_price} based on current demand and {batch.freshness.toLowerCase()}{" "}
                condition.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
