import { api } from "@/lib/axios";

export interface EditarProdutoParams {
  codigo: string;
  tipo: string;
  secao: string;
  bitola: string;
  acab: string;
  descricao: string;
  unidade: string;
  titulo?: string;
  marca?: string;
  observacao?: string;
  estqatual?: number;
  estqanterior?: number;
  estqminimo?: number;
  estqideal?: number;
  estqmaximo?: number;
  custoreal?: number;
  custoreal1?: number;
  precovenda?: number;
  codipi?: string;
  classifisc: string;
  qtdultvda?: number;
  cusultvda?: number;
  clieultvda?: string;
  pesoliqui?: number;
  cusmedatua?: number;
  cusmedante?: number;
  ipi?: number;
  qtdultcpa?: number;
  fornultcpa?: number;
  cusultcpa?: number;
  estqcpa?: number;
  pesoliq?: number;
  percicms?: number;
  tributo?: string;
  csosn?: string;
  precomini?: number;
  ident?: string;
  programa?: string;
  estqreser?: number;
  lote?: string;
  corrida?: string;
  seqcorrida?: string;
  bitola1?: number;
  bitola2?: number;
  bitola3?: number;
  bitorigi1?: number;
  bitorigi2?: number;
  bitorigi3?: number;
  barras?: number;
  compriment?: number;
  tipoaco: string;
  local: string;
  identific?: string;
  fornecedor?: string;
  observaocao?: string;
  alongament?: string;
  ultra_som?: string;
  nrocerti?: string;
  fci?: string;
  texto?: string;
  comprimemf?: number;
  blocok?: boolean;
  unidblocok?: string;
  cod_item_k?: string;
  tratamento: string;
  marcalista?: boolean;

  user_id: number;
  organizacao_id: number;
}

export async function editarProdutoService(params: EditarProdutoParams) {
  console.log("Iniciando requisição para editar produto:", JSON.stringify(params, null, 2));

  try {
    const response = await api.put(`/produtos/${params.codigo}`, params);

    console.log("Resposta do servidor:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        status: response.status,
        data: response.data,
      };
    }

    throw new Error("Erro ao editar produto");
  } catch (error: any) {
    console.error("Erro ao editar produto:", {
      error,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      response: error.response?.data,
    });
    throw error;
  }
}
