import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { getCollections, updateCollection } from '@/lib/actions/collections'
import { getCommunities } from '@/lib/actions/communities'
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

export const Route = createFileRoute('/dashboard/collections/$id/edit')({
  component: EditCollection,
  loader: async ({ params }) => {
    const [allCollections, communities] = await Promise.all([
      getCollections(),
      getCommunities(),
    ])
    const current = allCollections.find((c: any) => c.id === params.id)
    return { current, communities }
  },
})

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function EditCollection() {
  const { current, communities } = Route.useLoaderData()
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: current?.name ?? '',
    slug: current?.slug ?? '',
    shortDescription: current?.shortDescription ?? '',
    introductoryText: current?.introductoryText ?? '',
    logoUrl: current?.logoUrl ?? '',
    communityId: current?.communityId ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  if (!current) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Collection not found.{' '}
        <Link to="/dashboard/collections" className="underline">
          Go back
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug || !form.communityId) {
      setError('Name, slug, and community are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateCollection({
        data: {
          id,
          name: form.name,
          slug: form.slug,
          communityId: form.communityId,
          shortDescription: form.shortDescription || undefined,
          introductoryText: form.introductoryText || undefined,
          logoUrl: form.logoUrl || undefined,
        },
      })
      navigate({ to: '/dashboard/collections' })
    } catch {
      setError('Failed to update collection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <Link
            to="/dashboard/collections"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← Back to Collections
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Collection
          </h1>
          <p className="text-muted-foreground mt-1">{current.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="community">
              Community <span className="text-destructive">*</span>
            </Label>
            <Select
              defaultValue={form.communityId}
              onValueChange={(v) => set('communityId', v as string)}
            >
              <SelectTrigger id="community">
                <SelectValue placeholder="Select a community…" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="introductoryText">Introductory Text</Label>
            <Textarea
              id="introductoryText"
              value={form.introductoryText}
              onChange={(e) => set('introductoryText', e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={form.logoUrl}
              onChange={(e) => set('logoUrl', e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/dashboard/collections' })}
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
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
