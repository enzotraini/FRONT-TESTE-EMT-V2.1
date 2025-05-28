import { api } from "@/lib/axios";

export interface CriarProdutoService {
  codprod?: string;
  tipo?: string;
  secao?: string;
  bitola?: string;
  acab?: string;
  descricao?: string;
  unidade?: string;
  titulo?: string;
  marca?: string;
  obs?: string;
  estqatual?: number;
  estqanterior?: number;
  estqminimo?: number;
  estqideal?: number;
  estqmaximo?: number;
  custoreal?: number;
  custoreal1?: number;
  precovenda?: number;
  dtultatual?: string;
  codipi?: string;
  classifisc?: string;
  dtcadastro?: string;
  qtdultvda?: number;
  cusultvda?: number;
  dtultvda?: string;
  clieultvda?: string;
  pesoliqui?: number;
  cusmedatua?: number;
  cusmedante?: number;
  ipi?: number;
  nrodocto?: string;
  qtdultcpa?: number;
  fornultcpa?: number;
  cusultcpa?: number;
  dtultcpa?: string;
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
  tipoaco?: string;
  local?: string;
  identific?: string;
  fornecedor?: string;
  escoament?: string;
  alongament?: string;
  ultra_som?: string;
  nrocerti?: string;
  fci?: string;
  texto?: string;
  comprimenf?: number;
  blocok?: boolean;
  unidblocok?: string;
  cod_item_k?: string;
  tratamento?: string;
  marcalista?: boolean;
  user_id: number;
  organizacao_id: number;
}

export async function criarProdutoService(params: CriarProdutoService) {
  console.log("Criando produto:", JSON.stringify(params, null, 2));
  try {
    const response = await api.post("/produtos", params);

    if (response.status >= 200 && response.status < 300) {
      return {
        status: response.status,
        data: response.data,
        id: response.data.id,
      };
    }

    throw new Error("Erro ao criar produto.");
  } catch (error: any) {
    console.error("Erro ao criar produto:", {
      error,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      response: error.response?.data,
    });
    throw error;
  }
}
