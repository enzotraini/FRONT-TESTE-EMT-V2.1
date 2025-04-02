import { api } from "../api";
import { BuscarTransportadorasResponse } from "@/types/transportadora";

export async function buscarTransportadoras(): Promise<BuscarTransportadorasResponse> {
    const response = await api.get<BuscarTransportadorasResponse>("/transportadoras");
    return response.data;
} 