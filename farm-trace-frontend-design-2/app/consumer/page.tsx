"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin } from "lucide-react"
import Link from "next/link"
import { useData } from "@/lib/data-context"

export default function ConsumerPage() {
  const { batches } = useData()

  // Show all batches that are available (for demo purposes showing all, but typically only 'In Stock')
  // Filter to ensure we have unique crop types represented or just show recent
  const availableProducts = batches.filter((b) => b.status !== "Created")

  return (
    <DashboardLayout role="consumer">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fresh Produce</h1>
            <p className="text-gray-500 mt-1">Discover transparently sourced food from verified farmers</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search crops..." className="pl-9 bg-white" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableProducts.length > 0 ? (
            availableProducts.map((product) => {
              let displayImage = product.imageUrl
              if (product.imageUrl === "/placeholder.svg" || !product.imageUrl) {
                const cropLower = product.cropName.toLowerCase()
                if (cropLower.includes("tomato"))
                  displayImage =
                    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
                else if (cropLower.includes("potato"))
                  displayImage =
                    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
                else if (cropLower.includes("mango"))
                  displayImage =
                    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80"
                else if (cropLower.includes("onion"))
                  displayImage =
                    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80"
                else if (cropLower.includes("rice"))
                  displayImage =
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
              }

              return (
                <Link key={product.id} href={`/consumer/products/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group overflow-hidden border-0 shadow-sm bg-white">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={displayImage || "/placeholder.svg"}
                        alt={product.cropName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                          {product.aiAnalysis?.freshness || "Fresh"}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0F7A5D] transition-colors">
                            {product.cropName}
                          </h3>
                          <p className="text-sm text-gray-500">{product.batchCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{product.price || 45}</p>
                          <p className="text-xs text-gray-500">per kg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Farmer #{product.farmerId}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">No products available at the moment.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
