"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function GoogleCallbackPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")

      if (!code) {
        setError("Código de autorização não encontrado")
        return
      }

      try {
        const response = await fetch("http://localhost:8000/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Falha na autenticação")
        }

        // Armazenar dados do usuário (pode usar localStorage, sessionStorage, ou contexto)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirecionar para a página principal
        router.push("/")
      } catch (err: any) {
        console.error("Callback error:", err)
        setError(err.message || "Erro durante autenticação")
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Autenticação</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold">Processando login...</h1>
        <p className="text-gray-600 mt-2">Aguarde enquanto conectamos sua conta Google.</p>
      </div>
    </div>
  )
}