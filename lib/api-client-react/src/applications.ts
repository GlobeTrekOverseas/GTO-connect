import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface Application {
  id: number;
  userId: number;
  universityName: string;
  country: string;
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationInput {
  universityName: string;
  country: string;
}

export const getApplicationsQueryKey = () => ["/api/applications"] as const;

export const getApplications = async (): Promise<Application[]> => {
  return customFetch<Application[]>("/api/applications", { method: "GET" });
};

export const createApplication = async (
  body: CreateApplicationInput,
): Promise<Application> => {
  return customFetch<Application>("/api/applications", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const useGetApplications = <TData = Application[]>(
  options?: Omit<
    UseQueryOptions<Application[], Error, TData>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: getApplicationsQueryKey(),
    queryFn: getApplications,
    ...options,
  });
};

export const useCreateApplication = (
  options?: UseMutationOptions<Application, Error, CreateApplicationInput>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getApplicationsQueryKey() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    ...options,
  });
};
