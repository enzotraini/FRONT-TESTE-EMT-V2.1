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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { 
	Plus, 
	Search, 
	CreditCard, 
	Calendar,
	DollarSign,
	AlertTriangle,
	CheckCircle,
	Clock,
	FileText,
	User,
	Building,
	Download,
	Filter,
	BarChart3,
	Receipt,
	Banknote,
	CalendarDays,
	Eye,
	Truck,
	Factory
} from "lucide-react";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const contaPagarSchema = z.object({
	fornecedorId: z.number().min(1, "Fornecedor é obrigatório"),
	numeroTitulo: z.string().min(1, "Número do título é obrigatório"),
	dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
	dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
	valorTitulo: z.number().min(0.01, "Valor deve ser maior que zero"),
	valorDesconto: z.number().min(0).optional(),
	valorJuros: z.number().min(0).optional(),
	numeroParcelas: z.number().min(1).default(1),
	contaContabil: z.string().optional(),
	codigoBarra: z.string().optional(),
	observacoes: z.string().optional(),
	observacoesFornecedor: z.string().optional(),
	bancoId: z.number().optional(),
	numeroCheque: z.string().optional(),
	valorCheque: z.number().min(0).optional(),
	recebeu: z.boolean().default(false),
});

interface ContaPagar {
	id: number;
	numeroTitulo: string;
	dataEmissao: string;
	fornecedor: {
		id: number;
		nome: string;
		codigo: string;
	};
	dataVencimento: string;
	dataPagamento?: string;
	valorTitulo: number;
	valorDesconto: number;
	valorJuros: number;
	valorPago?: number;
	saldoDevedor: number;
	situacao: "EM_ABERTO" | "PAGO" | "VENCIDO" | "PARCIAL" | "CANCELADO";
	diasVencimento: number;
	contaContabil?: string;
	codigoBarra?: string;
	banco?: {
		id: number;
		nome: string;
	};
	observacoes?: string;
	observacoesFornecedor?: string;
	numeroCheque?: string;
	valorCheque?: number;
	numeroParcelas: number;
	parcelaAtual?: number;
}

interface Fornecedor {
	id: number;
	codigo: string;
	nome: string;
}

interface Banco {
	id: number;
	nome: string;
}

