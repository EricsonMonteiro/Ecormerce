"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-foreground uppercase">
              Central Cee Drip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Loja
            </Link>
            <Link
              href="#products"
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Drops
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Cultura
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {user ? (
                <>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{user.name}</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span className="uppercase tracking-wider text-xs">Entrar</span>
                </>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Loja
              </Link>
              <Link
                href="#products"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Drops
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Cultura
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {user ? user.name : "Entrar"}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
