import { api } from "@/lib/axios";

interface AlterarSenhaData {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export async function alterarSenha(data: AlterarSenhaData) {
  console.log("[alterarSenha] Iniciando alteração de senha");
  
  try {
    const response = await api.patch("/usuarios/senha", data);
    
    console.log("[alterarSenha] Resposta recebida:", {
      status: response.status,
      statusText: response.statusText,
    });
    
    return response.data;
  } catch (error) {
    console.error("[alterarSenha] Erro ao alterar senha:", error);
    throw error;
  }
} 