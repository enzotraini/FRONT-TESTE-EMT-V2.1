import { api } from "@/lib/axios";

export interface BuscarFornecedoresParams {
	page: number;
	perPage: number;
	search?: string;
}

export interface FornecedorDaListagem {
	id: number;
	nome: string;
	fantasia: string;
	cgcfor: string;
	contato: string;
	telefone1: string;
	telefone2: string;
	fax: string;
	dataCadastro: string;
	dataAtual: string;
	vendedores: string;
	endereco: string;
	nro: string;
	bairro: string;
	cidade: string;
	observacao: string;
	cep: string;
	estado: string;
	estadualrg: string;
	email: string;
	complemento: string;
	segmento: string;
}

export interface BuscarFornecedoresResponse {
	fornecedores: FornecedorDaListagem[];
	meta: {
		page: number;
		perPage: number;
		total: number;
	};
}

export async function buscarFornecedores({
	page,
	perPage,
	search,
}: BuscarFornecedoresParams) {
	
	const response = await api.get<BuscarFornecedoresResponse>("/fornecedores", {
		params: {
			page,
			perPage,
			search,
		},
	});

	return response.data;
}
