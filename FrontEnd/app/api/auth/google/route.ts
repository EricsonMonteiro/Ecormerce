import { NextRequest, NextResponse } from "next/server"
import { GOOGLE_CONFIG } from "@/lib/google-oauth"

// Iniciar OAuth Google
export async function GET() {
  if (!GOOGLE_CONFIG.clientId || !GOOGLE_CONFIG.redirectUri) {
    return NextResponse.json(
      { error: "Google OAuth not configured" },
      { status: 500 }
    )
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: "code",
    scope: GOOGLE_CONFIG.scopes,
    access_type: "offline",
    prompt: "consent"
  })

  const authUrl = `${GOOGLE_CONFIG.authUrl}?${params.toString()}`

  return NextResponse.redirect(authUrl)
}
