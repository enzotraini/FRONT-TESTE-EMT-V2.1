import { api } from "@/lib/axios";

export interface ListarContaContabilParams {
  contaContabil: string;
}

export interface ListarContaContabilResponse {
  label: string;
  value: string;
}

export async function listarDaContaContabil({
  contaContabil,
}: ListarContaContabilParams) {
  const response = await api.get<ListarContaContabilResponse>(
    `/fiscal/${contaContabil}`
  );

  return response.data;
}
