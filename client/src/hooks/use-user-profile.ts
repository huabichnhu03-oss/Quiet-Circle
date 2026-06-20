import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DEFAULT_PROFILE, type UserProfileData } from "@shared/profile-data";

export function useUserProfile() {
  const queryClient = useQueryClient();

  const query = useQuery<UserProfileData>({
    queryKey: ["/api/profile"],
  });

  const mutation = useMutation({
    mutationFn: async (patch: Partial<UserProfileData>) => {
      const res = await apiRequest("PATCH", "/api/profile", patch);
      return res.json() as Promise<UserProfileData>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/profile"], data);
    },
  });

  return {
    profile: query.data ?? DEFAULT_PROFILE,
    isLoading: query.isLoading,
    updateProfile: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
