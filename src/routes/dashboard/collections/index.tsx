import { buttonVariants } from '@/components/ui/button'
import { deleteCollection, getCollections } from '@/lib/actions/collections'
import { cn } from '@/lib/utils'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { Edit2, FolderOpen, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/collections/')({
  component: CollectionsManage,
  loader: () => getCollections(),
})

function CollectionsManage() {
  const collections = Route.useLoaderData()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteCollection({ data: id })
      router.invalidate()
    } finally {
      setDeleting(null)
    }
  }

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
              Collections
            </h1>
            <p className="text-muted-foreground mt-1">
              {collections.length} collection
              {collections.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/dashboard/collections/new"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'inline-flex items-center gap-2 shrink-0',
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>New Collection</span>
          </Link>
        </div>

        {/* List */}
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create your first collection inside a community to group
              submissions.
            </p>
            <Link
              to="/dashboard/collections/new"
              className={cn(buttonVariants(), 'inline-flex items-center gap-2')}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Create Collection</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {collections.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {col.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      /{col.slug} · {col.community.name} · {col.items.length}{' '}
                      item(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/collections/$slug"
                    params={{ slug: col.slug }}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      'text-xs',
                    )}
                  >
                    View
                  </Link>
                  <Link
                    to="/dashboard/collections/$id/edit"
                    params={{ id: col.id }}
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'icon-sm' }),
                      'inline-flex items-center justify-center',
                    )}
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(col.id, col.name)}
                    disabled={deleting === col.id}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                      'inline-flex items-center justify-center text-destructive hover:bg-destructive/10',
                    )}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
