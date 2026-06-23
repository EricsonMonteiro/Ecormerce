import { Product } from "@/context/cart-context"

export const products: Product[] = [
  {
    id: "drill-hoodie-01",
    name: "Oversized Hoodie Black",
    price: 289.00,
    image: "/products/hoodie-black.jpg",
    description: "Moletom oversized premium com bordado minimalista. Estilo UK Drill.",
  },
  {
    id: "drill-cargo-01",
    name: "Cargo Tactical Pants",
    price: 349.00,
    image: "/products/cargo-pants.jpg",
    description: "Calca cargo tatica com multiplos bolsos. Corte streetwear.",
  },
  {
    id: "drill-tee-01",
    name: "Graphic Tee Oversized",
    price: 189.00,
    image: "/products/tshirt-graphic.jpg",
    description: "Camiseta oversized com estampa exclusiva. 100% algodao.",
  },
  {
    id: "drill-puffer-01",
    name: "Puffer Jacket Black",
    price: 549.00,
    image: "/products/puffer-jacket.jpg",
    description: "Jaqueta puffer premium. Estilo luxury streetwear.",
  },
]

// Stripe Price IDs - configure no seu Stripe Dashboard
// Se não quiser usar IDs fixos, deixe como placeholder e o checkout criará os preços dinamicamente.
export const stripePriceIds: Record<string, string> = {
  "drill-hoodie-01": "price_1TVtDIGX2Wh3OjU9Wtu7tm6Y",
  "drill-cargo-01":  "price_1TVtEpGX2Wh3OjU9ks6Wrir4",
  "drill-tee-01":    "price_1TVtBPGX2Wh3OjU9gMulVMpr",
  "drill-puffer-01": "price_1TVtGGGX2Wh3OjU9GwbBWPop",
}
