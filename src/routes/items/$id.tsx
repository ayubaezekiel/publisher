import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getItemById } from '@/lib/actions/items'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Calendar, Download, File } from 'lucide-react'

export const Route = createFileRoute('/items/$id')({
  component: ItemDetail,
  loader: async ({ params }) => await getItemById({ data: params.id }),
})

function ItemDetail() {
  const item = Route.useLoaderData()

  if (!item) {
    return <div className="p-10 text-center">Item not found</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
          <Link
            to="/collections/$slug"
            params={{ slug: item.collection.slug }}
            className="hover:underline"
          >
            {item.collection.name}
          </Link>
          <span>/</span>
          <Link
            to="/collections/$slug"
            params={{ slug: item.collection.slug }}
            className="hover:underline"
          >
            {item.collection.name}
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{item.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
          {item.issueDate && (
            <div className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(item.issueDate).toLocaleDateString()}</span>
            </div>
          )}
          {item.publisher && (
            <div className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{item.publisher}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Files Section */}
          <section className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <File className="h-5 w-5 text-primary" />
              Files in this item
            </h2>
            <div className="space-y-3">
              {item.bitstreams.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB •{' '}
                        {file.mimeType}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'sm' }),
                      'inline-flex items-center gap-1.5',
                    )}
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" />
                    <span>View/Open</span>
                  </a>
                </div>
              ))}
              {item.bitstreams.length === 0 && (
                <p className="text-muted-foreground italic text-sm">
                  No files attached publicly.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Abstract</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground bg-muted/20 p-6 rounded-xl border-l-4 border-primary">
              {item.abstract || 'No abstract available.'}
            </div>
          </section>

          {item.citation && (
            <section>
              <h3 className="text-lg font-semibold mb-2">Citation</h3>
              <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                {item.citation}
              </div>
            </section>
          )}

          {/* Metadata Table */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Metadata</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {Object.entries(item.metadata as Record<string, any>).map(
                    ([key, value]) => (
                      <tr key={key} className="hover:bg-muted/50">
                        <td className="p-3 font-medium w-1/3 bg-muted/20">
                          {key}
                        </td>
                        <td className="p-3">
                          {Array.isArray(value)
                            ? value.join(', ')
                            : String(value)}
                        </td>
                      </tr>
                    ),
                  )}
                  {/* Core fields map to DC too potentially */}
                  <tr className="hover:bg-muted/50">
                    <td className="p-3 font-medium bg-muted/20">dc.title</td>
                    <td className="p-3">{item.title}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to="/collections/$slug"
                params={{ slug: item.collection.slug }}
                className="text-primary hover:underline text-sm block"
              >
                {item.collection.name}
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Views</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-medium">--</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
