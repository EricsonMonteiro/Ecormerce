import stripe
from config import STRIPE_SECRET_KEY

stripe.api_key = STRIPE_SECRET_KEY

def create_payment_intent(amount: float, currency: str = "usd", description: str = None):
    """
    Cria um Payment Intent no Stripe
    amount: valor em centavos (ex: 1000 = $10.00 para USD)
    """
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Stripe trabalha em centavos
            currency=currency,
            description=description
        )
        return {
            "success": True,
            "client_secret": intent.client_secret,
            "stripe_payment_id": intent.id,
            "amount": intent.amount / 100,
            "currency": intent.currency
        }
    except stripe.error.StripeError as e:
        return {
            "success": False,
            "error": str(e)
        }

def confirm_payment(payment_intent_id: str):
    """
    Confirma o status de um Payment Intent
    """
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        return {
            "success": True,
            "status": intent.status,
            "amount": intent.amount / 100,
            "currency": intent.currency
        }
    except stripe.error.StripeError as e:
        return {
            "success": False,
            "error": str(e)
        }

def refund_payment(payment_intent_id: str, amount: float = None):
    """
    Reembolsa um pagamento total ou parcialmente
    amount: opcional, valor do reembolso em unidades (ex: 10.50 para $10.50)
    """
    try:
        refund_params = {
            "payment_intent": payment_intent_id
        }
        if amount:
            refund_params["amount"] = int(amount * 100)
        
        refund = stripe.Refund.create(**refund_params)
        return {
            "success": True,
            "refund_id": refund.id,
            "amount": refund.amount / 100,
            "status": refund.status
        }
    except stripe.error.StripeError as e:
        return {
            "success": False,
            "error": str(e)
        }
