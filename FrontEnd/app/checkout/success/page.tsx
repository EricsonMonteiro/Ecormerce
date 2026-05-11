"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useCart } from "@/context/cart-context"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-wider">
            Pedido Confirmado
          </h1>

          <p className="mt-4 text-muted-foreground">
            Obrigado pela compra. Voce recebera um email com os detalhes do seu pedido.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-foreground/90 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
