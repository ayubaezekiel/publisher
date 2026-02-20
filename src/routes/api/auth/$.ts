import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          return await auth.handler(request)
        } catch (error: any) {
          console.error('Auth GET Error:', error)
          return new Response(
            JSON.stringify({
              status: 500,
              message: error.message || 'Internal Server Error',
              stack:
                process.env.NODE_ENV === 'development'
                  ? error.stack
                  : undefined,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
      POST: async ({ request }) => {
        try {
          return await auth.handler(request)
        } catch (error: any) {
          console.error('Auth POST Error:', error)
          return new Response(
            JSON.stringify({
              status: 500,
              message: error.message || 'Internal Server Error',
              stack:
                process.env.NODE_ENV === 'development'
                  ? error.stack
                  : undefined,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
