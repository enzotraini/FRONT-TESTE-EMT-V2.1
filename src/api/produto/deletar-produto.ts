import { api } from "@/lib/axios";

export interface DeletarProdutoParams {
  produtoId: string;
}

export async function deletarProduto({ produtoId }: DeletarProdutoParams) {
  const response = await api.delete(`/produtos/${produtoId}`);
  return response.data;
}
