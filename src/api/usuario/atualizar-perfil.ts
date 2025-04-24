import { api } from "@/lib/axios";

interface AtualizarPerfilData {
  nome: string;
  email: string;
}

export async function atualizarPerfil(data: AtualizarPerfilData) {
  console.log("[atualizarPerfil] Iniciando atualização de perfil");
  
  try {
    const response = await api.patch("/usuarios/perfil", data);
    
    console.log("[atualizarPerfil] Resposta recebida:", {
      status: response.status,
      statusText: response.statusText,
    });
    
    return response.data;
  } catch (error) {
    console.error("[atualizarPerfil] Erro ao atualizar perfil:", error);
    throw error;
  }
} 