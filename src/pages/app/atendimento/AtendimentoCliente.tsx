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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { buscarClientes, type ClienteDaListagem } from "@/api/clientes/buscar-clientes";
import {
	Calendar,
	Clock,
	Phone,
	Mail,
	MapPin,
	User,
	Plus,
	Edit,
	Trash,
	FileText,
	History,
	MoreHorizontal,
	ChevronDown
} from "lucide-react";

import dayjs from "dayjs";

export function AtendimentoCliente() {
	const [clienteSelecionado, setClienteSelecionado] = useState<ClienteDaListagem | null>(null);
	const [search, setSearch] = useState("");
	const [observacoes, setObservacoes] = useState("");
	const [page] = useState(1);
	const [perPage] = useState(15);

	const { data: clientesResponse, isFetching, error } = useQuery({
		queryKey: ["clientes-atendimento", page, perPage, search],
		queryFn: async () => {
			try {
				return await buscarClientes({ page, perPage, search });
			} catch (error) {
				console.warn("[AtendimentoCliente] Erro ao buscar clientes, usando dados de fallback:", error);
				return {
					clientes: [],
					meta: { page, perPage, total: 0 },
					teste: {}
				};
			}
		},
		initialData: { clientes: [], meta: { page, perPage, total: 0 }, teste: {} },
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	});

	const handleClienteClick = (cliente: ClienteDaListagem) => {
		setClienteSelecionado(cliente);
		setObservacoes("");
	};

	const formatarTelefone = (telefone: string) => {
		if (!telefone) return "";
		return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
	};

	const formatarCNPJ = (cnpj: string) => {
		if (!cnpj) return "";
		return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
	};

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação - Simplificados */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button variant="default">
						<Plus className="h-4 w-4 mr-2" />
						Incluir
					</Button>
					<Button variant="green" disabled={!clienteSelecionado}>
						<Edit className="h-4 w-4 mr-2" />
						Alterar
					</Button>
					<Button variant="ghost">
						<FileText className="h-4 w-4 mr-2" />
						Consultar
					</Button>
					<Button variant="destructive" disabled={!clienteSelecionado}>
						<Trash className="h-4 w-4 mr-2" />
						Excluir
					</Button>

					{/* Dropdown com outras opções */}
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
								Data
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Clock className="h-4 w-4 mr-2" />
								Hora
							</DropdownMenuItem>
							<DropdownMenuItem>
								<User className="h-4 w-4 mr-2" />
								Usuário
							</DropdownMenuItem>
							<DropdownMenuItem>Título</DropdownMenuItem>
							<DropdownMenuItem>Lembrar</DropdownMenuItem>
							<DropdownMenuItem>Registro</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Badge variant="outline" className="bg-blue-50 text-blue-700">
					{clientesResponse?.clientes?.length || 0} clientes
				</Badge>
			</header>

			{/* Barra de Pesquisa - Simplificada */}
			<nav className="p-3 flex gap-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
				<SearchInput
					placeholder="Pesquisar clientes..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-80"
				/>
				<Button variant="ghost" size="sm">Ficha crédito</Button>
				<Button variant="ghost" size="sm">Histórico alteração</Button>
			</nav>

			<div className="flex flex-1 overflow-hidden">
				{/* Lista de Clientes - Tabela Simplificada */}
				<div className="w-2/3 flex flex-col bg-white border-r border-gray-200">
					<div className="flex-1 overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
								<TableRow>
									<TableHead className="w-20">Código</TableHead>
									<TableHead className="w-80">Nome</TableHead>
									<TableHead className="w-40">Telefone</TableHead>
									<TableHead className="w-24">Tipo</TableHead>
									<TableHead className="w-24">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isFetching ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-12">
											<div className="flex items-center justify-center gap-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
												Carregando clientes...
											</div>
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-12 text-amber-600">
											⚠️ Erro ao carregar clientes. Verifique sua conexão.
										</TableCell>
									</TableRow>
								) : !clientesResponse?.clientes || clientesResponse.clientes.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-12 text-gray-500">
											<div className="flex flex-col items-center gap-2">
												<User className="h-8 w-8 text-gray-300" />
												<p>Nenhum cliente encontrado</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									clientesResponse.clientes.map((cliente) => (
										<TableRow
											key={cliente.id}
											className={`cursor-pointer hover:bg-gray-50 transition-colors ${clienteSelecionado?.id === cliente.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
												}`}
											onClick={() => handleClienteClick(cliente)}
										>
											<TableCell className="font-medium">{cliente.id}</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{cliente.nome}</p>
													{cliente.fantasia && (
														<p className="text-sm text-gray-500">{cliente.fantasia}</p>
													)}
												</div>
											</TableCell>
											<TableCell>{formatarTelefone(cliente.telefone1) || "Não informado"}</TableCell>
											<TableCell>
												<Badge variant="secondary" className="text-xs">
													{cliente.cnpj && cliente.cnpj.length > 11 ? "PJ" : "PF"}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className="text-xs text-green-700">
													Ativo
												</Badge>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* Painel de Detalhes - Layout Limpo */}
				<div className="w-1/3 flex flex-col bg-white">
					{clienteSelecionado ? (
						<>
							{/* Header do Cliente - Mais Clean */}
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">{clienteSelecionado.nome}</h2>
										{clienteSelecionado.fantasia && (
											<p className="text-gray-600 mt-1">{clienteSelecionado.fantasia}</p>
										)}
									</div>
									<Badge variant="outline" className="text-blue-700">
										#{clienteSelecionado.id}
									</Badge>
								</div>

								{/* Info rápida */}
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-gray-500">Telefone:</span>
										<p className="font-medium">{formatarTelefone(clienteSelecionado.telefone1) || "Não informado"}</p>
									</div>
									<div>
										<span className="text-gray-500">Tipo:</span>
										<p className="font-medium">{clienteSelecionado.cnpj && clienteSelecionado.cnpj.length > 11 ? "Pessoa Jurídica" : "Pessoa Física"}</p>
									</div>
								</div>
							</div>

							{/* Conteúdo - Mais Espaçado */}
							<div className="flex-1 p-6 space-y-6 overflow-auto">
								{/* Informações Completas - Card único mais organizado */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base">Informações Completas</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 gap-3">
											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CNPJ/CPF</label>
												<p className="text-sm font-mono mt-1">{formatarCNPJ(clienteSelecionado.cnpj) || "Não informado"}</p>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Telefone 2</label>
													<p className="text-sm mt-1">{formatarTelefone(clienteSelecionado.telefone2) || "Não informado"}</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">FAX</label>
													<p className="text-sm mt-1">{formatarTelefone(clienteSelecionado.fax) || "Não informado"}</p>
												</div>
											</div>

											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contato</label>
												<p className="text-sm mt-1">{clienteSelecionado.contato || "Não informado"}</p>
											</div>

											<div>
												<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vendedores</label>
												<p className="text-sm mt-1">{clienteSelecionado.vendedores || "Não informado"}</p>
											</div>

											<Separator />

											<div className="grid grid-cols-2 gap-3">
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cadastro</label>
													<p className="text-sm mt-1">
														{dayjs(new Date(clienteSelecionado.dataCadastro)).format("dd/MM/yyyy")}
													</p>
												</div>
												<div>
													<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Atualização</label>
													<p className="text-sm mt-1">
														{dayjs(new Date(clienteSelecionado.dataAtual)).format("dd/MM/yyyy")}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Observações - Interface Melhorada */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<FileText className="h-4 w-4" />
											Nova Observação
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Textarea
											placeholder="Digite observações sobre o atendimento..."
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

								{/* Histórico - Design Mais Limpo */}
								<Card>
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<History className="h-4 w-4" />
											Últimos Atendimentos
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
												<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
												<div className="flex-1">
													<p className="font-medium text-sm">Contato telefônico</p>
													<p className="text-xs text-gray-600 mt-1">Solicitação de orçamento</p>
													<span className="text-xs text-gray-500">Hoje, 14:30</span>
												</div>
											</div>
											<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
												<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
												<div className="flex-1">
													<p className="font-medium text-sm">Atendimento presencial</p>
													<p className="text-xs text-gray-600 mt-1">Negociação de prazo</p>
													<span className="text-xs text-gray-500">Ontem, 10:15</span>
												</div>
											</div>
											<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
												<div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
												<div className="flex-1">
													<p className="font-medium text-sm">Email enviado</p>
													<p className="text-xs text-gray-600 mt-1">Catálogo de produtos</p>
													<span className="text-xs text-gray-500">02/01, 16:45</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							<div className="text-center">
								<User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
								<h3 className="text-lg font-medium mb-2">Selecione um cliente</h3>
								<p className="text-sm text-gray-400">Clique em um cliente da lista para ver os detalhes</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
} 