import { http, HttpResponse } from "msw";
import type { AuthenticateBody } from "../../usuario/authenticate";
import { applyDelay } from "@/api/mocks/applyDelay";

export const authenticateMock = http.post<never, AuthenticateBody>(
	"/auth",
	async ({ request }) => {
		await applyDelay();
		const { email, senha } = await request.json();
		if (email === "example@email.com" && senha === "123456") {
			// Simula um token JWT com os IDs necessários
			const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwib3JnIjoiMSJ9.signature";
			
			// Define o cookie com o token
			return new HttpResponse(null, {
				status: 204,
				headers: {
					"Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict`
				}
			});
		}

		return HttpResponse.json(
			{ message: "Credenciais inválidas" },
			{ status: 401 },
		);
	},
);
