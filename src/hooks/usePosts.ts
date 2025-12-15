import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/post.service';
import type { CreatePostData, Post } from '../types';
import toast from 'react-hot-toast';

export const usePosts = (params?: {
  page?: number;
  size?: number;
  status?: string;
  category_id?: string;
  tag_id?: string;
  search?: string;
  author?: string;
}) => {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postService.getPosts(params),
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post berhasil dibuat!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Gagal membuat post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostData> }) =>
      postService.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      // Show specific message if only status is being updated
      if (
        variables.data &&
        Object.keys(variables.data).length === 1 &&
        'status' in variables.data
      ) {
        const statusMessage =
          variables.data.status === 'published'
            ? 'Post berhasil dipublish!'
            : variables.data.status === 'draft'
              ? 'Post berhasil diubah ke draft!'
              : 'Post berhasil diupdate!';
        toast.success(statusMessage);
      } else {
        toast.success('Post berhasil diupdate!');
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Gagal update post');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value for all posts queries
      const previousPostsQueries = queryClient.getQueriesData({
        queryKey: ['posts'],
      });

      // Optimistically remove the post from all posts queries
      previousPostsQueries.forEach(([queryKey, data]) => {
        if (Array.isArray(data)) {
          queryClient.setQueryData<Post[]>(queryKey, (old) => {
            if (!old) return old;
            return old.filter((post) => post.id !== deletedId);
          });
        }
      });

      return { previousPostsQueries };
    },
    onSuccess: async (_, deletedId) => {
      // Remove the specific post from cache
      queryClient.removeQueries({ queryKey: ['post', deletedId] });

      // Invalidate and refetch all posts queries (with any params)
      await queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });

      // Refetch all active posts queries to ensure UI updates
      await queryClient.refetchQueries({ queryKey: ['posts'], exact: false });

      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success('Post berhasil dihapus!');
    },
    onError: (error: unknown, _deletedId, context) => {
      // Rollback on error
      if (context?.previousPostsQueries) {
        context.previousPostsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Gagal menghapus post');
    },
  });
};

export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'published' | 'draft' | 'archived';
    }) => postService.updatePostStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      const statusMessage =
        variables.status === 'published'
          ? 'Post berhasil dipublish!'
          : variables.status === 'draft'
            ? 'Post berhasil diubah ke draft!'
            : 'Post berhasil di-archive!';
      toast.success(statusMessage);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Gagal mengubah status post');
    },
  });
};
