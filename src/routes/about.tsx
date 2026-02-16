import { createFileRoute } from '@tanstack/react-router'
import { Award, BookOpen, Eye, Lightbulb, Target, Users } from 'lucide-react'
import { Hero } from '@/components/hero'
// Import generated images
import aboutHeroImage from '@/../../.gemini/antigravity/brain/30cbe2f3-db68-40aa-acc9-653a1672ff11/about_hero_university_alt_1771244617332.png'
import missionImage from '@/../../.gemini/antigravity/brain/30cbe2f3-db68-40aa-acc9-653a1672ff11/about_mission_collaboration_1771244550200.png'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="Pioneering the Digital Frontier"
        subtitle="Discover our commitment to academic excellence and groundbreaking research at Abdulahi Fodio University of Science and Technology, Aliero."
        showCTA={false}
        imagePath={aboutHeroImage}
      />

      {/* University Perspective - Magazine Layout */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative bg-background p-8 sm:p-12 rounded-[2rem] border border-primary/10 shadow-2xl shadow-primary/5">
                  <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 leading-tight">
                    Our{' '}
                    <span className="text-primary italic">Academic Legacy</span>
                  </h2>
                  <div className="space-y-6 text-xl text-muted-foreground leading-relaxed font-light">
                    <p>
                      Abdulahi Fodio University of Science and Technology
                      (AFUST), Aliero, stands as a beacon of scientific inquiry
                      and technological innovation in Kebbi State, Nigeria.
                    </p>
                    <p>
                      The Faculty of Computing is the engine room of our digital
                      transformation, bringing together world-class researchers
                      and ambitious students to solve the complex challenges of
                      the 21st century.
                    </p>
                    <p className="border-l-4 border-primary pl-6 italic text-foreground bg-primary/5 py-4 rounded-r-lg">
                      "Our mission is to disseminate high-impact research that
                      doesn't just fill journals, but changes the world."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
                <img
                  src={missionImage}
                  alt="Academic Collaboration"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-accent/5 border border-border shadow-sm">
                  <div className="text-4xl font-bold text-primary mb-2">
                    20+
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Expert Faculty
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                  <div className="text-4xl font-bold mb-2">A+</div>
                  <div className="text-sm font-semibold uppercase tracking-wider opacity-80">
                    Research Quality
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Glassmorphism Cards */}
      <section className="py-24 bg-accent/5 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group p-12 rounded-[3rem] bg-background/50 backdrop-blur-xl border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-8 group-hover:rotate-12 transition-transform">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To provide an elite, peer-reviewed platform for computing
                research that drives innovation and global scientific
                advancement.
              </p>
            </div>

            <div className="group p-12 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 hover:-translate-y-2">
              <div className="p-4 bg-white/10 rounded-2xl w-fit mb-8 group-hover:-rotate-12 transition-transform">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                To be the primary global authority for computing research in
                Africa, recognized for integrity and technological leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Modern Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Our Core <span className="text-primary italic">Values</span>
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Excellence',
                desc: 'Setting the highest global benchmarks for research quality and ethics.',
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                desc: 'Championing original ideas that push the boundaries of what is possible.',
              },
              {
                icon: Users,
                title: 'Collaboration',
                desc: 'Building bridges between academia, industry, and international partners.',
              },
              {
                icon: BookOpen,
                title: 'Integrity',
                desc: 'Transparent, rigorous peer review processes you can trust.',
              },
            ].map((value, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-accent/5 transition-colors group"
              >
                <div className="p-5 rounded-2xl bg-primary/5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 mb-6">
                  <value.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">
                  {value.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
