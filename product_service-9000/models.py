from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

# Define the products model
class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float, index=True)
    price_id = Column(Float, index=True)
    icon_url = Column(String, index=True)
    stock = Column(Integer, index=True)
    
