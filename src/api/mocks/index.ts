import { setupWorker } from "msw/browser";
import { authenticateMock } from "./usuario/authenticate-mock";
import { buscarClientesMock } from "@/api/mocks/clientes/buscar-clientes-mock";
import { env } from "@/env";
import { buscarDadosCompletosDoCliente } from "@/api/clientes/buscar-dados-completos-do-cliente";
import { buscarDadosCompletosDoClienteMock } from "@/api/mocks/clientes/buscar-dados-completos-do-cliente-mock";
import { criarClienteMock } from "@/api/mocks/clientes/criar-clientes-mock";
import { editarClienteMock } from "@/api/mocks/clientes/editar-cliente-mock";
import { deletarClienteMock } from "@/api/mocks/clientes/deletar-cliente-mock";

const worker = setupWorker(
	authenticateMock,
	buscarClientesMock,
	buscarDadosCompletosDoClienteMock,
	criarClienteMock,
	editarClienteMock,
	deletarClienteMock,
);

export async function enableMSW() {
	if (env.MODE !== "test") {
		return;
	}
	await worker.start();
}
