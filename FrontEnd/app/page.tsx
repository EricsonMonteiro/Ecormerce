import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-background overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40">
            <div className="max-w-3xl">
              <p className="text-accent font-medium uppercase tracking-widest text-sm mb-4">
                UK Drill Streetwear
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-none text-foreground uppercase tracking-tight text-balance">
                Central Cee
                <br />
                <span className="text-muted-foreground">Drip</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Streetwear premium inspirado na cultura UK Drill. Estilo que vem das ruas de Londres direto pro seu guarda-roupa.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-foreground/90 transition-colors"
                >
                  Ver Drops
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-bold uppercase tracking-wider text-sm hover:bg-secondary transition-colors"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-accent font-medium uppercase tracking-widest text-sm mb-2">
                Colecao Exclusiva
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground uppercase tracking-tight">
                Latest Drops
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Pecas limitadas. Quando acaba, acaba.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="bg-secondary py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              A Vibe
            </p>
            <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold uppercase tracking-tight">
              {'"Straight from the streets of West London"'}
            </blockquote>
            <cite className="mt-6 block text-sm font-medium text-accent not-italic uppercase tracking-widest">
              — UK Drill Culture
            </cite>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-accent font-medium uppercase tracking-widest text-sm mb-4">
                  Sobre a Marca
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground uppercase tracking-tight">
                  Cultura que
                  <br />
                  <span className="text-muted-foreground">vira estilo</span>
                </h2>
                <p className="mt-6 text-muted-foreground">
                  Inspirados na cena UK Drill e no estilo inconfundivel do Central Cee, criamos pecas que representam a atitude das ruas. Cada item e pensado para quem vive a cultura.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Qualidade premium, cortes oversized, e aquela vibe que so quem entende, entende.
                </p>
                <Link
                  href="#products"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-accent transition-colors uppercase tracking-wider"
                >
                  Ver Colecao
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-secondary aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <span className="font-serif text-6xl font-bold text-muted-foreground/20 uppercase">CC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-foreground text-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs uppercase tracking-widest text-background/60 mb-4">
                Stay Updated
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight">
                Nao perca os proximos drops
              </h2>
              <p className="mt-4 text-background/70">
                Cadastre-se e receba primeiro acesso as novas colecoes e ofertas exclusivas.
              </p>
              <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 px-4 py-4 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors"
                >
                  Inscrever
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
