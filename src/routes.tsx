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
import { FormularioProduto } from "@/pages/cadastros/produtos/formularios/FormularioDeProduto";
import { AtendimentoCliente } from "@/pages/app/atendimento/AtendimentoCliente";
import { Compras } from "@/pages/app/pedidos/compras";
import { Vendas } from "@/pages/app/pedidos/vendas";
import { ControleNotas } from "@/pages/app/nota-fiscal/controle";
import { EmissaoNF } from "@/pages/app/nota-fiscal/emissao";
import { ConsultaNFe } from "@/pages/app/nota-fiscal/consulta";
import { KardexProdutos, KardexMateriaPrima, ListagemEstoque } from "@/pages/app/estoque";
import { ContasReceber } from "@/pages/app/financeiro/contas-receber";
import { ContasPagar } from "@/pages/app/financeiro/contas-pagar";
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
								element: <FormularioProduto />,
							},
							{
								path: ":id",
								element: <FormularioProduto />,
							},
							{
								path: "editar/:id",
								element: <FormularioProduto />,
							},
						],
					},
				],
			},
			{
				path: "/configuracoes",
				element: <ConfiguracoesPage />,
			},
			{
				path: "/atendimento-ao-cliente",
				element: <AtendimentoCliente />,
			},
			{
				path: "/pedidos",
				element: <Outlet />,
				children: [
					{
						path: "compras",
						element: <Compras />,
					},
					{
						path: "vendas",
						element: <Vendas />,
					},
				],
			},
			{
				path: "/nota-fiscal",
				element: <Outlet />,
				children: [
					{
						path: "controle",
						element: <ControleNotas />,
					},
					{
						path: "emissao",
						element: <EmissaoNF />,
					},
					{
						path: "consulta",
						element: <ConsultaNFe />,
					},
				],
			},
			{
				path: "/ficha-kardex",
				element: <Outlet />,
				children: [
					{
						path: "produtos",
						element: <KardexProdutos />,
					},
					{
						path: "materia-prima",
						element: <KardexMateriaPrima />,
					},
					{
						path: "listagem",
						element: <ListagemEstoque />,
					},
				],
			},
			{
				path: "/contas",
				element: <Outlet />,
				children: [
					{
						path: "receber",
						element: <ContasReceber />,
					},
					{
						path: "pagar",
						element: <ContasPagar />,
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
