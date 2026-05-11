import { NextRequest, NextResponse } from "next/server"
import { GOOGLE_CONFIG } from "@/lib/google-oauth"

// Iniciar OAuth Google
export async function GET() {
  if (!GOOGLE_CONFIG.clientId || !GOOGLE_CONFIG.clientSecret || !GOOGLE_CONFIG.redirectUri) {
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

// Callback do OAuth Google
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code not provided" },
        { status: 400 }
      )
    }

    // Trocar código por token de acesso
    const tokenResponse = await fetch(GOOGLE_CONFIG.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CONFIG.clientId,
        client_secret: GOOGLE_CONFIG.clientSecret,
        redirect_uri: GOOGLE_CONFIG.redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Token exchange failed:", tokenData)
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: 400 }
      )
    }

    // Obter dados do usuário
    const userResponse = await fetch(GOOGLE_CONFIG.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error("User info fetch failed:", userData)
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 400 }
      )
    }

    // Retornar dados do usuário
    const user = {
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      avatar: userData.picture,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}