import axios from "axios";
import { env } from "@/env";

console.log("[axios] Iniciando configuração do axios");
console.log("[axios] URL da API:", env.VITE_API_URL);

// Função para limpar todos os cookies
function clearAllCookies() {
	console.log("[axios] Limpando todos os cookies...");
	document.cookie.split(';').forEach(cookie => {
		const [name] = cookie.split('=');
		document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	});
	console.log("[axios] Cookies após limpeza:", document.cookie);
}

// Função para verificar se o backend está disponível
async function checkBackendAvailability() {
	try {
		const response = await axios.get(`${env.VITE_API_URL}/health`, {
			timeout: 5000, // 5 segundos
			withCredentials: false, // Não precisa de cookies para health check
		});
		return response.status === 200;
	} catch (error) {
		console.error("[axios] Backend não está disponível:", error);
		return false;
	}
}

export const api = axios.create({
	baseURL: env.VITE_API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
	validateStatus: (status) => {
		return status >= 200 && status < 300;
	},
	xsrfCookieName: undefined,
	xsrfHeaderName: undefined,
	timeout: 15000, // Aumentado para 15 segundos
});

// Interceptor para adicionar headers em cada requisição
api.interceptors.request.use(
	async (config) => {
		console.log("[axios] Enviando requisição:", {
			url: config.url,
			method: config.method,
			headers: config.headers,
			withCredentials: config.withCredentials,
			data: config.data,
		});

		// Verifica se o backend está disponível antes de cada requisição
		const isAvailable = await checkBackendAvailability();
		if (!isAvailable) {
			throw new Error("Backend não está disponível");
		}

		return config;
	},
	(error) => {
		console.error("[axios] Erro ao enviar requisição:", error);
		return Promise.reject(error);
	}
);

// Interceptor para tratar respostas
api.interceptors.response.use(
	(response) => {
		console.log("[axios] Resposta recebida:", {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			cookies: document.cookie,
			data: response.data,
		});
		
		// Verifica se há cookies na resposta
		const setCookie = response.headers["set-cookie"];
		if (setCookie) {
			console.log("[axios] Headers Set-Cookie recebidos:", setCookie);
		}
		
		return response;
	},
	(error) => {
		console.error("[axios] Erro na requisição:", {
			status: error.response?.status,
			statusText: error.response?.statusText,
			data: error.response?.data,
			headers: error.response?.headers,
			config: error.config,
			message: error.message,
			code: error.code,
		});
		
		if (error.response?.status === 401) {
			console.log("[axios] Erro 401 - Limpando cookies...");
			clearAllCookies();
			window.location.href = "/";
		}

		// Se for erro 404, tenta acessar a rota raiz para verificar se o backend está funcionando
		if (error.response?.status === 404) {
			console.log("[axios] Erro 404 - Verificando disponibilidade do backend...");
			return checkBackendAvailability()
				.then(isAvailable => {
					if (isAvailable) {
						throw new Error(`Rota não encontrada: ${error.config.url}`);
					}
					throw error;
				})
				.catch(() => Promise.reject(error));
		}

		// Se for erro de rede, tenta reconectar
		if (error.code === "ERR_NETWORK") {
			console.log("[axios] Tentando reconectar...");
			return checkBackendAvailability()
				.then(isAvailable => {
					if (isAvailable) {
						return api(error.config);
					}
					throw error;
				})
				.catch(() => Promise.reject(error));
		}
		
		return Promise.reject(error);
	}
);

// if (env.VITE_API_DELAY && env.MODE !== "test") {
// 	api.interceptors.request.use(async (request) => {
// 		await new Promise((resolve) =>
// 			setTimeout(resolve, Math.round(Math.random() * 3000)),
// 		);
// 		return request;
// 	});
// }
