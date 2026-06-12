import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsService, type CreateProjectRequest, type ProjectDetail } from "../services/projects-service";
import { QUERY_KEYS } from "@/lib/constants";
import { getApiErrorMessage } from "@/lib/api-client";
import type { Project } from "@/types/api";
import { toast } from "sonner";

export function useProjects() {
  return useQuery({
    queryKey: QUERY_KEYS.projects.all,
    queryFn: () => projectsService.getProjects(),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectsService.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success("Project created");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create project")),
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.detail(projectId),
    queryFn: () => projectsService.getProjectById(projectId),
    enabled: !!projectId,
  });
}

export function useAddMilestone(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string; dueDate?: string }) =>
      projectsService.addMilestone(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
      toast.success("Milestone added");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to add milestone")),
  });
}

export function useUpdateProjectProgress(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (completionPercent: number) => projectsService.updateProgress(projectId, completionPercent),
    onMutate: async (completionPercent) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
      const previousDetail = queryClient.getQueryData<ProjectDetail>(QUERY_KEYS.projects.detail(projectId));
      const previousProjects = queryClient.getQueryData<Project[]>(QUERY_KEYS.projects.all);

      queryClient.setQueryData<ProjectDetail>(QUERY_KEYS.projects.detail(projectId), (current) =>
        current ? { ...current, completionPercent } : current
      );
      queryClient.setQueryData<Project[]>(QUERY_KEYS.projects.all, (current) =>
        (current ?? []).map((project) => (project.id === projectId ? { ...project, completionPercent } : project))
      );

      return { previousDetail, previousProjects };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success("Progress updated");
    },
    onError: (error, _completionPercent, context) => {
      queryClient.setQueryData(QUERY_KEYS.projects.detail(projectId), context?.previousDetail);
      queryClient.setQueryData(QUERY_KEYS.projects.all, context?.previousProjects);
      toast.error(getApiErrorMessage(error, "Failed to update progress"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
  });
}

export function useUpdateMilestoneStatus(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, status }: { milestoneId: string; status: string }) =>
      projectsService.updateMilestoneStatus(projectId, milestoneId, status),
    onMutate: async ({ milestoneId, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
      const previousDetail = queryClient.getQueryData<ProjectDetail>(QUERY_KEYS.projects.detail(projectId));

      queryClient.setQueryData<ProjectDetail>(QUERY_KEYS.projects.detail(projectId), (current) => {
        if (!current) return current;
        return {
          ...current,
          milestones: current.milestones.map((milestone) =>
            milestone.id === milestoneId ? { ...milestone, status } : milestone
          ),
        };
      });

      return { previousDetail };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success("Milestone status updated");
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(QUERY_KEYS.projects.detail(projectId), context?.previousDetail);
      toast.error(getApiErrorMessage(error, "Failed to update milestone status"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(projectId) });
    },
  });
}
