import { projectListSchema, projectResultSchema, type Project } from "@/api/projects/schema.ts";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);

    if (!response.ok) {
        throw new Error(`Projects API error: ${response.status} ${response.statusText}`);
    }

    const body = await response.json();

    return projectListSchema.parse(body.data).projects;
}

export async function fetchProject(slug: string): Promise<Project | null> {
    const response = await fetch(`${API_URL}/projects/${slug}`);

    // Ein unbekannter oder unsichtbarer Slug ist kein Fehler, sondern "nicht da" —
    // die Detailseite zeigt dafuer ihren eigenen Nicht-gefunden-Zustand.
    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Project API error: ${response.status} ${response.statusText}`);
    }

    const body = await response.json();

    return projectResultSchema.parse(body.data).project;
}
