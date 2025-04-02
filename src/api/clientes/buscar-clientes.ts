import { api } from "@/lib/axios";

export interface BuscarClientesParams {
	page: number;
	perPage: number;
	search?: string;
}

export interface ClienteDaListagem {
	id: number;
	nome: string;
	fantasia: string;
	cnpj: string;
	contato: string;
	telefone1: string;
	telefone2: string;
	fax: string;
	dataCadastro: string;
	dataAtual: string;
	vendedores: string;
}

export interface BuscarClientesResponse {
	clientes: ClienteDaListagem[];
	meta: {
		page: number;
		perPage: number;
		total: number;
	};
	teste: any;
}

export async function buscarClientes({
	page,
	perPage,
	search,
}: BuscarClientesParams) {
	const response = await api.get<BuscarClientesResponse>("/clientes", {
		params: {
			page,
			perPage,
			search,
		},
	});

	return response.data;
}
