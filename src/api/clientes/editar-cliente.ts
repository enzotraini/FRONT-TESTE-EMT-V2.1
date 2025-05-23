import { api } from "@/lib/axios";

export interface EditarClienteParams {
	codigo: string;
	nome: string;
	tipo: "fisica" | "juridica";
	identificador: string;

	// Endereço
	cep: string;
	rua: string;
	numero?: number;
	complemento?: string;
	bairro: string;
	cidade: string;
	estado: string;
	ie?: number;
	contribuinteICMS: "1";
	isuframa?: string;
	nomeFantasia?: string;
	tipoConsumo: "1";

	// Praça de pagamento
	pracaCep: string;
	pracaRua: string;
	pracaNumero?: number;
	pracaComplemento?: string;
	pracaBairro: string;
	pracaCidade: string;
	pracaEstado: string;

	// Contato
	nomeContato?: string;
	telefone1?: string;
	telefone2?: string;
	fax?: string;
	site?: string;
	emailComercial?: string;
	emailFiscal?: string;
	vendedor1: { codigo: string; quantidade?: number };
	vendedor2: { codigo: string; quantidade?: number };
	vendedor3: { codigo: string; quantidade?: number };
	vendedor4: { codigo: string; quantidade?: number };
	vendedor5: { codigo: string; quantidade?: number };
	vendedor6: { codigo: string; quantidade?: number };
	isentoJPI: "0" | "1";
	percentualAumentoTeorico: string;
	percentualPerda: string;
	contatosAdicionais: Array<{
		id: string;
		contato: string;
		telefone: string;
		ramal: string;
		setor: string;
		email: string;
	}>;
	observacoesGerais?: string;
	contato_id: number;
	endereco_id: number;
	endereco_praca_id: number;
}

export async function editarCliente(params: EditarClienteParams) {
	console.log("Iniciando requisição para editar cliente:", JSON.stringify(params, null, 2));
	try {
		const response = await api.put(`/fornecedores/${params.contato_id}`, params);
		console.log("Resposta do servidor:", {
			status: response.status,
			data: response.data,
			headers: response.headers
		});
		
		// Se a resposta for bem sucedida (qualquer status 2xx), retornamos os dados
		if (response.status >= 200 && response.status < 300) {
			return {
				status: response.status,
				data: response.data
			};
		}
		
		// Se não for bem sucedida, lançamos um erro
		throw new Error("Erro ao editar cliente");
	} catch (error: any) {
		console.error("Erro ao editar cliente:", {
			error,
			message: error instanceof Error ? error.message : "Erro desconhecido",
			response: error.response?.data
		});
		throw error;
	}
}
