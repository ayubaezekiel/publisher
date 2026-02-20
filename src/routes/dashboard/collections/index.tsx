import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { Edit2, FolderOpen, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { deleteCollection, getCollections } from '@/lib/actions/collections'
import { cn } from '@/lib/utils'
import { getSessionFn } from '@/lib/session'
import { meetsMinRole } from '@/lib/permissions'
import type { UserRole } from '@/lib/permissions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'

export const Route = createFileRoute('/dashboard/collections/')({
  component: CollectionsManage,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
    const role = (session.user.role ?? 'reader') as UserRole
    if (!meetsMinRole(role, 'editor')) throw redirect({ to: '/dashboard' })
  },
  loader: () => getCollections(),
})

function CollectionsManage() {
  const collections = Route.useLoaderData()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
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

        {/* Table */}
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
          <div className="rounded-2xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Collection</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((col: any) => (
                  <TableRow key={col.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">
                          {col.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {col.community.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      /{col.slug}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {col.items.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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
                            buttonVariants({
                              variant: 'outline',
                              size: 'icon-sm',
                            }),
                            'inline-flex items-center justify-center',
                          )}
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <DeleteConfirmDialog
                          itemName={col.name}
                          onConfirm={() => handleDelete(col.id)}
                          loading={deleting === col.id}
                          trigger={
                            <button
                              disabled={deleting === col.id}
                              className={cn(
                                buttonVariants({
                                  variant: 'ghost',
                                  size: 'icon-sm',
                                }),
                                'inline-flex items-center justify-center text-destructive hover:bg-destructive/10',
                              )}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
