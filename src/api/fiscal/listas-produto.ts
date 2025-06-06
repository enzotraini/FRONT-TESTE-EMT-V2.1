import { api } from "@/lib/axios";

export interface ListarContaContabilParams {
  contaContabil: string;
}

export interface ListarResponse {
  label: string;
  value: string;
}

export const listarClassifisc = async (filtro: string) => {
  return api.get(`/fiscal/classifisc?search=${filtro}`).then(res => res.data);
};

export const listarAtributo = async (filtro: string) => {
  return api.get(`/fiscal/atributo?search=${filtro}`).then(res => res.data);
};

export const listarCsosn = async (filtro: string) => {
  return api.get(`/fiscal/csosn?search=${filtro}`).then(res => res.data);
};

export async function listarDaContaContabil({
  contaContabil,
}: ListarContaContabilParams) {
  const response = await api.get<ListarResponse>(
    `/fiscal/${contaContabil}`
  );

  return response.data;
}