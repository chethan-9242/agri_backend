from datetime import datetime, date
from typing import List, Optional

from sqlalchemy.orm import Session

from ..models.batch import Batch, BatchCreate, BatchStatus
from ..database import get_db
from ..db_models import BatchDB
from app.blockchain import bc_record_batch_created


def _to_batch_schema(db_batch: BatchDB) -> Batch:
    return Batch(
        id=db_batch.batch_id,
        batch_id=db_batch.batch_code,
        farmer_id=db_batch.farmer_id,
        crop_name=db_batch.crop_name,
        quantity_kg=float(db_batch.quantity or 0),
        harvest_date=(db_batch.harvest_date.date() if isinstance(db_batch.harvest_date, datetime) else db_batch.harvest_date or date.today()),
        location="",  # location stored in users table; can be joined later
        status=BatchStatus.WAITING_PICKUP if db_batch.status.lower() == "created" else BatchStatus(db_batch.status.lower()),
        ai_quality=None,
        created_at=db_batch.created_at,
        distributor_id=None,
        retailer_id=None,
        farmer_price_per_kg=(
            float(db_batch.farmer_price_per_kg)
            if getattr(db_batch, "farmer_price_per_kg", None) is not None
            else None
        ),
        distributor_transport_cost_per_kg=(
            float(db_batch.distributor_transport_cost_per_kg)
            if getattr(db_batch, "distributor_transport_cost_per_kg", None) is not None
            else None
        ),
        retailer_price_per_kg=(
            float(db_batch.retailer_price_per_kg)
            if getattr(db_batch, "retailer_price_per_kg", None) is not None
            else None
        ),
        retailer_discount_percent=(
            float(db_batch.retailer_discount_percent)
            if getattr(db_batch, "retailer_discount_percent", None) is not None
            else None
        ),
        category=None,
        arrival_date=None,
        shelf_date=None,
        expiry_date=None,
        image_url=getattr(db_batch, "image_url", None),
    )


def create_farmer_batch(db: Session, farmer_id: int, location: str, batch_in: BatchCreate) -> Batch:
    # Generate batch_code like B0001 using count+1
    next_number = db.query(BatchDB).count() + 1
    batch_code = f"B{next_number:04d}"

    db_batch = BatchDB(
        batch_code=batch_code,
        farmer_id=farmer_id,
        crop_name=batch_in.crop_name,
        quantity=batch_in.quantity_kg,
        unit="kg",
        harvest_date=batch_in.harvest_date,
        image_url=batch_in.image_url,
        status="Created",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)

    # Blockchain: farmer created a new batch (core traceability event)
    try:  # fail-soft so main flow keeps working even if chain write fails
        bc_record_batch_created(
            batch_id=db_batch.batch_code,
            crop_name=db_batch.crop_name,
            quantity_kg=float(db_batch.quantity or 0),
            harvest_dt=db_batch.harvest_date,
            image_url=db_batch.image_url,
        )
    except Exception as exc:  # pragma: no cover - integration side effects
        print("[BC] Failed to record batch creation:", exc)

    return _to_batch_schema(db_batch)


def list_batches_by_farmer(db: Session, farmer_id: int) -> List[Batch]:
    rows = db.query(BatchDB).filter(BatchDB.farmer_id == farmer_id).order_by(BatchDB.created_at.desc()).all()
    return [_to_batch_schema(b) for b in rows]


def get_batch(db: Session, batch_id: int) -> Optional[Batch]:
    row = db.query(BatchDB).filter(BatchDB.batch_id == batch_id).first()
    return _to_batch_schema(row) if row else None


def list_available_for_distributor(db: Session) -> List[Batch]:
    rows = db.query(BatchDB).filter(BatchDB.status.in_(["Created", "Waiting Pickup"])).all()
    return [_to_batch_schema(b) for b in rows]
