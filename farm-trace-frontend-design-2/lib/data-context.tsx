"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Batch, BatchStatus } from "@/lib/types"

interface DataContextType {
  batches: Batch[]
  addBatch: (batch: Omit<Batch, "id" | "createdAt">) => Promise<void>
  updateBatchStatus: (id: number, status: BatchStatus) => Promise<void>
  updateBatchPrice: (id: number, price: number) => Promise<void>
  isLoading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Initial mock data matching Batch type
const INITIAL_BATCHES: Batch[] = [
  {
    id: 1,
    batchCode: "BT001",
    cropName: "Tomato",
    quantity: 120,
    unit: "kg",
    status: "Created",
    harvestDate: "2025-11-20",
    createdAt: "2025-11-20T09:30:00Z",
    farmerId: 1,
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      isFruitOrVegetable: true,
      freshness: "Very Fresh",
      confidence: 95,
      quality: "excellent",
      damage: "None detected",
    },
  },
  {
    id: 2,
    batchCode: "BT002",
    cropName: "Potato",
    quantity: 200,
    unit: "kg",
    status: "In Transit",
    harvestDate: "2025-11-18",
    createdAt: "2025-11-18T10:00:00Z",
    farmerId: 1,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      isFruitOrVegetable: true,
      freshness: "Fresh",
      confidence: 88,
      quality: "good",
    },
  },
  {
    id: 3,
    batchCode: "BT003",
    cropName: "Mango",
    quantity: 85,
    unit: "kg",
    status: "Delivered to Retailer",
    harvestDate: "2025-11-15",
    createdAt: "2025-11-15T08:45:00Z",
    farmerId: 1,
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      isFruitOrVegetable: true,
      freshness: "Average",
      confidence: 75,
      quality: "average",
    },
  },
  {
    id: 4,
    batchCode: "BT004",
    cropName: "Onion",
    quantity: 150,
    unit: "kg",
    status: "At Warehouse",
    harvestDate: "2025-11-22",
    createdAt: "2025-11-22T14:20:00Z",
    farmerId: 1,
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      isFruitOrVegetable: true,
      freshness: "Fresh",
      confidence: 92,
      quality: "good",
    },
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from local storage on mount
  useEffect(() => {
    const storedBatches = localStorage.getItem("farmtrace_batches")
    if (storedBatches) {
      setBatches(JSON.parse(storedBatches))
    } else {
      setBatches(INITIAL_BATCHES)
      localStorage.setItem("farmtrace_batches", JSON.stringify(INITIAL_BATCHES))
    }
    setIsLoading(false)
  }, [])

  const addBatch = async (newBatchData: Omit<Batch, "id" | "createdAt">) => {
    const newBatch: Batch = {
      ...newBatchData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      // Ensure AI analysis is preserved
      aiAnalysis: newBatchData.aiAnalysis,
    }

    const updatedBatches = [newBatch, ...batches]
    setBatches(updatedBatches)
    localStorage.setItem("farmtrace_batches", JSON.stringify(updatedBatches))

    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const updateBatchStatus = async (id: number, status: BatchStatus) => {
    const updatedBatches = batches.map((batch) => (batch.id === id ? { ...batch, status } : batch))
    setBatches(updatedBatches)
    localStorage.setItem("farmtrace_batches", JSON.stringify(updatedBatches))
  }

  const updateBatchPrice = async (id: number, price: number) => {
    // In a real app, we would store price in a separate table or field
    // For this mock, we'll just update local storage or assume it's handled
    // We'll add a price field to the batch object in memory for now
    const updatedBatches = batches.map((batch) => (batch.id === id ? { ...batch, price } : batch))
    setBatches(updatedBatches)
    localStorage.setItem("farmtrace_batches", JSON.stringify(updatedBatches))
  }

  return (
    <DataContext.Provider value={{ batches, addBatch, updateBatchStatus, updateBatchPrice, isLoading }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
