import { api } from "../api";

interface CriarUsuarioRequest {
	nome: string;
	email: string;
	senha: string;
}

export async function criarUsuario({ nome, email, senha }: CriarUsuarioRequest) {
	const response = await api.post("/usuarios", {
		nome,
		email,
		senha,
	});

	return response.data;
} 