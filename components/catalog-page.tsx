// components/catalog-page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { type Product, fetchProductsFromSheets } from "@/lib/google-sheets"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/context/cart-context"
import { Search, Eye, EyeOff, ShoppingCart, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type PriceSortOrder = "default" | "asc" | "desc"

const parsePriceString = (priceStr: string | number): number => {
  if (typeof priceStr === "number") return priceStr
  if (!priceStr) return 0
  const cleaned = String(priceStr).replace(/\$/g, "").replace(/\./g, "").trim()
  const parsed = Number.parseInt(cleaned, 10)
  return isNaN(parsed) ? 0 : parsed
}

// ✅ OPCIONAL (recomendado): refresco automático para ver cambios del Sheets sin recargar la página.
// Si NO lo querés, poné 0 o comentá el setInterval (más abajo).
const AUTO_REFRESH_MS = 0 // ej: 10000 para 10s. Dejalo 0 si no querés polling.

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  // MODIFICACIÓN 1: Inicializar selectedCategory a "Todos"
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  // MODIFICACIÓN 2: Inicializar selectedBrand a "Todos"
  const [selectedBrand, setSelectedBrand] = useState("Todos")
  const [loading, setLoading] = useState(true)
  const [showOutOfStock, setShowOutOfStock] = useState(false)
  const [priceSort, setPriceSort] = useState<PriceSortOrder>("default")

  const { getTotalItems, isMinQuantityAccessory, setIsDrawerOpen } = useCart()

  // Función para resetear todos los filtros a sus valores por defecto
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Todos")
    setSelectedBrand("Todos")
    setShowOutOfStock(false)
    setPriceSort("default")
    // Hacer scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    let cancelled = false
    let intervalId: number | null = null

    const normalizeProducts = (productsData: Product[]) => {
      return productsData.map((p) => ({
        ...p,
        stock: typeof p.stock === "number" && !isNaN(p.stock) ? p.stock : 0,
      }))
    }

    async function loadData(isBackgroundRefresh = false) {
      // ✅ Para el primer load mostramos spinner.
      // Para refresh en background, NO tocamos loading para no “parpadear” UI.
      if (!isBackgroundRefresh) setLoading(true)

      try {
        const productsData = await fetchProductsFromSheets()
        const normalized = normalizeProducts(productsData)

        if (!cancelled) {
          setProducts(normalized)
          if (!isBackgroundRefresh) setLoading(false)
        }
      } catch (error) {
        console.error("Error loading products:", error)
        if (!cancelled && !isBackgroundRefresh) setLoading(false)
      }
    }

    // Primer load (con spinner)
    loadData(false)

    // ✅ Opcional: polling para ver cambios del Sheets sin recargar.
    if (AUTO_REFRESH_MS && AUTO_REFRESH_MS > 0) {
      intervalId = window.setInterval(() => {
        void loadData(true)
      }, AUTO_REFRESH_MS)
    }

    return () => {
      cancelled = true
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  const filteredProducts = useMemo(() => {
    let currentFiltered = products.slice()

    console.log("[v0] --- Aplicando Filtros ---")
    console.log("[v0] showOutOfStock:", showOutOfStock)
    console.log("[v0] products count (initial):", products.length)

    // 1. Limpieza básica (asegura SKU válido)
    currentFiltered = currentFiltered.filter((p) => p.sku && p.sku.trim() !== "")
    console.log("[v0] After SKU filter:", currentFiltered.length)

    // 2. Filtro de Stock - CRÍTICO: verificar que stock es un número
    if (!showOutOfStock) {
      currentFiltered = currentFiltered.filter((p) => {
        const stockNum = typeof p.stock === "number" ? p.stock : 0
        return stockNum > 0
      })
      console.log("[v0] After Stock filter (stock > 0):", currentFiltered.length)
    }

    // 3. Filtro de Categoría
    if (selectedCategory !== "Todos") {
      currentFiltered = currentFiltered.filter((p) => p.categoria === selectedCategory)
      console.log("[v0] After Category filter:", currentFiltered.length)
    }

    // 4. Filtro de Marca
    if (selectedBrand !== "Todos") {
      currentFiltered = currentFiltered.filter((p) => p.marca === selectedBrand)
      console.log("[v0] After Brand filter:", currentFiltered.length)
    }

    // 5. BÚSQUEDA DE ALTA PRECISIÓN (nombre, SKU, nivel de juego y año)
    if (searchTerm) {
      const cleanSearch = searchTerm.toLowerCase().trim()
      const searchTerms = cleanSearch.split(/\s+/)
      currentFiltered = currentFiltered.filter((p) => {
        const normalizedName = (p.nombre || "").toLowerCase().replace(/[-/()]/g, " ")
        const nameWords = normalizedName.split(/\s+/)
        const normalizedSku = (p.sku || "").toLowerCase()
        const normalizedNivel = (p.nivelDeJuego || "").toLowerCase()
        const normalizedAño = (p.año || "").toLowerCase()
        
        return searchTerms.every((term) => {
          // Buscar en SKU
          if (normalizedSku.includes(term)) return true
          // Buscar en nombre
          if (nameWords.some((word) => word.startsWith(term))) return true
          // Buscar en nivel de juego (ej: "avanzado", "intermedio", etc.)
          if (normalizedNivel.includes(term)) return true
          // Buscar en año (ej: "2026", "2025", etc.)
          if (normalizedAño.includes(term)) return true
          return false
        })
      })
      console.log("[v0] After Search filter:", currentFiltered.length)
    }

    // 6. FILTRO POR PRECIO
    if (priceSort !== "default") {
      currentFiltered = [...currentFiltered].sort((a, b) => {
        const getReferencePrice = (product: Product) => {
          const basePrice = parsePriceString(product.precio3)
          return isMinQuantityAccessory(product) ? basePrice * 2 : basePrice
        }
        const priceA = getReferencePrice(a)
        const priceB = getReferencePrice(b)
        return priceSort === "asc" ? priceA - priceB : priceB - priceA
      })
      console.log("[v0] After Price sort:", currentFiltered.length)
    }

    console.log("[v0] Final filteredProducts count:", currentFiltered.length)
    return currentFiltered
  }, [products, searchTerm, selectedCategory, selectedBrand, showOutOfStock, priceSort, isMinQuantityAccessory])

  const categories = useMemo(() => {
    // Ya incluye "Todos" al inicio, lo cual es correcto.
    return ["Todos", ...new Set(products.filter((p) => p.sku && p.sku.trim() !== "").map((p) => p.categoria))]
  }, [products])

  const availableBrands = useMemo(() => {
    if (selectedCategory !== "Todos") {
      const categoryProducts = products.filter((p) => p.categoria === selectedCategory && p.sku && p.sku.trim() !== "")
      // Ya incluye "Todos" al inicio, lo cual es correcto.
      return ["Todos", ...new Set(categoryProducts.map((p) => p.marca).filter(Boolean))]
    } else {
      // Ya incluye "Todos" al inicio, lo cual es correcto.
      return [
        "Todos",
        ...new Set(
          products
            .filter((p) => p.sku && p.sku.trim() !== "")
            .map((p) => p.marca)
            .filter(Boolean),
        ),
      ]
    }
  }, [products, selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />

      <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Ir al inicio y resetear filtros"
            >
              <img
                src="https://i.ibb.co/5XWFV3QX/LOGO-MAYCAM-GAMES.png"
                alt="Maycam Games"
                className="h-8 sm:h-12 w-auto"
              />
              <div>
                <h1 className="text-sm sm:text-2xl font-black text-foreground">MAYCAM GAMES</h1>
                <p className="text-[9px] sm:text-xs text-muted-foreground">Catálogo Mayorista</p>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition text-sm font-medium">
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">¿Cómo comprar?</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-gray-50/50 backdrop-blur-xl border-white/20">
                  <div className="p-6 bg-white rounded-t-lg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black text-center mb-2 flex items-center justify-center gap-2 text-slate-800">
                        <Info className="w-6 h-6 text-blue-600" />
                        ¿Cómo comprar?
                      </DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 grid gap-6">
                      {/* Pasos */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">
                            1
                          </span>
                          Pasos para comprar
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                            <span className="font-bold text-slate-800 block mb-1">🔍 Buscar</span>
                            Usá los filtros o el buscador para encontrar tus productos.
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                            <span className="font-bold text-slate-800 block mb-1">🛒 Agregar</span>
                            Sumá los productos que quieras al carrito.
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                            <span className="font-bold text-slate-800 block mb-1">📋 Copiar</span>
                            Tocá el botón verde "Copiar carrito" al finalizar.
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                            <span className="font-bold text-slate-800 block mb-1">💬 Enviar</span>
                            Pegá el pedido en WhatsApp para confirmar.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-b-lg space-y-4">
                    {/* Accesorios */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="text-xl">🧢</span> Accesorios
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        Compra mínima mayorista:{" "}
                        <span className="font-bold text-blue-600">20 unidades</span> (surtido).
                      </p>
                      <div className="bg-blue-50 text-blue-800 text-xs p-2 rounded-lg border border-blue-100">
                        👉 Menos de 20 unidades = precio unitario más alto. Al llegar a 20, se
                        ajusta automáticamente.
                      </div>
                    </div>

                    {/* Pelotas */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="text-xl">🎾</span> Pelotas
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        Venta <span className="font-bold text-red-600">EXCLUSIVAMENTE POR CAJA</span>.
                      </p>
                      <p className="text-sm text-slate-600 mb-3">
                        Stock = <span className="italic">Disponible</span>.
                      </p>
                      <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg border border-orange-100">
                        <span className="font-bold block mb-1">Ejemplo:</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                          <li>
                            En el carrito:{" "}
                            <span className="font-bold">1 unidad = 1 caja x 24 tubos</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <button
                onClick={() => setShowOutOfStock(!showOutOfStock)}
                className={`hidden sm:flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium
              ${
                showOutOfStock
                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
              >
                {showOutOfStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showOutOfStock ? "Ocultar productos sin stock" : "Mostrar productos sin stock"}</span>
              </button>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative bg-gradient-to-br from-green-300 to-emerald-400 text-white rounded-full px-3 sm:pl-4 sm:pr-5 py-2 sm:py-2 flex items-center justify-center shadow-lg font-bold text-xs sm:text-lg transition hover:from-green-400 hover:to-emerald-500 h-9 sm:h-12"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">En carrito ({getTotalItems()})</span>
                <span className="inline sm:hidden ml-1">({getTotalItems()})</span>
              </button>
            </div>
          </div>

          <div className="mb-3 sm:mb-4 sm:hidden">
            <button
              onClick={() => setShowOutOfStock(!showOutOfStock)}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition text-xs font-medium
              ${
                showOutOfStock
                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {showOutOfStock ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showOutOfStock ? "Ocultar productos sin stock" : "Mostrar productos sin stock"}</span>
            </button>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU, nivel (ej: avanzado) o año (ej: 2026)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2.5 text-xs sm:text-base border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label
                  htmlFor="category-select"
                  className="text-[10px] sm:text-xs font-semibold text-foreground mb-1 sm:mb-2 block"
                >
                  Categoría
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedBrand("Todos")
                    setSearchTerm("")
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2.5 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="brand-select"
                  className="text-[10px] sm:text-xs font-semibold text-foreground mb-1 sm:mb-2 block"
                >
                  Marca
                </label>
                <select
                  id="brand-select"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value)
                    setSearchTerm("")
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2.5 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="price-sort-select"
                  className="text-[10px] sm:text-xs font-semibold text-foreground mb-1 sm:mb-2 block"
                >
                  Ordenar por Precio
                </label>
                <select
                  id="price-sort-select"
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as PriceSortOrder)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2.5 text-xs sm:text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="default">Por defecto</option>
                  <option value="asc">Menor a Mayor</option>
                  <option value="desc">Mayor a Menor</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin w-8 h-8 border-4 border-border border-t-accent rounded-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                images={product.urlImagenes || []}
                showOutOfStock={showOutOfStock}
                priorityImage={index < 6}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
