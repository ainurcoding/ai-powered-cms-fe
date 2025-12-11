import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboardStats = (authorId?: string) => {
  return useQuery({
    queryKey: ['dashboardStats', authorId],
    queryFn: () => dashboardService.getDashboardStats(authorId),
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: true,
  });
};
