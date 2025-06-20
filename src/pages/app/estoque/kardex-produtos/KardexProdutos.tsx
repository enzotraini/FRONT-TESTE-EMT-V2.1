import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { 
	Plus, 
	Minus, 
	RotateCcw, 
	Search, 
	Package, 
	TrendingUp, 
	TrendingDown,
	Calendar,
	User,
	FileText,
	BarChart3,
	Filter,
	Download,
	Eye,
	History,
	AlertTriangle,
	CheckCircle,
	ArrowUp,
	ArrowDown,
	RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const movimentacaoSchema = z.object({
	tipo: z.string().min(1, "Tipo é obrigatório"),
	quantidade: z.number().min(0.01, "Quantidade deve ser maior que zero"),
	valor: z.number().min(0.01, "Valor deve ser maior que zero"),
	documento: z.string().optional(),
	observacao: z.string().optional(),
});

interface Produto {
	id: number;
	codigo: string;
	descricao: string;
	referencia?: string;
	unidade: string;
	marca?: string;
	saldoAtual: number;
	custoMedio: number;
	valorEstoque: number;
	ultimaMovimentacao?: string;
}

interface MovimentacaoKardex {
	id: number;
	data: string;
	documento: string;
	cliforn: string;
	tipo: string;
	observacao?: string;
	quantidade: number;
	saldoAnterior: number;
	saldoAtual: number;
	custoUnitario: number;
	valorTotal: number;
	usuario: string;
}

export function KardexProdutos() {
	const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
	const [searchProduto, setSearchProduto] = useState("");
	const [tipoFiltro, setTipoFiltro] = useState("todos");
	const [showFormulario, setShowFormulario] = useState(false);
	const [page] = useState(1);
	const [perPage] = useState(15);

	const form = useForm<z.infer<typeof movimentacaoSchema>>({
		resolver: zodResolver(movimentacaoSchema),
		defaultValues: {
			tipo: "",
			quantidade: 0,
			valor: 0,
			documento: "",
			observacao: "",
		},
	});

	// Mock data - Produtos
	const { data: produtosResponse, isFetching: isFetchingProdutos } = useQuery({
		queryKey: ["produtos-kardex", searchProduto],
		queryFn: async () => {
			await new Promise(resolve => setTimeout(resolve, 500));
			
			const mockProdutos: Produto[] = [
				{
					id: 1,
					codigo: "1",
					descricao: "NOTEBOOKS USADOS",
					referencia: "NB-001",
					unidade: "UN",
					marca: "DELL",
					saldoAtual: -63,
					custoMedio: 1250.00,
					valorEstoque: -78750.00,
					ultimaMovimentacao: "2025-01-15T10:30:00"
				},
				{
					id: 2,
					codigo: "2",
					descricao: "DESKTOP USADO",
					unidade: "UN",
					marca: "HP",
					saldoAtual: -171,
					custoMedio: 850.00,
					valorEstoque: -145350.00,
					ultimaMovimentacao: "2025-01-14T14:20:00"
				},
				{
					id: 3,
					codigo: "3",
					descricao: "MONITOR USADO",
					unidade: "UN",
					marca: "SAMSUNG",
					saldoAtual: -65,
					custoMedio: 320.00,
					valorEstoque: -20800.00,
					ultimaMovimentacao: "2025-01-13T09:15:00"
				},
				{
					id: 4,
					codigo: "4",
					descricao: "MINI DESKTOP CORE I3 USADOS",
					unidade: "UN",
					marca: "LENOVO",
					saldoAtual: -65,
					custoMedio: 950.00,
					valorEstoque: -61750.00,
					ultimaMovimentacao: "2025-01-12T16:45:00"
				}
			];

			const filteredProdutos = searchProduto 
				? mockProdutos.filter(p => 
					p.descricao.toLowerCase().includes(searchProduto.toLowerCase()) ||
					p.codigo.includes(searchProduto) ||
					p.referencia?.toLowerCase().includes(searchProduto.toLowerCase())
				)
				: mockProdutos;

			return { produtos: filteredProdutos };
		},
		staleTime: 1000 * 60 * 5,
	});

	// Mock data - Movimentações do produto selecionado
	const { data: movimentacoesResponse, isFetching: isFetchingMovimentacoes } = useQuery({
		queryKey: ["movimentacoes-kardex", produtoSelecionado?.id, tipoFiltro],
		queryFn: async () => {
			if (!produtoSelecionado) return { movimentacoes: [] };
			
			await new Promise(resolve => setTimeout(resolve, 800));
			
			const mockMovimentacoes: MovimentacaoKardex[] = [
				{
					id: 1,
					data: "2025-01-15T10:30:00",
					documento: "138",
					cliforn: "ASD COMERCIO E SERVIÇOS",
					tipo: "SAIDA MERCADOR",
					observacao: "Venda para cliente",
					quantidade: 1,
					saldoAnterior: -62,
					saldoAtual: -63,
					custoUnitario: 1250.00,
					valorTotal: 1250.00,
					usuario: "ADM"
				},
				{
					id: 2,
					data: "2025-01-14T14:20:00",
					documento: "NF-137",
					cliforn: "RRO COMERCIO E SERVIÇOS",
					tipo: "ENTRADA MERCADOR",
					observacao: "Compra de fornecedor",
					quantidade: 5,
					saldoAnterior: -67,
					saldoAtual: -62,
					custoUnitario: 1200.00,
					valorTotal: 6000.00,
					usuario: "ADM"
				},
				{
					id: 3,
					data: "2025-01-13T09:15:00",
					documento: "INV-001",
					cliforn: "",
					tipo: "INVENTARIO",
					observacao: "Ajuste de inventário",
					quantidade: -2,
					saldoAnterior: -65,
					saldoAtual: -67,
					custoUnitario: 1250.00,
					valorTotal: -2500.00,
					usuario: "ADM"
				}
			];

			const filteredMovimentacoes = tipoFiltro === "todos" 
				? mockMovimentacoes
				: mockMovimentacoes.filter(m => {
					switch(tipoFiltro) {
						case "entradas": return m.tipo.includes("ENTRADA");
						case "saidas": return m.tipo.includes("SAIDA");
						case "inventario": return m.tipo.includes("INVENTARIO");
						case "transferencia": return m.tipo.includes("TRANSFER");
						default: return true;
					}
				});

			return { movimentacoes: filteredMovimentacoes };
		},
		enabled: !!produtoSelecionado,
		staleTime: 1000 * 60 * 2,
	});

	const handleSubmitMovimentacao = async (values: z.infer<typeof movimentacaoSchema>) => {
		console.log("Nova movimentação:", values, "Produto:", produtoSelecionado);
		// Aqui seria a integração com a API
		setShowFormulario(false);
		form.reset();
	};

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(valor);
	};

	const getTipoColor = (tipo: string) => {
		if (tipo.includes("ENTRADA")) return "text-green-700 bg-green-50";
		if (tipo.includes("SAIDA")) return "text-red-700 bg-red-50";
		if (tipo.includes("INVENTARIO")) return "text-blue-700 bg-blue-50";
		if (tipo.includes("TRANSFER")) return "text-purple-700 bg-purple-50";
		return "text-gray-700 bg-gray-50";
	};

	const getTipoIcon = (tipo: string) => {
		if (tipo.includes("ENTRADA")) return <ArrowUp className="h-3 w-3" />;
		if (tipo.includes("SAIDA")) return <ArrowDown className="h-3 w-3" />;
		if (tipo.includes("INVENTARIO")) return <RotateCcw className="h-3 w-3" />;
		if (tipo.includes("TRANSFER")) return <RefreshCw className="h-3 w-3" />;
		return <FileText className="h-3 w-3" />;
	};

	const getSaldoStatus = (saldo: number) => {
		if (saldo < 0) return { color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" />, text: "Negativo" };
		if (saldo === 0) return { color: "text-gray-600", icon: <Minus className="h-4 w-4" />, text: "Zerado" };
		return { color: "text-green-600", icon: <CheckCircle className="h-4 w-4" />, text: "Positivo" };
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button 
						variant="default"
						onClick={() => setShowFormulario(true)}
						disabled={!produtoSelecionado}
					>
						<Plus className="h-4 w-4 mr-2" />
						Nova Movimentação
					</Button>
					<Button variant="green" disabled={!produtoSelecionado}>
						<TrendingUp className="h-4 w-4 mr-2" />
						Entrada
					</Button>
					<Button variant="outline" disabled={!produtoSelecionado}>
						<TrendingDown className="h-4 w-4 mr-2" />
						Saída
					</Button>
					<Button variant="ghost" disabled={!produtoSelecionado}>
						<RotateCcw className="h-4 w-4 mr-2" />
						Inventário
					</Button>
					<Button variant="outline">
						<BarChart3 className="h-4 w-4 mr-2" />
						Relatórios
					</Button>
				</div>

				<div className="flex items-center gap-3">
					{produtoSelecionado && (
						<Badge variant="outline" className="bg-blue-50 text-blue-700">
							{movimentacoesResponse?.movimentacoes?.length || 0} movimentações
						</Badge>
					)}
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Seleção de Produto */}
				<div className="w-1/3 flex flex-col bg-white border-r border-gray-200 p-4">
					<div className="mb-4">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Selecionar Produto</h2>
						<SearchInput
							placeholder="Buscar por código, descrição ou referência..."
							value={searchProduto}
							onChange={(e) => setSearchProduto(e.target.value)}
						/>
					</div>

					{/* Lista de Produtos */}
					<div className="flex-1 overflow-auto">
						{isFetchingProdutos ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
							</div>
						) : !produtosResponse?.produtos || produtosResponse.produtos.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
								<p>Nenhum produto encontrado</p>
							</div>
						) : (
							<div className="space-y-2">
								{produtosResponse.produtos.map((produto) => (
									<Card
										key={produto.id}
										className={`cursor-pointer transition-colors hover:bg-gray-50 ${
											produtoSelecionado?.id === produto.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
										}`}
										onClick={() => setProdutoSelecionado(produto)}
									>
										<CardContent className="p-4">
											<div className="flex justify-between items-start mb-2">
												<div className="flex-1">
													<p className="font-medium text-sm">{produto.codigo} - {produto.descricao}</p>
													{produto.referencia && (
														<p className="text-xs text-gray-500">Ref: {produto.referencia}</p>
													)}
													{produto.marca && (
														<p className="text-xs text-gray-500">Marca: {produto.marca}</p>
													)}
												</div>
												<div className="text-right">
													<div className={`flex items-center gap-1 text-sm font-medium ${getSaldoStatus(produto.saldoAtual).color}`}>
														{getSaldoStatus(produto.saldoAtual).icon}
														{produto.saldoAtual} {produto.unidade}
													</div>
												</div>
											</div>
											<div className="flex justify-between text-xs text-gray-600">
												<span>Custo: {formatarMoeda(produto.custoMedio)}</span>
												<span>Total: {formatarMoeda(produto.valorEstoque)}</span>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Movimentações do Produto */}
				<div className="w-2/3 flex flex-col bg-white">
					{produtoSelecionado ? (
						<>
							{/* Header do Produto */}
							<div className="p-4 border-b border-gray-200 bg-gray-50">
								<div className="flex items-start justify-between mb-3">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{produtoSelecionado.codigo} - {produtoSelecionado.descricao}
										</h2>
										{produtoSelecionado.referencia && (
											<p className="text-gray-600">Referência: {produtoSelecionado.referencia}</p>
										)}
									</div>
									<div className={`flex items-center gap-2 ${getSaldoStatus(produtoSelecionado.saldoAtual).color}`}>
										{getSaldoStatus(produtoSelecionado.saldoAtual).icon}
										<span className="font-semibold">Saldo: {produtoSelecionado.saldoAtual} {produtoSelecionado.unidade}</span>
									</div>
								</div>

								{/* Métricas */}
								<div className="grid grid-cols-3 gap-4 text-sm">
									<div>
										<span className="text-gray-500">Custo Médio:</span>
										<p className="font-medium text-lg">{formatarMoeda(produtoSelecionado.custoMedio)}</p>
									</div>
									<div>
										<span className="text-gray-500">Valor Estoque:</span>
										<p className={`font-medium text-lg ${produtoSelecionado.valorEstoque < 0 ? 'text-red-600' : 'text-green-600'}`}>
											{formatarMoeda(produtoSelecionado.valorEstoque)}
										</p>
									</div>
									<div>
										<span className="text-gray-500">Última Movimentação:</span>
										<p className="font-medium">
											{produtoSelecionado.ultimaMovimentacao 
												? format(new Date(produtoSelecionado.ultimaMovimentacao), "dd/MM/yyyy", { locale: ptBR })
												: "Sem movimentação"
											}
										</p>
									</div>
								</div>
							</div>

							{/* Filtros */}
							<div className="p-3 flex gap-3 bg-white border-b border-gray-200">
								<Select value={tipoFiltro} onValueChange={setTipoFiltro}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todos">Todas Movimentações</SelectItem>
										<SelectItem value="entradas">Entradas</SelectItem>
										<SelectItem value="saidas">Saídas</SelectItem>
										<SelectItem value="inventario">Inventário</SelectItem>
										<SelectItem value="transferencia">Transferências</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Tabela de Movimentações */}
							<div className="flex-1 overflow-auto">
								<Table>
									<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
										<TableRow>
											<TableHead className="w-28">Data</TableHead>
											<TableHead className="w-20">Docto</TableHead>
											<TableHead className="w-60">Cliente/Fornecedor</TableHead>
											<TableHead className="w-32">Tipo</TableHead>
											<TableHead className="w-20">Qtde</TableHead>
											<TableHead className="w-24">Saldo</TableHead>
											<TableHead className="w-28">Custo Unit.</TableHead>
											<TableHead className="w-20">Usuário</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{isFetchingMovimentacoes ? (
											<TableRow>
												<TableCell colSpan={8} className="text-center py-12">
													<div className="flex items-center justify-center gap-2">
														<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
														Carregando movimentações...
													</div>
												</TableCell>
											</TableRow>
										) : !movimentacoesResponse?.movimentacoes || movimentacoesResponse.movimentacoes.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8} className="text-center py-12 text-gray-500">
													<div className="flex flex-col items-center gap-2">
														<History className="h-8 w-8 text-gray-300" />
														<p>Nenhuma movimentação encontrada</p>
													</div>
												</TableCell>
											</TableRow>
										) : (
											movimentacoesResponse.movimentacoes.map((mov) => (
												<TableRow key={mov.id} className="hover:bg-gray-50">
													<TableCell className="text-xs">
														{format(new Date(mov.data), "dd/MM/yy", { locale: ptBR })}
													</TableCell>
													<TableCell className="font-medium text-xs">{mov.documento}</TableCell>
													<TableCell className="text-xs">{mov.cliforn}</TableCell>
													<TableCell>
														<Badge variant="outline" className={`text-xs flex items-center gap-1 ${getTipoColor(mov.tipo)}`}>
															{getTipoIcon(mov.tipo)}
															{mov.tipo}
														</Badge>
													</TableCell>
													<TableCell className={`font-medium text-xs ${mov.quantidade > 0 ? 'text-green-600' : 'text-red-600'}`}>
														{mov.quantidade > 0 ? '+' : ''}{mov.quantidade}
													</TableCell>
													<TableCell className={`font-medium text-xs ${mov.saldoAtual < 0 ? 'text-red-600' : 'text-green-600'}`}>
														{mov.saldoAtual}
													</TableCell>
													<TableCell className="font-medium text-xs">{formatarMoeda(mov.custoUnitario)}</TableCell>
													<TableCell className="text-xs">{mov.usuario}</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							<div className="text-center">
								<Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione um produto</h3>
								<p className="text-sm text-gray-400">Escolha um produto da lista para ver o histórico de movimentações</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Modal de Nova Movimentação */}
			{showFormulario && produtoSelecionado && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<Card className="w-full max-w-md mx-4">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Package className="h-5 w-5" />
								Nova Movimentação
							</CardTitle>
							<p className="text-sm text-gray-600">{produtoSelecionado.descricao}</p>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleSubmitMovimentacao)} className="space-y-4">
									<FormField
										control={form.control}
										name="tipo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tipo de Movimentação</FormLabel>
												<Select onValueChange={field.onChange} value={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Selecione o tipo" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="ENTRADA MERCADOR">Entrada de Mercadoria</SelectItem>
														<SelectItem value="SAIDA MERCADOR">Saída de Mercadoria</SelectItem>
														<SelectItem value="INVENTARIO">Inventário</SelectItem>
														<SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-2 gap-3">
										<FormField
											control={form.control}
											name="quantidade"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Quantidade</FormLabel>
													<FormControl>
														<Input 
															type="number" 
															step="0.01"
															{...field}
															onChange={(e) => field.onChange(Number(e.target.value))}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="valor"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Valor Unitário</FormLabel>
													<FormControl>
														<Input 
															type="number" 
															step="0.01"
															{...field}
															onChange={(e) => field.onChange(Number(e.target.value))}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="documento"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Documento</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Número do documento" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="observacao"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Observação</FormLabel>
												<FormControl>
													<Textarea {...field} placeholder="Observações sobre a movimentação..." />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex gap-3 pt-4">
										<Button type="submit" className="flex-1">
											Gravar
										</Button>
										<Button 
											type="button" 
											variant="outline" 
											onClick={() => setShowFormulario(false)}
											className="flex-1"
										>
											Cancelar
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			)}
		</section>
	);
} 