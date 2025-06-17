import { api } from "@/lib/axios";

export interface BuscarLocaisParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface BuscarLocaisResponse {
  label: string;
  value: number;
}

export const listarLocais = async (filtro: string) => {
  return api.get(`/produtos/local?search=${filtro}`).then(res => res.data);
};
