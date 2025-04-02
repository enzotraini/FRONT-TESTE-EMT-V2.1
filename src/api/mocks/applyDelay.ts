import { env } from "@/env";

export async function applyDelay() {
	if (env.VITE_API_DELAY === true) {
		await new Promise((resolve) =>
			setTimeout(resolve, Math.round(Math.random() * 3000)),
		);
	}
}
