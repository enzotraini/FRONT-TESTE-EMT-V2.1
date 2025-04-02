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
				],
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
