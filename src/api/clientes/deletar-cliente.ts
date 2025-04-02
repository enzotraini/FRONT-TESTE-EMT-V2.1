import { api } from "@/lib/axios";
import type {
	dadosGeraisContribuintesValidos,
	dadosGeraisTiposConsumoValidos,
	dadosGeraisTiposValidos,
} from "@/pages/app/cadastros/clientes/formulario/formularios/FormularioDadosGerais";

export interface DeletarClienteParams {
	clienteId: string;
}

export async function deletarCliente({ clienteId }: DeletarClienteParams) {
	const response = await api.delete(`/clientes/${clienteId}`);

	return response.data;
}
