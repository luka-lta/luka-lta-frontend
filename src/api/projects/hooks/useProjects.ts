import { useQuery } from "@tanstack/react-query";
import { fetchProject, fetchProjects } from "@/api/projects/endpoints/projects.ts";

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        staleTime: 60_000,
    });
}

export function useProject(slug: string | undefined) {
    return useQuery({
        queryKey: ["projects", slug],
        queryFn: () => fetchProject(slug!),
        enabled: !!slug,
        staleTime: 60_000,
    });
}
