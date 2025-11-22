"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, IndianRupee } from "lucide-react"

export default function UpdatePricePage({ params }: { params: { id: string } }) {
  const { id } = params
  const { batches, updateBatchPrice } = useData()
  const router = useRouter()
  const { toast } = useToast()

  const batch = batches.find((b) => b.id === Number(id))
  const [price, setPrice] = useState(batch?.price?.toString() || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!batch) {
    return (
      <DashboardLayout role="retailer">
        <div className="text-center py-10">Batch not found</div>
      </DashboardLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateBatchPrice(batch.id, Number(price))
      toast({
        title: "Price Updated",
        description: `Price for ${batch.cropName} set to ₹${price}/kg`,
      })
      router.push("/retailer/active-shipments")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="retailer">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Update Price</h1>

        <Card>
          <CardHeader>
            <CardTitle>Set Selling Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium text-lg">
                {batch.cropName} ({batch.batchCode})
              </p>
              <p className="text-sm text-gray-500 mt-2">Quantity Available</p>
              <p className="font-medium">
                {batch.quantity} {batch.unit}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="price">Price per {batch.unit} (₹)</Label>
                <div className="relative mt-2">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-9"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Price"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
