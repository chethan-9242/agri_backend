from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional


class BatchStatus(str, Enum):
    CREATED = "created"
    WAITING_PICKUP = "waiting_pickup"
    IN_TRANSIT = "in_transit"
    IN_WAREHOUSE = "in_warehouse"
    DELIVERED_TO_RETAILER = "delivered_to_retailer"
    AT_RETAILER = "at_retailer"
    SOLD = "sold"


class AIQualityResult(BaseModel):
    freshness: str
    spoilage: str
    damage: str
    confidence: float


class BatchBase(BaseModel):
    crop_name: str
    quantity_kg: float
    harvest_date: date


class BatchCreate(BatchBase):
    image_url: Optional[str] = None


class Batch(BatchBase):
    id: int
    batch_id: str
    farmer_id: int
    location: str
    status: BatchStatus
    ai_quality: Optional[AIQualityResult] = None
    created_at: datetime
    distributor_id: Optional[int] = None
    retailer_id: Optional[int] = None

    # Pricing & transparency fields
    farmer_price_per_kg: Optional[float] = None
    distributor_transport_cost_per_kg: Optional[float] = None
    retailer_price_per_kg: Optional[float] = None
    retailer_discount_percent: Optional[float] = None

    # Retailer & consumer-side metadata
    category: Optional[str] = None  # fruit / vegetable / grain / spice
    arrival_date: Optional[date] = None
    shelf_date: Optional[date] = None
    expiry_date: Optional[date] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
