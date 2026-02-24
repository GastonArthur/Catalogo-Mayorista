import {
  Package,
  Tag,
  Image,
  Settings,
  Palette,
  Share2,
  ShoppingCart,
  Search,
  Layers,
} from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Gestión de productos",
    description:
      "Agregá, editá y organizá todos tus productos con nombre, descripción, precio mayorista y minorista.",
  },
  {
    icon: Tag,
    title: "Precios flexibles",
    description:
      "Configurá precios de lista, precios especiales y porcentajes de descuento por cantidad o categoría.",
  },
  {
    icon: Image,
    title: "Imágenes y multimedia",
    description:
      "Subí múltiples fotos por producto. Lightbox integrado para que tus clientes vean los detalles.",
  },
  {
    icon: Palette,
    title: "Tu marca, tu identidad",
    description:
      "Personalizá con tu logo, colores corporativos, nombre de negocio y datos de contacto.",
  },
  {
    icon: Settings,
    title: "Configuración avanzada",
    description:
      "Controlá qué se muestra: precios, stock, categorías, y cómo se ordena el catálogo.",
  },
  {
    icon: Search,
    title: "Búsqueda y filtros",
    description:
      "Tus clientes encuentran lo que buscan con filtros por categoría, precio y disponibilidad.",
  },
  {
    icon: ShoppingCart,
    title: "Carrito de pedidos",
    description:
      "Los compradores arman su pedido directamente en el catálogo y te lo envían por WhatsApp.",
  },
  {
    icon: Share2,
    title: "Compartir fácil",
    description:
      "Un link único para tu catálogo. Compartilo por WhatsApp, Instagram o donde quieras.",
  },
  {
    icon: Layers,
    title: "Categorías y organización",
    description:
      "Organizá tus productos en categorías para una navegación más clara y profesional.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-24 border-b border-border" id="caracteristicas">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Características
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
            Todo lo que necesitás para vender al por mayor.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-background p-8 flex flex-col gap-4 hover:bg-secondary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
