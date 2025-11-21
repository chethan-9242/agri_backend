from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .config import settings
from .models.user import User, UserRole, FarmerProfile
from .database import get_db
from .db_models import UserDB, FarmerDetailsDB

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    # JOSE expects the 'sub' (subject) claim to be a string
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _to_user_schema(db_user: UserDB, farmer: FarmerDetailsDB | None) -> User:
    farmer_profile: FarmerProfile | None = None
    if db_user.role == "farmer" and farmer is not None:
        crops = (farmer.crops_grown or "").split(",") if farmer.crops_grown else []
        farmer_profile = FarmerProfile(
            farm_location=farmer.farm_location or "",
            crops_grown=[c.strip() for c in crops if c.strip()],
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


def get_user_by_email(db: Session, email: str) -> Optional[UserDB]:
    return db.query(UserDB).filter(UserDB.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[UserDB]:
    return db.query(UserDB).filter(UserDB.user_id == user_id).first()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing subject (sub)",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError as exc:
        # Debug logging of JWT issues (dev only)
        print("JWT decode error:", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db_user = get_user_by_id(db, int(user_id))
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found for token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    farmer_details = db_user.farmer_details
    return _to_user_schema(db_user, farmer_details)


def require_role(*roles: UserRole):
    async def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user

    return dependency
