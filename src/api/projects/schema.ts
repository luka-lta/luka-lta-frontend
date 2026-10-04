import { z } from "zod";

export const projectAssetSchema = z.object({
    id: z.string(),
    type: z.enum(["logo", "cover", "screenshot"]),
    url: z.string(),
    alt: z.string().nullable(),
    sortOrder: z.number(),
});

export const projectTagSchema = z.object({
    tagId: z.number(),
    name: z.string(),
    slug: z.string(),
});

export const projectSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    shortDescription: z.string().nullable(),
    description: z.string().nullable(),
    status: z.enum(["development", "beta", "active", "paused", "archived"]),
    isVisible: z.boolean(),
    category: z.string().nullable(),
    tags: z.array(projectTagSchema),
    techStack: z.array(z.string()),
    websiteUrl: z.string().nullable(),
    liveLabel: z.string().nullable(),
    repositoryUrl: z.string().nullable(),
    repositoryOwner: z.string().nullable(),
    repositoryName: z.string().nullable(),
    demoUrl: z.string().nullable(),
    documentationUrl: z.string().nullable(),
    role: z.string().nullable(),
    year: z.number().nullable(),
    isClientProject: z.boolean(),
    sortOrder: z.number(),
    logo: projectAssetSchema.nullable(),
    cover: projectAssetSchema.nullable(),
    screenshots: z.array(projectAssetSchema),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export const projectListSchema = z.object({ projects: z.array(projectSchema) });
export const projectResultSchema = z.object({ project: projectSchema });

export type Project = z.infer<typeof projectSchema>;
export type ProjectAsset = z.infer<typeof projectAssetSchema>;
