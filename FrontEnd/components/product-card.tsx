"use client"

import { Product } from "@/context/cart-context"
import { useCart } from "@/context/cart-context"
import { ShoppingBag } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div className="group">
      <div className="relative aspect-square bg-secondary overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-foreground uppercase tracking-wide text-sm">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="font-bold text-foreground text-lg">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}
