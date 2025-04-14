import type { CriarClienteParams } from "@/api/clientes/criar-cliente";
import {
	addCurrentIndex,
	clientes,
	currentIndex,
	setClientes,
	setCurrentIndex,
} from "@/api/mocks/clientes/buscar-clientes-mock";
import { http, HttpResponse } from "msw";

console.log("[MSW] Registrando mock de criação de cliente");

export const criarClienteMock = http.post<
	never,
	CriarClienteParams,
	never | { message: any }
>("/clientes", async ({ request }) => {
	try {
		console.log("[Mock] Iniciando criação de cliente");
		const clientesJson = localStorage.getItem("clientes");
		if (clientesJson) {
			setClientes(JSON.parse(clientesJson));
		}
		const currentIndexJson = localStorage.getItem("currentIndex");
		if (currentIndexJson) {
			setCurrentIndex(JSON.parse(currentIndexJson));
		}
		const body = await request.json() as CriarClienteParams;
		console.log("[Mock] Dados recebidos:", JSON.stringify(body, null, 2));
		
		// Verificar se os campos percentuais são números
		if (typeof body.percentualAumentoTeorico !== 'number') {
			console.error("[Mock] percentualAumentoTeorico não é um número:", body.percentualAumentoTeorico);
			return HttpResponse.json(
				{ message: "percentualAumentoTeorico deve ser um número" },
				{ status: 500 }
			);
		}
		
		if (typeof body.percentualPerda !== 'number') {
			console.error("[Mock] percentualPerda não é um número:", body.percentualPerda);
			return HttpResponse.json(
				{ message: "percentualPerda deve ser um número" },
				{ status: 500 }
			);
		}
		
		const novoId = addCurrentIndex();
		const novoCliente = {
			id: novoId,
			dadosGerais: {
				codigo: currentIndex.toString(),
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

		clientes.push(novoCliente);
		localStorage.setItem("clientes", JSON.stringify(clientes));
		localStorage.setItem("currentIndex", JSON.stringify(currentIndex));

		console.log("[Mock] Cliente criado com sucesso:", novoCliente);
		return HttpResponse.json(
			{ message: "Cliente criado com sucesso", id: novoId },
			{ status: 201 }
		);
	} catch (error) {
		console.error("[Mock] Erro ao criar cliente:", error);
		return HttpResponse.json(
			{ message: "Erro interno ao criar cliente", error: String(error) },
			{ status: 500 }
		);
	}
});
