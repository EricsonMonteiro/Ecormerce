import os
import pika
import json
import stripe
from fastapi import FastAPI, Request, HTTPException

# Inicia a API
app = FastAPI()

# Carrega configurações do ambiente
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

def get_rabbitmq_channel():
    # Conecta no RabbitMQ e garante que a fila existe
    parameters = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue='stripe_events', durable=True)
    return connection, channel

@app.post("/webhook")
async def stripe_webhook(request: Request):
    # Recebe eventos do Stripe (ex: pagamento confirmado)
    payload = await request.body()
    sig_header = request.headers.get('Stripe-Signature')

    try:
        # Valida a assinatura de segurança do Stripe
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            event = json.loads(payload)
    except Exception as e:
        print(f"Erro na assinatura do Stripe: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    try:
        # Envia o evento para a fila para ser processado de forma assíncrona
        connection, channel = get_rabbitmq_channel()
        channel.basic_publish(
            exchange='',
            routing_key='stripe_events',
            body=payload, # payload já é bytes (o JSON original do Stripe)
            properties=pika.BasicProperties(
                delivery_mode=2, # Mensagem persistente
            )
        )
        connection.close()
    except Exception as e:
        print(f"Falha ao publicar no RabbitMQ: {e}")
        raise HTTPException(status_code=500, detail="Failed to queue event")

    # Avisa ao Stripe que recebemos com sucesso
    return {"status": "success"}

@app.get("/health")
def health_check():
    # Rota simples para monitoramento
    return {"status": "healthy"}
