from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..models.batch import Batch, BatchCreate
from ..models.user import UserRole, User
from ..security import require_role
from ..repositories.batches import create_farmer_batch, list_batches_by_farmer, get_batch
from ..database import get_db

router = APIRouter(prefix="/farmer", tags=["farmer"])


@router.post("/batches", response_model=Batch)
def create_batch(
    batch_in: BatchCreate,
    db: Session = Depends(get_db),
    current_farmer: User = Depends(require_role(UserRole.FARMER)),
):
    location = (
        current_farmer.farmer_profile.farm_location
        if current_farmer.farmer_profile
        else "Unknown"
    )
    return create_farmer_batch(db, current_farmer.id, location, batch_in)


@router.get("/batches", response_model=list[Batch])
def my_batches(
    db: Session = Depends(get_db),
    current_farmer: User = Depends(require_role(UserRole.FARMER)),
):
    return list_batches_by_farmer(db, current_farmer.id)


@router.get("/batches/{batch_id}", response_model=Batch)
def batch_detail(
    batch_id: int,
    db: Session = Depends(get_db),
    current_farmer: User = Depends(require_role(UserRole.FARMER)),
):
    batch = get_batch(db, batch_id)
    if not batch or batch.farmer_id != current_farmer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Batch not found")
    return batch
