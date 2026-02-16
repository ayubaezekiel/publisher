import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'
import appCss from '../styles.css?url'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Publisher',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="min-h-screen flex flex-col">
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo and Title */}
              <Link to="/" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all" />
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                    AFUST Publications
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                    Faculty of Computing
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="relative px-5 py-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-all group"
                    activeProps={{ className: '!text-primary' }}
                  >
                    {item.label}
                    <div className="absolute inset-x-4 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                  </Link>
                ))}

                <div className="w-px h-6 bg-border mx-4" />

                <Link to="/dashboard">
                  <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95 font-bold">
                    Join Researcher Circle
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2.5 rounded-xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 group"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-primary" />
                ) : (
                  <Menu className="h-6 w-6 group-hover:text-primary transition-colors" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col gap-2">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/about', label: 'About' },
                    { to: '/contact', label: 'Contact' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-lg font-bold text-foreground/80 hover:text-primary transition-all px-4 py-3 rounded-xl hover:bg-primary/5"
                      onClick={() => setMobileMenuOpen(false)}
                      activeProps={{ className: '!text-primary !bg-primary/5' }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 px-4">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button size="lg" className="w-full rounded-xl font-bold">
                        Researcher Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="bg-muted/30 border-t border-border mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-foreground">
                    AFUST Publications
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Academic publication platform for the Faculty of Computing at
                  Abdulahi Fodio University of Science and Technology, Aliero.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-foreground mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Faculty of Computing</li>
                  <li>Abdulahi Fodio University</li>
                  <li>Aliero, Nigeria</li>
                  <li className="pt-2">
                    <a
                      href="mailto:publications@afust.edu.ng"
                      className="hover:text-primary transition-colors"
                    >
                      publications@afust.edu.ng
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Abdulahi Fodio University of
                Science and Technology, Aliero. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
