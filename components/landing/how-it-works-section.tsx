const steps = [
  {
    number: "01",
    title: "Creá tu cuenta",
    description:
      "Registrate en minutos y accedé a tu panel de administración donde podés configurar todo desde el primer día.",
  },
  {
    number: "02",
    title: "Agregá tus productos",
    description:
      "Cargá tus productos con fotos, descripciones y precios. Organizalos por categorías para una navegación más clara.",
  },
  {
    number: "03",
    title: "Personalizá tu marca",
    description:
      "Subí tu logo, elegí tus colores y configurá los datos de tu negocio. Tu catálogo va a reflejar tu identidad.",
  },
  {
    number: "04",
    title: "Compartilo con tus clientes",
    description:
      "Con un simple link tus clientes acceden a tu catálogo, arman su pedido y te lo mandan por WhatsApp.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-background py-24 border-b border-border" id="como-funciona">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          {/* Left sticky header */}
          <div className="lg:w-80 shrink-0">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
              Cómo funciona
            </p>
            <h2 className="text-4xl font-bold text-foreground leading-tight text-balance">
              Empezá a vender en 4 pasos.
            </h2>
          </div>

          {/* Steps */}
          <div className="flex-1 flex flex-col gap-0 divide-y divide-border">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-8 py-10 group"
              >
                <span className="text-5xl font-bold text-border group-hover:text-accent/30 transition-colors leading-none shrink-0 w-16 text-right">
                  {step.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
