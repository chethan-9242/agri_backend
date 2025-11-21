from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..models.user import User, UserRole
from ..security import require_role
from ..models.batch import Batch, BatchStatus
from ..repositories.batches import list_available_for_distributor, get_batch
from ..database import get_db
from app.blockchain import bc_record_pickup, bc_record_delivery

router = APIRouter(prefix="/distributor", tags=["distributor"])


@router.get("/available-batches", response_model=List[Batch])
def available_batches(
    db: Session = Depends(get_db),
    current_distributor: User = Depends(require_role(UserRole.DISTRIBUTOR)),
):
    return list_available_for_distributor(db)


@router.post("/batches/{batch_id}/pickup", response_model=Batch)
def pickup_batch(
    batch_id: int,
    db: Session = Depends(get_db),
    current_distributor: User = Depends(require_role(UserRole.DISTRIBUTOR)),
):
    batch = get_batch(db, batch_id)
    if not batch or batch.status != BatchStatus.WAITING_PICKUP:
        raise HTTPException(status_code=404, detail="Batch not available for pickup")
    batch.status = BatchStatus.IN_TRANSIT
    batch.distributor_id = current_distributor.id

    # Blockchain: pickup confirmation (core distributor event)
    try:
        bc_record_pickup(
            batch_id=batch.batch_id,
            pickup_dt=datetime.utcnow(),
            vehicle_number="UNKNOWN-VEHICLE",  # TODO: extend API to capture real vehicle no.
            destination="Retailer",  # TODO: replace with actual destination when modeled
        )
    except Exception as exc:  # pragma: no cover
        print("[BC] Failed to record pickup:", exc)

    return batch


@router.post("/batches/{batch_id}/status/{status}", response_model=Batch)
def update_transport_status(
    batch_id: int,
    status: BatchStatus,
    db: Session = Depends(get_db),
    current_distributor: User = Depends(require_role(UserRole.DISTRIBUTOR)),
):
    batch = get_batch(db, batch_id)
    # For hackathon demo we only ensure the batch exists; distributor_id is not persisted
    # yet in the DB-backed model, so we skip strict ownership checks here.
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    batch.status = status

    # Blockchain: delivery confirmation when batch reaches retailer
    if status == BatchStatus.DELIVERED_TO_RETAILER:
        try:
            bc_record_delivery(
                batch_id=batch.batch_id,
                arrival_dt=datetime.utcnow(),
                retailer_id_or_name=str(batch.retailer_id or "retailer"),
            )
        except Exception as exc:  # pragma: no cover
            print("[BC] Failed to record delivery:", exc)

    return batch
