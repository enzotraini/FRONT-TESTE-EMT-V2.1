import { api } from "@/lib/axios";

export interface EditarVendedorRequest {
	id: number;
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

export interface EditarVendedorResponse {
	id: number;
	message: string;
}

export async function editarVendedor(
	data: EditarVendedorRequest
): Promise<EditarVendedorResponse> {
	const response = await api.put<EditarVendedorResponse>(`/vendedores/${data.id}`, data);
	return response.data;
} 