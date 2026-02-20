import { createFileRoute, Link } from '@tanstack/react-router'
import { Layers } from 'lucide-react'
import { Collection } from '@/db/schemas/collections'
import { Community } from '@/db/schemas/communities'
import { getCommunityBySlug } from '@/lib/actions/communities'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/communities/$slug')({
  component: CommunityDetail,
  loader: async ({ params }) => getCommunityBySlug({ data: params.slug }),
})

function CommunityDetail() {
  const community = Route.useLoaderData()

  if (community == null) {
    return <div className="p-10 text-center">Community not found</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{community.name}</h1>
        {community.introductoryText && (
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: community.introductoryText }}
          />
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Collections */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Collections in this Community
            </h2>
            <div className="grid gap-4">
              {community.collections.length === 0 ? (
                <p className="text-muted-foreground italic">
                  No collections in this community yet.
                </p>
              ) : (
                community.collections.map((collection: Collection) => (
                  <Link
                    key={collection.id}
                    to="/collections/$slug"
                    params={{ slug: collection.slug }}
                  >
                    <Card className="hover:bg-accent/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {collection.name}
                        </CardTitle>
                        <CardDescription>
                          {collection.shortDescription}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Sub-communities */}
          {community.subCommunities.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-muted-foreground">
                Sub-communities
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {community.subCommunities.map((sub: Community) => (
                  <Link
                    key={sub.id}
                    to="/communities/$slug"
                    params={{ slug: sub.slug }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{sub.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar info */}
        <div className="bg-muted/30 p-6 rounded-lg h-fit">
          <h3 className="font-semibold mb-4">About this Community</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {community.shortDescription || 'No description available.'}
          </p>
          <div className="text-xs text-muted-foreground">
            Created: {new Date(community.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}
