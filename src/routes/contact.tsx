import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'

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
                    className="group flex gap-6 p-6 rounded-3xl border border-border bg-background hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div
                      className={`flex-shrink-0 p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">
                        {item.title}
                      </h4>
                      {item.details.map((detail, j) => (
                        <p key={j} className="text-muted-foreground">
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
              <div className="relative">
                {/* Glow behind the form */}
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-[3rem]" />
                <div className="relative bg-background p-8 sm:p-12 rounded-[3rem] border border-primary/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-1 w-12 bg-primary" />
                    <span className="text-sm font-bold uppercase tracking-widest text-primary">
                      Secure Channel
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-8">
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
      <section className="py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative aspect-video rounded-[3rem] overflow-hidden border border-primary/10 shadow-2xl group">
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
                  <h4 className="font-bold text-xl mb-1 text-slate-900">
                    University Campus
                  </h4>
                  <p className="text-slate-600">
                    AFUST main road, Aliero, Kebbi State, Nigeria
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            <div className="p-12 rounded-[3rem] bg-slate-900 text-white shadow-2xl flex flex-col justify-center border border-white/5">
              <Clock className="h-12 w-12 text-primary mb-8" />
              <h4 className="text-3xl font-bold mb-8">
                Office <span className="text-primary italic">Hours</span>
              </h4>
              <div className="space-y-4 text-xl text-slate-300">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="font-bold text-white">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-bold text-white">9:00 - 14:00</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Sunday</span>
                  <span className="font-bold uppercase tracking-widest text-xs mt-2">
                    Closed
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                className="text-primary p-0 h-auto font-bold mt-12 flex items-center gap-2 group/btn self-start"
              >
                Plan Your Visit{' '}
                <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
