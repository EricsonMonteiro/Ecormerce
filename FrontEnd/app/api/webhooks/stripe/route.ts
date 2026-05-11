import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET não configurado")
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      )
    }

    // Verify the webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error("Webhook signature verification failed:", error.message)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle specific events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "payment_intent.created":
        await handlePaymentIntentCreated(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object as Stripe.Charge)
        break

      case "charge.updated":
        await handleChargeUpdated(event.data.object as Stripe.Charge)
        break

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      case "product.created":
        await handleProductCreated(event.data.object as Stripe.Product)
        break

      case "price.created":
        await handlePriceCreated(event.data.object as Stripe.Price)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: error.message ?? "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// Event handlers
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("✅ Checkout session completed:", session.id)
  console.log("Customer email:", session.customer_email)
  console.log("Payment status:", session.payment_status)
  console.log("Metadata:", session.metadata)

  // TODO: Update your database
  // - Create order record
  // - Send confirmation email
  // - Update inventory
  // Example:
  // await db.orders.create({
  //   stripeSessionId: session.id,
  //   customerId: session.customer,
  //   email: session.customer_email,
  //   amount: session.amount_total,
  //   status: 'completed',
  //   metadata: session.metadata,
  // })
}

async function handlePaymentIntentCreated(paymentIntent: Stripe.PaymentIntent) {
  console.log("ℹ️ Payment intent created:", paymentIntent.id)
  console.log("Amount:", paymentIntent.amount)
  console.log("Status:", paymentIntent.status)
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("✅ Payment intent succeeded:", paymentIntent.id)
  console.log("Amount:", paymentIntent.amount)
  console.log("Status:", paymentIntent.status)

  // TODO: Handle payment success
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("❌ Payment intent failed:", paymentIntent.id)
  console.log("Last error:", paymentIntent.last_payment_error)

  // TODO: Handle payment failure
  // - Update order status
  // - Send failure email to customer
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log("✅ Charge succeeded:", charge.id)
  console.log("Amount:", charge.amount)
  console.log("Status:", charge.status)
}

async function handleChargeUpdated(charge: Stripe.Charge) {
  console.log("ℹ️ Charge updated:", charge.id)
  console.log("Status:", charge.status)
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("🔄 Charge refunded:", charge.id)
  console.log("Amount refunded:", charge.amount_refunded)

  // TODO: Handle refund
  // - Update order status
  // - Send refund confirmation email
}

async function handleProductCreated(product: Stripe.Product) {
  console.log("ℹ️ Product created:", product.id)
}

async function handlePriceCreated(price: Stripe.Price) {
  console.log("ℹ️ Price created:", price.id)
}
