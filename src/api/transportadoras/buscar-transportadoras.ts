import { api } from "@/lib/axios";
import { BuscarTransportadorasParams, BuscarTransportadorasResponse } from "@/types/transportadora";

export async function buscarTransportadoras({
	page,
	perPage,
	search,
}: BuscarTransportadorasParams): Promise<BuscarTransportadorasResponse> {
	const response = await api.get<BuscarTransportadorasResponse>("/transportadoras", {
		params: {
			page,
			perPage,
			search,
		},
	});

	return response.data;
} 