import { createFileRoute, Link } from '@tanstack/react-router'
import { getCommunities } from '@/lib/actions/communities'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users } from 'lucide-react'

export const Route = createFileRoute('/communities/')({
  component: CommunitiesIndex,
  loader: () => getCommunities(),
})

function CommunitiesIndex() {
  const communities = Route.useLoaderData()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground mt-2">
            Browse research by faculty, school, or department.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community: any) => (
          <Link
            key={community.id}
            to="/communities/$slug"
            params={{ slug: community.slug }}
            className="block h-full"
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  {community.logoUrl && (
                    <img
                      src={community.logoUrl}
                      alt={community.name}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </div>
                <CardTitle className="line-clamp-2">{community.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {community.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {community.subCommunities.length > 0 && (
                    <span className="mr-4">
                      {community.subCommunities.length} Sub-communities
                    </span>
                  )}
                  <span>{community.collections.length} Collections</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
