import { api } from "@/lib/axios";

export async function deletarVendedor(id: number): Promise<void> {
	await api.delete(`/vendedores/${id}`);
} 