import { api } from "@/lib/axios";

export interface CriarTransportadoraRequest {
	nome: string;
	cgccpf: string;
	cep: string;
	endereco: string;
	bairro: string;
	cidade: string;
	estado: string;
	telefone1?: string;
	telefone2?: string;
	fax?: string;
	placa?: string;
	estadualrg?: string;
	fantasia?: string;
	placauf?: string;
	contato?: string;
	email?: string;
	texto?: string;
	placauf1?: string;
	antt?: string;
	user_id: number;
	organizacao_id: number;
}

export interface CriarTransportadoraResponse {
	id: number;
	message: string;
}

export async function criarTransportadora(
	data: CriarTransportadoraRequest
): Promise<CriarTransportadoraResponse> {
	const response = await api.post<CriarTransportadoraResponse>("/transportadoras", data);
	return response.data;
} 