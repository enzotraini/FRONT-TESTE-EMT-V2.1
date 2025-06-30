import { api } from "@/lib/axios";

export interface EditarFornecedorParams {
  codigo: number;
  nome: string;
  cgcfor: string;

  cep: string;
  rua: string;
  numero?: number;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;

  estadualrg: string;
  tipoie: string;
  ctacontabi: string,	

  nomeFantasia?: string;
  observacao?: string;

  nomeContato?: string;
  telefone1?: string;
  telefone2?: string;
  site?: string;
  emailComercial?: string;
  emailFiscal?: string;

  user_id: number;
  organizacao_id: number;
}

export async function editarFornecedor(params: EditarFornecedorParams) {
  console.log("Iniciando requisição para editar fornecedor:", JSON.stringify(params, null, 2));
  
  try {
    const response = await api.put(`/fornecedores/${params.codigo}`, params);

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

    throw new Error("Erro ao editar fornecedor");
  } catch (error: any) {
    console.error("Erro ao editar fornecedor:", {
      error,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      response: error.response?.data,
    });
    throw error;
  }
}
