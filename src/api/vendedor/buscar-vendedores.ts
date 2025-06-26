import { api } from "@/lib/axios";
import { BuscarVendedoresParams, BuscarVendedoresResponse } from "@/types/vendedor";

export async function buscarVendedores({
	page,
	perPage,
	search,
}: BuscarVendedoresParams): Promise<BuscarVendedoresResponse> {
	const response = await api.get<BuscarVendedoresResponse>("/vendedores", {
		params: {
			page,
			perPage,
			search,
		},
	});

	return response.data;
} 