import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripePriceIds } from "@/lib/products"

// Initialize Stripe with your secret key
// You need to add STRIPE_SECRET_KEY to your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
})

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export async function POST(request: NextRequest) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Stripe is not configured",
          message:
            "Please add STRIPE_SECRET_KEY to your environment variables",
        },
        { status: 500 }
      )
    }

    const isValidStripePriceId = (priceId?: string) => {
      return (
        typeof priceId === "string" &&
        priceId.startsWith("price_") &&
        !priceId.includes("XXXXXXXX")
      )
    }

    // Create line items for Stripe Checkout
    // Option 1: Use existing Stripe Price IDs (recommended for production)
    // Option 2: Create prices on the fly (fallback)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        const priceId = stripePriceIds[item.id]

        if (isValidStripePriceId(priceId)) {
          return {
            price: priceId,
            quantity: item.quantity,
          }
        }

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: item.name,
              images: [item.image].filter((img) => img.startsWith("http")),
            },
            unit_amount: Math.round(item.price * 100), // Stripe uses cents
            recurring: { interval: "month" }, // fallback também recorrente
          },
          quantity: item.quantity,
        }
      })

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "subscription", // precos no Stripe sao recorrentes (Por mes)
      success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/cart`,
      metadata: {
        order_id: `order_${Date.now()}`,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error?.message ?? "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
