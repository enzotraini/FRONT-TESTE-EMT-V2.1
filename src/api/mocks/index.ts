import { setupWorker } from "msw/browser";
import { authenticateMock } from "./usuario/authenticate-mock";
import { buscarClientesMock } from "@/api/mocks/clientes/buscar-clientes-mock";
import { env } from "@/env";
import { buscarDadosCompletosDoCliente } from "@/api/clientes/buscar-dados-completos-do-cliente";
import { buscarDadosCompletosDoClienteMock } from "@/api/mocks/clientes/buscar-dados-completos-do-cliente-mock";
import { criarClienteMock } from "@/api/mocks/clientes/criar-clientes-mock";
import { editarClienteMock } from "@/api/mocks/clientes/editar-cliente-mock";
import { deletarClienteMock } from "@/api/mocks/clientes/deletar-cliente-mock";
import { buscarCepMock } from "./viacep/buscar-cep-mock";

const worker = setupWorker(
	authenticateMock,
	buscarClientesMock,
	buscarDadosCompletosDoClienteMock,
	criarClienteMock,
	editarClienteMock,
	deletarClienteMock,
	buscarCepMock,
);

export async function enableMSW() {
	// Ativar MSW em modo de desenvolvimento e teste
	if (env.VITE_MODE !== "test" && env.VITE_MODE !== "development") {
		return;
	}
	
	console.log("[MSW] Iniciando em modo:", env.VITE_MODE);
	await worker.start();
	console.log("[MSW] Worker iniciado com sucesso");
}
