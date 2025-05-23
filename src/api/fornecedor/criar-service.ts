import { api } from "@/lib/axios";
type DadosGeraisTipos = "fisica" | "juridica";
type DadosGeraisContribuintes = "1" | "2" | "9";
type DadosGeraisTiposConsumo = "1";
type BooleanSelector = "0" | "1";

interface Vendedor {
	codigo: string;
	quantidade?: number;
}

interface ContatoAdicional {
	id: string;
	contato: string;
	telefone: string;
	ramal: string;
	setor: string;
	email: string;
}

export interface CriarService {
	codigo: string;
	nome: string;
	tipo: DadosGeraisTipos;
	identificador: string;

	// Endereço
	cep: string;
	endereco: string;
	numero?: number;
	complement?: string;
	bairro: string;
	cidade: string;
	estado: string;
	//ie?: number;
	//contribuinteICMS: "1";
	//isuframa?: string;
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
	// vendedor1: { codigo: string; quantidade?: number };
	// vendedor2: { codigo: string; quantidade?: number };
	// vendedor3: { codigo: string; quantidade?: number };
	// vendedor4: { codigo: string; quantidade?: number };
	// vendedor5: { codigo: string; quantidade?: number };
	// vendedor6: { codigo: string; quantidade?: number };
	// isentoJPI: "0" | "1";
	// percentualAumentoTeorico: number;
	// percentualPerda: number;
	// contatosAdicionais: Array<{
	// 	id: string;
	// 	contato: string;
	// 	telefone: string;
	// 	ramal: string;
	// 	setor: string;
	// 	email: string;
	// }>;
	observacao?: string;
	user_id: number;
	organizacao_id: number;
}

export async function criarFornecedorService(params: CriarService) {
	console.log("Iniciando requisição para criar :", JSON.stringify(params, null, 2));
	try {
		const response = await api.post("/fornecedores", params);
		console.log("Resposta do servidor:", {
			status: response.status,
			data: response.data,
			headers: response.headers
		});
		
		// Se a resposta for bem sucedida (qualquer status 2xx), retornamos os dados
		if (response.status >= 200 && response.status < 300) {
			return {
				status: response.status,
				data: response.data,
				id: response.data.id
			};
		}
		
		// Se não for bem sucedida, lançamos um erro
		throw new Error("Erro ao criar ");
	} catch (error: any) {
		console.error("Erro ao criar :", {
			error,
			message: error instanceof Error ? error.message : "Erro desconhecido",
			response: error.response?.data,
			request: {
				url: error.config?.url,
				method: error.config?.method,
				headers: error.config?.headers,
				data: error.config?.data
			}
		});
		throw error;
	}
}
