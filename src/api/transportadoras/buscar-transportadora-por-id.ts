import { api } from "@/lib/axios";

export interface TransportadoraCompleta {
	dadosGerais: {
		id: number;
		transporte: number;
		nome: string;
		cgccpf: string;
		fantasia?: string;
		contato?: string;
		telefone1?: string;
		telefone2?: string;
		email?: string;
		fax?: string;
		endereco: string;
		bairro: string;
		cidade: string;
		estado: string;
		cep: string;
		estadualrg?: string;
		placa?: string;
		placauf?: string;
		placauf1?: string;
		antt?: string;
		texto?: string;
	};
}

export async function buscarTransportadoraPorId(id: number): Promise<TransportadoraCompleta> {
	const response = await api.get<TransportadoraCompleta>(`/transportadoras/${id}`);
	return response.data;
} 