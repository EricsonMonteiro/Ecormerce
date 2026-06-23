"""
seed.py - Script para popular o banco de dados com os produtos da loja.

Uso:
    python seed.py

Requer que a products_api esteja rodando em http://localhost:8003
"""

import requests

API_URL = "http://localhost:8003/products/"

PRODUCTS = [
    {
        "name": "Oversized Hoodie Black",
        "description": "Moletom oversized premium com bordado minimalista. Estilo UK Drill.",
        "price": 289.00,
        "image_url": "/products/hoodie-black.jpg",
        "stripe_price_id": "price_1TVtDIGX2Wh3OjU9Wtu7tm6Y",
    },
    {
        "name": "Cargo Tactical Pants",
        "description": "Calca cargo tatica com multiplos bolsos. Corte streetwear.",
        "price": 349.00,
        "image_url": "/products/cargo-pants.jpg",
        "stripe_price_id": "price_1TVtEpGX2Wh3OjU9ks6Wrir4",
    },
    {
        "name": "Graphic Tee Oversized",
        "description": "Camiseta oversized com estampa exclusiva. 100% algodao.",
        "price": 189.00,
        "image_url": "/products/tshirt-graphic.jpg",
        "stripe_price_id": "price_1TVtBPGX2Wh3OjU9gMulVMpr",
    },
    {
        "name": "Puffer Jacket Black",
        "description": "Jaqueta puffer premium. Estilo luxury streetwear.",
        "price": 549.00,
        "image_url": "/products/puffer-jacket.jpg",
        "stripe_price_id": "price_1TVtGGGX2Wh3OjU9GwbBWPop",
    },
]


def seed():
    print("Verificando produtos existentes...\n")

    existing = requests.get(API_URL).json()
    if existing:
        print(f"Ja existem {len(existing)} produto(s) no banco. Pulando seed.")
        print("Se quiser re-inserir, delete os produtos primeiro via DELETE /products/{id}")
        return

    print("Inserindo produtos...\n")
    for product in PRODUCTS:
        resp = requests.post(API_URL, json=product)
        if resp.status_code == 201:
            data = resp.json()
            print(f"OK: [{data['id']}] {data['name']} - R${data['price']:.2f}")
        else:
            print(f"ERRO: {product['name']}: {resp.status_code} - {resp.text}")

    print("\nSeed concluido!")


if __name__ == "__main__":
    seed()
