import { api } from "@/lib/axios";

export interface CriarVendedorRequest {
	codigo: number;
	nome: string;
	endereco: string;
	bairro: string;
	cidade: string;
	estado: string;
	cep: string;
	telefone1: string;
	telefone2?: string;
	celular1?: string;
	email?: string;
	cgccpf: string;
	inscricaoestadual?: string;
	comissao: number;
	observacoes?: string;
	ativo: boolean;
	user_id: number;
	organizacao_id: number;
}

export interface CriarVendedorResponse {
	id: number;
	message: string;
}

export async function criarVendedor(
	data: CriarVendedorRequest
): Promise<CriarVendedorResponse> {
	const response = await api.post<CriarVendedorResponse>("/vendedores", data);
	return response.data;
} 