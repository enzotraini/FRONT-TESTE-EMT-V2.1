import { api } from "@/lib/axios";

export interface EditarTransportadoraRequest {
  id: number;
  nome: string;
  cgccpf: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone1?: string;
  telefone2?: string;
  fax?: string;
  placa?: string;
  estadualrg?: string;
  fantasia?: string;
  placauf?: string;
  contato?: string;
  email?: string;
  texto?: string;
  placauf1?: string;
  antt?: string;
  user_id: number;
  organizacao_id: number;
}

export interface EditarTransportadoraResponse {
  success: boolean;
  message: string;
}

export async function editarTransportadora(
  data: EditarTransportadoraRequest
): Promise<EditarTransportadoraResponse> {
  const { id, ...requestData } = data;
  const response = await api.put<EditarTransportadoraResponse>(`/transportadoras/${id}`, requestData);
  return response.data;
} 