import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen } from 'lucide-react'

import { Button } from './ui/button'

interface HeroProps {
  title: string
  subtitle: string
  showCTA?: boolean
  imagePath?: string
}

export function Hero({
  title,
  subtitle,
  showCTA = true,
  imagePath,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Image with Overlay */}
      {imagePath ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imagePath})` }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
          {/* Accent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        </>
      ) : (
        <>
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb,96,165,250),0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--foreground-rgb,0,0,0),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--foreground-rgb,0,0,0),0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 backdrop-blur-sm mb-6 shadow-lg animate-in fade-in zoom-in duration-500">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">
              Faculty of Computing
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-foreground/80 leading-relaxed mb-12 font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          {showCTA && (
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="gap-2 group shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all text-lg px-10 py-7 h-auto font-semibold"
                >
                  Submit Your Research
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 h-auto border-2 hover:bg-accent/50 font-semibold backdrop-blur-sm bg-background/50"
                >
                  Explore Publications
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
