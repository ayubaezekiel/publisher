import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createCommunity, getCommunities } from '@/lib/actions/communities'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, Save } from 'lucide-react'

export const Route = createFileRoute('/dashboard/communities/new')({
  component: NewCommunity,
  loader: () => getCommunities(),
})

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function NewCommunity() {
  const allCommunities = Route.useLoaderData()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    introductoryText: '',
    logoUrl: '',
    parentCommunityId: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug) {
      setError('Name and slug are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createCommunity({
        data: {
          name: form.name,
          slug: form.slug,
          shortDescription: form.shortDescription || undefined,
          introductoryText: form.introductoryText || undefined,
          logoUrl: form.logoUrl || undefined,
          parentCommunityId: form.parentCommunityId || undefined,
        },
      })
      navigate({ to: '/dashboard/communities' })
    } catch {
      setError('Failed to create community. The slug may already be taken.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <Link
            to="/dashboard/communities"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← Back to Communities
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            New Community
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new research community or faculty group.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Faculty of Engineering"
              value={form.name}
              onChange={(e) => {
                set('name', e.target.value)
                if (!form.slug) set('slug', slugify(e.target.value))
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="e.g. faculty-of-engineering"
              value={form.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier. Auto-generated from name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              placeholder="One-line summary shown in listings"
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="introductoryText">Introductory Text</Label>
            <Textarea
              id="introductoryText"
              placeholder="Longer description shown on the community page…"
              value={form.introductoryText}
              onChange={(e) => set('introductoryText', e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              placeholder="https://…"
              value={form.logoUrl}
              onChange={(e) => set('logoUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Parent Community (optional)</Label>
            <Select
              onValueChange={(v) =>
                set(
                  'parentCommunityId',
                  (v as string) === '__none' ? '' : (v as string),
                )
              }
            >
              <SelectTrigger id="parent">
                <SelectValue placeholder="None (top-level community)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">None</SelectItem>
                {allCommunities.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/dashboard/communities' })}
              disabled={saving}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(buttonVariants(), 'inline-flex items-center gap-2')}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 shrink-0" />
                  <span>Create Community</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
