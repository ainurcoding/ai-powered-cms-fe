import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type { Media } from '../types';

export const mediaService = {
  async uploadFile(file: File): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getMediaList(): Promise<Media[]> {
    const response = await api.get(API_ENDPOINTS.MEDIA.LIST);
    return response.data;
  },

  async deleteMedia(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.MEDIA.DELETE(id));
  },
};

