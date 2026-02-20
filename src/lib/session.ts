import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from './auth'
import type { User } from '@/db/schemas/auth-schema'

export type Session = {
  user: User
  session: any
}

/**
 * Server function version of getSession for use in routes (beforeLoad, component, etc).
 * Client-safe RPC.
 */
export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Session | null> => {
    try {
      const request = getRequest()
      const session = await auth.api.getSession({ headers: request.headers })
      return (session as Session) ?? null
    } catch (error: any) {
      console.error('getSessionFn Error:', error)
      throw new Error(error.message || 'Failed to get session')
    }
  },
)

/**
 * Server function version of requireAuth for use in routes.
 * Client-safe RPC.
 */
export const requireAuthFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Session> => {
    try {
      const request = getRequest()
      const session = (await auth.api.getSession({
        headers: request.headers,
      })) as Session

      if (!session?.user) {
        throw new Response(null, {
          status: 302,
          headers: { Location: '/' },
        })
      }
      return session
    } catch (error: any) {
      if (error instanceof Response) throw error
      console.error('requireAuthFn Error:', error)
      throw new Error(error.message || 'Authentication required')
    }
  },
)

// NOTE: Shared helpers that you want to use on the server only should NOT have .server
// suffix if they are imported by this file (which is shared).
// The compiler handles stripping server-only code inside createServerFn.
