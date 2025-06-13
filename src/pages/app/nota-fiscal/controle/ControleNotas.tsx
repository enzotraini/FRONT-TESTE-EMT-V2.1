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
	FileText, 
	Users, 
	User, 
	Plus, 
	Edit, 
	Trash, 
	History,
	MoreHorizontal,
	ChevronDown,
	Receipt,
	DollarSign,
	Send,
	Printer,
	Mail,
	Download,
	Search,
	AlertCircle,
	CheckCircle,
	XCircle,
	Clock3
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotaFiscal {
	id: number;
	serie: string;
	numero: string;
	dtNota: string;
	cliente: string;
	codFiscal: string;
	totMercad: number;
	totalNota: number;
	status: string;
	statusNF: string;
	reciboEnvio?: string;
	protocoloNFe?: string;
	dtHoraProtocolo?: string;
	chave: string;
	nfRefer?: string;
	empresa: string;
	tipoNota: string;
}

export function ControleNotas() {
	const [notaSelecionada, setNotaSelecionada] = useState<NotaFiscal | null>(null);
	const [search, setSearch] = useState("");
	const [observacoes, setObservacoes] = useState("");
	const [page] = useState(1);
	const [perPage] = useState(15);

	// Mock data - substituir por API real
	const { data: notasResponse, isFetching, error } = useQuery({
		queryKey: ["notas-fiscais", page, perPage, search],
		queryFn: async () => {
			// Simular delay da API
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const mockNotas: NotaFiscal[] = [
				{
					id: 137,
					serie: "1",
					numero: "000137",
					dtNota: "2025-01-15T10:30:00",
					cliente: "RRO COMERCIO E SERVIÇOS DE INFORMATICA LTDA",
					codFiscal: "5.102",
					totMercad: 6000.00,
					totalNota: 6000.00,
					status: "A",
					statusNF: "Autorizada",
					reciboEnvio: "351017595824480",
					protocoloNFe: "135250739412169",
					dtHoraProtocolo: "2025-01-15T11:15:00",
					chave: "35250327926350001355001000001371845638042",
					empresa: "1",
					tipoNota: "Consumidor"
				},
				{
					id: 138,
					serie: "1", 
					numero: "000138",
					dtNota: "2025-01-14T14:15:00",
					cliente: "ASD COMERCIO E SERVIÇOS DE EQUIPAMENTOS ELETRONICOS LTDA",
					codFiscal: "5.102",
					totMercad: 575.00,
					totalNota: 575.00,
					status: "A",
					statusNF: "Transmitida",
					reciboEnvio: "351017344064288",
					protocoloNFe: "135250741753261",
					dtHoraProtocolo: "2025-01-14T14:32:00",
					chave: "35250327926350001355001000001381442359693",
					empresa: "1",
					tipoNota: "Consumidor"
				},
				{
					id: 139,
					serie: "1",
					numero: "000139", 
					dtNota: "2025-01-13T09:00:00",
					cliente: "TELL BETEL LTDA",
					codFiscal: "5.102",
					totMercad: 20250.00,
					totalNota: 20250.00,
					status: "A",
					statusNF: "Pendente",
					empresa: "1",
					tipoNota: "Consumidor"
				},
				{
					id: 140,
					serie: "1",
					numero: "000140",
					dtNota: "2025-01-12T16:45:00",
					cliente: "PONTO TECH INFORMATICA LTDA",
					codFiscal: "6.102",
					totMercad: 3300.00,
					totalNota: 3300.00,
					status: "C",
					statusNF: "Cancelada",
					empresa: "1",
					tipoNota: "Consumidor"
				}
			];

			const filteredNotas = search 
				? mockNotas.filter(n => 
					n.cliente.toLowerCase().includes(search.toLowerCase()) ||
					n.numero.includes(search) ||
					n.chave.includes(search)
				)
				: mockNotas;

			return { 
				notas: filteredNotas, 
				meta: { page, perPage, total: filteredNotas.length } 
			};
		},
		initialData: { notas: [], meta: { page, perPage, total: 0 } },
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	});

	const handleNotaClick = (nota: NotaFiscal) => {
		setNotaSelecionada(nota);
		setObservacoes("");
	};

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(valor);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'A': return 'text-green-700 bg-green-50';
			case 'C': return 'text-red-700 bg-red-50';
			case 'P': return 'text-yellow-700 bg-yellow-50';
			default: return 'text-gray-700 bg-gray-50';
		}
	};

	const getStatusNFColor = (statusNF: string) => {
		switch (statusNF) {
			case 'Autorizada': return 'text-green-700 bg-green-50';
			case 'Transmitida': return 'text-blue-700 bg-blue-50';
			case 'Pendente': return 'text-yellow-700 bg-yellow-50';
			case 'Cancelada': return 'text-red-700 bg-red-50';
			case 'Rejeitada': return 'text-orange-700 bg-orange-50';
			default: return 'text-gray-700 bg-gray-50';
		}
	};

	const getStatusIcon = (statusNF: string) => {
		switch (statusNF) {
			case 'Autorizada': return <CheckCircle className="h-3 w-3" />;
			case 'Transmitida': return <Send className="h-3 w-3" />;
			case 'Pendente': return <Clock3 className="h-3 w-3" />;
			case 'Cancelada': return <XCircle className="h-3 w-3" />;
			case 'Rejeitada': return <AlertCircle className="h-3 w-3" />;
			default: return <FileText className="h-3 w-3" />;
		}
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button variant="default">
						<Plus className="h-4 w-4 mr-2" />
						Nova NF
					</Button>
					<Button variant="green" disabled={!notaSelecionada}>
						<Edit className="h-4 w-4 mr-2" />
						Alterar
					</Button>
					<Button variant="ghost">
						<FileText className="h-4 w-4 mr-2" />
						Consultar
					</Button>
					<Button variant="destructive" disabled={!notaSelecionada}>
						<Trash className="h-4 w-4 mr-2" />
						Cancelar
					</Button>
					
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<MoreHorizontal className="h-4 w-4 mr-2" />
								Ações NFe
								<ChevronDown className="h-3 w-3 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem>
								<Send className="h-4 w-4 mr-2" />
								Transmitir NFe
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Printer className="h-4 w-4 mr-2" />
								Imprimir DANFE
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Mail className="h-4 w-4 mr-2" />
								Enviar Email
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Download className="h-4 w-4 mr-2" />
								Download XML
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Search className="h-4 w-4 mr-2" />
								Consultar Status
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<Receipt className="h-4 w-4 mr-2" />
								Relatórios
								<ChevronDown className="h-3 w-3 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem>
								<Calendar className="h-4 w-4 mr-2" />
								Por Período
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Users className="h-4 w-4 mr-2" />
								Por Cliente
							</DropdownMenuItem>
							<DropdownMenuItem>
								<DollarSign className="h-4 w-4 mr-2" />
								Por Valor
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Badge variant="outline" className="bg-blue-50 text-blue-700">
					{notasResponse?.notas?.length || 0} notas
				</Badge>
			</header>

			{/* Barra de Pesquisa */}
			<nav className="p-3 flex gap-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
				<SearchInput
					placeholder="Pesquisar por cliente, número ou chave..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-80"
				/>
				<Button variant="ghost" size="sm">Autorizadas</Button>
				<Button variant="ghost" size="sm">Pendentes</Button>
				<Button variant="ghost" size="sm">Canceladas</Button>
			</nav>

			<div className="flex flex-1 overflow-hidden">
				{/* Lista de Notas Fiscais */}
				<div className="w-2/3 flex flex-col bg-white border-r border-gray-200">
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
								<TableRow>
									<TableHead className="w-20">NF/Série</TableHead>
									<TableHead className="w-80">Cliente</TableHead>
									<TableHead className="w-32">Data</TableHead>
									<TableHead className="w-32">Total</TableHead>
									<TableHead className="w-24">Status</TableHead>
									<TableHead className="w-32">Status NFe</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isFetching ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12">
											<div className="flex items-center justify-center gap-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
												Carregando notas fiscais...
											</div>
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12 text-amber-600">
											⚠️ Erro ao carregar notas fiscais.
										</TableCell>
									</TableRow>
								) : !notasResponse?.notas || notasResponse.notas.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12 text-gray-500">
											<div className="flex flex-col items-center gap-2">
												<Receipt className="h-8 w-8 text-gray-300" />
												<p>Nenhuma nota fiscal encontrada</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									notasResponse.notas.map((nota) => (
										<TableRow
											key={nota.id}
											className={`cursor-pointer hover:bg-gray-50 transition-colors ${
												notaSelecionada?.id === nota.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
											}`}
											onClick={() => handleNotaClick(nota)}
										>
											<TableCell className="font-medium">{nota.numero}/{nota.serie}</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{nota.cliente}</p>
													<p className="text-sm text-gray-500">{nota.codFiscal}</p>
												</div>
											</TableCell>
											<TableCell>{format(new Date(nota.dtNota), "dd/MM/yy", { locale: ptBR })}</TableCell>
											<TableCell className="font-medium">{formatarMoeda(nota.totalNota)}</TableCell>
											<TableCell>
												<Badge variant="outline" className={`text-xs ${getStatusColor(nota.status)}`}>
													{nota.status === 'A' ? 'Ativa' : nota.status === 'C' ? 'Cancelada' : 'Pendente'}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className={`text-xs flex items-center gap-1 ${getStatusNFColor(nota.statusNF)}`}>
													{getStatusIcon(nota.statusNF)}
													{nota.statusNF}
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
					{notaSelecionada ? (
						<>
							{/* Header da Nota */}
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">NF {notaSelecionada.numero}/{notaSelecionada.serie}</h2>
										<p className="text-gray-600 mt-1">{notaSelecionada.cliente}</p>
									</div>
									<Badge variant="outline" className={`flex items-center gap-1 ${getStatusNFColor(notaSelecionada.statusNF)}`}>
										{getStatusIcon(notaSelecionada.statusNF)}
										{notaSelecionada.statusNF}
									</Badge>
								</div>
								
								{/* Info rápida */}
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-gray-500">Total:</span>
										<p className="font-medium text-lg">{formatarMoeda(notaSelecionada.totalNota)}</p>
									</div>
									<div>
										<span className="text-gray-500">Data:</span>
										<p className="font-medium">{format(new Date(notaSelecionada.dtNota), "dd/MM/yyyy", { locale: ptBR })}</p>
									</div>
								</div>
							</div>

							{/* Conteúdo */}
							<div className="flex-1 p-6 space-y-6 overflow-auto">
								{/* Informações da Nota */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base">Dados da Nota Fiscal</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 gap-3">
											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Número</label>
													<p className="text-sm mt-1">{notaSelecionada.numero}</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Série</label>
													<p className="text-sm mt-1">{notaSelecionada.serie}</p>
												</div>
											</div>

											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Código Fiscal</label>
												<p className="text-sm mt-1">{notaSelecionada.codFiscal}</p>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tot. Mercadoria</label>
													<p className="text-sm mt-1 font-medium">{formatarMoeda(notaSelecionada.totMercad)}</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Nota</label>
													<p className="text-sm mt-1 font-medium text-lg">{formatarMoeda(notaSelecionada.totalNota)}</p>
												</div>
											</div>

											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo da Nota</label>
												<p className="text-sm mt-1">{notaSelecionada.tipoNota}</p>
											</div>

											<Separator />

											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chave de Acesso</label>
												<p className="text-xs mt-1 font-mono bg-gray-50 p-2 rounded break-all">{notaSelecionada.chave}</p>
											</div>

											{notaSelecionada.reciboEnvio && (
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recibo Envio</label>
													<p className="text-sm mt-1 font-mono">{notaSelecionada.reciboEnvio}</p>
												</div>
											)}

											{notaSelecionada.protocoloNFe && (
												<div className="grid grid-cols-1 gap-3">
													<div>
														<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Protocolo NFe</label>
														<p className="text-sm mt-1 font-mono">{notaSelecionada.protocoloNFe}</p>
													</div>
													{notaSelecionada.dtHoraProtocolo && (
														<div>
															<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data/Hora Protocolo</label>
															<p className="text-sm mt-1">{format(new Date(notaSelecionada.dtHoraProtocolo), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
														</div>
													)}
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
											Observações
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Textarea
											placeholder="Digite observações sobre a nota fiscal..."
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
											Histórico da NFe
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
												<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
												<div className="flex-1">
													<p className="font-medium text-sm">Nota criada</p>
													<p className="text-xs text-gray-600 mt-1">Nota fiscal gerada no sistema</p>
													<span className="text-xs text-gray-500">{format(new Date(notaSelecionada.dtNota), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
												</div>
											</div>
											{notaSelecionada.reciboEnvio && (
												<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
													<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
													<div className="flex-1">
														<p className="font-medium text-sm">NFe transmitida</p>
														<p className="text-xs text-gray-600 mt-1">Enviada para SEFAZ</p>
														<span className="text-xs text-gray-500">Recibo: {notaSelecionada.reciboEnvio}</span>
													</div>
												</div>
											)}
											{notaSelecionada.protocoloNFe && (
												<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
													<div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
													<div className="flex-1">
														<p className="font-medium text-sm">NFe autorizada</p>
														<p className="text-xs text-gray-600 mt-1">Protocolo de autorização recebido</p>
														<span className="text-xs text-gray-500">{notaSelecionada.dtHoraProtocolo && format(new Date(notaSelecionada.dtHoraProtocolo), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
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
								<Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione uma nota fiscal</h3>
								<p className="text-sm text-gray-400">Clique em uma nota da lista para ver os detalhes</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
} 