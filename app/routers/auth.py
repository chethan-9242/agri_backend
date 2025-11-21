from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..models.user import UserCreate, User, UserRole, FarmerProfile
from ..security import (
    hash_password,
    verify_password,
    create_access_token,
)
from ..database import get_db
from ..db_models import UserDB, FarmerDetailsDB
from ..config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=User)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(UserDB).filter(UserDB.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = hash_password(user_in.password)

    db_user = UserDB(
        name=user_in.name,
        phone=user_in.phone,
        email=user_in.email,
        role=user_in.role.value,
        password_hash=password_hash,
        location=(
            user_in.farmer_profile.farm_location
            if user_in.role == UserRole.FARMER and user_in.farmer_profile
            else None
        ),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # If farmer, create farmer_details row
    if user_in.role == UserRole.FARMER and user_in.farmer_profile:
        crops_str = ",".join(user_in.farmer_profile.crops_grown)
        farmer = FarmerDetailsDB(
            farmer_id=db_user.user_id,
            farm_location=user_in.farmer_profile.farm_location,
            crops_grown=crops_str,
            additional_info=None,
        )
        db.add(farmer)
        db.commit()

    farmer_details = db_user.farmer_details
    farmer_profile: FarmerProfile | None = None
    if db_user.role == "farmer" and farmer_details is not None:
        farmer_profile = FarmerProfile(
            farm_location=farmer_details.farm_location or "",
            crops_grown=[
                c.strip() for c in (farmer_details.crops_grown or "").split(",") if c.strip()
            ],
        )

    return User(
        id=db_user.user_id,
        name=db_user.name,
        phone=db_user.phone or "",
        role=UserRole(db_user.role),
        email=db_user.email or "",
        farmer_profile=farmer_profile,
        distributor_profile=None,
        retailer_profile=None,
        consumer_profile=None,
    )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = db.query(UserDB).filter(UserDB.email == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": db_user.user_id, "role": db_user.role},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}
