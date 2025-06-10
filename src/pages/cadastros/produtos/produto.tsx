import {
	Form,
	FormControl,
	FormField,
} from "@/components/ui/form";
import {
	buscarProdutos,
	BuscarProdutosResponse,
	type ProdutoDaListagem,
} from "@/api/produto/buscar-produto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/pages/cadastros/produtos/formularios/FormularioDadosGerais";
import { deletarProduto } from "@/api/produto/deletar-produto";
import {
	Edit,
	MoreHorizontal,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React from "react";

const buscarProdutosFormSchema = z.object({
	search: z.string().optional(),
});

export function Produtos() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// const form = useForm({
	// 	resolver: zodResolver(buscarProdutosFormSchema),
	// 	defaultValues: { search: "" },
	// });

	// const search = form.watch("search") ?? "";
	//const debouncedSearch = useDebounce(search, 300);


	const buscarProdutosForm = useForm<BuscarProdutosData>({
		resolver: zodResolver(buscarProdutosFormSchema),
		defaultValues: { search: "" },
	});

	const search = buscarProdutosForm.watch("search") ?? "";
	const debouncedSearch = useDebounce(search, 300);

	// const colunasVisiveis = [
	// 	"Código", "Tipo", "Secao", "Bitola", "Acab", "Corrida",
	// 	"Estq. Atual", "UNI", "Tipo Aço", "Local", "Tratamento", "Observação"
	// ];

	// const colunasOcultas = [
	// 	"Tributo", "Class. Fiscal", "Fornecedor", "Tipo Material", "Cod. Bloco", "Registro"
	// ];

	const [linhaExpandida, setLinhaExpandida] = useState<number | null>(null);

	const page = z.coerce
		.number()
		.transform((page) => Math.max(1, page))
		.parse(searchParams.get("page") ?? "1");

	const perPage = 10;

	const {
		data: buscarProdutosResponse,
		isFetching: buscandoProdutos,
	} = useQuery<BuscarProdutosResponse>({
		queryKey: ["produtos", page, perPage, debouncedSearch],
		queryFn: () => buscarProdutos({ page, perPage, search: debouncedSearch }),
		enabled: debouncedSearch.length >= 3 || debouncedSearch === "",
		staleTime: 0,
	});


	const { mutateAsync: deletarProdutoFn } = useMutation({
		mutationFn: deletarProduto,
	});

	useEffect(() => {
		if (debouncedSearch.length >= 3 || debouncedSearch === "") {
			setSearchParams((prev) => {
				prev.set("page", "1");
				prev.set("search", debouncedSearch);
				return prev;
			});
		}
	}, [debouncedSearch, setSearchParams]);


	function handleEditar(id: number) {
		navigate(`/cadastros/produtos/editar/${id}`);
	}

	function handleExcluir(id: number, codprod: string) {
		const confirmar = window.confirm(
			`Deseja realmente excluir o produto "${codprod}"?`
		);
		if (confirmar) deletarProdutoFn({ produtoId: id });
	}

	type BuscarProdutosData = z.infer<typeof buscarProdutosFormSchema>;

	const podeExibirResultados = debouncedSearch.length >= 3 || debouncedSearch === "";
	const _produtos = buscarProdutosResponse?.produtos ?? [];


	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Produto</h1>
				<Link to="/cadastros/transportadoras/novo">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Novo Produto
					</Button>
				</Link>
			</div>
			<Card>
				<CardHeader>
					<Form {...buscarProdutosForm}>
						<div className="flex items-center justify-between">
							<CardTitle>Lista de Produtos</CardTitle>
							<div className="flex w-72 items-center space-x-2">
								<FormField
									name="search"
									control={buscarProdutosForm.control}
									render={({ field }) => (
										<FormControl>
											<div className="relative w-full">
												<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
												<Input
													placeholder="Buscar produto..."
													{...field}
													className="pl-8"
												/>
											</div>
										</FormControl>
									)}
								/>
							</div>
						</div>
					</Form>
				</CardHeader>

				<CardContent>
					<div className="rounded-md border overflow-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b bg-muted/50">
									{["Código", "Tipo", "Secao", "Bitola", "Acab", "Corrida", "Estq. Atual", "UNI", "Tipo Aço", "Local", "Tratamento", "Observação", ""].map((col) => (
										<th key={col} className="h-10 px-2 text-left font-medium">
											{col}
										</th>
									))}
									<th className="h-10 px-2 text-right font-medium">Ações</th>
								</tr>
							</thead>
							<tbody>

								{podeExibirResultados && _produtos.map((row) => (
									<React.Fragment key={row.sr_recno}>
										<tr className="border-b hover:bg-muted/50">

											{/* as colunas visíveis */}
											<td className="p-2">{row.codprod}</td>
											<td className="p-2">{row.tipo}</td>
											<td className="p-2">{row.secao}</td>
											<td className="p-2">{row.bitola}</td>
											<td className="p-2">{row.acab}</td>
											<td className="p-2">{row.corrida}</td>
											<td className="p-2">{row.estqatual}</td>
											<td className="p-2">{row.uni}</td>
											<td className="p-2">{row.tipoaco}</td>
											<td className="p-2">{row.local}</td>
											<td className="p-2">{row.tratamento}</td>
											<td className="p-2">{row.obs}</td>

											{/* botão expandir */}
											<td className="p-2">
												<button onClick={() =>
													setLinhaExpandida((prev) => (prev === row.sr_recno ? null : row.sr_recno))
												}>
													{linhaExpandida === row.sr_recno ? "🔼" : "🔽"}
												</button>
											</td>

											{/* ações */}
											<td className="p-2 text-center flex justify-center items-center">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem onClick={() => handleEditar(row.sr_recno)}>
															<Pencil className="mr-2 h-4 w-4" /> Editar
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive"
															onClick={() => handleExcluir(row.sr_recno, row.codprod)}
														>
															<Trash2 className="mr-2 h-4 w-4" /> Excluir
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</td>

										</tr>

										{/* colunas invisiveis */}
										{linhaExpandida === row.sr_recno && (
											<tr className="bg-gray-50">
												<td colSpan={20}>
													<div className="grid grid-cols-3 gap-4 p-4 text-sm">
														<div><strong>Tributo:</strong> {row.tributo}</div>
														<div><strong>Class. Fiscal:</strong> {row.classifisc}</div>
														<div><strong>Fornecedor:</strong> {row.fornecedor}</div>
														<div><strong>Tipo Material:</strong> {row.tipomaterial}</div>
														<div><strong>Cod. Bloco:</strong> {row.codbloco}</div>
														<div><strong>Registro:</strong> {row.Registro}</div>
													</div>
												</td>
											</tr>
										)}
									</React.Fragment>

								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
