import { apiClient } from "@/lib/api-client";
import type { Project } from "@/types/api";

export interface CreateProjectRequest {
  title: string;
  location: string;
  state: string;
  contractValue: number;
  tenderId?: string;
}

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>("/projects");
    return response.data;
  },

  async createProject(payload: CreateProjectRequest): Promise<{ id: string; title: string; status: string }> {
    const response = await apiClient.post("/projects", payload);
    return response.data;
  },

  async getProjectById(id: string): Promise<ProjectDetail> {
    const response = await apiClient.get<ProjectDetail>(`/projects/${id}`);
    return response.data;
  },

  async addMilestone(projectId: string, payload: { title: string; description?: string; dueDate?: string }) {
    const response = await apiClient.post(`/projects/${projectId}/milestones`, payload);
    return response.data as { id: string };
  },

  async updateProgress(projectId: string, completionPercent: number): Promise<void> {
    await apiClient.patch(`/projects/${projectId}/progress`, { completionPercent });
  },

  async updateMilestoneStatus(projectId: string, milestoneId: string, status: string): Promise<void> {
    await apiClient.patch(`/projects/${projectId}/milestones/${milestoneId}`, { status });
  },
};

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  completedAt?: string;
  sortOrder: number;
}

export interface ProjectDetail extends Project {
  milestones: ProjectMilestone[];
}
