import { api } from "@/lib/axios";
import { Vendedor } from "@/types/vendedor";

export interface BuscarVendedorPorIdResponse {
	dadosGerais: {
		nome: string;
		cgccpf: string;
		cep: string;
		endereco: string;
		bairro: string;
		cidade: string;
		estado: string;
		telefone: string;
		celular1: string;
		celular2: string;
		comissao: string;
		estadualrg: string;
		email: string;
		observacoes: string;
	};
}

export async function buscarVendedorPorId(
	id: string
): Promise<BuscarVendedorPorIdResponse> {
	const response = await api.get<BuscarVendedorPorIdResponse>(
		`/vendedores/${id}`
	);

	return response.data;
} 