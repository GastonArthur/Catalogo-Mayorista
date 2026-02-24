import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaFooterSection() {
  return (
    <>
      {/* CTA Banner */}
      <section className="bg-foreground py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-background leading-tight text-balance mb-6">
            Tu catálogo mayorista,
            <br />
            listo en minutos.
          </h2>
          <p className="text-background/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Unite a los distribuidores que ya digitalizaron su negocio con
            Maycam Games Catálogo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-10"
            >
              <Link href="#planes">
                Ver planes
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/30 text-background hover:bg-background/10 font-semibold text-base px-10"
            >
              <Link href="/catalogo">Ver catálogo demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm">
              Maycam Games
            </span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground text-sm">
              Catálogo Mayorista
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#caracteristicas" className="hover:text-foreground transition-colors">
              Características
            </Link>
            <Link href="#planes" className="hover:text-foreground transition-colors">
              Planes
            </Link>
            <Link href="/catalogo" className="hover:text-foreground transition-colors">
              Demo
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Maycam Games. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}
