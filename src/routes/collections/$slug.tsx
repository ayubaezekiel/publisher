import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Item } from '@/db/schemas/items'
import { getCollectionBySlug } from '@/lib/actions/collections'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

export const Route = createFileRoute('/collections/$slug')({
  component: CollectionDetail,
  loader: async ({ params }) =>
    await getCollectionBySlug({ data: params.slug }),
})

function CollectionDetail() {
  const collection = Route.useLoaderData()

  if (!collection) {
    return <div className="p-10 text-center">Collection not found</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">
          <Link
            to="/communities/$slug"
            params={{ slug: collection.community.slug }}
            className="hover:underline"
          >
            {collection.community.name}
          </Link>
          <span className="mx-2">/</span>
          Collection
        </div>
        <h1 className="text-4xl font-bold mb-4">{collection.name}</h1>
        {collection.introductoryText && (
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: collection.introductoryText }}
          />
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Recent Submissions
        </h2>

        <div className="grid gap-4">
          {collection.items.length === 0 ? (
            <p className="text-muted-foreground italic">
              No items in this collection yet.
            </p>
          ) : (
            collection.items.map((item: Item) => (
              <Link key={item.id} to="/items/$id" params={{ id: item.id }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-primary">
                        {item.title}
                      </CardTitle>
                      {item.issueDate && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.issueDate).getFullYear()}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 text-muted-foreground">
                      {item.abstract || 'No abstract available.'}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.publisher && <span>{item.publisher}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
