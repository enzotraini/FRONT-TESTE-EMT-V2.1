import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
  withCredentials: true,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Se o token expirou, redireciona para a página de login
      localStorage.removeItem("token");
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
); 