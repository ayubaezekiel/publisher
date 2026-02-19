import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { FileText, Search } from 'lucide-react'
import { useState } from 'react'
import { getAllSubmissions } from '@/lib/actions/admin'
import { getSessionFn } from '@/lib/session'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/dashboard/admin/submissions/')({
  component: AllSubmissions,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
    const role = session.user.role ?? 'reader'
    if (role !== 'admin') throw redirect({ to: '/dashboard' })
  },
  loader: () => getAllSubmissions(),
})

const statusStyles: Record<string, string> = {
  workflow:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  archived:
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  withdrawn:
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

const STATUS_OPTIONS = ['all', 'workflow', 'archived', 'withdrawn'] as const

function AllSubmissions() {
  const submissions = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.submitter?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← Back to Admin Panel
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <FileText className="h-7 w-7 text-amber-500" />
                All Submissions
              </h1>
              <p className="text-muted-foreground mt-1">
                {submissions.length} total submission
                {submissions.length !== 1 ? 's' : ''} platform-wide
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Search by title or submitter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize',
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted',
                )}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Title</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Files</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-20 text-center text-muted-foreground"
                  >
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    {submissions.length === 0
                      ? 'No submissions yet.'
                      : 'No results match your filters.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="max-w-[220px]">
                      <Link
                        to="/items/$id"
                        params={{ id: sub.id }}
                        className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {sub.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {sub.submitter?.name ?? (
                        <span className="italic">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.collection.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.collection.community?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize',
                          statusStyles[sub.status] ??
                            'bg-secondary text-secondary-foreground border-border',
                        )}
                      >
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground text-center">
                      {sub.bitstreams.length}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4 text-right">
            Showing {filtered.length} of {submissions.length} submission
            {submissions.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
