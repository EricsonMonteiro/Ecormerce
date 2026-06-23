import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Optional

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/ecommerce")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Model ---
class Product(Base):
    __tablename__ = "products"
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String)
    description   = Column(String)
    price         = Column(Float)
    image_url     = Column(String)
    stripe_price_id = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

# --- Schema ---
class ProductSchema(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    stripe_price_id: Optional[str] = None

    class Config:
        from_attributes = True

# --- Routes ---
@app.get("/products/")
def list_products():
    db = SessionLocal()
    products = db.query(Product).all()
    db.close()
    return products

@app.get("/products/{product_id}")
def get_product(product_id: int):
    db = SessionLocal()
    product = db.query(Product).filter(Product.id == product_id).first()
    db.close()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product

@app.post("/products/", status_code=201)
def create_product(data: ProductSchema):
    db = SessionLocal()
    product = Product(**data.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    db.close()
    return product

@app.put("/products/{product_id}")
def update_product(product_id: int, data: ProductSchema):
    db = SessionLocal()
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        db.close()
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    db.close()
    return product

@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        db.close()
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(product)
    db.commit()
    db.close()
    return {"detail": "Produto deletado"}

@app.get("/health")
def health():
    return {"status": "healthy"}
