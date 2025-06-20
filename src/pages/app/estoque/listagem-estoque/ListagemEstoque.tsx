import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/SearchInput";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
	Package, 
	TrendingUp, 
	TrendingDown,
	BarChart3,
	AlertTriangle,
	CheckCircle,
	Minus,
	FileText,
	Download,
	Eye,
	Filter,
	RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ItemEstoque {
	id: number;
	codigo: string;
	descricao: string;
	referencia?: string;
	unidade: string;
	categoria: string;
	marca?: string;
	localizacao: string;
	saldoAtual: number;
	estoqueMinimo: number;
	estoqueMaximo: number;
	custoMedio: number;
	valorEstoque: number;
	ultimaMovimentacao?: string;
	statusEstoque: "CRITICO" | "BAIXO" | "NORMAL" | "ALTO" | "ZERADO";
}

export function ListagemEstoque() {
	const [searchItem, setSearchItem] = useState("");
	const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
	const [statusFiltro, setStatusFiltro] = useState("todos");
	const [page] = useState(1);
	const [perPage] = useState(20);

	// Mock data - Itens do Estoque
	const { data: estoqueResponse, isFetching: isFetchingEstoque } = useQuery({
		queryKey: ["listagem-estoque", searchItem, categoriaFiltro, statusFiltro],
		queryFn: async () => {
			await new Promise(resolve => setTimeout(resolve, 800));
			
			const mockItens: ItemEstoque[] = [
				{
					id: 1,
					codigo: "1",
					descricao: "NOTEBOOKS USADOS",
					referencia: "NB-001",
					unidade: "UN",
					categoria: "PRODUTOS",
					marca: "DELL",
					localizacao: "A1-001",
					saldoAtual: -63,
					estoqueMinimo: 10,
					estoqueMaximo: 100,
					custoMedio: 1250.00,
					valorEstoque: -78750.00,
					ultimaMovimentacao: "2025-01-15T10:30:00",
					statusEstoque: "CRITICO"
				},
				{
					id: 2,
					codigo: "2",
					descricao: "DESKTOP USADO",
					unidade: "UN",
					categoria: "PRODUTOS",
					marca: "HP",
					localizacao: "A1-002",
					saldoAtual: -171,
					estoqueMinimo: 15,
					estoqueMaximo: 80,
					custoMedio: 850.00,
					valorEstoque: -145350.00,
					ultimaMovimentacao: "2025-01-14T14:20:00",
					statusEstoque: "CRITICO"
				},
				{
					id: 3,
					codigo: "MP001",
					descricao: "PLACAS DE CIRCUITO",
					referencia: "PLC-001",
					unidade: "UN",
					categoria: "MATERIA_PRIMA",
					localizacao: "B2-015",
					saldoAtual: 250,
					estoqueMinimo: 50,
					estoqueMaximo: 500,
					custoMedio: 15.50,
					valorEstoque: 3875.00,
					ultimaMovimentacao: "2025-01-15T10:30:00",
					statusEstoque: "NORMAL"
				},
				{
					id: 4,
					codigo: "MP002",
					descricao: "PROCESSADOR INTEL",
					referencia: "PROC-I5",
					unidade: "UN",
					categoria: "MATERIA_PRIMA",
					localizacao: "B2-020",
					saldoAtual: 8,
					estoqueMinimo: 20,
					estoqueMaximo: 100,
					custoMedio: 850.00,
					valorEstoque: 6800.00,
					ultimaMovimentacao: "2025-01-14T14:20:00",
					statusEstoque: "BAIXO"
				},
				{
					id: 5,
					codigo: "MP003",
					descricao: "MEMORIA RAM DDR4",
					referencia: "RAM-8GB",
					unidade: "UN",
					categoria: "MATERIA_PRIMA",
					localizacao: "B2-025",
					saldoAtual: 120,
					estoqueMinimo: 30,
					estoqueMaximo: 200,
					custoMedio: 180.00,
					valorEstoque: 21600.00,
					ultimaMovimentacao: "2025-01-13T09:15:00",
					statusEstoque: "NORMAL"
				},
				{
					id: 6,
					codigo: "MP004",
					descricao: "FONTE DE ALIMENTACAO",
					referencia: "PWR-500W",
					unidade: "UN",
					categoria: "MATERIA_PRIMA",
					localizacao: "B2-030",
					saldoAtual: 0,
					estoqueMinimo: 10,
					estoqueMaximo: 50,
					custoMedio: 120.00,
					valorEstoque: 0.00,
					ultimaMovimentacao: "2025-01-12T16:45:00",
					statusEstoque: "ZERADO"
				},
				{
					id: 7,
					codigo: "3",
					descricao: "MONITOR USADO",
					unidade: "UN",
					categoria: "PRODUTOS",
					marca: "SAMSUNG",
					localizacao: "A1-010",
					saldoAtual: 35,
					estoqueMinimo: 5,
					estoqueMaximo: 40,
					custoMedio: 320.00,
					valorEstoque: 11200.00,
					ultimaMovimentacao: "2025-01-13T09:15:00",
					statusEstoque: "ALTO"
				}
			];

			let filteredItens = mockItens;

			// Filtro por busca
			if (searchItem) {
				filteredItens = filteredItens.filter(item => 
					item.descricao.toLowerCase().includes(searchItem.toLowerCase()) ||
					item.codigo.includes(searchItem) ||
					item.referencia?.toLowerCase().includes(searchItem.toLowerCase()) ||
					item.marca?.toLowerCase().includes(searchItem.toLowerCase())
				);
			}

			// Filtro por categoria
			if (categoriaFiltro !== "todas") {
				filteredItens = filteredItens.filter(item => item.categoria === categoriaFiltro);
			}

			// Filtro por status
			if (statusFiltro !== "todos") {
				filteredItens = filteredItens.filter(item => item.statusEstoque === statusFiltro);
			}

			return { itens: filteredItens };
		},
		staleTime: 1000 * 60 * 5,
	});

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(valor);
	};

	const getStatusColor = (status: string) => {
		switch(status) {
			case "CRITICO": return "bg-red-100 text-red-800";
			case "BAIXO": return "bg-yellow-100 text-yellow-800";
			case "NORMAL": return "bg-green-100 text-green-800";
			case "ALTO": return "bg-blue-100 text-blue-800";
			case "ZERADO": return "bg-gray-100 text-gray-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch(status) {
			case "CRITICO": return <AlertTriangle className="h-3 w-3" />;
			case "BAIXO": return <TrendingDown className="h-3 w-3" />;
			case "NORMAL": return <CheckCircle className="h-3 w-3" />;
			case "ALTO": return <TrendingUp className="h-3 w-3" />;
			case "ZERADO": return <Minus className="h-3 w-3" />;
			default: return <Minus className="h-3 w-3" />;
		}
	};

	const getCategoriaColor = (categoria: string) => {
		switch(categoria) {
			case "PRODUTOS": return "bg-blue-100 text-blue-800";
			case "MATERIA_PRIMA": return "bg-purple-100 text-purple-800";
			case "ACESSORIOS": return "bg-green-100 text-green-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	// Calcular resumo
	const resumo = estoqueResponse?.itens ? {
		totalItens: estoqueResponse.itens.length,
		valorTotalEstoque: estoqueResponse.itens.reduce((acc, item) => acc + item.valorEstoque, 0),
		itensCriticos: estoqueResponse.itens.filter(item => item.statusEstoque === "CRITICO").length,
		itensZerados: estoqueResponse.itens.filter(item => item.statusEstoque === "ZERADO").length,
		itensBaixos: estoqueResponse.itens.filter(item => item.statusEstoque === "BAIXO").length,
	} : {
		totalItens: 0,
		valorTotalEstoque: 0,
		itensCriticos: 0,
		itensZerados: 0,
		itensBaixos: 0,
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button variant="default">
						<RefreshCw className="h-4 w-4 mr-2" />
						Atualizar
					</Button>
					<Button variant="outline">
						<Download className="h-4 w-4 mr-2" />
						Exportar
					</Button>
					<Button variant="outline">
						<BarChart3 className="h-4 w-4 mr-2" />
						Relatórios
					</Button>
					<Button variant="ghost">
						<Eye className="h-4 w-4 mr-2" />
						Inventário
					</Button>
				</div>

				<div className="flex items-center gap-3">
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						{resumo.totalItens} itens
					</Badge>
					<Badge variant="outline" className="bg-green-50 text-green-700">
						{formatarMoeda(resumo.valorTotalEstoque)}
					</Badge>
				</div>
			</header>

			{/* Resumo de Status */}
			<div className="p-4 bg-white border-b border-gray-200">
				<div className="grid grid-cols-5 gap-4">
					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
								<Package className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Total de Itens</p>
								<p className="text-lg font-semibold">{resumo.totalItens}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="h-4 w-4 text-red-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Críticos</p>
								<p className="text-lg font-semibold text-red-600">{resumo.itensCriticos}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<Minus className="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Zerados</p>
								<p className="text-lg font-semibold text-gray-600">{resumo.itensZerados}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
								<TrendingDown className="h-4 w-4 text-yellow-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Baixos</p>
								<p className="text-lg font-semibold text-yellow-600">{resumo.itensBaixos}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
								<BarChart3 className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Valor Total</p>
								<p className="text-sm font-semibold text-green-600">{formatarMoeda(resumo.valorTotalEstoque)}</p>
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* Filtros */}
			<div className="p-4 flex gap-3 bg-white border-b border-gray-200">
				<SearchInput
					placeholder="Buscar por código, descrição, referência ou marca..."
					value={searchItem}
					onChange={(e) => setSearchItem(e.target.value)}
					className="flex-1"
				/>
				
				<Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
					<SelectTrigger className="w-48">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="todas">Todas Categorias</SelectItem>
						<SelectItem value="PRODUTOS">Produtos</SelectItem>
						<SelectItem value="MATERIA_PRIMA">Matéria Prima</SelectItem>
						<SelectItem value="ACESSORIOS">Acessórios</SelectItem>
					</SelectContent>
				</Select>

				<Select value={statusFiltro} onValueChange={setStatusFiltro}>
					<SelectTrigger className="w-48">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="todos">Todos os Status</SelectItem>
						<SelectItem value="CRITICO">Críticos</SelectItem>
						<SelectItem value="BAIXO">Baixos</SelectItem>
						<SelectItem value="NORMAL">Normais</SelectItem>
						<SelectItem value="ALTO">Altos</SelectItem>
						<SelectItem value="ZERADO">Zerados</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Tabela de Estoque */}
			<div className="flex-1 overflow-auto bg-white">
				<Table>
					<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
						<TableRow>
							<TableHead className="w-20">Código</TableHead>
							<TableHead className="w-60">Descrição</TableHead>
							<TableHead className="w-32">Categoria</TableHead>
							<TableHead className="w-24">Localização</TableHead>
							<TableHead className="w-20">Saldo</TableHead>
							<TableHead className="w-20">Min/Max</TableHead>
							<TableHead className="w-28">Custo Médio</TableHead>
							<TableHead className="w-28">Valor Total</TableHead>
							<TableHead className="w-24">Status</TableHead>
							<TableHead className="w-24">Última Mov.</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isFetchingEstoque ? (
							<TableRow>
								<TableCell colSpan={10} className="text-center py-12">
									<div className="flex items-center justify-center gap-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
										Carregando estoque...
									</div>
								</TableCell>
							</TableRow>
						) : !estoqueResponse?.itens || estoqueResponse.itens.length === 0 ? (
							<TableRow>
								<TableCell colSpan={10} className="text-center py-12 text-gray-500">
									<div className="flex flex-col items-center gap-2">
										<Package className="h-8 w-8 text-gray-300" />
										<p>Nenhum item encontrado</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							estoqueResponse.itens.map((item) => (
								<TableRow key={item.id} className="hover:bg-gray-50">
									<TableCell className="font-medium text-xs">{item.codigo}</TableCell>
									<TableCell className="text-xs">
										<div>
											<p className="font-medium">{item.descricao}</p>
											{item.referencia && <p className="text-gray-500">Ref: {item.referencia}</p>}
											{item.marca && <p className="text-gray-500">{item.marca}</p>}
										</div>
									</TableCell>
									<TableCell>
										<Badge className={`text-xs ${getCategoriaColor(item.categoria)}`}>
											{item.categoria.replace("_", " ")}
										</Badge>
									</TableCell>
									<TableCell className="text-xs">{item.localizacao}</TableCell>
									<TableCell className={`font-medium text-xs ${item.saldoAtual < 0 ? 'text-red-600' : item.saldoAtual === 0 ? 'text-gray-600' : 'text-green-600'}`}>
										{item.saldoAtual} {item.unidade}
									</TableCell>
									<TableCell className="text-xs">
										{item.estoqueMinimo}/{item.estoqueMaximo}
									</TableCell>
									<TableCell className="font-medium text-xs">{formatarMoeda(item.custoMedio)}</TableCell>
									<TableCell className={`font-medium text-xs ${item.valorEstoque < 0 ? 'text-red-600' : 'text-green-600'}`}>
										{formatarMoeda(item.valorEstoque)}
									</TableCell>
									<TableCell>
										<Badge className={`text-xs flex items-center gap-1 ${getStatusColor(item.statusEstoque)}`}>
											{getStatusIcon(item.statusEstoque)}
											{item.statusEstoque}
										</Badge>
									</TableCell>
									<TableCell className="text-xs">
										{item.ultimaMovimentacao 
											? format(new Date(item.ultimaMovimentacao), "dd/MM/yy", { locale: ptBR })
											: "-"
										}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</section>
	);
} 