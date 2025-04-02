import { Link } from "react-router-dom";
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

const linkClassName =
	"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm";

export function AppSidebar() {
	const { setTheme } = useTheme();

	return (
		<Sidebar>
			<SidebarHeader>
				<Link to="/" className="uppercase text-blue-700 dark:text-blue-400 p-4 hover:opacity-80 transition-opacity">
					Comercial <br /> <strong>Aço Fácil</strong>
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
									<List /> Pedidos
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarMenuButton>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenuButton asChild>
										<Link to="/pedidos/vendas">
											<SidebarMenuItem>Vendas</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<Link to="/pedidos/compras">
											<SidebarMenuItem>Compras</SidebarMenuItem>
										</Link>
									</SidebarMenuButton>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<SidebarMenuButton asChild>
						<Link to="/nota-fiscal">
							<SidebarMenuItem className={linkClassName}>
								<File /> Nota fiscal
							</SidebarMenuItem>
						</Link>
					</SidebarMenuButton>

					<SidebarMenuButton asChild>
						<Link to="/entrada-de-mercadoria">
							<SidebarMenuItem className={linkClassName}>
								<ShoppingCart /> Entrada de Mercadoria
							</SidebarMenuItem>
						</Link>
					</SidebarMenuButton>

					<SidebarMenuButton asChild>
						<Link to="/ficha-kardex">
							<SidebarMenuItem className={linkClassName}>
								<Ticket /> Ficha Kardex
							</SidebarMenuItem>
						</Link>
					</SidebarMenuButton>

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

					<SidebarMenuButton asChild>
						<Link to="/expedicao">
							<SidebarMenuItem className={linkClassName}>
								<MapIcon /> Expedição
							</SidebarMenuItem>
						</Link>
					</SidebarMenuButton>

					<SidebarMenuButton asChild>
						<Link to="/preco-e-estoque">
							<SidebarMenuItem className={linkClassName}>
								<Box /> Preço e Estoque
							</SidebarMenuItem>
						</Link>
					</SidebarMenuButton>
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
								<DropdownMenuItem>
									<span className="flex gap-2 items-center justify-center">
										<Settings /> Configurações
									</span>
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
										<DropdownMenuItem onClick={() => setTheme("light")}>
											<span>Claro</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setTheme("dark")}>
											<span>Escuro</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setTheme("system")}>
											<span>Sistema</span>
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
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
