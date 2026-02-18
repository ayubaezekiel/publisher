import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  FileText,
  FolderOpen,
  PlusCircle,
  Settings2,
  Upload,
  Users,
  Wrench,
} from 'lucide-react'
import { DocxViewer } from '@/components/DocxViewer'
import { LexicalEditor } from '@/components/LexicalEditor'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function NavCard({
  to,
  icon: Icon,
  title,
  description,
  filled = false,
}: {
  to: string
  icon: React.ElementType
  title: string
  description: string
  filled?: boolean
}) {
  return (
    <Link
      to={to}
      className={
        filled
          ? 'group flex items-start gap-3 p-4 bg-primary rounded-2xl border border-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200'
          : 'group flex items-start gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200'
      }
    >
      <div
        className={
          filled
            ? 'flex-shrink-0 p-2 rounded-xl bg-white/20 text-primary-foreground'
            : 'flex-shrink-0 p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors'
        }
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold text-sm ${filled ? 'text-primary-foreground' : 'text-foreground group-hover:text-primary transition-colors'}`}
        >
          {title}
        </h3>
        <p
          className={`text-xs mt-0.5 ${filled ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
        >
          {description}
        </p>
      </div>
      <ArrowRight
        className={`h-3.5 w-3.5 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-0.5 ${filled ? 'text-primary-foreground/70' : 'text-muted-foreground group-hover:text-primary'}`}
      />
    </Link>
  )
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto px-4 sm:px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Researcher Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Manage your submissions and research tools.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* ── Sidebar ── */}
          <aside className="w-full xl:w-72 shrink-0 space-y-6">
            {/* My Research */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                My Research
              </h2>
              <NavCard
                to="/dashboard/my-submissions"
                icon={FileText}
                title="My Submissions"
                description="View and manage your submitted items."
              />
              <NavCard
                to="/dashboard/submit"
                icon={PlusCircle}
                title="New Submission"
                description="Submit a new research paper or thesis."
                filled
              />
              <NavCard
                to="/communities"
                icon={Upload}
                title="Browse Repository"
                description="Explore communities and collections."
              />
            </div>

            {/* Manage */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                Manage
              </h2>
              <NavCard
                to="/dashboard/communities"
                icon={Users}
                title="Communities"
                description="Create and manage research communities."
              />
              <NavCard
                to="/dashboard/collections"
                icon={FolderOpen}
                title="Collections"
                description="Organise collections within communities."
              />
            </div>
          </aside>

          {/* ── Main: Research Tools ── */}
          <div className="flex-1 min-w-0 space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5" />
              Research Tools
            </h2>
            <div className="bg-card rounded-2xl border border-border p-6 space-y-8">
              <DocxViewer />
              <div className="border-t border-border" />
              <LexicalEditor />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
