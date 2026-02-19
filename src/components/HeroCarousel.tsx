import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SlideData {
  title: string
  subtitle: string
  image: string
  ctaText?: string
  ctaLink?: string
  tag?: string
}

interface HeroCarouselProps {
  slides: Array<SlideData>
}

const PROGRESS_INTERVAL = 6000

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: PROGRESS_INTERVAL, stopOnInteraction: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const resetProgress = useCallback(() => {
    setProgress(0)
    startTimeRef.current = Date.now()
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / PROGRESS_INTERVAL) * 100, 100))
    }, 30)
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    resetProgress()
  }, [emblaApi, resetProgress])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollPrev()
      if (e.key === 'ArrowRight') scrollNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [scrollPrev, scrollNext])

  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{ minHeight: 'min(90svh, 780px)' }}
    >
      {/* ── Embla viewport ── */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => {
            const isActive = selectedIndex === index
            return (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative overflow-hidden"
              >
                {/* Photo — full width, gradient fades left side into bg-background for text */}
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center will-change-transform"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      transform: isActive ? 'scale(1.06)' : 'scale(1)',
                      transition: isActive
                        ? 'transform 8000ms cubic-bezier(0.25,0.46,0.45,0.94)'
                        : 'transform 700ms ease-out',
                    }}
                  />
                  {/* Fade photo into bg on the left for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background from-30% via-background/80 via-55% to-background/10" />
                  {/* Subtle top/bottom vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
                </div>

                {/* ── Left accent bar (primary colour) ── */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary origin-top"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                    transition:
                      'opacity 500ms ease, transform 800ms cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: isActive ? '150ms' : '0ms',
                  }}
                />

                {/* ── Slide content ── */}
                <div
                  className="relative h-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 flex items-center"
                  style={{ minHeight: 'inherit' }}
                >
                  <div className="max-w-xl xl:max-w-2xl space-y-6 py-24 lg:py-0">
                    {/* Tag */}
                    <div
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? 'translateY(0)'
                          : 'translateY(12px)',
                        transition: 'all 550ms cubic-bezier(0.16,1,0.3,1)',
                        transitionDelay: isActive ? '80ms' : '0ms',
                      }}
                    >
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-primary border border-primary/25 bg-primary/8 rounded-sm px-3 py-1.5">
                        <BookOpen className="h-3 w-3" />
                        {slide.tag ?? 'Faculty of Computing'}
                      </span>
                    </div>

                    {/* Thin rule under tag */}
                    <div
                      className="w-12 h-[2px] bg-primary origin-left"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'all 600ms cubic-bezier(0.16,1,0.3,1)',
                        transitionDelay: isActive ? '180ms' : '0ms',
                      }}
                    />

                    {/* Title */}
                    <h1
                      className="font-extrabold text-foreground leading-[1.08] tracking-tight"
                      style={{
                        fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)',
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? 'translateY(0)'
                          : 'translateY(22px)',
                        transition: 'all 650ms cubic-bezier(0.16,1,0.3,1)',
                        transitionDelay: isActive ? '240ms' : '0ms',
                      }}
                    >
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p
                      className="text-muted-foreground leading-relaxed"
                      style={{
                        fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
                        maxWidth: '46ch',
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? 'translateY(0)'
                          : 'translateY(22px)',
                        transition: 'all 650ms cubic-bezier(0.16,1,0.3,1)',
                        transitionDelay: isActive ? '360ms' : '0ms',
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTAs */}
                    <div
                      className="flex flex-wrap gap-3 pt-2"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? 'translateY(0)'
                          : 'translateY(22px)',
                        transition: 'all 650ms cubic-bezier(0.16,1,0.3,1)',
                        transitionDelay: isActive ? '460ms' : '0ms',
                      }}
                    >
                      <Link to={slide.ctaLink ?? '/dashboard'}>
                        <button className="group relative inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded text-sm tracking-wide overflow-hidden transition-colors duration-200 active:scale-95 shadow-sm">
                          {/* Shine sweep */}
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                          {slide.ctaText ?? 'Submit Your Research'}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                      <Link to="/about">
                        <button className="inline-flex items-center gap-2 border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground font-medium px-6 py-3 rounded text-sm tracking-wide transition-all duration-200 active:scale-95">
                          Explore Publications
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Nav arrows ── */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center size-10 rounded border border-border bg-background/80 backdrop-blur-sm text-foreground hover:border-primary hover:text-primary transition-all duration-200 active:scale-95 shadow-sm"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center size-10 rounded border border-border bg-background/80 backdrop-blur-sm text-foreground hover:border-primary hover:text-primary transition-all duration-200 active:scale-95 shadow-sm"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Bottom control bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-40">
        {/* Thin top divider */}
        <div className="border-t border-border/60" />
        <div className="bg-background/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 py-3 flex items-center justify-between gap-6">
            {/* Slide counter */}
            <span className="hidden sm:block text-xs font-mono text-muted-foreground tracking-widest select-none">
              <span className="text-foreground font-semibold">
                {String(selectedIndex + 1).padStart(2, '0')}
              </span>
              {' / '}
              {String(slides.length).padStart(2, '0')}
            </span>

            {/* Progress dots */}
            <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="flex items-center"
                >
                  <div
                    className={cn(
                      'relative overflow-hidden rounded-full transition-all duration-400',
                      selectedIndex === i
                        ? 'w-12 h-1 bg-primary/20'
                        : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground',
                    )}
                  >
                    {selectedIndex === i && (
                      <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        style={{
                          width: `${progress}%`,
                          transition: 'width 30ms linear',
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Keyboard hint */}
            <div className="hidden lg:flex items-center gap-1 text-muted-foreground/60 text-[10px] font-mono select-none">
              <kbd className="border border-border rounded px-1 py-0.5">←</kbd>
              <kbd className="border border-border rounded px-1 py-0.5">→</kbd>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
