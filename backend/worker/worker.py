import os
import pika
import json
import time
import requests

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
ORDERS_API_URL = os.getenv("ORDERS_API_URL", "http://orders_api:8000")

def process_event(ch, method, properties, body):
    event = json.loads(body)
    event_type = event.get('type')
    stripe_event_id = event.get('id')
    print(f"[Worker] Evento recebido do RabbitMQ: {event_type} | ID: {stripe_event_id}")

    # ------------------------------------------------------------------ #
    # Evento 1: checkout.session.completed                                #
    # Cria uma nova order na Orders API via POST                          #
    # ------------------------------------------------------------------ #
    if event_type == 'checkout.session.completed':
        session = event.get('data', {}).get('object', {})
        metadata = session.get('metadata', {})

        payment_status = session.get('payment_status', 'paid')
        order_status = "PAID" if payment_status == "paid" else "pending"

        order_data = {
            "customer_id": session.get('customer') or metadata.get('customer_id', 'unknown'),
            "stripe_event_id": stripe_event_id,
            "status": order_status,
            "total_amount": session.get('amount_total', 0) / 100.0
        }

        try:
            response = requests.post(f"{ORDERS_API_URL}/orders/", json=order_data)
            if response.status_code in [200, 201]:
                print(f"[Worker] Order criada com sucesso: {response.json()}")
            else:
                print(f"[Worker] Falha ao criar order: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[Worker] Erro de conexão com Orders API: {e}")

    # ------------------------------------------------------------------ #
    # Evento 2: payment_intent.succeeded                                  #
    # Atualiza a order existente para status PAID via HTTP PUT            #
    # ------------------------------------------------------------------ #
    elif event_type == 'payment_intent.succeeded':
        payment_intent = event.get('data', {}).get('object', {})
        metadata = payment_intent.get('metadata', {})

        # O order_id deve ser enviado como metadata do PaymentIntent no Stripe
        order_id = metadata.get('order_id')

        if not order_id:
            print(f"[Worker] payment_intent.succeeded recebido sem 'order_id' no metadata. Ignorando update.")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        update_data = {
            "status": "PAID",
            "stripe_event_id": stripe_event_id
        }

        try:
            response = requests.put(f"{ORDERS_API_URL}/orders/{order_id}", json=update_data)
            if response.status_code == 200:
                print(f"[Worker] Order {order_id} atualizada para PAID com sucesso: {response.json()}")
            elif response.status_code == 404:
                print(f"[Worker] Order {order_id} não encontrada na Orders API.")
            else:
                print(f"[Worker] Falha ao atualizar order {order_id}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[Worker] Erro de conexão com Orders API: {e}")

    # ------------------------------------------------------------------ #
    # Evento 3: payment_intent.payment_failed                             #
    # Atualiza a order existente para status FAILED via HTTP PUT          #
    # ------------------------------------------------------------------ #
    elif event_type == 'payment_intent.payment_failed':
        payment_intent = event.get('data', {}).get('object', {})
        metadata = payment_intent.get('metadata', {})
        order_id = metadata.get('order_id')

        if not order_id:
            print(f"[Worker] payment_intent.payment_failed recebido sem 'order_id' no metadata. Ignorando update.")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        update_data = {
            "status": "FAILED",
            "stripe_event_id": stripe_event_id
        }

        try:
            response = requests.put(f"{ORDERS_API_URL}/orders/{order_id}", json=update_data)
            if response.status_code == 200:
                print(f"[Worker] Order {order_id} atualizada para FAILED: {response.json()}")
            elif response.status_code == 404:
                print(f"[Worker] Order {order_id} não encontrada na Orders API.")
            else:
                print(f"[Worker] Falha ao atualizar order {order_id}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[Worker] Erro de conexão com Orders API: {e}")

    else:
        print(f"[Worker] Evento '{event_type}' não mapeado. Ignorando.")

    ch.basic_ack(delivery_tag=method.delivery_tag)

def start_worker():
    parameters = pika.URLParameters(RABBITMQ_URL)
    connection = None
    
    while True:
        try:
            connection = pika.BlockingConnection(parameters)
            break
        except Exception as e:
            print(f"Aguardando RabbitMQ iniciar... {e}")
            time.sleep(5)

    channel = connection.channel()
    channel.queue_declare(queue='stripe_events', durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='stripe_events', on_message_callback=process_event)
    
    print("Worker iniciado. Aguardando eventos do Stripe no RabbitMQ...")
    channel.start_consuming()

if __name__ == '__main__':
    start_worker()
