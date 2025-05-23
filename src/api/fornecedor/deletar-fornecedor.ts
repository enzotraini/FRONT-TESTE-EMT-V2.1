import { api } from "@/lib/axios";

export interface DeletarFornecedorParams {
	fornecedorId: string;
}

export async function deletarFornecedor({ fornecedorId }: DeletarFornecedorParams) {
	const response = await api.delete(`/fornecedores/${fornecedorId}`);
	return response.data;
}
