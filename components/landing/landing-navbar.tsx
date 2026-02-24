"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder-logo.png"
            alt="Maycam Games logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="font-bold text-foreground text-base">
            Maycam Games
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="#caracteristicas" className="hover:text-foreground transition-colors">
            Características
          </Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">
            Cómo funciona
          </Link>
          <Link href="#planes" className="hover:text-foreground transition-colors">
            Planes
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
          >
            <Link href="/catalogo">Ver demo</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 font-semibold"
          >
            <Link href="#planes">Empezar</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
