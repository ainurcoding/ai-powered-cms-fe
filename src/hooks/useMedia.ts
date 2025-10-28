import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService } from '../services/media.service';
import toast from 'react-hot-toast';

export const useMediaList = () => {
  return useQuery({
    queryKey: ['media'],
    queryFn: mediaService.getMediaList,
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => mediaService.uploadFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('File berhasil diupload!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Gagal upload file');
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaService.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('File berhasil dihapus!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Gagal menghapus file');
    },
  });
};
