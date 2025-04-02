import { http, HttpResponse } from "msw";
import type { AuthenticateBody } from "../../usuario/authenticate";
import { applyDelay } from "@/api/mocks/applyDelay";

export const authenticateMock = http.post<never, AuthenticateBody>(
	"/auth",
	async ({ request }) => {
		await applyDelay();
		const { email, senha } = await request.json();
		if (email === "example@email.com" && senha === "123456") {
			return HttpResponse.json(null, { status: 200 });
		}

		return HttpResponse.json(
			{ message: "Crendeciais inválidas" },
			{ status: 401 },
		);
	},
);
