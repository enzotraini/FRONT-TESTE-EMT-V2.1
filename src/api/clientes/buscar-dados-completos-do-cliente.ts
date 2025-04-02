import { api } from "@/lib/axios";
import type {
	dadosGeraisContribuintesValidos,
	dadosGeraisTiposConsumoValidos,
	dadosGeraisTiposValidos,
} from "@/pages/app/cadastros/clientes/formulario/formularios/FormularioDadosGerais";

export interface BuscarDadosCompletosDoClienteParams {
	clienteId: string;
}

interface Vendedor {
	codigo: string;
	quantidade?: number;
}

export interface BuscarDadosCompletosDoClienteResponse {
	id: number;
	dadosGerais: {
		codigo: string;
		nome: string;
		tipo: (typeof dadosGeraisTiposValidos)[number];
		identificador: string;
		cep: string;
		rua: string;
		numero?: string;
		complemento?: string;
		bairro: string;
		cidade: string;
		estado: string;
		ie?: string;
		contribuinteICMS: (typeof dadosGeraisContribuintesValidos)[number];
		isuframa?: string;
		nomeFantasia?: string;
		tipoConsumo: (typeof dadosGeraisTiposConsumoValidos)[number];
		pracaCep: string;
		pracaRua: string;
		pracaNumero?: string;
		pracaComplemento?: string;
		pracaBairro: string;
		pracaCidade: string;
		pracaEstado: string;
		nomeContato?: string;
		telefone1?: string;
		telefone2?: string;
		fax?: string;
		site?: string;
		emailComercial?: string;
		emailFiscal?: string;
	};
	dadosAdicionais: {
		vendedor1: Vendedor;
		vendedor2?: Vendedor;
		vendedor3?: Vendedor;
		vendedor4?: Vendedor;
		vendedor5?: Vendedor;
		vendedor6?: Vendedor;
		isentoJPI: "0" | "1";
		percentualAumentoTeorico: string;
		percentualPerda: string;
		contatosAdicionais: {
			id: string;
			contato: string;
			telefone: string;
			ramal: string;
			setor: string;
			email: string;
		}[];
		observacoesGerais?: string;
	};
}

export async function buscarDadosCompletosDoCliente({
	clienteId,
}: BuscarDadosCompletosDoClienteParams) {
	const response = await api.get<BuscarDadosCompletosDoClienteResponse>(
		`/clientes/${clienteId}`,
	);

	return response.data;
}
