import axios from "axios";
import { env } from "@/env";

console.log("[axios] Iniciando configuração do axios");
console.log("[axios] URL da API:", env.VITE_API_URL);

// Função para limpar todos os cookies
function clearAllCookies() {
	console.log("[axios] Limpando todos os cookies...");
	document.cookie.split(';').forEach(cookie => {
		const [name] = cookie.split('=');
		document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
	});
	console.log("[axios] Cookies após limpeza:", document.cookie);
}

// Função para verificar se o backend está disponível
async function checkBackendAvailability() {
	try {
		const response = await axios.get(`${env.VITE_API_URL}/health`, {
			timeout: 5000,
			withCredentials: false,
		});
		return response.status === 200;
	} catch (error) {
		console.error("[axios] Backend não está disponível:", error);
		return false;
	}
}

const api = axios.create({
	baseURL: env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	validateStatus: (status) => {
		return status >= 200 && status < 300;
	},
	timeout: 15000
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
	(response) => {
		console.log("[axios] Resposta recebida:", {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			cookies: document.cookie,
		});
		
		// Verifica se há cookies na resposta
		const setCookie = response.headers["set-cookie"];
		if (setCookie) {
			console.log("[axios] Headers Set-Cookie recebidos:", setCookie);
		}
		
		return response;
	},
	async (error) => {
		console.error("[axios] Erro na requisição:", {
			status: error.response?.status,
			statusText: error.response?.statusText,
			data: error.response?.data,
			headers: error.response?.headers,
			message: error.message,
		});
		
		if (error.response?.status === 401) {
			console.log("[axios] Erro 401 - Limpando cookies e redirecionando...");
			clearAllCookies();
			window.location.href = "/auth/sign-in";
			return Promise.reject(error);
		}

		if (error.response?.status === 404) {
			console.log("[axios] Erro 404 - Verificando disponibilidade do backend...");
			const isAvailable = await checkBackendAvailability();
			if (!isAvailable) {
				throw new Error("Backend não está disponível");
			}
			throw new Error(`Rota não encontrada: ${error.config.url}`);
		}

		if (error.code === "ERR_NETWORK") {
			console.log("[axios] Erro de rede - Verificando disponibilidade...");
			const isAvailable = await checkBackendAvailability();
			if (isAvailable) {
				return api(error.config);
			}
			throw new Error("Erro de conexão com o backend");
		}
		
		return Promise.reject(error);
	}
);

// Interceptor para adicionar headers em cada requisição
api.interceptors.request.use(
	async (config) => {
		console.log("[axios] Enviando requisição:", {
			url: config.url,
			method: config.method,
			withCredentials: config.withCredentials,
		});
		
		return config;
	},
	(error) => {
		console.error("[axios] Erro ao enviar requisição:", error);
		return Promise.reject(error);
	}
);

export { api };

// Função para verificar se os cookies foram definidos
function checkCookies() {
	const cookies = document.cookie.split(';').map(cookie => cookie.trim());
	const hasAuthCheck = cookies.some(cookie => cookie.startsWith('auth_check='));
	console.log("[axios] Verificando cookies:", {
		cookies,
		hasAuthCheck,
		allCookies: document.cookie
	});
	return hasAuthCheck;
}

// Função para aguardar os cookies serem definidos
async function waitForCookies(maxAttempts = 20, interval = 200) {
	console.log("[axios] Iniciando espera por cookies...");
	for (let i = 0; i < maxAttempts; i++) {
		if (checkCookies()) {
			console.log("[axios] Cookies encontrados na tentativa", i + 1);
			return true;
		}
		console.log("[axios] Tentativa", i + 1, "de", maxAttempts);
		await new Promise(resolve => setTimeout(resolve, interval));
	}
	console.log("[axios] Timeout esperando cookies");
	return false;
}

// if (env.VITE_API_DELAY && env.MODE !== "test") {
// 	api.interceptors.request.use(async (request) => {
// 		await new Promise((resolve) =>
// 			setTimeout(resolve, Math.round(Math.random() * 3000)),
// 		);
// 		return request;
// 	});
// }
