import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from './auth'

/**
 * Server function version of getSession for use in routes (beforeLoad, component, etc).
 * Client-safe RPC.
 */
export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })
    return session ?? null
  },
)

/**
 * Server function version of requireAuth for use in routes.
 * Client-safe RPC.
 */
export const requireAuthFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      throw new Response(null, {
        status: 302,
        headers: { Location: '/' },
      })
    }
    return session
  },
)

// NOTE: Shared helpers that you want to use on the server only should NOT have .server
// suffix if they are imported by this file (which is shared).
// The compiler handles stripping server-only code inside createServerFn.
