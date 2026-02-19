/**
 * Permissions & role-based access control
 *
 * Roles (least → most privileged):
 *   reader → author → reviewer → editor → admin
 */

export type UserRole = 'reader' | 'author' | 'reviewer' | 'editor' | 'admin'

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  reader: 0,
  author: 1,
  reviewer: 2,
  editor: 3,
  admin: 4,
}

// ── Named permissions ──────────────────────────────────────────────────────────

export type Permission =
  | 'viewDashboard' // any authenticated user
  | 'submitItem' // author+
  | 'viewOwnSubmissions' // author+
  | 'reviewItem' // reviewer+
  | 'manageCommunities' // editor+
  | 'manageCollections' // editor+
  | 'manageItems' // editor+
  | 'viewAdminPanel' // admin only
  | 'manageUsers' // admin only
  | 'manageRoles' // admin only

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  reader: ['viewDashboard'],
  author: ['viewDashboard', 'submitItem', 'viewOwnSubmissions'],
  reviewer: ['viewDashboard', 'submitItem', 'viewOwnSubmissions', 'reviewItem'],
  editor: [
    'viewDashboard',
    'submitItem',
    'viewOwnSubmissions',
    'reviewItem',
    'manageCommunities',
    'manageCollections',
    'manageItems',
  ],
  admin: [
    'viewDashboard',
    'submitItem',
    'viewOwnSubmissions',
    'reviewItem',
    'manageCommunities',
    'manageCollections',
    'manageItems',
    'viewAdminPanel',
    'manageUsers',
    'manageRoles',
  ],
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Check whether a role has a specific permission */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/** Check whether a role meets the minimum required role level */
export function meetsMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
}

/** Human-readable role label */
export const ROLE_LABELS: Record<UserRole, string> = {
  reader: 'Reader',
  author: 'Author',
  reviewer: 'Reviewer',
  editor: 'Editor',
  admin: 'Admin',
}

export const ALL_ROLES: UserRole[] = [
  'reader',
  'author',
  'reviewer',
  'editor',
  'admin',
]
