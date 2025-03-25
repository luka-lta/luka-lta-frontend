import {z} from "zod";

export const trackResponse = z.object({
    redirectUrl: z.string().url("Must be a valid URL"),
});