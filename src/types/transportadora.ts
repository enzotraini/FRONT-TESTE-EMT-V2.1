export interface BuscarTransportadorasParams {
	page: number;
	perPage: number;
	search?: string;
}

export interface TransportadoraDaListagem {
	id: number;
	transporte: number;
	nome: string;
	fantasia: string;
	cgccpf: string;
	contato: string;
	telefone1: string;
	telefone2: string;
	fax: string;
	endereco: string;
	bairro: string;
	cidade: string;
	cep: string;
	estado: string;
	estadualrg: string;
	email: string;
	placa: string;
	placauf: string;
	placauf1: string;
	antt: string;
	texto: string;
	dataCadastro: string;
	dataAtual: string;
}

export interface BuscarTransportadorasResponse {
	transportadoras: TransportadoraDaListagem[];
	meta: {
		page: number;
		perPage: number;
		total: number;
	};
}

export interface CriarTransportadoraData {
	transporte?: number;
	nome: string;
	cgccpf: string;
	cep: string;
	endereco: string;
	bairro: string;
	cidade: string;
	estado: string;
	telefone1?: string;
	telefone2?: string;
	fax?: string;
	placa?: string;
	estadualrg?: string;
	fantasia?: string;
	placauf?: string;
	contato?: string;
	email?: string;
	texto?: string;
	placauf1?: string;
	antt?: string;
}

export interface CriarTransportadoraResponse {
	message: string;
	id: number;
} 