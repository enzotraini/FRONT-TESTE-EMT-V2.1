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
	Eye
} from "lucide-react";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const contaReceberSchema = z.object({
	clienteId: z.number().min(1, "Cliente é obrigatório"),
	tipoDocumento: z.string().min(1, "Tipo de documento é obrigatório"),
	numeroNota: z.string().optional(),
	numeroSerie: z.string().optional(),
	numeroDuplicata: z.string().min(1, "Número da duplicata é obrigatório"),
	dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
	dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
	valorTitulo: z.number().min(0.01, "Valor deve ser maior que zero"),
	valorDesconto: z.number().min(0).optional(),
	valorJuros: z.number().min(0).optional(),
	despesasAdm: z.number().min(0).optional(),
	acrescimosAdm: z.number().min(0).optional(),
	vendedorId: z.number().optional(),
	bancoId: z.number().optional(),
	observacoes: z.string().optional(),
	emCartorio: z.boolean().default(false),
	protestado: z.boolean().default(false),
});

interface ContaReceber {
	id: number;
	numeroDuplicata: string;
	tipoDocumento: string;
	dataEmissao: string;
	cliente: {
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
	situacao: "EM_ABERTO" | "PAGO" | "VENCIDO" | "EM_CARTORIO" | "PROTESTADO";
	diasVencimento: number;
	vendedor?: {
		id: number;
		nome: string;
	};
	banco?: {
		id: number;
		nome: string;
	};
	observacoes?: string;
	numeroNota?: string;
	numeroSerie?: string;
}

interface Cliente {
	id: number;
	codigo: string;
	nome: string;
}

interface Vendedor {
	id: number;
	nome: string;
}

interface Banco {
	id: number;
	nome: string;
}

export function ContasReceber() {
	const [contaSelecionada, setContaSelecionada] = useState<ContaReceber | null>(null);
	const [searchConta, setSearchConta] = useState("");
	const [situacaoFiltro, setSituacaoFiltro] = useState("todas");
	const [showFormulario, setShowFormulario] = useState(false);

	const form = useForm<z.infer<typeof contaReceberSchema>>({
		resolver: zodResolver(contaReceberSchema),
		defaultValues: {
			clienteId: 0,
			tipoDocumento: "",
			numeroNota: "",
			numeroSerie: "",
			numeroDuplicata: "",
			dataEmissao: format(new Date(), "yyyy-MM-dd"),
			dataVencimento: format(addDays(new Date(), 30), "yyyy-MM-dd"),
			valorTitulo: 0,
			valorDesconto: 0,
			valorJuros: 0,
			despesasAdm: 0,
			acrescimosAdm: 0,
			vendedorId: 0,
			bancoId: 0,
			observacoes: "",
			emCartorio: false,
			protestado: false,
		},
	});

	// Mock data - Contas a Receber
	const { data: contasResponse, isFetching: isFetchingContas } = useQuery({
		queryKey: ["contas-receber", searchConta, situacaoFiltro],
		queryFn: async () => {
			await new Promise(resolve => setTimeout(resolve, 800));
			
			const mockContas: ContaReceber[] = [
				{
					id: 1,
					numeroDuplicata: "127-A",
					tipoDocumento: "DINHEIRO",
					dataEmissao: "2025-01-22",
					cliente: { id: 12, nome: "JUNIOR CESAR DE SOUZA", codigo: "12" },
					dataVencimento: "2025-01-22",
					valorTitulo: 4975.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 4975.00,
					situacao: "EM_ABERTO",
					diasVencimento: 0,
					numeroNota: "127",
					numeroSerie: "A"
				},
				{
					id: 2,
					numeroDuplicata: "128-A",
					tipoDocumento: "DINHEIRO",
					dataEmissao: "2025-01-23",
					cliente: { id: 13, nome: "D.W.A TECNOLOGIA ARP LTDA", codigo: "13" },
					dataVencimento: "2025-01-23",
					valorTitulo: 995.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 995.00,
					situacao: "EM_ABERTO",
					diasVencimento: 0
				},
				{
					id: 3,
					numeroDuplicata: "129-A",
					tipoDocumento: "DINHEIRO",
					dataEmissao: "2025-01-28",
					cliente: { id: 14, nome: "ISRAEL DO VALE BARROSO", codigo: "14" },
					dataVencimento: "2025-01-10",
					valorTitulo: 1590.00,
					valorDesconto: 0,
					valorJuros: 50.00,
					saldoDevedor: 1640.00,
					situacao: "VENCIDO",
					diasVencimento: -18
				},
				{
					id: 4,
					numeroDuplicata: "130-A",
					tipoDocumento: "DINHEIRO",
					dataEmissao: "2025-01-31",
					cliente: { id: 15, nome: "GABRIEL CORDERO TEIXEIRA", codigo: "15" },
					dataVencimento: "2025-01-31",
					valorTitulo: 1399.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 1399.00,
					situacao: "EM_ABERTO",
					diasVencimento: 0
				},
				{
					id: 5,
					numeroDuplicata: "131-A",
					tipoDocumento: "DINHEIRO",
					dataEmissao: "2025-01-04",
					cliente: { id: 9, nome: "PRONTO SOCORRO DOS MICROS LTDA", codigo: "9" },
					dataVencimento: "2025-01-04",
					valorTitulo: 1697.00,
					valorDesconto: 0,
					valorJuros: 0,
					saldoDevedor: 0,
					situacao: "PAGO",
					diasVencimento: 0,
					dataPagamento: "2025-01-04",
					valorPago: 1697.00
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
					conta.numeroDuplicata.toLowerCase().includes(searchConta.toLowerCase()) ||
					conta.cliente.nome.toLowerCase().includes(searchConta.toLowerCase()) ||
					conta.cliente.codigo.includes(searchConta) ||
					conta.numeroNota?.includes(searchConta)
				);
			}

			if (situacaoFiltro !== "todas") {
				filteredContas = filteredContas.filter(conta => conta.situacao === situacaoFiltro);
			}

			return { contas: filteredContas };
		},
		staleTime: 1000 * 60 * 5,
	});

	// Mock data - Clientes
	const { data: clientesResponse } = useQuery({
		queryKey: ["clientes-select"],
		queryFn: async () => {
			const mockClientes: Cliente[] = [
				{ id: 12, codigo: "12", nome: "JUNIOR CESAR DE SOUZA" },
				{ id: 13, codigo: "13", nome: "D.W.A TECNOLOGIA ARP LTDA" },
				{ id: 14, codigo: "14", nome: "ISRAEL DO VALE BARROSO" },
				{ id: 15, codigo: "15", nome: "GABRIEL CORDERO TEIXEIRA" },
			];
			return { clientes: mockClientes };
		},
	});

	const handleSubmitConta = async (values: z.infer<typeof contaReceberSchema>) => {
		console.log("Nova conta a receber:", values);
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
			case "EM_CARTORIO": return "bg-purple-100 text-purple-800";
			case "PROTESTADO": return "bg-orange-100 text-orange-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	const getSituacaoIcon = (situacao: string) => {
		switch(situacao) {
			case "PAGO": return <CheckCircle className="h-3 w-3" />;
			case "EM_ABERTO": return <Clock className="h-3 w-3" />;
			case "VENCIDO": return <AlertTriangle className="h-3 w-3" />;
			case "EM_CARTORIO": return <Building className="h-3 w-3" />;
			case "PROTESTADO": return <FileText className="h-3 w-3" />;
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
						Incluir Conta
					</Button>
					<Button variant="green" disabled={!contaSelecionada}>
						<DollarSign className="h-4 w-4 mr-2" />
						Receber
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
						{resumo.totalContas} contas
					</Badge>
					<Badge variant="outline" className="bg-green-50 text-green-700">
						{formatarMoeda(resumo.valorTotal)}
					</Badge>
				</div>
			</header>

			{/* Resumo Financeiro */}
			<div className="p-4 bg-white border-b border-gray-200">
				<div className="grid grid-cols-4 gap-4">
					<Card className="p-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
								<CreditCard className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Total a Receber</p>
								<p className="text-lg font-semibold text-blue-600">{formatarMoeda(resumo.valorTotal)}</p>
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
								<Receipt className="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<p className="text-xs text-gray-500">Total de Contas</p>
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
							placeholder="Buscar por duplicata, cliente, nota..."
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
								<SelectItem value="EM_CARTORIO">Em Cartório</SelectItem>
								<SelectItem value="PROTESTADO">Protestadas</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Tabela de Contas */}
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
								<TableRow>
									<TableHead className="w-24">Duplicata</TableHead>
									<TableHead className="w-60">Cliente</TableHead>
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
												Carregando contas...
											</div>
										</TableCell>
									</TableRow>
								) : !contasResponse?.contas || contasResponse.contas.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-12 text-gray-500">
											<div className="flex flex-col items-center gap-2">
												<CreditCard className="h-8 w-8 text-gray-300" />
												<p>Nenhuma conta encontrada</p>
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
											<TableCell className="font-medium text-xs">{conta.numeroDuplicata}</TableCell>
											<TableCell className="text-xs">
												<div>
													<p className="font-medium">{conta.cliente.nome}</p>
													<p className="text-gray-500">Cód: {conta.cliente.codigo}</p>
												</div>
											</TableCell>
											<TableCell className="text-xs">
												{format(parseISO(conta.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
											</TableCell>
											<TableCell className="font-medium text-xs">{formatarMoeda(conta.valorTitulo)}</TableCell>
											<TableCell className={`font-medium text-xs ${conta.saldoDevedor > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
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
											Duplicata {contaSelecionada.numeroDuplicata}
										</h2>
										<p className="text-gray-600">{contaSelecionada.cliente.nome}</p>
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
										Documento
									</h3>
									<div className="space-y-2 text-xs">
										<div className="flex justify-between">
											<span className="text-gray-500">Tipo:</span>
											<span>{contaSelecionada.tipoDocumento}</span>
										</div>
										{contaSelecionada.numeroNota && (
											<div className="flex justify-between">
												<span className="text-gray-500">Nota:</span>
												<span>{contaSelecionada.numeroNota}</span>
											</div>
										)}
										{contaSelecionada.numeroSerie && (
											<div className="flex justify-between">
												<span className="text-gray-500">Série:</span>
												<span>{contaSelecionada.numeroSerie}</span>
											</div>
										)}
									</div>
								</Card>

								{contaSelecionada.vendedor && (
									<Card className="p-3">
										<h3 className="font-medium text-sm mb-3 flex items-center gap-2">
											<User className="h-4 w-4" />
											Vendedor
										</h3>
										<p className="text-xs">{contaSelecionada.vendedor.nome}</p>
									</Card>
								)}

								{contaSelecionada.observacoes && (
									<Card className="p-3">
										<h3 className="font-medium text-sm mb-2">Observações</h3>
										<p className="text-xs text-gray-600">{contaSelecionada.observacoes}</p>
									</Card>
								)}
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							<div className="text-center">
								<CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione uma conta</h3>
								<p className="text-sm text-gray-400">Escolha uma conta da lista para ver os detalhes</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Modal de Nova Conta */}
			{showFormulario && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Incluir Conta a Receber
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleSubmitConta)} className="space-y-6">
									{/* Cliente e Documento */}
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="clienteId"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Cliente *</FormLabel>
													<Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Selecione o cliente" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{clientesResponse?.clientes?.map(cliente => (
																<SelectItem key={cliente.id} value={cliente.id.toString()}>
																	{cliente.codigo} - {cliente.nome}
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
											name="tipoDocumento"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Tipo Documento *</FormLabel>
													<Select onValueChange={field.onChange} value={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Selecione o tipo" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="DINHEIRO">Dinheiro</SelectItem>
															<SelectItem value="CHEQUE">Cheque</SelectItem>
															<SelectItem value="DUPLICATA">Duplicata</SelectItem>
															<SelectItem value="PROMISSORIA">Promissória</SelectItem>
															<SelectItem value="CARTAO">Cartão</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Números */}
									<div className="grid grid-cols-3 gap-4">
										<FormField
											control={form.control}
											name="numeroDuplicata"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nº Duplicata *</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Ex: 151-A" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="numeroNota"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nº Nota</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Ex: 151" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="numeroSerie"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Série</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Ex: A" />
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
									<div className="grid grid-cols-3 gap-4">
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
									</div>

									{/* Observações */}
									<FormField
										control={form.control}
										name="observacoes"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Observações</FormLabel>
												<FormControl>
													<Textarea {...field} placeholder="Observações sobre a conta..." />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Checkboxes */}
									<div className="flex gap-6">
										<FormField
											control={form.control}
											name="emCartorio"
											render={({ field }) => (
												<FormItem className="flex items-center space-x-2">
													<FormControl>
														<Checkbox 
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="text-sm">Em Cartório</FormLabel>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="protestado"
											render={({ field }) => (
												<FormItem className="flex items-center space-x-2">
													<FormControl>
														<Checkbox 
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="text-sm">Protestado</FormLabel>
												</FormItem>
											)}
										/>
									</div>

									<div className="flex gap-3 pt-4">
										<Button type="submit" className="flex-1">
											Gravar Conta
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