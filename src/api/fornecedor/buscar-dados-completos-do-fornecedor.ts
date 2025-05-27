import { api } from "@/lib/axios";

export interface BuscarDadosCompletosDoFornecedorParams {
  fornecedorId: string;
}

export interface BuscarDadosCompletosDoFornecedorResponse {
  id: number;
  dadosGerais: {
    codigo: string;
    nome: string;
    identificador: string;
    cep: string;
    rua: string;
    numero?: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    nomeFantasia?: string;
    observacao?: string;
    nomeContato?: string;
    telefone1?: string;
    telefone2?: string;
    site?: string;
    emailComercial?: string;
    emailFiscal?: string;
    ctacontabi?: string;
  };
}

export async function buscarDadosCompletosDoFornecedor({
  fornecedorId,
}: BuscarDadosCompletosDoFornecedorParams) {
  const response = await api.get<BuscarDadosCompletosDoFornecedorResponse>(
    `/fornecedores/${fornecedorId}`
  );

  return response.data;
}
