"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Inicial",
    price: "Gratis",
    period: "",
    description: "Para empezar a digitalizar tu catálogo sin costo.",
    highlight: false,
    cta: "Empezar gratis",
    features: [
      "Hasta 30 productos",
      "1 catálogo activo",
      "Imágenes por producto",
      "Link para compartir",
      "Carrito de pedidos",
      "Soporte por email",
    ],
  },
  {
    name: "Profesional",
    price: "$9.999",
    period: "/mes",
    description: "Para negocios que quieren una imagen más completa.",
    highlight: true,
    badge: "Más elegido",
    cta: "Comenzar ahora",
    features: [
      "Productos ilimitados",
      "3 catálogos activos",
      "Logo y colores propios",
      "Precios diferenciados",
      "Filtros y búsqueda avanzada",
      "Pedidos por WhatsApp",
      "Soporte prioritario",
    ],
  },
  {
    name: "Empresarial",
    price: "$24.999",
    period: "/mes",
    description: "Para distribuidoras con alto volumen y múltiples canales.",
    highlight: false,
    cta: "Contactar ventas",
    features: [
      "Todo lo de Profesional",
      "Catálogos ilimitados",
      "Usuarios múltiples",
      "Acceso por API",
      "Dominio personalizado",
      "Estadísticas avanzadas",
      "Soporte dedicado 24/7",
    ],
  },
]

export function PricingSection() {
  return (
    <section className="bg-secondary/20 py-24 border-b border-border" id="planes">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Planes y precios
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance mb-4">
            Elegí el plan que se adapta a tu negocio.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Sin costos ocultos. Podés cambiar o cancelar cuando quieras.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 transition-all",
                plan.highlight
                  ? "bg-foreground text-background border-foreground shadow-2xl scale-[1.02]"
                  : "bg-card text-foreground border-border"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <p
                  className={cn(
                    "text-sm font-semibold uppercase tracking-widest mb-3",
                    plan.highlight ? "text-background/60" : "text-muted-foreground"
                  )}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span
                      className={cn(
                        "text-base",
                        plan.highlight
                          ? "text-background/60"
                          : "text-muted-foreground"
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    plan.highlight ? "text-background/70" : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        plan.highlight ? "text-accent" : "text-accent"
                      )}
                      strokeWidth={2.5}
                    />
                    <span
                      className={
                        plan.highlight ? "text-background/85" : "text-foreground/80"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={cn(
                  "w-full font-semibold",
                  plan.highlight
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
