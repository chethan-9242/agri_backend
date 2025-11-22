"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ScanLine, Leaf } from "lucide-react"
import Link from "next/link"

const mockProducts = [
  {
    id: 1,
    name: "Organic Tomato",
    farmer: "Ravi Kumar",
    price: 40,
    origin: "Nashik",
    freshness: "Very Fresh",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Fresh Potato",
    farmer: "Suresh Patil",
    price: 25,
    origin: "Pune",
    freshness: "Fresh",
    image: "https://images.unsplash.com/photo-1518977676605-695d30539932?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Alphonso Mango",
    farmer: "Vijay Shinde",
    price: 180,
    origin: "Ratnagiri",
    freshness: "Premium",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Basmati Rice",
    farmer: "Anil Deshmukh",
    price: 90,
    origin: "Konkan",
    freshness: "Aged",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Red Onion",
    farmer: "Amit Deshmukh",
    price: 30,
    origin: "Nashik",
    freshness: "Fresh",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
  },
]

export default function ConsumerProductsPage() {
  return (
    <DashboardLayout role="consumer">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fresh Produce</h1>
            <p className="text-gray-500 mt-1">Trace the journey of your food from farm to table</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search products..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ScanLine className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Link href={`/consumer/products/${product.id}`} key={product.id}>
              <Card className="h-full hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm">
                      {product.freshness}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        {product.farmer}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-xs text-gray-500">per kg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t">
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded">Origin: {product.origin}</div>
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Verified</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
