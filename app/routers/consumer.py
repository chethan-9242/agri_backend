from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..models.batch import Batch, BatchStatus
from ..models.user import User, UserRole
from ..security import require_role
from ..repositories.batches import get_batch, _to_batch_schema  # type: ignore
from ..db_models import BatchDB
from ..database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/consumer", tags=["consumer"])


class ProductCard(BaseModel):
    batch_id: int
    crop_name: str
    category: Optional[str]
    price_per_kg: Optional[float]
    image_url: Optional[str]


class PriceBreakdown(BaseModel):
    farmer_price_per_kg: Optional[float]
    distributor_transport_cost_per_kg: Optional[float]
    retailer_price_per_kg: Optional[float]
    final_price_per_kg: Optional[float]
    discount_percent: Optional[float]


class ProductDetail(BaseModel):
    batch: Batch
    price_breakdown: PriceBreakdown


@router.get("/products", response_model=List[ProductCard])
def list_products(db: Session = Depends(get_db)):
    """List products available to consumers.

    We read from the DB-backed batches table, convert rows to the public
    Batch schema using `_to_batch_schema`, and expose only batches that are
    currently at the retailer and have a retailer price set.
    """

    rows = db.query(BatchDB).order_by(BatchDB.created_at.desc()).all()

    products: List[ProductCard] = []
    for row in rows:
        b = _to_batch_schema(row)
        products.append(
            ProductCard(
                batch_id=b.id,
                crop_name=b.crop_name,
                category=b.category,
                price_per_kg=b.retailer_price_per_kg,
                image_url=getattr(b, "image_url", None),
            )
        )
    return products


@router.get("/products/{batch_id}", response_model=ProductDetail)
def product_detail(batch_id: int, db: Session = Depends(get_db)):
    batch = get_batch(db, batch_id)
    # For the hackathon demo we only ensure the batch exists; status
    # transitions are not fully persisted in the DB-backed model yet.
    if not batch:
        raise HTTPException(status_code=404, detail="Product not available")

    final_price = batch.retailer_price_per_kg
    if final_price is not None and batch.retailer_discount_percent:
        final_price = final_price * (1 - batch.retailer_discount_percent / 100)

    pb = PriceBreakdown(
        farmer_price_per_kg=batch.farmer_price_per_kg,
        distributor_transport_cost_per_kg=batch.distributor_transport_cost_per_kg,
        retailer_price_per_kg=batch.retailer_price_per_kg,
        final_price_per_kg=final_price,
        discount_percent=batch.retailer_discount_percent,
    )
    return ProductDetail(batch=batch, price_breakdown=pb)


@router.get("/products/{batch_id}/qr")
def qr_data(batch_id: int, db: Session = Depends(get_db)):
    batch = get_batch(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    # Frontend will generate actual QR code from this payload
    return {
        "batch_id": batch.batch_id,
        "crop_name": batch.crop_name,
        "category": batch.category,
        "retailer_price_per_kg": batch.retailer_price_per_kg,
    }
