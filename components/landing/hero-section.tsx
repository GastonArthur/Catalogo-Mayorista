"use client"

import Link from "next/link"
import { ArrowRight, Package, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden border-b border-border">
      {/* Grid lines background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16">
          {/* Left: text */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Plataforma mayorista para distribuidores
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight text-balance mb-8">
              Tu catálogo
              <br />
              mayorista,{" "}
              <span className="text-accent">profesional.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
              Creá y compartí tu catálogo de productos con precios mayoristas,
              imágenes, tu marca y mucho más. Todo desde un panel simple y
              potente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold text-base px-8"
              >
                <Link href="/catalogo">
                  Ver catálogo demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8 border-border"
              >
                <Link href="#planes">Ver planes</Link>
              </Button>
            </div>
          </div>

          {/* Right: stat cards */}
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-lg">
            {[
              {
                icon: Package,
                value: "Ilimitado",
                label: "Productos en el catálogo",
              },
              {
                icon: TrendingUp,
                value: "100%",
                label: "Personalizable con tu marca",
              },
              {
                icon: Users,
                value: "Fácil",
                label: "Compartir con clientes",
              },
              {
                icon: ArrowRight,
                value: "Gratis",
                label: "Para empezar hoy mismo",
              },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2"
              >
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
