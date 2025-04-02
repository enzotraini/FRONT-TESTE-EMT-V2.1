import { http, HttpResponse } from "msw";
import type { AuthenticateBody } from "../../usuario/authenticate";
import type {
	BuscarClientesParams,
	BuscarClientesResponse,
	ClienteDaListagem,
} from "@/api/clientes/buscar-clientes";
import { applyDelay } from "@/api/mocks/applyDelay";
import type { DeletarClienteParams } from "@/api/clientes/deletar-cliente";
import {
	clientes,
	currentIndex,
} from "@/api/mocks/clientes/buscar-clientes-mock";

export const deletarClienteMock = http.delete<
	never,
	never,
	never | { message: string }
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

	const clienteIndex = clientes.findIndex(
		(cliente) => cliente.id === numberClientId,
	);

	if (clienteIndex === -1) {
		return HttpResponse.json(
			{
				message: "Usuário não encontrado",
			},
			{
				status: 404,
			},
		);
	}

	clientes.splice(clienteIndex, 1);

	localStorage.setItem("clientes", JSON.stringify(clientes));
	localStorage.setItem("currentIndex", JSON.stringify(currentIndex));

	return HttpResponse.json(null, {
		status: 200,
	});
});
