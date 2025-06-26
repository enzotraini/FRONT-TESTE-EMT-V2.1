export interface Vendedor {
  id: number;
  codigo: number;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone1: string;
  telefone2?: string;
  celular1?: string;
  email?: string;
  cgccpf: string;
  inscricaoestadual?: string;
  comissao: number;
  observacoes?: string;
  ativo: boolean;
}

export interface BuscarVendedoresParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface BuscarVendedoresResponse {
  vendedores: Vendedor[];
  meta: {
    totalCount: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface CriarVendedorData {
  codigo: number;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone1: string;
  telefone2?: string;
  celular1?: string;
  email?: string;
  cgccpf: string;
  inscricaoestadual?: string;
  comissao: number;
  observacoes?: string;
  ativo: boolean;
}

export interface EditarVendedorData extends CriarVendedorData {
  id: number;
} 