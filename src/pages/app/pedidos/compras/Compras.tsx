import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/SearchInput";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
	Calendar, 
	Clock, 
	Truck, 
	Building2, 
	User, 
	Plus, 
	Edit, 
	Trash, 
	FileText, 
	History,
	MoreHorizontal,
	ChevronDown,
	Package,
	DollarSign
} from "lucide-react";
import dayjs from "dayjs";
import { formatMoney } from "@/utils/formatMoney";

interface PedidoCompra {
	id: number;
	numeroPedido: string;
	tipoVenda: string;
	tipoPedido: string;
	data: string;
	fornecedor: string;
	dtEntrega: string;
	dtBaixa?: string;
	totMercador: number;
	totalPedido: number;
	status: string;
	hora: string;
	vendedor: string;
	usuario: string;
	loja: string;
	nota?: string;
	caixa?: string;
}

export function Compras() {
	const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoCompra | null>(null);
	const [search, setSearch] = useState("");
	const [observacoes, setObservacoes] = useState("");
	const [page] = useState(1);
	const [perPage] = useState(15);

	// Mock data - substituir por API real
	const { data: pedidosResponse, isFetching, error } = useQuery({
		queryKey: ["pedidos-compra", page, perPage, search],
		queryFn: async () => {
			// Simular delay da API
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const mockPedidos: PedidoCompra[] = [
				{
					id: 1,
					numeroPedido: "000001",
					tipoVenda: "Compra",
					tipoPedido: "Normal",
					data: "2025-01-15T10:30:00",
					fornecedor: "FORNECEDOR ABC LTDA",
					dtEntrega: "2025-01-20T00:00:00",
					dtBaixa: "2025-01-18T14:30:00",
					totMercador: 15750.00,
					totalPedido: 18637.50,
					status: "Finalizado",
					hora: "10:30",
					vendedor: "João Silva",
					usuario: "ADM",
					loja: "01",
					nota: "NF-001",
					caixa: "CX-01"
				},
				{
					id: 2,
					numeroPedido: "000002",
					tipoVenda: "Compra",
					tipoPedido: "Urgente",
					data: "2025-01-14T14:15:00",
					fornecedor: "METALÚRGICA XYZ S/A",
					dtEntrega: "2025-01-19T00:00:00",
					totMercador: 8200.00,
					totalPedido: 9676.00,
					status: "Pendente",
					hora: "14:15",
					vendedor: "Maria Santos",
					usuario: "USR",
					loja: "01"
				},
				{
					id: 3,
					numeroPedido: "000003",
					tipoVenda: "Compra",
					tipoPedido: "Normal",
					data: "2025-01-13T09:00:00",
					fornecedor: "DISTRIBUIDORA 123",
					dtEntrega: "2025-01-22T00:00:00",
					totMercador: 5600.00,
					totalPedido: 6608.00,
					status: "Em Andamento",
					hora: "09:00",
					vendedor: "Carlos Costa",
					usuario: "ADM",
					loja: "02"
				}
			];

			const filteredPedidos = search 
				? mockPedidos.filter(p => 
					p.fornecedor.toLowerCase().includes(search.toLowerCase()) ||
					p.numeroPedido.includes(search)
				)
				: mockPedidos;

			return { 
				pedidos: filteredPedidos, 
				meta: { page, perPage, total: filteredPedidos.length } 
			};
		},
		initialData: { pedidos: [], meta: { page, perPage, total: 0 } },
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	});

	const handlePedidoClick = (pedido: PedidoCompra) => {
		setPedidoSelecionado(pedido);
		setObservacoes("");
	};



	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Finalizado': return 'text-green-700 bg-green-50';
			case 'Pendente': return 'text-yellow-700 bg-yellow-50';
			case 'Em Andamento': return 'text-blue-700 bg-blue-50';
			case 'Cancelado': return 'text-red-700 bg-red-50';
			default: return 'text-gray-700 bg-gray-50';
		}
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button variant="default">
						<Plus className="h-4 w-4 mr-2" />
						Novo Pedido
					</Button>
					<Button variant="green" disabled={!pedidoSelecionado}>
						<Edit className="h-4 w-4 mr-2" />
						Alterar
					</Button>
					<Button variant="ghost">
						<FileText className="h-4 w-4 mr-2" />
						Consultar
					</Button>
					<Button variant="destructive" disabled={!pedidoSelecionado}>
						<Trash className="h-4 w-4 mr-2" />
						Cancelar
					</Button>
					
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<MoreHorizontal className="h-4 w-4 mr-2" />
								Mais opções
								<ChevronDown className="h-3 w-3 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem>
								<Calendar className="h-4 w-4 mr-2" />
								Relatório por Data
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Building2 className="h-4 w-4 mr-2" />
								Por Fornecedor
							</DropdownMenuItem>
							<DropdownMenuItem>
								<DollarSign className="h-4 w-4 mr-2" />
								Valores
							</DropdownMenuItem>
							<DropdownMenuItem>Imprimir</DropdownMenuItem>
							<DropdownMenuItem>Exportar</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Badge variant="outline" className="bg-blue-50 text-blue-700">
					{pedidosResponse?.pedidos?.length || 0} pedidos
				</Badge>
			</header>

			{/* Barra de Pesquisa */}
			<nav className="p-3 flex gap-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
				<SearchInput
					placeholder="Pesquisar por fornecedor ou número..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-80"
				/>
				<Button variant="ghost" size="sm">Pendentes</Button>
				<Button variant="ghost" size="sm">Finalizados</Button>
			</nav>

			<div className="flex flex-1 overflow-hidden">
				{/* Lista de Pedidos */}
				<div className="w-2/3 flex flex-col bg-white border-r border-gray-200">
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
								<TableRow>
									<TableHead className="w-20">Nº Pedido</TableHead>
									<TableHead className="w-80">Fornecedor</TableHead>
									<TableHead className="w-32">Data</TableHead>
									<TableHead className="w-32">Dt. Entrega</TableHead>
									<TableHead className="w-32">Total</TableHead>
									<TableHead className="w-24">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isFetching ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12">
											<div className="flex items-center justify-center gap-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
												Carregando pedidos...
											</div>
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12 text-amber-600">
											⚠️ Erro ao carregar pedidos.
										</TableCell>
									</TableRow>
								) : !pedidosResponse?.pedidos || pedidosResponse.pedidos.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12 text-gray-500">
											<div className="flex flex-col items-center gap-2">
												<Package className="h-8 w-8 text-gray-300" />
												<p>Nenhum pedido encontrado</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									pedidosResponse.pedidos.map((pedido) => (
										<TableRow
											key={pedido.id}
											className={`cursor-pointer hover:bg-gray-50 transition-colors ${
												pedidoSelecionado?.id === pedido.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
											}`}
											onClick={() => handlePedidoClick(pedido)}
										>
											<TableCell className="font-medium">{pedido.numeroPedido}</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{pedido.fornecedor}</p>
													<p className="text-sm text-gray-500">{pedido.tipoPedido}</p>
												</div>
											</TableCell>
											<TableCell>{dayjs(pedido.data).format("DD/MM/YY")}</TableCell>
											<TableCell>{dayjs(pedido.dtEntrega).format("DD/MM/YY")}</TableCell>
											<TableCell className="font-medium">{formatMoney(pedido.totalPedido)}</TableCell>
											<TableCell>
												<Badge variant="outline" className={`text-xs ${getStatusColor(pedido.status)}`}>
													{pedido.status}
												</Badge>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* Painel de Detalhes */}
				<div className="w-1/3 flex flex-col bg-white">
					{pedidoSelecionado ? (
						<>
							{/* Header do Pedido */}
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">Pedido #{pedidoSelecionado.numeroPedido}</h2>
										<p className="text-gray-600 mt-1">{pedidoSelecionado.fornecedor}</p>
									</div>
									<Badge variant="outline" className={getStatusColor(pedidoSelecionado.status)}>
										{pedidoSelecionado.status}
									</Badge>
								</div>
								
								{/* Info rápida */}
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-gray-500">Total:</span>
										<p className="font-medium text-lg">{formatMoney(pedidoSelecionado.totalPedido)}</p>
									</div>
									<div>
										<span className="text-gray-500">Entrega:</span>
										<p className="font-medium">{dayjs(pedidoSelecionado.dtEntrega).format("DD/MM/YYYY")}</p>
									</div>
								</div>
							</div>

							{/* Conteúdo */}
							<div className="flex-1 p-6 space-y-6 overflow-auto">
								{/* Informações Completas */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base">Detalhes do Pedido</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 gap-3">
											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data</label>
													<p className="text-sm mt-1">{dayjs(pedidoSelecionado.data).format("DD/MM/YYYY")}</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hora</label>
													<p className="text-sm mt-1">{pedidoSelecionado.hora}</p>
												</div>
											</div>

											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo Pedido</label>
												<p className="text-sm mt-1">{pedidoSelecionado.tipoPedido}</p>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vendedor</label>
													<p className="text-sm mt-1">{pedidoSelecionado.vendedor}</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usuário</label>
													<p className="text-sm mt-1">{pedidoSelecionado.usuario}</p>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Loja</label>
													<p className="text-sm mt-1">{pedidoSelecionado.loja}</p>
												</div>
												{pedidoSelecionado.caixa && (
													<div>
														<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Caixa</label>
														<p className="text-sm mt-1">{pedidoSelecionado.caixa}</p>
													</div>
												)}
											</div>

											<Separator />

											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tot. Mercadoria</label>
													<p className="text-sm mt-1 font-medium">{formatMoney(pedidoSelecionado.totMercador)}</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Pedido</label>
													<p className="text-sm mt-1 font-medium text-lg">{formatMoney(pedidoSelecionado.totalPedido)}</p>
												</div>
											</div>

											{pedidoSelecionado.dtBaixa && (
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data Baixa</label>
													<p className="text-sm mt-1">{dayjs(pedidoSelecionado.dtBaixa).format("DD/MM/YYYY HH:mm")}</p>
												</div>
											)}

											{pedidoSelecionado.nota && (
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nota</label>
													<p className="text-sm mt-1">{pedidoSelecionado.nota}</p>
												</div>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Observações */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<FileText className="h-4 w-4" />
											Nova Observação
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Textarea
											placeholder="Digite observações sobre o pedido..."
											value={observacoes}
											onChange={(e) => setObservacoes(e.target.value)}
											className="min-h-20 resize-none"
										/>
										<div className="flex justify-end mt-3">
											<Button size="sm" disabled={!observacoes.trim()}>
												Salvar
											</Button>
										</div>
									</CardContent>
								</Card>

								{/* Histórico */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<History className="h-4 w-4" />
											Histórico do Pedido
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
												<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
												<div className="flex-1">
													<p className="font-medium text-sm">Pedido criado</p>
													<p className="text-xs text-gray-600 mt-1">Pedido registrado no sistema</p>
													<span className="text-xs text-gray-500">{dayjs(pedidoSelecionado.data).format("DD/MM/YYYY HH:mm")}</span>
												</div>
											</div>
											{pedidoSelecionado.dtBaixa && (
												<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
													<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
													<div className="flex-1">
														<p className="font-medium text-sm">Pedido finalizado</p>
														<p className="text-xs text-gray-600 mt-1">Baixa realizada no sistema</p>
														<span className="text-xs text-gray-500">{dayjs(pedidoSelecionado.dtBaixa).format("DD/MM/YYYY HH:mm")}</span>
													</div>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							<div className="text-center">
								<Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione um pedido</h3>
								<p className="text-sm text-gray-400">Clique em um pedido da lista para ver os detalhes</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
} 