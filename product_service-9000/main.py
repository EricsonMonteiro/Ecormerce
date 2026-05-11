import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],

    
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/product/")
def create_product(name: str, icon_url: str, price_id:str, price:int, db: Session = Depends(get_db)):
    product = models.Product(name=name, icon_url=icon_url, price_id=price_id, price=price)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product  

@app.get("/product/")
def get_product(db: Session = Depends(get_db)):
    return db.query(models.Product).all()
