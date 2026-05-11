"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function LoginPage() {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        router.push("/")
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-card border border-border p-8">
            {user ? (
              // Logged in state
              <div className="text-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-accent"
                />
                <h1 className="font-serif text-2xl font-bold text-card-foreground uppercase tracking-wider">
                  Welcome, {user.name}!
                </h1>
                <p className="mt-2 text-muted-foreground">{user.email}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Redirecionando para a loja...
                </p>
                <button
                  onClick={signOut}
                  className="mt-6 w-full py-3 border border-border text-foreground font-bold uppercase tracking-wider text-sm hover:bg-secondary transition-colors"
                >
                  Sair da conta
                </button>
              </div>
            ) : (
              // Login form
              <>
                <div className="text-center mb-8">
                  <Link href="/" className="inline-block">
                    <span className="font-serif text-xl font-bold tracking-wider text-foreground uppercase">
                      Central Cee Drip
                    </span>
                  </Link>
                  <h1 className="mt-6 font-serif text-2xl font-bold text-card-foreground uppercase tracking-wider">
                    Login
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Acesse sua conta para continuar comprando
                  </p>
                </div>

                {/* Google Sign In Button */}
                <button
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span>{isLoading ? "Entrando..." : "Continuar com Google"}</span>
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 text-muted-foreground tracking-widest">
                      Ou
                    </span>
                  </div>
                </div>

                {/* Email Form */}
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-card-foreground uppercase tracking-wider mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold text-card-foreground uppercase tracking-wider mb-2"
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors"
                  >
                    Entrar
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Nao tem conta?{" "}
                  <Link
                    href="#"
                    className="text-foreground hover:text-accent transition-colors underline"
                  >
                    Criar conta
                  </Link>
                </p>

                {/* Integration Notice */}
                <div className="mt-8 p-4 bg-secondary border border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    <strong className="text-foreground">Integracao Google Auth:</strong> Configure suas credenciais OAuth do Google Cloud Console para ativar o login.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
