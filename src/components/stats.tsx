import { TrendingUp } from 'lucide-react'

interface StatItemProps {
  value: string
  label: string
  index: number
}

function StatItem({ value, label, index }: StatItemProps) {
  const gradients = [
    'from-primary/20 to-primary/5',
    'from-primary/15 to-primary/10',
    'from-primary/10 to-primary/5',
    'from-primary/20 to-transparent',
  ]

  return (
    <div
      className={`group relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br ${gradients[index]} border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

      <div className="relative text-center">
        <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
          {value}
        </div>
        <div className="text-sm font-medium text-foreground/70 uppercase tracking-wider">
          {label}
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  )
}

export function Stats() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-muted/30 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--foreground-rgb,0,0,0),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--foreground-rgb,0,0,0),0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Growing Community
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Platform Statistics
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our thriving community of researchers and academics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <StatItem value="500+" label="Publications" index={0} />
          <StatItem value="200+" label="Authors" index={1} />
          <StatItem value="50+" label="Research Areas" index={2} />
          <StatItem value="98%" label="Acceptance Rate" index={3} />
        </div>
      </div>
    </section>
  )
}
