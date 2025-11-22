"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Camera, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUpload {
  id: string
  file: File
  preview: string
}

export default function CreateBatchPage() {
  const { user } = useAuth()
  const { addBatch } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [cropName, setCropName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [images, setImages] = useState<ImageUpload[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length + images.length > 3) {
      toast({
        title: "Too many images",
        description: "You can only have up to 3 images total.",
        variant: "destructive",
      })
      return
    }

    for (const file of files) {
      const id = Math.random().toString(36).substr(2, 9)

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = async () => {
        const base64 = reader.result as string

        setImages((prev) => [
          ...prev,
          {
            id,
            file,
            preview: base64,
          },
        ])
      }
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const quantityNum = Number.parseFloat(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid positive number for quantity.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const mainImage = images[0]

    try {
      await addBatch({
        batchCode: `BT${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        cropName,
        quantity: quantityNum,
        unit: "kg",
        harvestDate,
        status: "Created",
        farmerId: user ? Number.parseInt(user.id) : 1,
        imageUrl: mainImage.preview,
      })

      toast({
        title: "Batch created successfully!",
        description: "Your batch has been recorded and added to your list.",
      })

      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        router.push("/farmer/batches")
      }, 100)
    } catch (error) {
      console.error("[v0] Error creating batch:", error)
      toast({
        title: "Error",
        description: "Failed to create batch. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="farmer">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Create New Batch</h1>
          <p className="text-gray-600 mt-2">Add your harvest details and upload photos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
              <CardDescription>Enter the details of your harvest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="crop">Crop Name *</Label>
                <Select value={cropName} onValueChange={setCropName} required>
                  <SelectTrigger id="crop" className="mt-2">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tomato">Tomato</SelectItem>
                    <SelectItem value="Potato">Potato</SelectItem>
                    <SelectItem value="Mango">Mango</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Onion">Onion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity (kg) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 120.5"
                  required
                  min="0.01"
                  step="0.01"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="harvest-date">Harvest Date *</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Product Images</CardTitle>
              </div>
              <CardDescription>Upload up to 3 clear photos of your harvest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label
                  className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    images.length >= 3
                      ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                      : "border-primary/30 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-6 pb-8">
                    <div className="p-3 bg-primary/10 rounded-lg mb-3">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB ({images.length}/3 images)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={images.length >= 3}
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group rounded-lg overflow-hidden border">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || images.length === 0 || !cropName || !quantity || !harvestDate}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Batch...
                </>
              ) : (
                "Create Batch"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
