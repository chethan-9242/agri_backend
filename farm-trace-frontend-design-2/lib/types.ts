export type Role = "farmer" | "distributor" | "retailer" | "consumer"

export interface User {
  id: number
  name: string
  email: string
  role: Role
  location?: string
  metadata?: any
}

export interface Batch {
  id: number
  batchCode: string
  farmerId: number
  cropName: string
  variety?: string
  quantity: number
  unit: string
  harvestDate: string // YYYY-MM-DD
  imageUrl: string
  status: BatchStatus
  createdAt: string
  farmerName?: string
  location?: string
  aiAnalysis?: AIAnalysisResult
}

export interface AIAnalysisResult {
  isFruitOrVegetable: boolean
  freshness: "Very Fresh" | "Fresh" | "Average" | "Poor" | "Spoiled"
  confidence: number
  quality: "excellent" | "good" | "average" | "poor"
  damage?: string
  spoilage?: string
}

export type BatchStatus =
  | "Created"
  | "At Farm"
  | "In Transit"
  | "At Warehouse"
  | "Delivered to Retailer"
  | "Accepted"
  | "Delayed"

export interface AIQualityCheck {
  id: number
  batchId: number
  freshness: "Very Fresh" | "Fresh" | "Average" | "Old"
  confidenceScore: number
  notes?: string
  checkedAt: string
}

export interface TransportUpdate {
  id: number
  batchId: number
  status: BatchStatus
  location: string
  timestamp: string
  remarks?: string
}

export interface PriceUpdate {
  id: number
  batchId: number
  sellingPrice: number
  discount: number
  finalPrice: number
  retailerId: number
}
