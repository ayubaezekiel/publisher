import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { ChevronDown, Search, Users } from 'lucide-react'
import { useState } from 'react'
import { getAllUsers, updateUserRole } from '@/lib/actions/admin'
import { getSessionFn } from '@/lib/session'
import { RoleBadge } from '@/components/RoleBadge'
import { ALL_ROLES } from '@/lib/permissions'
import type { UserRole } from '@/lib/permissions'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/dashboard/admin/users/')({
  component: UsersManagement,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
    const role = session.user.role ?? 'reader'
    if (role !== 'admin') throw redirect({ to: '/dashboard' })
    return { currentUserId: session.user.id }
  },
  loader: async ({ context }) => {
    const users = await getAllUsers()
    return { users, currentUserId: context.currentUserId }
  },
})

function UsersManagement() {
  const { users, currentUserId } = Route.useLoaderData()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const filtered = users.filter(
    (u: any) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdatingId(userId)
    setOpenDropdown(null)
    try {
      await updateUserRole({ data: { userId, role } })
      router.invalidate()
    } finally {
      setUpdatingId(null)
    }
  }

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
                <Users className="h-7 w-7 text-blue-500" />
                User Management
              </h1>
              <p className="text-muted-foreground mt-1">
                {users.length} registered user{users.length !== 1 ? 's' : ''}
              </p>
            </div>
            {/* Search */}
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-20 text-center text-muted-foreground"
                  >
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u: any) => {
                  const role = (u.role as UserRole) ?? 'reader'
                  const isSelf = u.id === currentUserId
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">
                          {u.name}
                          {isSelf && (
                            <span className="ml-2 text-xs text-primary font-normal">
                              (you)
                            </span>
                          )}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                            u.emailVerified
                              ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                              : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
                          )}
                        >
                          {u.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={role} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {isSelf ? (
                          <span className="text-xs text-muted-foreground italic">
                            —
                          </span>
                        ) : (
                          <div className="relative inline-block">
                            <button
                              disabled={updatingId === u.id}
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === u.id ? null : u.id,
                                )
                              }
                              className={cn(
                                'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors',
                                updatingId === u.id &&
                                  'opacity-50 cursor-not-allowed',
                              )}
                            >
                              {updatingId === u.id ? 'Saving…' : 'Change role'}
                              <ChevronDown className="h-3 w-3" />
                            </button>

                            {openDropdown === u.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenDropdown(null)}
                                />
                                <div className="absolute right-0 top-full mt-1.5 z-20 w-40 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
                                  {ALL_ROLES.map((r: any) => (
                                    <button
                                      key={r}
                                      onClick={() => handleRoleChange(u.id, r)}
                                      className={cn(
                                        'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2',
                                        r === role &&
                                          'bg-primary/10 text-primary font-medium',
                                      )}
                                    >
                                      <RoleBadge role={r} />
                                      {r === role && (
                                        <span className="ml-auto text-xs">
                                          ✓
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Count + legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground items-center">
            <span className="font-medium">Roles:</span>
            {ALL_ROLES.map((r: any) => (
              <RoleBadge key={r} role={r} />
            ))}
          </div>
          {filtered.length !== users.length && (
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {users.length} users
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
