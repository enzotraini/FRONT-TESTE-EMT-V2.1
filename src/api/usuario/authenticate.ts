import { api } from "@/lib/axios";

export interface AuthenticateBody {
	email: string;
	senha: string;
}

export interface AuthenticateResponse {
	token?: string;
	refreshToken?: string;
}

// Função para verificar se os cookies foram definidos
async function waitForCookies(maxAttempts = 30, interval = 200): Promise<boolean> {
	console.log("[authenticate] Aguardando cookies serem definidos...");
	
	for (let i = 0; i < maxAttempts; i++) {
		console.log("[authenticate] Tentativa", i + 1, "de", maxAttempts);
		console.log("[authenticate] Cookies atuais:", document.cookie);
		
		// Verifica especificamente o cookie auth_check
		if (document.cookie.includes("auth_check=true")) {
			console.log("[authenticate] Cookie de verificação encontrado!");
			return true;
		}
		
		await new Promise(resolve => setTimeout(resolve, interval));
	}
	
	console.log("[authenticate] Timeout aguardando cookies");
	return false;
}

export async function authenticate({ email, senha }: AuthenticateBody) {
	
	console.log("[authenticate] Iniciando requisição de autenticação");
	console.log("[authenticate] URL:", api.defaults.baseURL);
	console.log("[authenticate] Headers:", api.defaults.headers);
	console.log("[authenticate] Cookies antes da requisição:", document.cookie);
	
	try {
		// Verifica se o backend está disponível antes de tentar autenticar
		const healthCheck = await api.get("/health");
		if (healthCheck.status !== 200) {
			throw new Error("Backend não está disponível");
		}
		const response = await api.post<AuthenticateResponse>("/auth", { 
			email, 
			senha 
		}, {
			withCredentials: true
		});
		
		console.log("[authenticate] Resposta recebida 11:", {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			data: response.data
		});
		
		// Se a resposta não for 204, algo está errado
		if (response.status !== 200) {
			console.error("[authenticate] Status da resposta inesperado:", response.status);
			throw new Error(`Status da resposta inesperado: ${response.status}`);
		}
		
		console.log("[authenticate] Cookies antes de aguardar:", document.cookie);
		
		// Aguarda os cookies serem definidos
		// const cookiesSet = await waitForCookies(20, 200); // Aumentado para 20 tentativas e 200ms de intervalo
		// if (!cookiesSet) {
		// 	console.error("[authenticate] Cookies não foram definidos após a resposta");
		// 	console.log("[authenticate] Headers da resposta:", response.headers);
		// 	throw new Error("Timeout aguardando cookies de autenticação");
		// }
		console.log("[authenticate] Cookies após aguardar:", document.cookie);
		
		window.location.href = "/";
		
	} catch (error) {
		console.error("[authenticate] Erro na requisição:", error);
		console.error("[authenticate] Stack trace:", (error as Error).stack);
		
		// Se for erro de rede, tenta reconectar
		if ((error as any).code === "ERR_NETWORK") {
			console.log("[authenticate] Tentando reconectar...");
			await new Promise(resolve => setTimeout(resolve, 2000)); // Aumentado para 2 segundos
			return authenticate({ email, senha }); // Tenta novamente
		}
		
		throw error;
	}
}
