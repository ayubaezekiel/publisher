import { HeroCarousel } from '@/components/HeroCarousel'
import { Stats } from '@/components/stats'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, Globe, Shield, TrendingUp, Zap } from 'lucide-react'

// Assets
import facultyImage from '/faculty_computing_1771235743947.png'
import heroImage from '/hero_academic_research_1771235709059.png'
import aiImage from '/research_area_ai_1771235841739.png'
import securityImage from '/research_area_cybersecurity_1771235859577.png'
import dataImage from '/research_area_data_1771235872985.png'
import collaborationImage from '/research_collaboration_1771235722874.png'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const HERO_SLIDES = [
  {
    title: 'Advancing Computing Research',
    subtitle:
      'A peer-reviewed platform for groundbreaking research from the Faculty of Computing.',
    image: heroImage,
    ctaText: 'Publish Your Work',
  },
  {
    title: 'Collaborative Excellence',
    subtitle:
      'Connect with global researchers and push the boundaries of digital innovation.',
    image: collaborationImage,
    ctaText: 'Explore Initiatives',
  },
  {
    title: 'Future of Computing',
    subtitle:
      'Shaping the next generation of technology through rigorous academic standards.',
    image: facultyImage,
    ctaText: 'Join the Faculty',
  },
]

// ─── Section header shared component ──────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && (
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
        {title}
      </h2>
      <div
        className={`mt-4 h-[3px] w-14 bg-primary ${centered ? 'mx-auto' : ''}`}
      />
      {description && (
        <p
          className={`mt-5 text-muted-foreground text-lg leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroCarousel slides={HERO_SLIDES} />

      {/* ── Features Section ──────────────────────────────────────────────── */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <SectionHeader
              eyebrow="Academic Integrity"
              title="World-Class Standards"
              description="We uphold the highest standards of academic publishing, ensuring quality and impact for every submission."
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border rounded-sm overflow-hidden">
            {[
              {
                icon: Shield,
                title: 'Rigorous Peer Review',
                description:
                  'Our specialized panel ensures every paper undergoes intensive scrutiny for technical correctness and novelty.',
              },
              {
                icon: Globe,
                title: 'Global Accessibility',
                description:
                  'Your research is indexed internationally, providing worldwide visibility to the academic community.',
              },
              {
                icon: Zap,
                title: 'Rapid Dissemination',
                description:
                  'Optimized editorial workflows ensure fast turnarounds without compromising on review quality.',
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className={`group p-8 lg:p-10 bg-background hover:bg-accent/10 transition-all duration-300 hover:shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${
                  i < 2 ? 'border-r border-border' : ''
                }`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mb-5 inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Happening Now ─────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-border bg-accent/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <SectionHeader
              eyebrow="Latest Updates"
              title="Happening Across the Faculty"
            />
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 shrink-0"
            >
              View All News
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured story */}
            <div className="lg:col-span-7 group cursor-pointer animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-md hover:shadow-xl transition-all duration-500 mb-5">
                <img
                  src={collaborationImage}
                  alt="Research Collaboration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white/90 border border-white/40 bg-white/10 backdrop-blur-md rounded-md px-3 py-1.5 mb-4 shadow-sm">
                    Featured Collaboration
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-[1.2] mb-3 group-hover:text-primary-foreground/90 transition-colors">
                    International Research Grant Awarded for AI Infrastructure
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base line-clamp-2 md:line-clamp-3 leading-relaxed">
                    The Faculty of Computing has secured a major grant to
                    establish a new center for distributed artificial
                    intelligence.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar news items */}
            <div className="lg:col-span-5 flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
              {[
                {
                  img: facultyImage,
                  icon: null,
                  label: 'Academic Programs',
                  title: 'New PhD Track in Quantum Computing',
                  desc: "Applications are now open for the upcoming semester's advanced research program.",
                },
                {
                  img: null,
                  icon: Award,
                  label: 'Recognition',
                  title: "Chancellor's Award for Excellence",
                  desc: 'Recognizing outstanding contributions to computer science education and research.',
                },
                {
                  img: null,
                  icon: TrendingUp,
                  label: 'Publications',
                  title: 'Annual Publication Report 2025',
                  desc: 'Read our latest metrics on research output and international citations.',
                },
              ].map(({ img, icon: Icon, label, title, desc }, i) => (
                <div
                  key={i}
                  className="group flex gap-5 p-5 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Thumbnail */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-border/50 shadow-sm relative">
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        {Icon && (
                          <Icon className="h-8 w-8 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary/80 mb-1.5 group-hover:text-primary transition-colors">
                      {label}
                    </p>
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                      {title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <Stats />

      {/* ── Research Areas ────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeader
              eyebrow="Journals & Conferences"
              title="Leading Innovations"
              description="We push the boundaries of technology across key computing disciplines through specialized journals and conferences."
            />
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 shrink-0"
            >
              View All Areas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Artificial Intelligence',
                image: aiImage,
                count: '120+ Papers',
                description:
                  'Machine learning, neural networks, and expert systems.',
              },
              {
                title: 'Cybersecurity',
                image: securityImage,
                count: '85+ Papers',
                description:
                  'Network defense, cryptography, and digital forensics.',
              },
              {
                title: 'Data Science',
                image: dataImage,
                count: '150+ Papers',
                description: 'Big data analytics, mining, and visualization.',
              },
            ].map((area, i) => (
              <div
                key={i}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Content */}
                <div className="relative p-6 sm:p-8 flex-1 flex flex-col justify-end -mt-16 sm:-mt-20">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {area.title}
                    </h3>
                  </div>
                  <span className="w-fit text-[10px] font-bold tracking-widest uppercase text-primary border border-primary/20 bg-background/80 backdrop-blur-md rounded-md px-2.5 py-1 mb-3">
                    {area.count}
                  </span>
                  <p className="text-sm text-muted-foreground/90 mb-6 leading-relaxed flex-1">
                    {area.description}
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors"
                  >
                    Explore Research{' '}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="relative overflow-hidden border border-border rounded-sm bg-primary">
            {/* Subtle texture lines */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)',
              }}
            />
            {/* Accent block top-right */}
            <div className="absolute top-0 right-0 w-64 h-full bg-black/10" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center p-10 sm:p-16">
              <div>
                <p className="text-sm font-bold tracking-[0.25em] uppercase text-primary-foreground/70 mb-5 animate-in fade-in slide-in-from-left-4">
                  Get Started Today
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight mb-6 drop-shadow-sm">
                  Ready to Shape the Future of Computing?
                </h2>
                <p className="text-primary-foreground/90 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl font-light">
                  Join our community of elite researchers and publish your work
                  in the prestigious AFUST Faculty of Computing journals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/dashboard">
                    <button className="relative group inline-flex items-center gap-2 bg-background text-foreground font-bold px-8 py-4 rounded-lg text-base hover:bg-white transition-all duration-300 active:scale-95 shadow-xl shadow-black/20 overflow-hidden">
                      <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                      <span className="relative flex items-center gap-2">
                        Submit Now
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                      </span>
                    </button>
                  </Link>
                  <Link to="/about">
                    <button className="inline-flex items-center gap-2 border-2 border-primary-foreground/20 hover:border-primary-foreground flex text-primary-foreground font-bold px-8 py-4 rounded-lg text-base transition-all duration-300 active:scale-95 backdrop-blur-sm bg-black/5">
                      Author Guide
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right side — stat grid */}
              <div className="hidden lg:grid grid-cols-2 gap-px bg-primary-foreground/20 border border-primary-foreground/20 rounded-sm overflow-hidden">
                {[
                  { value: '500+', label: 'Published Papers' },
                  { value: '120+', label: 'Active Researchers' },
                  { value: '40+', label: 'Partner Institutions' },
                  { value: '98%', label: 'Author Satisfaction' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-black/15 px-8 py-7">
                    <div className="text-3xl font-extrabold text-primary-foreground mb-1">
                      {value}
                    </div>
                    <div className="text-xs font-medium text-primary-foreground/60 uppercase tracking-wide">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
