// FrontEnd/app/api/webhooks/stripe/handlers.ts
// Exemplo de como integrar com seu banco de dados

import Stripe from "stripe"

// Tipos para sua aplicação
interface Order {
  id?: string
  stripeSessionId: string
  stripePaymentIntentId?: string
  customerEmail?: string
  customerName?: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  items: OrderItem[]
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitAmount: number
  totalAmount: number
}

// ============================================
// EXEMPLO 1: Firebase (Recomendado para Serverless)
// ============================================

/*
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, updateDoc, doc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function createOrder(order: Order) {
  const docRef = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return docRef.id
}

export async function updateOrderStatus(
  stripeSessionId: string,
  status: Order["status"]
) {
  const ordersRef = collection(db, "orders")
  const querySnapshot = await getDocs(
    query(ordersRef, where("stripeSessionId", "==", stripeSessionId))
  )

  if (querySnapshot.size > 0) {
    const docId = querySnapshot.docs[0].id
    await updateDoc(doc(db, "orders", docId), {
      status,
      updatedAt: new Date(),
    })
  }
}
*/

// ============================================
// EXEMPLO 2: PostgreSQL com Prisma
// ============================================

/*
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createOrder(order: Order) {
  const result = await prisma.order.create({
    data: {
      stripeSessionId: order.stripeSessionId,
      stripePaymentIntentId: order.stripePaymentIntentId,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      items: JSON.stringify(order.items),
      metadata: JSON.stringify(order.metadata),
    },
  })
  return result.id
}

export async function updateOrderStatus(
  stripeSessionId: string,
  status: Order["status"]
) {
  await prisma.order.update({
    where: { stripeSessionId },
    data: {
      status,
      updatedAt: new Date(),
    },
  })
}
*/

// ============================================
// EXEMPLO 3: MongoDB com Mongoose
// ============================================

/*
import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  stripeSessionId: { type: String, required: true, unique: true },
  stripePaymentIntentId: String,
  customerEmail: String,
  customerName: String,
  amount: Number,
  currency: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  items: Array,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema)

export async function createOrder(order: Order) {
  const result = await Order.create(order)
  return result._id
}

export async function updateOrderStatus(
  stripeSessionId: string,
  status: Order["status"]
) {
  await Order.findOneAndUpdate(
    { stripeSessionId },
    {
      status,
      updatedAt: new Date(),
    }
  )
}
*/

// ============================================
// EXEMPLO 4: Supabase (PostgreSQL hospedado)
// ============================================

/*
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function createOrder(order: Order) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        stripe_session_id: order.stripeSessionId,
        stripe_payment_intent_id: order.stripePaymentIntentId,
        customer_email: order.customerEmail,
        customer_name: order.customerName,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        items: order.items,
        metadata: order.metadata,
      },
    ])
    .select()

  if (error) throw error
  return data[0].id
}

export async function updateOrderStatus(
  stripeSessionId: string,
  status: Order["status"]
) {
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date() })
    .eq("stripe_session_id", stripeSessionId)

  if (error) throw error
}
*/

// ============================================
// HELPER: Enviar Email de Confirmação
// ============================================

/*
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  amount: number,
  items: OrderItem[]
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td>${item.productName}</td>
          <td>${item.quantity}x</td>
          <td>R$ ${(item.unitAmount / 100).toFixed(2)}</td>
        </tr>`
    )
    .join("")

  const html = `
    <h1>Pedido Confirmado!</h1>
    <p>Olá ${customerName},</p>
    <p>Seu pagamento foi confirmado. Aqui estão os detalhes:</p>
    
    <table>
      <tr>
        <th>Produto</th>
        <th>Qtd</th>
        <th>Preço</th>
      </tr>
      ${itemsHtml}
    </table>
    
    <p><strong>Total: R$ ${(amount / 100).toFixed(2)}</strong></p>
    <p>Número do pedido: ${orderId}</p>
    
    <p>Obrigado por sua compra!</p>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "Pedido Confirmado",
    html,
  })
}
*/

// ============================================
// Como usar no webhook
// ============================================

/*
// Em app/api/webhooks/stripe/route.ts:

import { createOrder, updateOrderStatus, sendOrderConfirmationEmail } from "./handlers"

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const orderId = await createOrder({
    stripeSessionId: session.id,
    customerEmail: session.customer_email,
    amount: session.amount_total || 0,
    currency: session.currency || "brl",
    status: "completed",
    items: [], // Parse from session.line_items
    metadata: session.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await sendOrderConfirmationEmail(
    session.customer_email || "",
    "Cliente",
    orderId,
    session.amount_total || 0,
    []
  )
}
*/

export {}
