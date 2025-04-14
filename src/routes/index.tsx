import { createBrowserRouter, Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import App from "../App";
import { Dashboard } from "../pages/Dashboard";
import { AuthLayout } from "../pages/_layouts/AuthLayout";
import { AppLayout } from "../pages/_layouts/AppLayout";
import { SignIn } from "../pages/auth/SignIn";
import { SignUp } from "../pages/auth/SignUp";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { NotFound } from "../pages/NotFound";
import { ErrorPage } from "../pages/ErrorPage";
import { Transportadoras } from "../pages/cadastros/transportadoras/Transportadoras";
import { FormularioDeTransportadora } from "../pages/cadastros/transportadoras/formulario/FormularioDeTransportadora";
import { Clientes } from "../pages/app/cadastros/clientes/Clientes";
import { FormularioDeCliente } from "../pages/app/cadastros/clientes/formulario/FormularioDeCliente";
import { TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "../lib/utils";
import { RegistrarEntradaPage } from "../pages/entrada-mercadoria/registrar";
import { ComprasPage } from "../pages/pedidos/compras/ComprasPage";

console.log("[ROUTER] Iniciando configuração de rotas...");

// Função para verificar se o usuário está autenticado
export function isAuthenticated() {
	console.log("[isAuthenticated] Verificando autenticação...");
	console.log("[isAuthenticated] Cookies atuais:", document.cookie);
	
	const cookies = document.cookie.split(';');
	const hasToken = cookies.some(cookie => cookie.trim().startsWith('token='));
	
	console.log("[isAuthenticated] Token encontrado:", hasToken);
	return hasToken;
}

// Função para limpar todos os cookies
function clearAllCookies() {
	console.log("[clearAllCookies] Limpando todos os cookies...");
	document.cookie.split(';').forEach(cookie => {
		const [name] = cookie.split('=');
		document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	});
	console.log("[clearAllCookies] Cookies após limpeza:", document.cookie);
}

// Componente de proteção de rota
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const location = useLocation();

	console.log("[ProtectedRoute] Componente montado");
	console.log("[ProtectedRoute] Localização atual:", location.pathname);
	console.log("[ProtectedRoute] Verificando autenticação...");
	console.log("[ProtectedRoute] Cookies:", document.cookie);

	if (!isAuthenticated()) {
		console.log("[ProtectedRoute] Usuário não autenticado, redirecionando para login...");
		clearAllCookies();
		// Salva a rota que o usuário tentou acessar
		navigate("/auth/sign-in", { 
			replace: true,
			state: { from: location.pathname }
		});
		return null;
	}

	console.log("[ProtectedRoute] Usuário autenticado, renderizando rota protegida...");
	return <>{children}</>;
};

// Componente que redireciona usuários autenticados para o app
const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const location = useLocation();

	console.log("[RedirectIfAuthenticated] Verificando autenticação...");
	console.log("[RedirectIfAuthenticated] Localização atual:", location.pathname);
	console.log("[RedirectIfAuthenticated] Cookies atuais:", document.cookie);
	
	// Se houver qualquer cookie relacionado à autenticação mas não tivermos o token,
	// limpamos tudo para evitar estado inconsistente
	if (document.cookie.includes('sidebar=') && !isAuthenticated()) {
		console.log("[RedirectIfAuthenticated] Cookies em estado inconsistente, limpando...");
		clearAllCookies();
		return null;
	}
	
	if (isAuthenticated()) {
		console.log("[RedirectIfAuthenticated] Usuário autenticado, redirecionando para app...");
		// Usa replace: true para evitar que o usuário volte para a página de login
		navigate("/app", { replace: true });
		return null;
	}

	console.log("[RedirectIfAuthenticated] Usuário não autenticado, renderizando página de login...");
	return <>{children}</>;
};

// Configuração das rotas
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				element: <Navigate to="/dashboard" replace />,
			},
			{
				path: "auth",
				element: <AuthLayout />,
				children: [
					{
						path: "sign-in",
						element: <RedirectIfAuthenticated><SignIn /></RedirectIfAuthenticated>,
					},
					{
						path: "sign-up",
						element: <RedirectIfAuthenticated><SignUp /></RedirectIfAuthenticated>,
					},
					{
						path: "forgot-password",
						element: <RedirectIfAuthenticated><ForgotPassword /></RedirectIfAuthenticated>,
					},
					{
						path: "reset-password",
						element: <RedirectIfAuthenticated><ResetPassword /></RedirectIfAuthenticated>,
					},
				],
			},
			{
				path: "entrada-mercadoria",
				children: [
					{
						path: "",
						element: <div>Entrada de Mercadoria</div>,
					},
					{
						path: "registrar",
						element: <RegistrarEntradaPage />,
					},
					{
						path: "substituicao",
						element: <div>Entrada de Substituição</div>,
					},
					{
						path: "consultar",
						element: <div>Consultar Entradas</div>,
					},
				],
			},
			{
				path: "dashboard",
				element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
			},
			{
				path: "cadastros",
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{
						path: "clientes",
						element: <Clientes />,
					},
					{
						path: "clientes/novo",
						element: <FormularioDeCliente />,
					},
					{
						path: "clientes/:id",
						element: <FormularioDeCliente />,
					},
					{
						path: "transportadoras",
						element: (
							console.log("[ROUTER] Tentando renderizar componente Transportadoras"),
							<Transportadoras />
						),
					},
					{
						path: "transportadoras/novo",
						element: <FormularioDeTransportadora />,
					},
					{
						path: "transportadoras/:id",
						element: <FormularioDeTransportadora />,
					},
				],
			},
			{
				path: "pedidos",
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{
						path: "compras",
						element: <ComprasPage />,
					},
					{
						path: "vendas",
						element: <div>Vendas</div>,
					},
				],
			},
			{
				path: "atendimento-ao-cliente",
				element: <ProtectedRoute><div>Atendimento ao Cliente</div></ProtectedRoute>,
			},
			{
				path: "nota-fiscal",
				element: <ProtectedRoute><div>Nota Fiscal</div></ProtectedRoute>,
			},
			{
				path: "ficha-kardex",
				element: <ProtectedRoute><div>Ficha Kardex</div></ProtectedRoute>,
			},
			{
				path: "contas",
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{
						path: "receber",
						element: <div>Contas a Receber</div>,
					},
					{
						path: "pagar",
						element: <div>Contas a Pagar</div>,
					},
				],
			},
			{
				path: "expedicao",
				element: <ProtectedRoute><div>Expedição</div></ProtectedRoute>,
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

console.log("[ROUTER] Rotas configuradas:", router.routes);
console.log("[ROUTER] Estrutura de rotas:", JSON.stringify(router.routes, null, 2));

export { router as routes }; 