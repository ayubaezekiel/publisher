import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { FileText, Plus } from 'lucide-react'
import { getItems } from '@/lib/actions/items'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSessionFn } from '@/lib/session'

export const Route = createFileRoute('/dashboard/my-submissions/')({
  component: MySubmissions,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
  },
  loader: async () => getItems(),
})

const statusColors: Record<string, string> = {
  workflow:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  archived:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  withdrawn: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

function MySubmissions() {
  const items = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Submissions
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
          <Link
            to="/dashboard/submit"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'inline-flex items-center gap-2 shrink-0',
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>New Submission</span>
          </Link>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No submissions yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start by submitting your first research paper or thesis to a
              collection.
            </p>
            <Link
              to="/dashboard/submit"
              className={cn(buttonVariants(), 'inline-flex items-center gap-2')}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Start New Submission</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-md transition-shadow border-border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-semibold leading-snug">
                      <Link
                        to="/items/$id"
                        params={{ id: item.id }}
                        className="hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                    </CardTitle>
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shrink-0',
                        statusColors[item.status] ||
                          'bg-secondary text-secondary-foreground',
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {item.abstract && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.abstract}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {item.collection && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {item.collection.name}
                      </span>
                    )}
                    {item.issueDate && (
                      <span>
                        {new Date(item.issueDate).toLocaleDateString()}
                      </span>
                    )}
                    {item.bitstreams && item.bitstreams.length > 0 && (
                      <span>{item.bitstreams.length} file(s) attached</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
