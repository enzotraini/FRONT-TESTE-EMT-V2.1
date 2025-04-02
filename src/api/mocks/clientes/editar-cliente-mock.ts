import type { EditarClienteParams } from "@/api/clientes/editar-cliente";
import {
	addCurrentIndex,
	clientes,
	currentIndex,
	setClientes,
	setCurrentIndex,
} from "@/api/mocks/clientes/buscar-clientes-mock";
import { http, HttpResponse } from "msw";

export const editarClienteMock = http.put<
	never,
	{ params: EditarClienteParams },
	never | { message: any }
>("/clientes", async ({ request }) => {
	const clientesJson = localStorage.getItem("clientes");
	if (clientesJson) {
		setClientes(JSON.parse(clientesJson));
	}

	const body = (await request.json()).params;

	const clienteIndex = clientes.findIndex(
		(cliente) => cliente.id === Number.parseInt(body.id),
	);
	clientes[clienteIndex] = {
		id: Number.parseInt(body.id),
		dadosGerais: {
			codigo: body.id,
			nome: body.nome,
			bairro: body.bairro,
			cep: body.cep,
			cidade: body.cidade,
			complemento: body.complemento,
			contribuinteICMS: body.contribuinteICMS,
			estado: body.estado,
			rua: body.rua,
			ie: (body.ie || 0).toString(),
			isuframa: body.isuframa,
			identificador: body.identificador,
			nomeFantasia: body.nomeFantasia,
			pracaBairro: body.pracaBairro,
			pracaCep: body.pracaCep,
			pracaCidade: body.pracaCidade,
			pracaComplemento: body.pracaComplemento,
			pracaEstado: body.pracaEstado,
			pracaNumero: (body.pracaNumero || 0).toString(),
			pracaRua: body.pracaRua,
			tipo: body.tipo,
			tipoConsumo: body.tipoConsumo,
			emailComercial: body.emailComercial,
			emailFiscal: body.emailFiscal,
			fax: body.fax,
			nomeContato: body.nomeContato,
			site: body.site,
			numero: body.numero?.toString() || "",
			telefone1: body.telefone1,
			telefone2: body.telefone2,
		},
		dadosAdicionais: {
			contatosAdicionais: body.contatosAdicionais,
			isentoJPI: body.isentoJPI,
			observacoesGerais: body.observacoesGerais,
			percentualAumentoTeorico: body.percentualAumentoTeorico,
			percentualPerda: body.percentualPerda,
			vendedor1: body.vendedor1,
			vendedor2: body.vendedor2,
			vendedor3: body.vendedor3,
			vendedor4: body.vendedor4,
			vendedor5: body.vendedor5,
			vendedor6: body.vendedor6,
		},
	};

	localStorage.setItem("clientes", JSON.stringify(clientes));
	localStorage.setItem("currentIndex", JSON.stringify(currentIndex));

	return HttpResponse.json(
		{ message: clientes },
		{
			status: 201,
		},
	);
});
