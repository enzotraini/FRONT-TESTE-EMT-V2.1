import { z } from "zod";

const envSchema = z.object({
	VITE_API_URL: z.string(),
	VITE_API_DELAY: z
		.string()
		.refine((value) => value === "true" || value === "false")
		.transform((value) => value === "true"),
	MODE: z.enum(["production", "development", "test"]),
});

export const env = envSchema.parse(import.meta.env);
