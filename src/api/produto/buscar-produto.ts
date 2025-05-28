import { api } from "@/lib/axios";

export interface BuscarProdutosParams {
	page: number;
	perPage: number;
	search?: string;
}

export interface ProdutoDaListagem {
  codigo: string;
  tipo: string;
  secao: string;
  bitola: string;
  acab: string;
  corrida: string;
  estqatual: number;
  uni: string;
  tipoaco: string;
  local: string;
  tratamento: string;
  observaocao: string;
  tributo: string;
  classifisc: string;
  fornecedor: string;
  tipomaterial: string;
  codbloco: string;
  registro: string;
}


export interface BuscarProdutosResponse {
  produtos: ProdutoDaListagem[];
  meta: {
    page: number;
    perPage: number;
    total: number;
  };
}


export async function buscarProdutos({
	page,
	perPage,
	search,
}: BuscarProdutosParams) {
	const response = await api.get<BuscarProdutosResponse>("/produtos", {
		params: {
			page,
			perPage,
			search,
		},
	});

	return response.data;
}