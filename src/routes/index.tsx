import { FeatureCard } from '@/components/feature-card'
import { Hero } from '@/components/hero'
import { Stats } from '@/components/stats'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, Globe, Shield, TrendingUp, Zap } from 'lucide-react'

// Import generated images
import { Button } from '@/components/ui/button'
import heroImage from '/hero_academic_research_1771235709059.png'
import aiImage from '/research_area_ai_1771235841739.png'
import securityImage from '/research_area_cybersecurity_1771235859577.png'
import dataImage from '/research_area_data_1771235872985.png'
import collaborationImage from '/research_collaboration_1771235722874.png'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="Advancing Computing Research in Aliero"
        subtitle="A peer-reviewed platform for groundbreaking research from the Faculty of Computing"
        imagePath={heroImage}
      />

      {/* Features Section */}
      <section className="relative py-28 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb,96,165,250),0.03),transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Academic Integrity
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              World-Class Standards
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We uphold the highest standards of academic publishing, ensuring
              quality and impact for every submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Rigorous Peer Review"
              description="Our specialized panel ensures every paper undergoes intensive scrutiny for technical correctness and novelty."
            />
            <FeatureCard
              icon={Globe}
              title="Global Accessibility"
              description="Your research is indexed internationally, providing worldwide visibility to the academic community."
            />
            <FeatureCard
              icon={Zap}
              title="Rapid Dissemination"
              description="Optimized editorial workflows ensure fast turnarounds without compromising on review quality."
            />
          </div>
        </div>
      </section>

      {/* Happening Now Section - Asymmetric Layout */}
      <section className="py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Happening Across the Faculty
              </h2>
              <div className="h-1 w-24 bg-primary mt-4" />
            </div>
            <Link
              to="/about"
              className="text-primary font-semibold flex items-center gap-2 group"
            >
              View All News{' '}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Featured Item */}
            <div className="lg:col-span-7 group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 shadow-xl">
                <img
                  src={collaborationImage}
                  alt="Research Collaboration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <span className="text-primary-foreground/80 text-sm font-bold uppercase tracking-widest mb-2">
                    Featured Collaboration
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    International Research Grant Awarded for AI Infrastructure
                  </h3>
                  <p className="text-white/80 line-clamp-2">
                    The Faculty of Computing has secured a major grant to
                    establish a new center for distributed artificial
                    intelligence.
                  </p>
                </div>
              </div>
            </div>

            {/* Smaller Sidebar Items */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex gap-6 group cursor-pointer">
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={'/faculty_computing_1771235743947.png'}
                    alt="Faculty News"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    New PhD Track in Quantum Computing
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Applications are now open for the upcoming semester's
                    advanced research program.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group cursor-pointer">
                <div className="w-32 h-32 flex-shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    Chancellor's Award for Excellence
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Recognizing outstanding contributions to computer science
                    education and research.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group cursor-pointer">
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 p-6 flex flex-col justify-end">
                    <TrendingUp className="text-white h-8 w-8 mb-2" />
                    <span className="text-white text-xs font-bold uppercase">
                      Journal Impact
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    Annual Publication Report 2025
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Read our latest metrics on research output and international
                    citations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Stats />

      {/* Updated Research Areas with Images */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Leading Innovations
              </h2>
              <p className="text-xl text-muted-foreground">
                We push the boundaries of technology across key computing
                disciplines through specialized journals and conferences.
              </p>
            </div>
            <div className="h-1 w-32 bg-primary/20 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
                className="group relative h-[450px] overflow-hidden rounded-3xl shadow-2xl"
              >
                <img
                  src={area.image}
                  alt={area.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/30 backdrop-blur-md text-primary-foreground text-xs font-bold mb-4 w-fit">
                    {area.count}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {area.description}
                  </p>
                  <Button
                    variant="link"
                    className="text-white p-0 h-auto font-bold flex items-center gap-2 group/btn"
                  >
                    Explore Research{' '}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Magazine Style */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />

            <div className="relative grid lg:grid-cols-2 items-center gap-12 p-12 sm:p-20">
              <div className="text-left">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                  Ready to Shape the <br />
                  <span className="text-primary italic">
                    Future of Computing?
                  </span>
                </h2>
                <p className="text-xl text-slate-300 mb-12 max-w-xl">
                  Join our community of elite researchers and publish your work
                  in the prestigious AFUST Faculty of Computing journals.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-10 py-5 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all group"
                  >
                    Submit Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center justify-center px-10 py-5 rounded-xl border-2 border-slate-700 text-white font-bold text-lg hover:bg-white/5 hover:border-primary/50 transition-all"
                  >
                    Author Guide
                  </a>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="aspect-square rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-3xl shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)]">
                    <Zap className="h-24 w-24 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
