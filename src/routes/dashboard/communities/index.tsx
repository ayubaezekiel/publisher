import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { Edit2, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteCommunity, getCommunities } from '@/lib/actions/communities'
import type { UserRole } from '@/lib/permissions'
import { meetsMinRole } from '@/lib/permissions'
import { getSessionFn } from '@/lib/session'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/communities/')({
  component: CommunitiesManage,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
    const role = (session.user.role ?? 'reader') as UserRole
    if (!meetsMinRole(role, 'editor')) throw redirect({ to: '/dashboard' })
  },
  loader: () => getCommunities(),
})

function CommunitiesManage() {
  const communities = Route.useLoaderData()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await deleteCommunity({ data: id })
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
              Communities
            </h1>
            <p className="text-muted-foreground mt-1">
              {communities.length} communit
              {communities.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          <Link
            to="/dashboard/communities/new"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'inline-flex items-center gap-2 shrink-0',
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>New Community</span>
          </Link>
        </div>

        {/* Table */}
        {communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create your first community to organise collections and
              submissions.
            </p>
            <Link
              to="/dashboard/communities/new"
              className={cn(buttonVariants(), 'inline-flex items-center gap-2')}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Create Community</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Community</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Collections</TableHead>
                  <TableHead className="text-center">Sub-communities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communities.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">
                          {c.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      /{c.slug}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {c.collections.length}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {c.subCommunities.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/communities/$slug"
                          params={{ slug: c.slug }}
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'sm' }),
                            'text-xs',
                          )}
                        >
                          View
                        </Link>
                        <Link
                          to="/dashboard/communities/$id/edit"
                          params={{ id: c.id }}
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
                          itemName={c.name}
                          onConfirm={() => handleDelete(c.id)}
                          loading={deleting === c.id}
                          trigger={
                            <button
                              disabled={deleting === c.id}
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
