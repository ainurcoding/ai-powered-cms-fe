import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { usePosts, useDeletePost, useUpdatePost } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { Checkbox } from '../components/ui/Checkbox';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/AlertDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';

export const PostsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Determine if user is admin/editor (role === 'ADMIN' || role === 'EDITOR')
  const isAdminOrEditor =
    user?.role === 'ADMIN' || user?.role === 'EDITOR' || false;

  // Determine authorId to filter by:
  // - If user is regular USER (not admin/editor), always filter by their ID
  // - If user is admin/editor and checkbox is checked, filter by their ID
  // - If user is admin/editor and checkbox is unchecked, show all (no filter)
  const authorId = !isAdminOrEditor || showOnlyMine ? user?.id : undefined;

  const {
    data: posts,
    isLoading,
    error,
  } = usePosts({
    author: authorId,
  });
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  // Filter posts
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (selectedPostId) {
      try {
        await deletePost.mutateAsync(selectedPostId);
        setDeleteDialogOpen(false);
        setSelectedPostId(null);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await updatePost.mutateAsync({ id, data: { status: 'published' } });
    } catch {
      // Error already handled by hook
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await updatePost.mutateAsync({ id, data: { status: 'draft' } });
    } catch {
      // Error already handled by hook
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
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
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive">
                Gagal memuat posts. Silakan refresh halaman.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground">
              Kelola semua posts Anda di sini
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Show checkbox only for admin/editor */}
            {isAdminOrEditor && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-only-mine-posts"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                />
                <label
                  htmlFor="show-only-mine-posts"
                  className="cursor-pointer text-sm font-medium"
                >
                  Hanya Saya
                </label>
              </div>
            )}
            <Link to="/posts/new">
              <Button>Create New Post</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Posts ({filteredPosts?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPosts && filteredPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left font-medium">Title</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Category</th>
                      <th className="p-4 text-left font-medium">Author</th>
                      <th className="p-4 text-left font-medium">Created</th>
                      <th className="p-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-accent/50 border-b">
                        <td className="p-4">
                          <div>
                            <Link
                              to={`/posts/${post.id}/edit`}
                              className="hover:text-primary font-medium"
                            >
                              {post.title}
                            </Link>
                            {post.excerpt && (
                              <p className="text-muted-foreground line-clamp-1 text-sm">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              post.status === 'published'
                                ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20'
                                : post.status === 'draft'
                                  ? 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20'
                                  : 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20'
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {post.category?.name || '-'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{post.author.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {format(new Date(post.created_at), 'dd MMM yyyy', {
                              locale: id,
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {post.status !== 'published' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePublish(post.id)}
                                disabled={updatePost.isPending}
                              >
                                Publish
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnpublish(post.id)}
                                disabled={updatePost.isPending}
                              >
                                Unpublish
                              </Button>
                            )}
                            <Link to={`/posts/${post.id}/edit`}>
                              <Button size="sm" variant="ghost">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedPostId(post.id);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={deletePost.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                No posts found. Create your first post!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};
