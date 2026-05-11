"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.message || data.error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Erro ao processar checkout. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground uppercase tracking-wider">
              Carrinho vazio
            </h1>
            <p className="mt-2 text-muted-foreground">
              Adicione produtos para comecar.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-foreground/90 transition-colors"
            >
              Ver Drops
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-wider mb-8">
            Seu Carrinho
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card border border-border"
                >
                  <div className="w-24 h-24 bg-secondary overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://placehold.co/100x100/1a1a1a/ffffff?text=${encodeURIComponent(item.name)}`
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-card-foreground uppercase tracking-wide text-sm">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-card-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors uppercase tracking-wider"
              >
                Limpar carrinho
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-6 sticky top-24">
                <h2 className="font-bold text-card-foreground uppercase tracking-wider text-sm mb-4">
                  Resumo
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span>Calculado no checkout</span>
                  </div>
                </div>

                <div className="border-t border-border my-4" />

                <div className="flex justify-between font-bold text-card-foreground">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full mt-6 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Processando..." : "Finalizar Compra"}
                </button>

                <p className="mt-4 text-xs text-center text-muted-foreground">
                  Pagamento seguro via Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
