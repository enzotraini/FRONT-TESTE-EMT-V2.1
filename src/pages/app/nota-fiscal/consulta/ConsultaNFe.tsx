import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
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
	Calendar, 
	Clock, 
	FileText, 
	Search, 
	RefreshCw, 
	Download, 
	Eye,
	Globe,
	CheckCircle,
	AlertCircle,
	XCircle,
	Clock3,
	Shield,
	Server,
	Activity,
	ExternalLink,
	Copy,
	Printer,
	Mail
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConsultaNFe {
	id: number;
	numero: string;
	serie: string;
	chave: string;
	cliente: string;
	dtEmissao: string;
	valor: number;
	statusSefaz: string;
	protocolo?: string;
	dtAutorizacao?: string;
	motivoRejeicao?: string;
	ultimaConsulta?: string;
}

export function ConsultaNFe() {
	const [consultaSelecionada, setConsultaSelecionada] = useState<ConsultaNFe | null>(null);
	const [tipoConsulta, setTipoConsulta] = useState("todas");
	const [search, setSearch] = useState("");
	const [chaveConsulta, setChaveConsulta] = useState("");
	const [page] = useState(1);
	const [perPage] = useState(15);

	// Mock data - substituir por API real
	const { data: consultasResponse, isFetching, error, refetch } = useQuery({
		queryKey: ["consulta-nfe", page, perPage, search, tipoConsulta],
		queryFn: async () => {
			// Simular delay da API
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const mockConsultas: ConsultaNFe[] = [
				{
					id: 137,
					numero: "000137",
					serie: "1",
					chave: "35250327926350001355001000001371845638042",
					cliente: "RRO COMERCIO E SERVIÇOS DE INFORMATICA LTDA",
					dtEmissao: "2025-01-15T10:30:00",
					valor: 6000.00,
					statusSefaz: "Autorizada",
					protocolo: "135250739412169",
					dtAutorizacao: "2025-01-15T11:15:00",
					ultimaConsulta: "2025-01-15T16:30:00"
				},
				{
					id: 138,
					numero: "000138",
					serie: "1",
					chave: "35250327926350001355001000001381442359693",
					cliente: "ASD COMERCIO E SERVIÇOS DE EQUIPAMENTOS ELETRONICOS LTDA",
					dtEmissao: "2025-01-14T14:15:00",
					valor: 575.00,
					statusSefaz: "Transmitida",
					ultimaConsulta: "2025-01-14T18:20:00"
				},
				{
					id: 139,
					numero: "000139",
					serie: "1",
					chave: "35250327926350001355001000001391962474581",
					cliente: "TELL BETEL LTDA",
					dtEmissao: "2025-01-13T09:00:00",
					valor: 20250.00,
					statusSefaz: "Rejeitada",
					motivoRejeicao: "Erro na chave de acesso",
					ultimaConsulta: "2025-01-13T09:15:00"
				},
				{
					id: 140,
					numero: "000140",
					serie: "1",
					chave: "35250327926350001355001000001403847592016",
					cliente: "PONTO TECH INFORMATICA LTDA",
					dtEmissao: "2025-01-12T16:45:00",
					valor: 3300.00,
					statusSefaz: "Cancelada",
					protocolo: "135250847392856",
					dtAutorizacao: "2025-01-12T17:15:00",
					ultimaConsulta: "2025-01-12T20:10:00"
				}
			];

			const filteredConsultas = mockConsultas.filter(c => {
				const matchSearch = !search || 
					c.cliente.toLowerCase().includes(search.toLowerCase()) ||
					c.numero.includes(search) ||
					c.chave.includes(search);

				const matchTipo = tipoConsulta === "todas" ||
					(tipoConsulta === "autorizadas" && c.statusSefaz === "Autorizada") ||
					(tipoConsulta === "pendentes" && c.statusSefaz === "Transmitida") ||
					(tipoConsulta === "rejeitadas" && c.statusSefaz === "Rejeitada") ||
					(tipoConsulta === "canceladas" && c.statusSefaz === "Cancelada");

				return matchSearch && matchTipo;
			});

			return { 
				consultas: filteredConsultas, 
				meta: { page, perPage, total: filteredConsultas.length } 
			};
		},
		initialData: { consultas: [], meta: { page, perPage, total: 0 } },
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 2, // Cache por 2 minutos
	});

	const handleConsultaClick = (consulta: ConsultaNFe) => {
		setConsultaSelecionada(consulta);
	};

	const consultarPorChave = async () => {
		if (!chaveConsulta || chaveConsulta.length !== 44) {
			return;
		}
		// Simular consulta individual
		console.log("Consultando chave:", chaveConsulta);
	};

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(valor);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Autorizada': return 'text-green-700 bg-green-50';
			case 'Transmitida': return 'text-blue-700 bg-blue-50';
			case 'Rejeitada': return 'text-red-700 bg-red-50';
			case 'Cancelada': return 'text-orange-700 bg-orange-50';
			default: return 'text-gray-700 bg-gray-50';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'Autorizada': return <CheckCircle className="h-3 w-3" />;
			case 'Transmitida': return <Clock3 className="h-3 w-3" />;
			case 'Rejeitada': return <XCircle className="h-3 w-3" />;
			case 'Cancelada': return <AlertCircle className="h-3 w-3" />;
			default: return <FileText className="h-3 w-3" />;
		}
	};

	const copiarChave = (chave: string) => {
		navigator.clipboard.writeText(chave);
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button 
						variant="default"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						<RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
						Atualizar Status
					</Button>
					<Button variant="green" disabled={!consultaSelecionada}>
						<Search className="h-4 w-4 mr-2" />
						Consultar SEFAZ
					</Button>
					<Button variant="ghost" disabled={!consultaSelecionada}>
						<Download className="h-4 w-4 mr-2" />
						Download XML
					</Button>
					<Button variant="outline" disabled={!consultaSelecionada}>
						<Printer className="h-4 w-4 mr-2" />
						Imprimir DANFE
					</Button>
					<Button variant="outline" disabled={!consultaSelecionada}>
						<Mail className="h-4 w-4 mr-2" />
						Enviar Email
					</Button>
				</div>

				<div className="flex items-center gap-3">
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						{consultasResponse?.consultas?.length || 0} NFe
					</Badge>
					<Badge variant="outline" className="bg-green-50 text-green-700">
						<Globe className="h-3 w-3 mr-1" />
						SEFAZ Online
					</Badge>
				</div>
			</header>

			{/* Barra de Pesquisa */}
			<nav className="p-4 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
				<div className="flex gap-3 mb-3">
					<SearchInput
						placeholder="Pesquisar por cliente, número ou chave..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-80"
					/>
					<Select value={tipoConsulta} onValueChange={setTipoConsulta}>
						<SelectTrigger className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todas">Todas as NFe</SelectItem>
							<SelectItem value="autorizadas">Autorizadas</SelectItem>
							<SelectItem value="pendentes">Pendentes</SelectItem>
							<SelectItem value="rejeitadas">Rejeitadas</SelectItem>
							<SelectItem value="canceladas">Canceladas</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Consulta por Chave */}
				<div className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
					<Shield className="h-4 w-4 text-gray-500" />
					<span className="text-sm font-medium text-gray-700 min-w-fit">Consulta individual:</span>
					<Input
						placeholder="Cole aqui a chave de acesso NFe (44 dígitos)..."
						value={chaveConsulta}
						onChange={(e) => setChaveConsulta(e.target.value)}
						className="font-mono text-xs"
						maxLength={44}
					/>
					<Button 
						size="sm" 
						onClick={consultarPorChave}
						disabled={!chaveConsulta || chaveConsulta.length !== 44}
					>
						<Search className="h-4 w-4 mr-1" />
						Consultar
					</Button>
				</div>
			</nav>

			<div className="flex flex-1 overflow-hidden">
				{/* Lista de NFe */}
				<div className="w-2/3 flex flex-col bg-white border-r border-gray-200">
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
								<TableRow>
									<TableHead className="w-20">NF/Série</TableHead>
									<TableHead className="w-80">Cliente</TableHead>
									<TableHead className="w-32">Data</TableHead>
									<TableHead className="w-32">Valor</TableHead>
									<TableHead className="w-32">Status SEFAZ</TableHead>
									<TableHead className="w-32">Última Consulta</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isFetching ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12">
											<div className="flex items-center justify-center gap-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
												Consultando status na SEFAZ...
											</div>
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12 text-amber-600">
											⚠️ Erro ao consultar NFe.
										</TableCell>
									</TableRow>
								) : !consultasResponse?.consultas || consultasResponse.consultas.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-12 text-gray-500">
											<div className="flex flex-col items-center gap-2">
												<Search className="h-8 w-8 text-gray-300" />
												<p>Nenhuma NFe encontrada</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									consultasResponse.consultas.map((consulta) => (
										<TableRow
											key={consulta.id}
											className={`cursor-pointer hover:bg-gray-50 transition-colors ${
												consultaSelecionada?.id === consulta.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
											}`}
											onClick={() => handleConsultaClick(consulta)}
										>
											<TableCell className="font-medium">{consulta.numero}/{consulta.serie}</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{consulta.cliente}</p>
													<p className="text-xs text-gray-500 font-mono">{consulta.chave.substring(0, 20)}...</p>
												</div>
											</TableCell>
											<TableCell>{format(new Date(consulta.dtEmissao), "dd/MM/yy", { locale: ptBR })}</TableCell>
											<TableCell className="font-medium">{formatarMoeda(consulta.valor)}</TableCell>
											<TableCell>
												<Badge variant="outline" className={`text-xs flex items-center gap-1 ${getStatusColor(consulta.statusSefaz)}`}>
													{getStatusIcon(consulta.statusSefaz)}
													{consulta.statusSefaz}
												</Badge>
											</TableCell>
											<TableCell className="text-xs text-gray-500">
												{consulta.ultimaConsulta ? format(new Date(consulta.ultimaConsulta), "dd/MM HH:mm", { locale: ptBR }) : "-"}
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
					{consultaSelecionada ? (
						<>
							{/* Header da NFe */}
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">NFe {consultaSelecionada.numero}/{consultaSelecionada.serie}</h2>
										<p className="text-gray-600 mt-1">{consultaSelecionada.cliente}</p>
									</div>
									<Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(consultaSelecionada.statusSefaz)}`}>
										{getStatusIcon(consultaSelecionada.statusSefaz)}
										{consultaSelecionada.statusSefaz}
									</Badge>
								</div>
								
								{/* Info rápida */}
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-gray-500">Valor:</span>
										<p className="font-medium text-lg">{formatarMoeda(consultaSelecionada.valor)}</p>
									</div>
									<div>
										<span className="text-gray-500">Emissão:</span>
										<p className="font-medium">{format(new Date(consultaSelecionada.dtEmissao), "dd/MM/yyyy", { locale: ptBR })}</p>
									</div>
								</div>
							</div>

							{/* Conteúdo */}
							<div className="flex-1 p-6 space-y-6 overflow-auto">
								{/* Status SEFAZ */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<Server className="h-4 w-4" />
											Status na SEFAZ
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
											{getStatusIcon(consultaSelecionada.statusSefaz)}
											<div className="flex-1">
												<p className="font-medium">{consultaSelecionada.statusSefaz}</p>
												<p className="text-xs text-gray-600">
													{consultaSelecionada.statusSefaz === 'Autorizada' ? 'NFe autorizada e válida' :
													 consultaSelecionada.statusSefaz === 'Transmitida' ? 'Aguardando processamento' :
													 consultaSelecionada.statusSefaz === 'Rejeitada' ? 'NFe rejeitada pela SEFAZ' :
													 consultaSelecionada.statusSefaz === 'Cancelada' ? 'NFe cancelada' : 'Status desconhecido'}
												</p>
											</div>
										</div>

										{consultaSelecionada.motivoRejeicao && (
											<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
												<p className="text-sm font-medium text-red-800 mb-1">Motivo da Rejeição:</p>
												<p className="text-sm text-red-700">{consultaSelecionada.motivoRejeicao}</p>
											</div>
										)}

										{consultaSelecionada.protocolo && (
											<div className="space-y-3">
												<Separator />
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Protocolo de Autorização</label>
													<p className="text-sm mt-1 font-mono">{consultaSelecionada.protocolo}</p>
												</div>
												{consultaSelecionada.dtAutorizacao && (
													<div>
														<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data/Hora Autorização</label>
														<p className="text-sm mt-1">{format(new Date(consultaSelecionada.dtAutorizacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
													</div>
												)}
											</div>
										)}

										{consultaSelecionada.ultimaConsulta && (
											<div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
												<Activity className="h-3 w-3" />
												Última consulta: {format(new Date(consultaSelecionada.ultimaConsulta), "dd/MM/yyyy HH:mm", { locale: ptBR })}
											</div>
										)}
									</CardContent>
								</Card>

								{/* Chave de Acesso */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<Shield className="h-4 w-4" />
											Chave de Acesso
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="p-3 bg-gray-50 rounded-lg">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-medium text-gray-500">Chave NFe</span>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copiarChave(consultaSelecionada.chave)}
													className="h-6 px-2"
												>
													<Copy className="h-3 w-3" />
												</Button>
											</div>
											<p className="text-xs font-mono bg-white p-2 rounded border break-all">
												{consultaSelecionada.chave}
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Ações Disponíveis */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base">Ações Disponíveis</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<Button className="w-full justify-start" variant="outline">
											<RefreshCw className="h-4 w-4 mr-2" />
											Consultar Status Atual
										</Button>
										<Button className="w-full justify-start" variant="outline" disabled={consultaSelecionada.statusSefaz !== 'Autorizada'}>
											<Download className="h-4 w-4 mr-2" />
											Download XML Autorização
										</Button>
										<Button className="w-full justify-start" variant="outline" disabled={consultaSelecionada.statusSefaz !== 'Autorizada'}>
											<Printer className="h-4 w-4 mr-2" />
											Imprimir DANFE
										</Button>
										<Button className="w-full justify-start" variant="outline">
											<ExternalLink className="h-4 w-4 mr-2" />
											Portal Nacional NFe
										</Button>
									</CardContent>
								</Card>

								{/* Informações Técnicas */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base">Informações Técnicas</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3 text-sm">
										<div className="grid grid-cols-2 gap-3">
											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Modelo</label>
												<p>55 - NFe</p>
											</div>
											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Versão</label>
												<p>4.00</p>
											</div>
										</div>
										<div>
											<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ambiente</label>
											<p>1 - Produção</p>
										</div>
										<div>
											<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Processo de Emissão</label>
											<p>0 - Emissão Normal</p>
										</div>
									</CardContent>
								</Card>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							<div className="text-center">
								<Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione uma NFe</h3>
								<p className="text-sm text-gray-400">Clique em uma NFe da lista para consultar seu status na SEFAZ</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
} 