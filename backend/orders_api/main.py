import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# Inicia a API
app = FastAPI()

# Configuração do Banco de Dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/ecommerce")

# Cria a conexão com o PostgreSQL
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Tabela de Pedidos no Banco de Dados
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    stripe_event_id = Column(String, unique=True, index=True) # Evita eventos duplicados
    status = Column(String)
    total_amount = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Modelo de Entrada para Criar Pedido
class OrderCreate(BaseModel):
    customer_id: str
    stripe_event_id: str
    status: str
    total_amount: float

# Modelo de Entrada para Atualizar Pedido
class OrderUpdate(BaseModel):
    status: str
    stripe_event_id: str

@app.post("/orders/")
def create_order(order: OrderCreate):
    # Rota para salvar um novo pedido
    db = SessionLocal()
    try:
        # Verifica se o evento já foi processado
        existing_order = db.query(Order).filter(Order.stripe_event_id == order.stripe_event_id).first()
        if existing_order:
            return {"status": "ignored", "detail": "Evento do Stripe já processado."}
            
        # Salva o pedido no banco
        db_order = Order(**order.dict())
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        return {"status": "success", "order_id": db_order.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/orders/{order_id}")
def get_order(order_id: int):
    # Rota para buscar um pedido pelo ID
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order is None:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
        return order
    finally:
        db.close()

@app.put("/orders/{order_id}")
def update_order(order_id: int, order_update: OrderUpdate):
    # Rota para atualizar o status do pedido
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order is None:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        # Atualiza os dados no banco
        order.status = order_update.status
        order.stripe_event_id = order_update.stripe_event_id
        db.commit()
        db.refresh(order)
        return {"status": "success", "order_id": order.id, "new_status": order.status}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/orders/")
def list_orders():
    # Rota para listar todos os pedidos
    db = SessionLocal()
    try:
        orders = db.query(Order).all()
        return orders
    finally:
        db.close()

@app.get("/health")
def health_check():
    # Rota simples para monitoramento
    return {"status": "healthy"}
