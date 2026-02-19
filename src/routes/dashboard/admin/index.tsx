import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { getAdminStats } from '@/lib/actions/admin'
import { getSessionFn } from '@/lib/session'

export const Route = createFileRoute('/dashboard/admin/')({
  component: AdminDashboard,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
    const role = session.user.role ?? 'reader'
    if (role !== 'admin') throw redirect({ to: '/dashboard' })
  },
  loader: () => getAdminStats(),
})

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {value.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const stats = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-0.5">
                Platform overview and management controls
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={Number(stats.users)}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <StatCard
              icon={LayoutDashboard}
              label="Communities"
              value={Number(stats.communities)}
              color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            />
            <StatCard
              icon={FolderOpen}
              label="Collections"
              value={Number(stats.collections)}
              color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            />
            <StatCard
              icon={FileText}
              label="Submissions"
              value={Number(stats.items)}
              color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            />
          </div>
        </section>

        {/* Admin Quick Links */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/dashboard/admin/users"
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    User Management
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View all users, assign roles, and manage accounts.
                  </p>
                  <p className="text-xs font-medium text-primary mt-3 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Manage users →
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/dashboard/admin/submissions"
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    All Submissions
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage all research submissions platform-wide.
                  </p>
                  <p className="text-xs font-medium text-primary mt-3 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View submissions →
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/dashboard/communities"
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Communities
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create and manage research communities and sub-communities.
                  </p>
                  <p className="text-xs font-medium text-primary mt-3 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Manage communities →
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/dashboard/collections"
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Collections
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Organise and manage collections within communities.
                  </p>
                  <p className="text-xs font-medium text-primary mt-3 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Manage collections →
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
