import { Link, useNavigate } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import {
	Banknote,
	Box,
	ChevronDown,
	ChevronUp,
	File,
	FilePen,
	List,
	Map as MapIcon,
	Moon,
	Power,
	Settings,
	ShoppingCart,
	Sun,
	Ticket,
	User,
	User2,
	FileText,
	ClipboardList,
	PackageSearch,
	Boxes,
	ClipboardCheck,
	PackageOpen,
	BarChart3,
	Truck,
	DollarSign,
	PackageCheck,
	Route,
	Calculator,
	LineChart,
	Package,
} from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/usuario/logout";
import { toast } from "sonner";
import { redirectTo } from "@/utils/navigation";

const linkClassName =
	"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm";

export function AppSidebar() {
	const { setTheme } = useTheme();
	const navigate = useNavigate();

	const { mutateAsync: logoutFn } = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			console.log("[AppSidebar] Logout realizado com sucesso");
			toast.success("Logout realizado com sucesso!");
		},
		onError: (error) => {
			console.error("[AppSidebar] Erro ao fazer logout:", error);
			toast.error("Erro ao fazer logout. Tente novamente.");
		},
	});

	const handleLogout = async () => {
		try {
			await logoutFn();
			redirectTo("/auth/sign-in");
		} catch (error) {
			console.error("[AppSidebar] Erro ao fazer logout:", error);
			redirectTo("/auth/sign-in");
		}
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<Link to="/" className="uppercase text-blue-700 dark:text-blue-400 p-4 hover:opacity-80 transition-opacity">
					Comercial <br /> <strong>EMT Consultoria</strong>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<FilePen />
									Cadastros
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/cadastros/produtos">
											<SidebarMenuItem>Cadastro de Produtos</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/cadastros/clientes">
											<SidebarMenuItem>Cadastro de Clientes</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/cadastros/transportadoras">
											<SidebarMenuItem>Cadastro de Transportadoras</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/cadastros/fornecedores">
											<SidebarMenuItem>Cadastro de Fornecedores</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<SidebarMenu>
						<SidebarMenuButton asChild>
							<Link to="/atendimento-ao-cliente">
								<SidebarMenuItem className={linkClassName}>
									<User /> Atendimento ao Cliente
								</SidebarMenuItem>
							</Link>
						</SidebarMenuButton>
					</SidebarMenu>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<ShoppingCart /> Pedidos
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link
											to="/pedidos/compras"
											className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
										>
											<ShoppingCart className="h-4 w-4" />
											Compras
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link
											to="/pedidos/vendas"
											className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
										>
											<ShoppingCart className="h-4 w-4" />
											Vendas
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<FileText /> Nota Fiscal
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/nota-fiscal/emissao">
											<SidebarMenuItem>Emissão de NF</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/nota-fiscal/controle">
											<SidebarMenuItem>Controle de Notas</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/nota-fiscal/consulta">
											<SidebarMenuItem>Consulta NF-e</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<PackageOpen /> Entrada de Mercadoria
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link
											to="/cadastros/entrada-mercadoria/nova"
											className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
										>
											<Package className="h-4 w-4" />
											Registrar Entrada
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link
											to="/cadastros/entrada-mercadoria/substituicao"
											className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
										>
											<Package className="h-4 w-4" />
											Entrada de Substituição
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link
											to="/cadastros/entrada-mercadoria/consulta"
											className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
										>
											<Package className="h-4 w-4" />
											Consultar Entradas
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<BarChart3 /> Ficha Kardex
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/ficha-kardex/materia-prima">
											<SidebarMenuItem>Kardex Matéria Prima</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/ficha-kardex/produtos">
											<SidebarMenuItem>Kardex Produtos</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/ficha-kardex/listagem">
											<SidebarMenuItem>Listagem Estoque</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<Banknote /> Contas
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/contas/receber">
											<SidebarMenuItem>Receber</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/contas/pagar">
											<SidebarMenuItem>Pagar</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<Truck /> Expedição
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/expedicao/romaneio">
											<SidebarMenuItem>Romaneio</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/expedicao/entregas">
											<SidebarMenuItem>Controle de Entregas</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/expedicao/rotas">
											<SidebarMenuItem>Rotas</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/collapsible">
						<SidebarGroup>
							<SidebarMenuButton asChild>
								<CollapsibleTrigger>
									<Calculator /> Preço e Estoque
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/preco-estoque/tabela">
											<SidebarMenuItem>Tabela de Preços</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/preco-estoque/cotacoes">
											<SidebarMenuItem>Cotações</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/preco-estoque/analise">
											<SidebarMenuItem>Análise de Estoque</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> Username
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem asChild>
									<Link to="/configuracoes">
										<span className="flex gap-2 items-center justify-center">
											<Settings /> Configurações
										</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger asChild>
										<span className="flex gap-2 items-center justify-start">
											<Sun className="h-[1.2rem] w-[1.2rem] dark:-rotate-90 dark:hidden" />
											<Moon className="h-[1.2rem] w-[1.2rem] dark:rotate-0 hidden dark:flex" />
											<span>Trocar tema</span>
										</span>
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										<DropdownMenuItem
											onSelect={() => {
												console.log("[AppSidebar] Tentando mudar para tema claro");
												setTheme("light");
												console.log("[AppSidebar] Tema claro definido");
												toast.success("Tema claro ativado");
											}}
										>
											<span>Claro</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() => {
												console.log("[AppSidebar] Tentando mudar para tema escuro");
												setTheme("dark");
												console.log("[AppSidebar] Tema escuro definido");
												toast.success("Tema escuro ativado");
											}}
										>
											<span>Escuro</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onSelect={() => {
												console.log("[AppSidebar] Tentando mudar para tema do sistema");
												setTheme("system");
												console.log("[AppSidebar] Tema do sistema definido");
												toast.success("Tema do sistema ativado");
											}}
										>
											<span>Sistema</span>
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<span className="flex gap-2 items-center justify-center">
										<Power /> Sair
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
