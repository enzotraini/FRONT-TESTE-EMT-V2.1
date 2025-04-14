import { api } from "@/lib/axios";

export async function logout() {
    console.log("[logout] Iniciando processo de logout");
    
    try {
        const response = await api.patch("/logout");
        
        console.log("[logout] Resposta recebida:", {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
        
        // Limpa todos os cookies de autenticação
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth_check=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        console.log("[logout] Cookies limpos com sucesso");
        
        return response;
    } catch (error) {
        console.error("[logout] Erro ao fazer logout:", error);
        throw error;
    }
} 