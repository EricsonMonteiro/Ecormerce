from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    user_id: int
    amount: float
    currency: str = "usd"
    description: Optional[str] = None

class PaymentResponse(BaseModel):
    id: int
    user_id: int
    stripe_payment_id: str
    amount: float
    currency: str
    status: str
    created_at: datetime
    description: Optional[str] = None

    class Config:
        from_attributes = True
