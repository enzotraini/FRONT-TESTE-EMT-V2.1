import { api } from "../api";

interface RecuperarSenhaRequest {
	email: string;
}

export async function recuperarSenha({ email }: RecuperarSenhaRequest) {
	const response = await api.post("/usuarios/recuperar-senha", {
		email,
	});

	return response.data;
} 