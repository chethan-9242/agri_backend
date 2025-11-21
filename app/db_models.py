from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class UserDB(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    role = Column(
        Enum("farmer", "distributor", "retailer", "consumer", "admin", name="user_role_enum"),
        nullable=False,
        default="consumer",
    )
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True)
    email = Column(String(100), unique=True)
    password_hash = Column(String(255), nullable=False)
    location = Column(String(255))
    extra_metadata = Column("metadata", JSON)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    farmer_details = relationship("FarmerDetailsDB", back_populates="user", uselist=False)


class FarmerDetailsDB(Base):
    __tablename__ = "farmer_details"

    farmer_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    farm_location = Column(String(255))
    crops_grown = Column(Text)
    additional_info = Column(JSON)

    user = relationship("UserDB", back_populates="farmer_details")


class CategoryDB(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class BatchDB(Base):
    __tablename__ = "batches"

    batch_id = Column(Integer, primary_key=True, autoincrement=True)
    batch_code = Column(String(50), nullable=False, unique=True)
    farmer_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    crop_name = Column(String(100), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id", ondelete="SET NULL"))
    variety = Column(String(100))
    quantity = Column("quantity", Integer)  # DECIMAL(12,2) in DB; map to simple int/float use
    unit = Column(String(20), default="kg", nullable=False)
    harvest_date = Column(DateTime)
    image_url = Column(String(500))
    status = Column(String(50), default="Created")
    farmer_price_per_kg = Column(Integer, nullable=True)
    distributor_transport_cost_per_kg = Column(Integer, nullable=True)
    retailer_price_per_kg = Column(Integer, nullable=True)
    retailer_discount_percent = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    farmer = relationship("UserDB")
