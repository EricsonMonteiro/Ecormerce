import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-bold tracking-wider text-foreground uppercase">
              Central Cee Drip
            </span>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Streetwear premium inspirado na cultura UK Drill. Direto das ruas de Londres pro seu estilo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground uppercase tracking-wider text-sm mb-4">Navegacao</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Loja
                </Link>
              </li>
              <li>
                <Link
                  href="#products"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Drops
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cultura
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Minha Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-foreground uppercase tracking-wider text-sm mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entregas
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trocas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2024 Central Cee Drip. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Secure payments via Stripe
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
