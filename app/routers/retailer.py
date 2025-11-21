from datetime import date, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from ..models.batch import Batch, BatchStatus
from ..models.user import User, UserRole
from ..repositories.batches import get_batch, list_available_for_distributor, _to_batch_schema  # type: ignore
from ..db_models import BatchDB
from ..security import require_role
from ..repositories.alerts import create_alert
from ..models.alerts import AlertType
from ..database import get_db
from app.blockchain import bc_record_retailer_price

router = APIRouter(prefix="/retailer", tags=["retailer"])

PRICE_RANGES = {
    "Tomato": (20, 100),
    "Potato": (15, 60),
    "Mango": (60, 180),
    "Rice": (30, 80),
}


class PriceUpdate(BaseModel):
    price_per_kg: float
    discount_percent: Optional[float] = 0.0


class AcceptBatchRequest(BaseModel):
    shelf_date: date
    condition_notes: Optional[str] = None
    category: Optional[str] = None


class AnalyticsSummary(BaseModel):
    total_batches: int
    total_quantity_kg: float
    total_revenue: float
    last_10_batches: List[Batch]


@router.get("/incoming-batches", response_model=List[Batch])
def incoming_batches(
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    """Batches that are on the way to retailers.

    For hackathon demo simplicity we currently reuse the distributor's
    "available" list, which surfaces batches that are not yet finalized.
    Later, when we fully integrate with MySQL and assign specific
    retailer_ids/statuses, we can narrow this down per retailer.
    """
    return list_available_for_distributor(db)


@router.post("/batches/{batch_id}/accept", response_model=Batch)
def accept_batch(
    batch_id: int,
    body: AcceptBatchRequest,
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    batch = get_batch(db, batch_id)
    # For hackathon demo we only ensure the batch exists; retailer_id is not
    # yet persisted in the DB-backed model, so we skip strict ownership checks.
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    today = date.today()
    batch.status = BatchStatus.AT_RETAILER
    batch.arrival_date = today
    batch.shelf_date = body.shelf_date
    batch.category = body.category or batch.category

    # simple shelf-life rule: 7 days from shelf_date
    batch.expiry_date = body.shelf_date + timedelta(days=7)
    return batch


@router.post("/batches/{batch_id}/price", response_model=Batch)
def update_price(
    batch_id: int,
    price: PriceUpdate,
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    batch = get_batch(db, batch_id)
    # For hackathon demo we only ensure the batch exists; retailer_id is not
    # yet persisted in the DB-backed model, so we skip strict ownership checks.
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    min_price, max_price = PRICE_RANGES.get(batch.crop_name, (0, float("inf")))
    if not (min_price <= price.price_per_kg <= max_price):
        # Create alert for abnormal price
        create_alert(
            user_id=current_retailer.id,
            batch_id=batch.id,
            alert_type=AlertType.PRICE_SPIKE,
            message="Abnormal price entry detected for this crop.",
        )
        raise HTTPException(status_code=400, detail="Price out of allowed range for this crop")

    # Update price and discount
    previous_price = batch.retailer_price_per_kg or 0.0
    batch.retailer_price_per_kg = price.price_per_kg
    batch.retailer_discount_percent = price.discount_percent or 0.0

    # Compute final price after discount for blockchain transparency
    discount = price.discount_percent or 0.0
    final_price = batch.retailer_price_per_kg * (1 - discount / 100.0)

    # If big spike vs farmer price, notify farmer
    if batch.farmer_price_per_kg and batch.retailer_price_per_kg >= batch.farmer_price_per_kg * 3:
        create_alert(
            user_id=batch.farmer_id,
            batch_id=batch.id,
            alert_type=AlertType.PRICE_SPIKE,
            message="Abnormal retail price increase detected.",
        )

    # Blockchain: retailer sets / updates selling price (core price event)
    # Persist price and discount into the DB row for consumer visibility
    db_row = db.query(BatchDB).filter(BatchDB.batch_id == batch_id).first()
    if db_row:
        db_row.retailer_price_per_kg = int(price.price_per_kg)
        db_row.retailer_discount_percent = int(discount)
        db.commit()

    try:
        bc_record_retailer_price(
            batch_id=batch.batch_id,
            original_price=price.price_per_kg,
            discount_percent=discount,
            final_price=final_price,
        )
    except Exception as exc:  # pragma: no cover
        print("[BC] Failed to record retailer price:", exc)

    return batch


@router.get("/batches/{batch_id}", response_model=Batch)
def batch_detail(
    batch_id: int,
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    batch = get_batch(db, batch_id)
    # For hackathon demo we only ensure the batch exists; retailer_id is not
    # yet persisted in the DB-backed model, so we skip strict ownership checks.
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.get("/analytics/summary", response_model=AnalyticsSummary)
def analytics_summary(
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    """Retailer analytics summary based on batches in the database.

    For now we compute simple global metrics over all batches:
    - total number of batches
    - total quantity (kg)
    - last 10 batches (most recent first)

    Revenue is kept as 0.0 because pricing fields are not yet persisted in
    the DB model; this can be extended later.
    """

    rows = db.query(BatchDB).order_by(BatchDB.created_at.desc()).all()
    total_batches = len(rows)
    total_quantity = sum(float(r.quantity or 0) for r in rows)

    last_10_rows = rows[:10]
    last_10_batches = [_to_batch_schema(r) for r in last_10_rows]

    return AnalyticsSummary(
        total_batches=total_batches,
        total_quantity_kg=total_quantity,
        total_revenue=0.0,
        last_10_batches=last_10_batches,
    )


@router.get("/stock/categories")
def stock_by_category(
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    """Category-wise stock view for retailer.

    For now we aggregate quantity per `category` over all batches that are
    at retailer (status AT_RETAILER). Once retailer_id is persisted in the
    DB model we can further filter per `current_retailer.id`.
    """

    # Status transitions like AT_RETAILER are currently tracked only in
    # the in-memory schema and not persisted back to BatchDB.status. For
    # the hackathon demo we therefore aggregate over all batches and group
    # by crop_name, which is always present in the DB data.

    rows = db.query(BatchDB.crop_name, BatchDB.quantity).all()

    counts: dict[str, float] = {}
    for crop_name, qty in rows:
        if not crop_name:
            continue
        counts[crop_name] = counts.get(crop_name, 0.0) + float(qty or 0)
    return counts


@router.post("/batches/{batch_id}/apply-discount", response_model=Batch)
def apply_discount(
    batch_id: int,
    discount_percent: float,
    db: Session = Depends(get_db),
    current_retailer: User = Depends(require_role(UserRole.RETAILER)),
):
    batch = get_batch(db, batch_id)
    # For hackathon demo we only ensure the batch exists; retailer_id is not
    # yet persisted in the DB-backed model, so we skip strict ownership checks.
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if discount_percent < 0 or discount_percent > 90:
        raise HTTPException(status_code=400, detail="Unreasonable discount value")

    batch.retailer_discount_percent = discount_percent

    # Persist discount into the DB row for consumer analytics/visibility
    db_row = db.query(BatchDB).filter(BatchDB.batch_id == batch_id).first()
    if db_row:
        db_row.retailer_discount_percent = int(discount_percent)
        db.commit()

    return batch
