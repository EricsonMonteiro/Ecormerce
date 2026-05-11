import os
from dotenv import load_dotenv

load_dotenv()

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")

if not STRIPE_SECRET_KEY or not STRIPE_PUBLIC_KEY:
    raise ValueError("Stripe keys não configuradas. Configure as variáveis de ambiente STRIPE_SECRET_KEY e STRIPE_PUBLIC_KEY")
