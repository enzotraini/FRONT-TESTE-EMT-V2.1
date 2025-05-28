import { api } from "@/lib/axios";

export interface BuscarDadosCompletosDoProdutoParams {
  produtoId: string;
}

export interface BuscarDadosCompletosDoProdutoResponse {
  id: number;
  dadosGerais: {
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
    sr_deleted?: string;
  };
}

export async function buscarDadosCompletosDoProduto({
  produtoId,
}: BuscarDadosCompletosDoProdutoParams) {
  const response = await api.get<BuscarDadosCompletosDoProdutoResponse>(
    `/produtos/${produtoId}`
  );
  return response.data;
}
