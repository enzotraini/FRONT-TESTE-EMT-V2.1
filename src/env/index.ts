import { z } from "zod";

const rawEnv = {
	VITE_API_URL: "/api",
	VITE_API_DELAY: import.meta.env.VITE_API_DELAY ?? "false",
	VITE_MODE: import.meta.env.MODE ?? "production",
};

const envSchema = z.object({
	VITE_API_URL: z.string(),
	VITE_API_DELAY: z
		.string()
		.refine((value) => value === "true" || value === "false")
		.transform((value) => value === "true"),
	VITE_MODE: z.enum(["production", "development", "test"]),
});

export const env = envSchema.parse(rawEnv);
