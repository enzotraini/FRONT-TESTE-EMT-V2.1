import { http, HttpResponse } from "msw";
import type { AuthenticateBody } from "../../usuario/authenticate";
import type {
	BuscarClientesParams,
	BuscarClientesResponse,
	ClienteDaListagem,
} from "@/api/clientes/buscar-clientes";
import { applyDelay } from "@/api/mocks/applyDelay";
import type { BuscarDadosCompletosDoClienteResponse } from "@/api/clientes/buscar-dados-completos-do-cliente";

// const clientes: ClienteDaListagem[] = Array.from({ length: 96 }).map(
// 	(_, index) => {
// 		const indexPlusOne = index + 1;
// 		return {
// 			id: indexPlusOne,
// 			nome: `Cliente ${indexPlusOne}`,
// 			fantasia: `Empresa ${indexPlusOne}`,
// 			cnpj: "999.999.999-99",
// 			contato: `cliente${indexPlusOne}@example.com`,
// 			telefone1: "+55 (99) 99999-9999",
// 			telefone2: "+55 (11) 11111-1111",
// 			fax: "+55 (91) 91919-1919",
// 			dataCadastro: "18/08/2021",
// 			dataAtual: "24/12/2024",
// 			vendedores: "100 / 50 / 200 / 10 / 20 / 31",
// 		};
// 	},
// );

export let clientes: BuscarDadosCompletosDoClienteResponse[] = [];

export let currentIndex = 0;

export function addCurrentIndex(): number {
	currentIndex++;
	return currentIndex;
}

export function setCurrentIndex(newCurrentIndex: number) {
	currentIndex = newCurrentIndex;
}

export function setClientes(
	newClientes: BuscarDadosCompletosDoClienteResponse[],
) {
	clientes = newClientes;
}

export const buscarClientesMock = http.get<
	never,
	never,
	BuscarClientesResponse
>("/clientes", async ({ request }) => {
	const clientesJson = localStorage.getItem("clientes");
	if (clientesJson) {
		setClientes(JSON.parse(clientesJson));
	}
	const currentIndexJson = localStorage.getItem("currentIndex");
	if (currentIndexJson) {
		setCurrentIndex(JSON.parse(currentIndexJson));
	}
	// await applyDelay();
	const { searchParams } = new URL(request.url);
	const page = Number(searchParams.get("page"));
	const perPage = Number(searchParams.get("perPage"));
	const search = searchParams.get("search") ?? "";
	const startIndex = (page - 1) * perPage;
	const endIndex = startIndex + perPage;
	const filteredClientes = clientes.filter(
		(cliente) =>
			cliente.id.toString().includes(search) ||
			cliente.dadosGerais.nome.toLowerCase().includes(search.toLowerCase()) ||
			cliente.dadosGerais.nomeFantasia
				?.toLowerCase()
				?.includes(search.toLowerCase()) ||
			cliente.dadosGerais.identificador.includes(search),
	);
	const paginatedClientes = filteredClientes.slice(startIndex, endIndex);
	const clientesDaListagem = paginatedClientes.map(
		(cliente) =>
			({
				nome: cliente.dadosGerais.nome,
				fantasia: cliente.dadosGerais.nomeFantasia,
				cnpj: cliente.dadosGerais.identificador,
				contato: cliente.dadosGerais.emailComercial,
				dataAtual: new Date().toLocaleDateString(),
				dataCadastro: new Date().toLocaleDateString(),
				fax: cliente.dadosGerais.fax,
				id: cliente.id,
				telefone1: cliente.dadosGerais.telefone1,
				telefone2: cliente.dadosGerais.telefone2,
				vendedores: [
					cliente.dadosAdicionais.vendedor1?.codigo || 0,
					cliente.dadosAdicionais.vendedor2?.codigo || 0,
					cliente.dadosAdicionais.vendedor3?.codigo || 0,
					cliente.dadosAdicionais.vendedor4?.codigo || 0,
					cliente.dadosAdicionais.vendedor5?.codigo || 0,
					cliente.dadosAdicionais.vendedor6?.codigo || 0,
				].join(" / "),
			}) as ClienteDaListagem,
	);
	return HttpResponse.json(
		{
			clientes: clientesDaListagem,
			teste: clientes,
			meta: {
				page,
				perPage,
				total: filteredClientes.length,
			},
		},
		{ status: 200 },
	);
});
