import { api } from "@/lib/axios";

export async function deletarTransportadora(id: number): Promise<void> {
	await api.delete(`/transportadoras/${id}`);
} 