export function ContasPagar() {
	const [contaSelecionada, setContaSelecionada] = useState<ContaPagar | null>(null);
	const [searchConta, setSearchConta] = useState("");
	const [situacaoFiltro, setSituacaoFiltro] = useState("todas");
	const [showFormulario, setShowFormulario] = useState(false);

	const form = useForm<z.infer<typeof contaPagarSchema>>({
		resolver: zodResolver(contaPagarSchema),
		defaultValues: {
			fornecedorId: 0,
			numeroTitulo: "",
			dataEmissao: format(new Date(), "yyyy-MM-dd"),
			dataVencimento: format(addDays(new Date(), 30), "yyyy-MM-dd"),
			valorTitulo: 0,
			valorDesconto: 0,
			valorJuros: 0,
			numeroParcelas: 1,
			contaContabil: "",
			codigoBarra: "",
			observacoes: "",
			observacoesFornecedor: "",
			bancoId: 0,
			numeroCheque: "",
			valorCheque: 0,
			recebeu: false,
		},
	});

	// Mock data - Contas a Pagar
	const { data: contasResponse, isFetching: isFetchingContas } = useQuery({
		queryKey: ["contas-pagar", searchConta, situacaoFiltro],
		queryFn: async () => {
			await new Promise(resolve => setTimeout(resolve, 800));
			
			const mockContas: ContaPagar[] = [
				{
					id: 1,
					numeroTitulo: "001/2025",
					dataEmissao: "2025-01-15",
					fornecedor: { id: 1, nome: "TECH SOLUTIONS LTDA", codigo: "001" },
					dataVencimento: "2025-02-15",
					valorTitulo: 2500.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 2500.00,
					situacao: "EM_ABERTO",
					diasVencimento: 25,
					contaContabil: "2.1.001",
					numeroParcelas: 1
				},
				{
					id: 2,
					numeroTitulo: "002/2025",
					dataEmissao: "2025-01-20",
					fornecedor: { id: 2, nome: "FORNECEDOR ABC LTDA", codigo: "002" },
					dataVencimento: "2025-01-10",
					valorTitulo: 1800.00,
					valorDesconto: 0,
					valorJuros: 75.00,
					saldoDevedor: 1875.00,
					situacao: "VENCIDO",
					diasVencimento: -11,
					contaContabil: "2.1.002",
					numeroParcelas: 1
				},
				{
					id: 3,
					numeroTitulo: "003/2025",
					dataEmissao: "2025-01-12",
					fornecedor: { id: 3, nome: "MATERIAL CONSTRUCCION S.A", codigo: "003" },
					dataVencimento: "2025-01-12",
					valorTitulo: 950.00,
					valorDesconto: 50.00,
					valorJuros: 0,
					saldoDevedor: 0,
					situacao: "PAGO",
					diasVencimento: 0,
					dataPagamento: "2025-01-12",
					valorPago: 900.00,
					contaContabil: "2.1.003",
					numeroParcelas: 1
				},
				{
					id: 4,
					numeroTitulo: "004/2025-1",
					dataEmissao: "2025-01-25",
					fornecedor: { id: 4, nome: "EQUIPAMENTOS INDUSTRIAIS LTDA", codigo: "004" },
					dataVencimento: "2025-02-25",
					valorTitulo: 4200.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 2800.00,
					situacao: "PARCIAL",
					diasVencimento: 30,
					valorPago: 1400.00,
					contaContabil: "2.1.004",
					numeroParcelas: 3,
					parcelaAtual: 1
				},
				{
					id: 5,
					numeroTitulo: "005/2025",
					dataEmissao: "2025-01-30",
					fornecedor: { id: 5, nome: "SERVIÇOS GERAIS LTDA", codigo: "005" },
					dataVencimento: "2025-01-31",
					valorTitulo: 320.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 320.00,
					situacao: "EM_ABERTO",
					diasVencimento: 0,
					contaContabil: "2.1.005",
					numeroParcelas: 1,
					codigoBarra: "34191790010000032000001234567890123456789"
				}
			];

			// Calcular dias de vencimento para cada conta
			const contasCalculadas = mockContas.map(conta => {
				const hoje = new Date();
				const vencimento = parseISO(conta.dataVencimento);
				const diasVencimento = differenceInDays(vencimento, hoje);
				
				let situacao = conta.situacao;
				if (conta.situacao === "EM_ABERTO" && diasVencimento < 0) {
					situacao = "VENCIDO";
				}

				return {
					...conta,
					diasVencimento,
					situacao
				};
			});

			let filteredContas = contasCalculadas;

			if (searchConta) {
				filteredContas = filteredContas.filter(conta => 
					conta.numeroTitulo.toLowerCase().includes(searchConta.toLowerCase()) ||
					conta.fornecedor.nome.toLowerCase().includes(searchConta.toLowerCase()) ||
					conta.fornecedor.codigo.includes(searchConta) ||
					conta.contaContabil?.includes(searchConta)
				);
			}

			if (situacaoFiltro !== "todas") {
				filteredContas = filteredContas.filter(conta => conta.situacao === situacaoFiltro);
			}

			return { contas: filteredContas };
		},
		staleTime: 1000 * 60 * 5,
	});

	// Mock data - Fornecedores
	const { data: fornecedoresResponse } = useQuery({
		queryKey: ["fornecedores-select"],
		queryFn: async () => {
			const mockFornecedores: Fornecedor[] = [
				{ id: 1, codigo: "001", nome: "TECH SOLUTIONS LTDA" },
				{ id: 2, codigo: "002", nome: "FORNECEDOR ABC LTDA" },
				{ id: 3, codigo: "003", nome: "MATERIAL CONSTRUCCION S.A" },
				{ id: 4, codigo: "004", nome: "EQUIPAMENTOS INDUSTRIAIS LTDA" },
				{ id: 5, codigo: "005", nome: "SERVIÇOS GERAIS LTDA" },
			];
			return { fornecedores: mockFornecedores };
		},
	});

	const handleSubmitConta = async (values: z.infer<typeof contaPagarSchema>) => {
		console.log("Nova conta a pagar:", values);
		setShowFormulario(false);
		form.reset();
	};

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(valor);
	};

	const getSituacaoColor = (situacao: string) => {
		switch(situacao) {
			case "PAGO": return "bg-green-100 text-green-800";
			case "EM_ABERTO": return "bg-blue-100 text-blue-800";
			case "VENCIDO": return "bg-red-100 text-red-800";
			case "PARCIAL": return "bg-yellow-100 text-yellow-800";
			case "CANCELADO": return "bg-gray-100 text-gray-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getSituacaoIcon = (situacao: string) => {
		switch(situacao) {
			case "PAGO": return <CheckCircle className="h-3 w-3" />;
			case "EM_ABERTO": return <Clock className="h-3 w-3" />;
			case "VENCIDO": return <AlertTriangle className="h-3 w-3" />;
			case "PARCIAL": return <BarChart3 className="h-3 w-3" />;
			case "CANCELADO": return <FileText className="h-3 w-3" />;
			default: return <FileText className="h-3 w-3" />;
		}
	};

	const getVencimentoColor = (dias: number, situacao: string) => {
		if (situacao === "PAGO") return "text-gray-600";
		if (dias < 0) return "text-red-600 font-medium";
		if (dias <= 7) return "text-yellow-600 font-medium";
		return "text-green-600";
	};

	// Calcular resumo
	const resumo = contasResponse?.contas ? {
		totalContas: contasResponse.contas.length,
		valorTotal: contasResponse.contas.reduce((acc, conta) => acc + conta.saldoDevedor, 0),
		contasVencidas: contasResponse.contas.filter(conta => conta.situacao === "VENCIDO").length,
		valorVencido: contasResponse.contas.filter(conta => conta.situacao === "VENCIDO").reduce((acc, conta) => acc + conta.saldoDevedor, 0),
		contasPagas: contasResponse.contas.filter(conta => conta.situacao === "PAGO").length,
		valorPago: contasResponse.contas.filter(conta => conta.situacao === "PAGO").reduce((acc, conta) => acc + (conta.valorPago || 0), 0),
	} : {
		totalContas: 0,
		valorTotal: 0,
		contasVencidas: 0,
		valorVencido: 0,
		contasPagas: 0,
		valorPago: 0,
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button 
						variant="default"
						onClick={() => setShowFormulario(true)}
					>
						<Plus className="h-4 w-4 mr-2" />
						Incluir Título
					</Button>
					<Button variant="destructive" disabled={!contaSelecionada}>
						<DollarSign className="h-4 w-4 mr-2" />
						Pagar
					</Button>
					<Button variant="outline" disabled={!contaSelecionada}>
						<Calendar className="h-4 w-4 mr-2" />
						Prorrogar
					</Button>
					<Button variant="outline">
						<Download className="h-4 w-4 mr-2" />
						Relatórios
					</Button>
					<Button variant="ghost">
						<BarChart3 className="h-4 w-4 mr-2" />
						Dashboard
					</Button>
				</div>

				<div className="flex items-center gap-3">
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						{resumo.totalContas} títulos
					</Badge>
					<Badge variant="outline" className="bg-red-50 text-red-700">
						{formatarMoeda(resumo.valorTotal)}
					</Badge>
				</div>
			</header>

			{/* Resumo Financeiro */}
			<div className="p-4 bg-white border-b border-gray-200">
				<div className="grid grid-cols-4 gap-4">
					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
								<CreditCard className="h-4 w-4 text-red-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Total a Pagar</p>
								<p className="text-lg font-semibold text-red-600">{formatarMoeda(resumo.valorTotal)}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="h-4 w-4 text-red-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Vencidas ({resumo.contasVencidas})</p>
								<p className="text-lg font-semibold text-red-600">{formatarMoeda(resumo.valorVencido)}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Pagas ({resumo.contasPagas})</p>
								<p className="text-lg font-semibold text-green-600">{formatarMoeda(resumo.valorPago)}</p>
							</div>
						</div>
					</Card>

					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
								<Factory className="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Total de Títulos</p>
								<p className="text-lg font-semibold text-gray-600">{resumo.totalContas}</p>
							</div>
						</div>
					</Card>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* Lista de Contas */}
				<div className="w-2/3 flex flex-col bg-white border-r border-gray-200">
					{/* Filtros */}
					<div className="p-3 flex gap-3 bg-white border-b border-gray-200">
						<SearchInput
							placeholder="Buscar por título, fornecedor, conta contábil..."
							value={searchConta}
							onChange={(e) => setSearchConta(e.target.value)}
							className="flex-1"
						/>
						
						<Select value={situacaoFiltro} onValueChange={setSituacaoFiltro}>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="todas">Todas as Situações</SelectItem>
								<SelectItem value="EM_ABERTO">Em Aberto</SelectItem>
								<SelectItem value="VENCIDO">Vencidas</SelectItem>
								<SelectItem value="PAGO">Pagas</SelectItem>
								<SelectItem value="PARCIAL">Parciais</SelectItem>
								<SelectItem value="CANCELADO">Canceladas</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Tabela de Contas */}
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
								<TableRow>
									<TableHead className="w-28">Título</TableHead>
									<TableHead className="w-60">Fornecedor</TableHead>
									<TableHead className="w-24">Vencimento</TableHead>
									<TableHead className="w-28">Valor</TableHead>
									<TableHead className="w-28">Saldo</TableHead>
									<TableHead className="w-24">Situação</TableHead>
									<TableHead className="w-20">Dias</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isFetchingContas ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-12">
											<div className="flex items-center justify-center gap-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
												Carregando títulos...
											</div>
										</TableCell>
									</TableRow>
								) : !contasResponse?.contas || contasResponse.contas.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-12 text-gray-500">
											<div className="flex flex-col items-center gap-2">
												<Factory className="h-8 w-8 text-gray-300" />
												<p>Nenhum título encontrado</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									contasResponse.contas.map((conta) => (
										<TableRow 
											key={conta.id} 
											className={`hover:bg-gray-50 cursor-pointer ${
												contaSelecionada?.id === conta.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
											}`}
											onClick={() => setContaSelecionada(conta)}
										>
											<TableCell className="font-medium text-xs">
												<div>
													<p>{conta.numeroTitulo}</p>
													{conta.numeroParcelas > 1 && (
														<p className="text-gray-500">{conta.parcelaAtual || 1}/{conta.numeroParcelas}</p>
													)}
												</div>
											</TableCell>
											<TableCell className="text-xs">
												<div>
													<p className="font-medium">{conta.fornecedor.nome}</p>
													<p className="text-gray-500">Cód: {conta.fornecedor.codigo}</p>
												</div>
											</TableCell>
											<TableCell className="text-xs">
												{format(parseISO(conta.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
											</TableCell>
											<TableCell className="font-medium text-xs">{formatarMoeda(conta.valorTitulo)}</TableCell>
											<TableCell className={`font-medium text-xs ${conta.saldoDevedor > 0 ? 'text-red-600' : 'text-gray-600'}`}>
												{formatarMoeda(conta.saldoDevedor)}
											</TableCell>
											<TableCell>
												<Badge className={`text-xs flex items-center gap-1 ${getSituacaoColor(conta.situacao)}`}>
													{getSituacaoIcon(conta.situacao)}
													{conta.situacao.replace("_", " ")}
												</Badge>
											</TableCell>
											<TableCell className={`text-xs ${getVencimentoColor(conta.diasVencimento, conta.situacao)}`}>
												{conta.situacao === "PAGO" ? "-" : 
													conta.diasVencimento === 0 ? "Hoje" :
													conta.diasVencimento > 0 ? `+${conta.diasVencimento}` : conta.diasVencimento
												}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* Detalhes da Conta */}
				<div className="w-1/3 flex flex-col bg-white">
					{contaSelecionada ? (
						<>
							<div className="p-4 border-b border-gray-200 bg-gray-50">
								<div className="flex items-start justify-between mb-3">
									<div>
										<h2 className="text-lg font-semibold text-gray-900">
											Título {contaSelecionada.numeroTitulo}
										</h2>
										<p className="text-gray-600">{contaSelecionada.fornecedor.nome}</p>
									</div>
									<Badge className={`${getSituacaoColor(contaSelecionada.situacao)}`}>
										{getSituacaoIcon(contaSelecionada.situacao)}
										{contaSelecionada.situacao.replace("_", " ")}
									</Badge>
								</div>

								<div className="grid grid-cols-2 gap-3 text-sm">
									<div>
										<span className="text-gray-500">Valor do Título:</span>
										<p className="font-medium text-lg">{formatarMoeda(contaSelecionada.valorTitulo)}</p>
									</div>
									<div>
										<span className="text-gray-500">Saldo Devedor:</span>
										<p className={`font-medium text-lg ${contaSelecionada.saldoDevedor > 0 ? 'text-red-600' : 'text-green-600'}`}>
											{formatarMoeda(contaSelecionada.saldoDevedor)}
										</p>
									</div>
								</div>
							</div>

							<div className="p-4 space-y-4">
								<Card className="p-3">
									<h3 className="font-medium text-sm mb-3 flex items-center gap-2">
										<CalendarDays className="h-4 w-4" />
										Datas
									</h3>
									<div className="space-y-2 text-xs">
										<div className="flex justify-between">
											<span className="text-gray-500">Emissão:</span>
											<span>{format(parseISO(contaSelecionada.dataEmissao), "dd/MM/yyyy", { locale: ptBR })}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-500">Vencimento:</span>
											<span className={getVencimentoColor(contaSelecionada.diasVencimento, contaSelecionada.situacao)}>
												{format(parseISO(contaSelecionada.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
											</span>
										</div>
										{contaSelecionada.dataPagamento && (
											<div className="flex justify-between">
												<span className="text-gray-500">Pagamento:</span>
												<span className="text-green-600">
													{format(parseISO(contaSelecionada.dataPagamento), "dd/MM/yyyy", { locale: ptBR })}
												</span>
											</div>
										)}
									</div>
								</Card>

								<Card className="p-3">
									<h3 className="font-medium text-sm mb-3 flex items-center gap-2">
										<Banknote className="h-4 w-4" />
										Valores
									</h3>
									<div className="space-y-2 text-xs">
										<div className="flex justify-between">
											<span className="text-gray-500">Valor Principal:</span>
											<span>{formatarMoeda(contaSelecionada.valorTitulo)}</span>
										</div>
										{contaSelecionada.valorDesconto > 0 && (
											<div className="flex justify-between">
												<span className="text-gray-500">Desconto:</span>
												<span className="text-green-600">-{formatarMoeda(contaSelecionada.valorDesconto)}</span>
											</div>
										)}
										{contaSelecionada.valorJuros > 0 && (
											<div className="flex justify-between">
												<span className="text-gray-500">Juros:</span>
												<span className="text-red-600">+{formatarMoeda(contaSelecionada.valorJuros)}</span>
											</div>
										)}
										{contaSelecionada.valorPago && (
											<div className="flex justify-between">
												<span className="text-gray-500">Valor Pago:</span>
												<span className="text-green-600">{formatarMoeda(contaSelecionada.valorPago)}</span>
											</div>
										)}
									</div>
								</Card>

								<Card className="p-3">
									<h3 className="font-medium text-sm mb-3 flex items-center gap-2">
										<FileText className="h-4 w-4" />
										Informações
									</h3>
									<div className="space-y-2 text-xs">
										{contaSelecionada.contaContabil && (
											<div className="flex justify-between">
												<span className="text-gray-500">Conta Contábil:</span>
												<span>{contaSelecionada.contaContabil}</span>
											</div>
										)}
										{contaSelecionada.numeroParcelas > 1 && (
											<div className="flex justify-between">
												<span className="text-gray-500">Parcelas:</span>
												<span>{contaSelecionada.parcelaAtual || 1}/{contaSelecionada.numeroParcelas}</span>
											</div>
										)}
										{contaSelecionada.numeroCheque && (
											<div className="flex justify-between">
												<span className="text-gray-500">Nº Cheque:</span>
												<span>{contaSelecionada.numeroCheque}</span>
											</div>
										)}
									</div>
								</Card>

								{contaSelecionada.codigoBarra && (
									<Card className="p-3">
										<h3 className="font-medium text-sm mb-2 flex items-center gap-2">
											<Receipt className="h-4 w-4" />
											Código de Barras
										</h3>
										<p className="text-xs font-mono text-gray-600 break-all">
											{contaSelecionada.codigoBarra}
										</p>
									</Card>
								)}

								{contaSelecionada.banco && (
									<Card className="p-3">
										<h3 className="font-medium text-sm mb-3 flex items-center gap-2">
											<Building className="h-4 w-4" />
											Banco
										</h3>
										<p className="text-xs">{contaSelecionada.banco.nome}</p>
									</Card>
								)}

								{(contaSelecionada.observacoes || contaSelecionada.observacoesFornecedor) && (
									<Card className="p-3">
										<h3 className="font-medium text-sm mb-2">Observações</h3>
										{contaSelecionada.observacoes && (
											<p className="text-xs text-gray-600 mb-2">{contaSelecionada.observacoes}</p>
										)}
										{contaSelecionada.observacoesFornecedor && (
											<div>
												<p className="text-xs font-medium text-gray-700">Fornecedor:</p>
												<p className="text-xs text-gray-600">{contaSelecionada.observacoesFornecedor}</p>
											</div>
										)}
									</Card>
								)}
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							<div className="text-center">
								<Factory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione um título</h3>
								<p className="text-sm text-gray-400">Escolha um título da lista para ver os detalhes</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Modal de Novo Título */}
			{showFormulario && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Factory className="h-5 w-5" />
								Incluir Título a Pagar
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleSubmitConta)} className="space-y-6">
									{/* Fornecedor e Título */}
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="fornecedorId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Fornecedor *</FormLabel>
													<Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Selecione o fornecedor" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{fornecedoresResponse?.fornecedores?.map(fornecedor => (
																<SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
																	{fornecedor.codigo} - {fornecedor.nome}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="numeroTitulo"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Número do Título *</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Ex: 001/2025" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Datas */}
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="dataEmissao"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Data Emissão *</FormLabel>
													<FormControl>
														<Input type="date" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="dataVencimento"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Data Vencimento *</FormLabel>
													<FormControl>
														<Input type="date" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Valores */}
									<div className="grid grid-cols-4 gap-4">
										<FormField
											control={form.control}
											name="valorTitulo"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Valor Título *</FormLabel>
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
											name="valorDesconto"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Valor Desconto</FormLabel>
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
											name="valorJuros"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Valor Juros</FormLabel>
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
											name="numeroParcelas"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nº Parcelas</FormLabel>
													<FormControl>
														<Input 
															type="number" 
															min="1"
															{...field}
															onChange={(e) => field.onChange(Number(e.target.value))}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Informações Contábeis */}
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="contaContabil"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Conta Contábil</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Ex: 2.1.001" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="codigoBarra"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Código de Barras</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Código de barras do boleto" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Informações Bancárias */}
									<div className="grid grid-cols-3 gap-4">
										<FormField
											control={form.control}
											name="numeroCheque"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nº Cheque</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Ex: 001234" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="valorCheque"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Valor Cheque</FormLabel>
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
											name="recebeu"
											render={({ field }) => (
												<FormItem className="flex items-center space-x-2 pt-8">
													<FormControl>
														<Checkbox 
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="text-sm">Recebeu</FormLabel>
												</FormItem>
											)}
										/>
									</div>

									{/* Observações */}
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="observacoes"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Observações</FormLabel>
													<FormControl>
														<Textarea {...field} placeholder="Observações sobre o título..." />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="observacoesFornecedor"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Observações do Fornecedor</FormLabel>
													<FormControl>
														<Textarea {...field} placeholder="Observações do fornecedor..." />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex gap-3 pt-4">
										<Button type="submit" className="flex-1">
											Gravar Título
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