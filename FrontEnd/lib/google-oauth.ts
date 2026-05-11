// Configuração do Google OAuth para Next.js
// Baseado na implementação PHP existente

export const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,

  // URLs do Google OAuth
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",

  // Scopes necessários
  scopes: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ].join(" ")
}

// Função auxiliar para gerar URL de autorização
export function generateAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: "code",
    scope: GOOGLE_CONFIG.scopes,
    access_type: "offline",
    prompt: "consent"
  })

  return `${GOOGLE_CONFIG.authUrl}?${params.toString()}`
}