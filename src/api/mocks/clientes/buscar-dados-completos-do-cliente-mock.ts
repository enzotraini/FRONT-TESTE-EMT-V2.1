import { http, HttpResponse } from "msw";
import type { AuthenticateBody } from "../../usuario/authenticate";
import type {
	BuscarClientesParams,
	BuscarClientesResponse,
	ClienteDaListagem,
} from "@/api/clientes/buscar-clientes";
import { applyDelay } from "@/api/mocks/applyDelay";
import type { BuscarDadosCompletosDoClienteResponse } from "@/api/clientes/buscar-dados-completos-do-cliente";
import { clientes } from "@/api/mocks/clientes/buscar-clientes-mock";

export const buscarDadosCompletosDoClienteMock = http.get<
	never,
	never,
	BuscarDadosCompletosDoClienteResponse | { message: string }
>("/clientes/:clienteId", async ({ request }) => {
	const clientId = request.url.split("/")[4].trim();

	if (Number.isNaN(clientId)) {
		return HttpResponse.json(
			{ message: "Id inválido" },
			{
				status: 400,
			},
		);
	}

	const numberClientId = Number.parseInt(clientId);

	const cliente = clientes.find((cliente) => cliente.id === numberClientId);

	if (!cliente) {
		return HttpResponse.json(
			{
				message: "Usuário não encontrado",
			},
			{
				status: 404,
			},
		);
	}

	return HttpResponse.json(cliente, {
		status: 200,
	});
});
