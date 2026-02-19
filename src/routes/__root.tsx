import { LoginModal } from '@/components/LoginModal'
import { authClient } from '@/lib/auth-client'
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { BookOpen, ChevronRight, Mail, MapPin, Menu, X } from 'lucide-react'
import { useState } from 'react'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'AFUST Publications' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function RootDocument({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const { data: session } = authClient.useSession()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {/* ── Top announcement bar ── */}
        <div className="bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide py-2 hidden sm:block">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-4">
            <span className="opacity-80">
              Faculty of Computing · Abdulahi Fodio University of Science and
              Technology, Aliero
            </span>
            <a
              href="mailto:publications@afust.edu.ng"
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
            >
              <Mail className="h-3 w-3" />
              publications@afust.edu.ng
            </a>
          </div>
        </div>

        {/* ── Main navbar ── */}
        <nav className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between h-16 gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 shrink-0 group">
                <div className="w-9 h-9 rounded-sm overflow-hidden border border-border shadow-sm group-hover:border-primary/40 transition-colors">
                  <img
                    src="/afusta.jpeg"
                    alt="AFUST Logo"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                    AFUST Publications
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                    Faculty of Computing
                  </span>
                </div>
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center h-full gap-0">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="relative h-full flex items-center px-5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent"
                    activeProps={{
                      className: '!text-primary !border-primary',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-3 shrink-0">
                {session ? (
                  <Link to="/dashboard">
                    <button className="group inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-5 py-2 rounded-sm transition-colors active:scale-95">
                      Researcher Dashboard
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="group inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-5 py-2 rounded-sm transition-colors active:scale-95"
                  >
                    Sign In
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-sm border border-border hover:border-primary/40 hover:bg-accent transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-primary" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
              <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col divide-y divide-border">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between py-3.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    activeProps={{ className: '!text-primary' }}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
                <div className="pt-4">
                  {session ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-sm hover:bg-primary/90 transition-colors">
                        Researcher Dashboard
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setLoginModalOpen(true)
                      }}
                      className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-sm hover:bg-primary/90 transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        <main className="flex-1">{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-border bg-accent/20 mt-0">
          {/* Main footer grid */}
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Brand col */}
              <div className="md:col-span-4">
                <Link
                  to="/"
                  className="flex items-center gap-3 mb-4 group w-fit"
                >
                  <div className="w-9 h-9 rounded-sm overflow-hidden border border-border">
                    <img
                      src="/afusta.jpeg"
                      alt="AFUST Logo"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-extrabold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                      AFUST Publications
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                      Faculty of Computing
                    </span>
                  </div>
                </Link>
                <div className="w-10 h-[3px] bg-primary mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The official academic publication platform for the Faculty of
                  Computing at Abdulahi Fodio University of Science and
                  Technology, Aliero.
                </p>
              </div>

              {/* Quick links */}
              <div className="md:col-span-3 md:col-start-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/about', label: 'About Us' },
                    { to: '/contact', label: 'Contact' },
                    { to: '/dashboard', label: 'Researcher Dashboard' },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-primary/50 group-hover:translate-x-0.5 transition-transform" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="md:col-span-4 md:col-start-9">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground mb-4">
                  Contact
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      Faculty of Computing, Abdulahi Fodio University, Aliero,
                      Nigeria
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
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
          </div>

          {/* Footer bottom bar */}
          <div className="border-t border-border">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Abdulahi Fodio University of
                Science and Technology, Aliero. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Peer-Reviewed · Open Access
                </span>
              </div>
            </div>
          </div>
        </footer>

        <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
        <Scripts />
      </body>
    </html>
  )
}
