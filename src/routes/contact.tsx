import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { ContactForm } from '@/components/contact-form'
import { Hero } from '@/components/hero'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="We're Here to Support Your Research"
        subtitle="Connect with our editorial team and support staff for any inquiries regarding submissions, publications, or technical assistance."
        showCTA={false}
        imagePath={'/contact_hero_support_1771244662462.png'}
      />

      <section className="py-24 bg-background relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-12">
              <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Contact{' '}
                  <span className="text-primary italic">Intelligence</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Our dedicated support hub is integrated directly with the
                  Faculty of Computing to ensure your academic inquiries are
                  handled with precision.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                {[
                  {
                    icon: Mail,
                    title: 'Editorial Team',
                    details: [
                      'publications@afust.edu.ng',
                      'computing@afust.edu.ng',
                    ],
                    color: 'bg-blue-500/10 text-blue-600',
                  },
                  {
                    icon: Phone,
                    title: 'Direct Support',
                    details: ['+234 (0) 803 XXX XXXX', 'Mon-Fri, 8AM - 5PM'],
                    color: 'bg-primary/10 text-primary',
                  },
                  {
                    icon: MapPin,
                    title: 'Faculty HQ',
                    details: [
                      'Faculty of Computing, AFUST',
                      'PMB 1010, Aliero, Kebbi State',
                    ],
                    color: 'bg-emerald-500/10 text-emerald-600',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group flex gap-6 p-6 rounded-3xl border border-border/60 bg-background/50 backdrop-blur-sm hover:bg-background hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div
                      className={`relative flex-shrink-0 p-4 rounded-2xl ${item.color} group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      {item.details.map((detail, j) => (
                        <p
                          key={j}
                          className="text-muted-foreground/90 leading-relaxed"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative group">
                {/* Glow behind the form */}
                <div className="absolute -inset-4 bg-primary/10 blur-[60px] rounded-[3rem] group-hover:bg-primary/20 transition-colors duration-1000" />
                <div className="relative bg-background/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[3rem] border border-primary/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-1.5 w-12 bg-primary rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      Secure Channel
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8 tracking-tight">
                    Send an Inquiry
                  </h3>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Office Hours - Modern Look */}
      <section className="py-24 bg-accent/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative aspect-video rounded-[3rem] overflow-hidden border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] group">
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <div className="text-center p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-black/5 transform group-hover:scale-105 transition-transform duration-700">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
                  <h4 className="font-bold text-2xl mb-2 text-slate-900 tracking-tight">
                    University Campus
                  </h4>
                  <p className="text-slate-600 font-medium">
                    AFUST main road, Aliero, Kebbi State, Nigeria
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            <div className="p-10 sm:p-12 rounded-[3rem] bg-slate-900 text-white shadow-2xl flex flex-col justify-center border border-white/10 relative overflow-hidden group hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <Clock className="h-12 w-12 text-primary mb-8" />
                <h4 className="text-3xl sm:text-4xl font-extrabold mb-10 tracking-tight">
                  Office{' '}
                  <span className="text-primary italic font-serif">Hours</span>
                </h4>
                <div className="space-y-6 text-xl text-slate-300 font-light">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span>Mon - Fri</span>
                    <span className="font-bold text-white tracking-wide">
                      8:00 - 17:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span>Saturday</span>
                    <span className="font-bold text-white tracking-wide">
                      9:00 - 14:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-red-400/90 pt-2">
                    <span>Sunday</span>
                    <span className="font-bold uppercase tracking-widest text-xs border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded-md">
                      Closed
                    </span>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto font-bold mt-12 flex items-center gap-2 group/btn self-start text-lg tracking-wide hover:text-primary-foreground transition-colors"
                >
                  Plan Your Visit{' '}
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
