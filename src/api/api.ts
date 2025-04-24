import axios from "axios";
import { env } from "@/env";

export const api = axios.create({
	baseURL: env.VITE_API_URL,
	withCredentials: true,
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Se o token expirou, redireciona para a página de login
			window.location.href = "/auth/sign-in";
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