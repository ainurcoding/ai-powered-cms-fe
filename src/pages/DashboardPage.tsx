import { Layout } from '../components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang di AI CMS Dashboard
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang di AI CMS Dashboard
            </p>
          </div>
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive">
                Gagal memuat data dashboard. Silakan refresh halaman.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const totalPosts = stats?.totalPosts ?? 0;
  const publishedPosts = stats?.publishedPosts ?? 0;
  const totalCategories = stats?.totalCategories ?? 0;
  const totalTags = stats?.totalTags ?? 0;
  const recentPosts = stats?.recentPosts ?? [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di AI CMS Dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-muted-foreground text-xs">
                {publishedPosts} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts}</div>
              <p className="text-muted-foreground text-xs">
                {totalPosts > 0
                  ? `${Math.round((publishedPosts / totalPosts) * 100)}% of total`
                  : 'No posts yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-muted-foreground text-xs">Active categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTags}</div>
              <p className="text-muted-foreground text-xs">Available tags</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest posts</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-border flex items-start justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm leading-none font-medium">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 text-xs">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              post.status === 'published'
                                ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20'
                            }`}
                          >
                            {post.status}
                          </span>
                          <span>•</span>
                          <span>
                            {format(new Date(post.created_at), 'dd MMM yyyy', {
                              locale: id,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  No posts yet. Create your first post!
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/posts/new"
                className="text-primary hover:text-primary/90 block text-sm font-medium transition-colors"
              >
                • Create new post
              </Link>
              <Link
                to="/categories"
                className="text-primary hover:text-primary/90 block text-sm font-medium transition-colors"
              >
                • Manage categories
              </Link>
              <Link
                to="/media"
                className="text-primary hover:text-primary/90 block text-sm font-medium transition-colors"
              >
                • Upload media
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
