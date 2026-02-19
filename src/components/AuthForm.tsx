import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface AuthFormProps {
  onSuccess?: () => void
  defaultMode?: 'login' | 'register'
}

export function AuthForm({ onSuccess, defaultMode = 'login' }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        })
        if (signInError) {
          setError(signInError.message || 'Invalid email or password')
        } else {
          onSuccess?.()
        }
      } else {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (signUpError) {
          setError(signUpError.message || 'Failed to create account')
        } else {
          onSuccess?.()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {mode === 'login'
            ? 'Enter your credentials to access your dashboard'
            : 'Sign up to start publishing your research'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 text-destructive text-sm items-center">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Dr. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {mode === 'login' && (
              <Button
                variant="link"
                size="sm"
                className="px-0 font-normal h-auto"
              >
                Forgot password?
              </Button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-bold"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
