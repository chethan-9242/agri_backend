"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, CheckCircle, AlertCircle, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUpload {
  id: string
  file: File
  preview: string
  aiResult?: {
    freshness: string
    confidence: number
    quality: "excellent" | "good" | "average" | "poor"
  }
}

export default function CreateBatchPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [cropName, setCropName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [images, setImages] = useState<ImageUpload[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      if (images.length >= 3) {
        toast({
          title: "Maximum images reached",
          description: "You can upload up to 3 images per batch",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage: ImageUpload = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: reader.result as string,
        }

        setImages((prev) => [...prev, newImage])

        // Simulate AI analysis
        setTimeout(() => {
          const aiResults = [
            { freshness: "Very Fresh", confidence: 95, quality: "excellent" as const },
            { freshness: "Fresh", confidence: 88, quality: "good" as const },
            { freshness: "Average", confidence: 72, quality: "average" as const },
          ]
          const result = aiResults[Math.floor(Math.random() * aiResults.length)]

          setImages((prev) => prev.map((img) => (img.id === newImage.id ? { ...img, aiResult: result } : img)))
        }, 2000)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Batch created successfully!",
      description: "Your batch has been recorded on the blockchain.",
    })

    router.push("/farmer/dashboard")
  }

  return (
    <DashboardLayout role="farmer">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Batch</h1>
          <p className="text-gray-500 mt-1">Add your harvest details and upload photos for AI quality analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
              <CardDescription>Enter the details of your harvest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="crop">Crop Name *</Label>
                <Select value={cropName} onValueChange={setCropName} required>
                  <SelectTrigger id="crop" className="mt-1">
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
                  placeholder="e.g. 120"
                  required
                  className="mt-1"
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
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload up to 3 clear photos for AI quality analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB ({images.length}/3)</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>

                      {/* AI Analysis Result */}
                      {image.aiResult ? (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {image.aiResult.quality === "excellent" || image.aiResult.quality === "good" ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                AI Analysis: {image.aiResult.freshness}
                              </span>
                            </div>
                            <Badge variant={image.aiResult.quality === "excellent" ? "default" : "secondary"}>
                              {image.aiResult.confidence}% Confidence
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                            <span className="text-sm text-blue-700">Analyzing image quality...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || images.length === 0 || !cropName || !quantity || !harvestDate}
              className="flex-1"
            >
              {isSubmitting ? "Creating Batch..." : "Create Batch"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
