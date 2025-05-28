import { createBrowserRouter, Outlet, type Router } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/AppLayout";
import { Home } from "./pages/app/home/Home";
import { AuthLayout } from "./pages/_layouts/AuthLayout";
import { SignIn } from "./pages/auth/SignIn";
import { SignUp } from "./pages/auth/SignUp";
import { NotFound } from "./pages/404";
import { ErrorPage } from "./pages/Error";
import { Clientes } from "@/pages/app/cadastros/clientes/Clientes";
import { FormularioDeClientes } from "@/pages/app/cadastros/clientes/formulario/FormularioDeCliente";
import { Transportadoras } from "@/pages/cadastros/transportadoras/Transportadoras";
import { FormularioDeTransportadora } from "@/pages/cadastros/transportadoras/formulario/FormularioDeTransportadora";
import { EntradaDeMercadoria } from "@/pages/cadastros/entrada-mercadoria/EntradaDeMercadoria";
import { FormularioDeEntradaDeMercadoria } from "@/pages/cadastros/entrada-mercadoria/formulario/FormularioDeEntradaDeMercadoria";
import { ConfiguracoesPage } from "@/pages/configuracoes";
import { FormularioFornecedor } from "@/pages/cadastros/fornecedores/formularios/FormularioDeFornecedor";
import { Fornecedores } from "@/pages/cadastros/fornecedores/fornecedor";
import { Produtos } from "@/pages/cadastros/produtos/produto";
//import { FormularioDadosGerais } from "@/pages/cadastros/fornecedores/formularios/FormularioDadosGerais";

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/cadastros",
				element: <Outlet />,
				children: [
					{
						path: "clientes",
						element: <Outlet />,
						children: [
							{
								path: "",
								element: <Clientes />,
							},
							{
								path: "incluir",
								element: <FormularioDeClientes />,
							},
							{
								path: "editar/:clienteId",
								element: <FormularioDeClientes />,
							},
							{
								path: ":id",
								element: <FormularioDeClientes />,
							},
						],
					},
					{
						path: "transportadoras",
						element: <Outlet />,
						children: [
							{
								path: "",
								element: <Transportadoras />,
							},
							{
								path: "novo",
								element: <FormularioDeTransportadora />,
							},
							{
								path: ":id",
								element: <FormularioDeTransportadora />,
							},
						],
					},
					{
						path: "entrada-mercadoria",
						element: <Outlet />,
						children: [
							{
								path: "",
								element: <EntradaDeMercadoria />,
							},
							{
								path: "nova",
								element: <FormularioDeEntradaDeMercadoria />,
							},
							{
								path: ":id",
								element: <FormularioDeEntradaDeMercadoria />,
							},
						],
					},
					{
						path: "fornecedores",
						element: <Outlet />,
						children: [
							{
								path: "",
								element: <Fornecedores />,
							},
							{
								path: "novo",
								element: <FormularioFornecedor />,
							},
							{
								path: ":id",
								element: <FormularioFornecedor />,
							},
							{
								path: "editar/:id",
								element: <FormularioFornecedor />,
							},
						],
					},
					{
						path: "produtos",
						element: <Outlet />,
						children: [
							{
								path: "",
								element: <Produtos />,
							},
							{
								path: "novo",
								element: <FormularioFornecedor />,
							},
							{
								path: ":id",
								element: <FormularioFornecedor />,
							},
							{
								path: "editar/:id",
								element: <FormularioFornecedor />,
							},
						],
					},
				],
			},
			{
				path: "/configuracoes",
				element: <ConfiguracoesPage />,
			},
		],
	},
	{
		path: "/auth",
		element: <AuthLayout />,
		children: [
			{
				path: "sign-in",
				element: <SignIn />,
			},
			{
				path: "sign-up",
				element: <SignUp />,
			},
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);
