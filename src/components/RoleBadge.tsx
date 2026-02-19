import type { UserRole } from '@/lib/permissions'
import { ROLE_LABELS } from '@/lib/permissions'
import { cn } from '@/lib/utils'

const ROLE_STYLES: Record<UserRole, string> = {
  admin:
    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  editor:
    'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  reviewer:
    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  author:
    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  reader:
    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
}

interface RoleBadgeProps {
  role: UserRole
  className?: string
  size?: 'sm' | 'md'
}

export function RoleBadge({ role, className, size = 'sm' }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium capitalize',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        ROLE_STYLES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
