from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional


class AlertType(str, Enum):
    QUANTITY_MISMATCH = "quantity_mismatch"
    PRICE_SPIKE = "price_spike"
    DUPLICATE_BATCH = "duplicate_batch"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"


class Alert(BaseModel):
    id: int
    user_id: int
    batch_id: Optional[int] = None
    type: AlertType
    message: str
    created_at: datetime
    is_read: bool = False

    class Config:
        from_attributes = True
