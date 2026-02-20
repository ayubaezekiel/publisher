import { useState } from 'react'
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { addBitstreamToItem, createItem } from '@/lib/actions/items'
import { getCollections } from '@/lib/actions/collections'
import { buttonVariants } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { Loader2, Send, Upload } from 'lucide-react'
import { getSessionFn } from '@/lib/session'

export const Route = createFileRoute('/dashboard/submit/')({
  component: SubmitPage,
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session?.user) throw redirect({ to: '/' })
  },
  loader: () => getCollections(),
})

function SubmitPage() {
  const collections = Route.useLoaderData()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    collectionId: '',
    publisher: '',
    citation: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.collectionId) {
      setError('Please select a collection.')
      return
    }
    setError(null)
    setIsSubmitting(true)

    try {
      const newItem = await createItem({
        data: {
          ...formData,
          status: 'workflow',
          issueDate: new Date(),
        },
      })

      if (file && newItem) {
        const mockUrl = `https://r2.poolcdn.com/${file.name}`
        await addBitstreamToItem({
          data: {
            itemId: newItem.id,
            name: file.name,
            sizeBytes: file.size,
            mimeType: file.type || 'application/octet-stream',
            url: mockUrl,
            bundleName: 'ORIGINAL',
          },
        })
      }

      navigate({ to: '/dashboard/my-submissions' })
    } catch (err) {
      console.error('Submission failed', err)
      setError('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Submit New Item
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to submit your research to the repository.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection" className="text-sm font-medium">
              Collection <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setFormData({ ...formData, collectionId: val as string })
              }
            >
              <SelectTrigger id="collection" className="w-full">
                <SelectValue placeholder="Select a collection…" />
              </SelectTrigger>
              <SelectContent>
                {collections.length === 0 ? (
                  <SelectItem value="__none" disabled>
                    No collections available
                  </SelectItem>
                ) : (
                  collections.map((col: any) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Analysis of Machine Learning in Healthcare"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <Label htmlFor="abstract" className="text-sm font-medium">
              Abstract
            </Label>
            <Textarea
              id="abstract"
              placeholder="Provide a brief summary of your research…"
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
              className="min-h-[140px] resize-y"
            />
          </div>

          {/* Publisher + Citation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="publisher" className="text-sm font-medium">
                Publisher
              </Label>
              <Input
                id="publisher"
                placeholder="e.g. AFUST Press"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="citation" className="text-sm font-medium">
                Citation
              </Label>
              <Input
                id="citation"
                placeholder="e.g. APA, MLA format…"
                value={formData.citation}
                onChange={(e) =>
                  setFormData({ ...formData, citation: e.target.value })
                }
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Upload File
            </Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.odt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {file ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Upload className="h-3 w-3 shrink-0" />
                <span>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, Word (.doc/.docx), Plain text, ODT
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            {/* Cancel — plain button, no icon needed */}
            <button
              type="button"
              onClick={() => navigate({ to: '/dashboard' })}
              disabled={isSubmitting}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Cancel
            </button>

            {/* Submit — inline-flex so icon + text align */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(buttonVariants(), 'inline-flex items-center gap-2')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 shrink-0" />
                  <span>Submit Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
