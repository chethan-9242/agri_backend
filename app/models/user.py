from enum import Enum
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRole(str, Enum):
    FARMER = "farmer"
    DISTRIBUTOR = "distributor"
    RETAILER = "retailer"
    CONSUMER = "consumer"


class UserBase(BaseModel):
    name: str
    phone: str
    role: UserRole


class FarmerProfile(BaseModel):
    farm_location: str
    crops_grown: list[str]


class DistributorProfile(BaseModel):
    company_name: Optional[str] = None
    vehicle_details: Optional[str] = None


class RetailerProfile(BaseModel):
    shop_name: Optional[str] = None
    location: Optional[str] = None


class ConsumerProfile(BaseModel):
    address: Optional[str] = None


class UserCreate(UserBase):
    email: EmailStr
    password: str
    farmer_profile: Optional[FarmerProfile] = None
    distributor_profile: Optional[DistributorProfile] = None
    retailer_profile: Optional[RetailerProfile] = None
    consumer_profile: Optional[ConsumerProfile] = None


class User(UserBase):
    id: int
    email: EmailStr
    farmer_profile: Optional[FarmerProfile] = None
    distributor_profile: Optional[DistributorProfile] = None
    retailer_profile: Optional[RetailerProfile] = None
    consumer_profile: Optional[ConsumerProfile] = None

    class Config:
        from_attributes = True
