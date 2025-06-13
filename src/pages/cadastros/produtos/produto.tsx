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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Pagination as PaginationRoot, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Column, Grid } from "@/components/Grid";
import { toast } from "sonner";

const buscarProdutosFormSchema = z.object({
	search: z.string().optional(),
});

export function Produtos() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();


	const buscarProdutosForm = useForm<BuscarProdutosData>({
		resolver: zodResolver(buscarProdutosFormSchema),
		defaultValues: { search: "" },
	});

	const search = buscarProdutosForm.watch("search") ?? "";
	const debouncedSearch = useDebounce(search, 300);

	const [linhaExpandida, setLinhaExpandida] = useState<number | null>(null);

	const page = z.coerce
		.number()
		.transform((page) => Math.max(1, page))
		.parse(searchParams.get("page") ?? "1");

	const perPage = 10;

	const { data, isFetching } = useQuery({
		queryKey: ['produtos', page, perPage, debouncedSearch],
		queryFn: () => buscarProdutos({ page, perPage, search: debouncedSearch }),
		enabled: debouncedSearch.length >= 3 || debouncedSearch === '',
	})

	const queryClient = useQueryClient()

	const { mutate: deletarProdutoFn } = useMutation({
		mutationFn: deletarProduto,            // chamada ao backend
		onSuccess: () => {
			toast.success("Produto excluído")
			/* força refetch de todas as páginas que começam com ['produtos'] */
			queryClient.invalidateQueries({ queryKey: ["produtos"] })
		},
		onError: () => {
			toast.error("Falha ao excluir produto")
		},
	})

	useEffect(() => {
		if (debouncedSearch.length >= 3 || debouncedSearch.length === 0) {
			setSearchParams((prev) => {
				const newParams = new URLSearchParams(prev);
				newParams.set("search", debouncedSearch); // mantém a page atual!
				return newParams;
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
	const _produtos = data?.produtos ?? [];

	interface Produto {
		sr_recno: number
		codprod: string
		tipo: string
		secao: string
		bitola: string
		acab: string
		corrida: string
		estqatual: number
		uni: string
		tipoaco: string
		local: string
		tratamento: string
		obs: string
		tributo: string
		classifisc: string
		fornecedor: string
		tipomaterial: string
		codbloco: string
		registro: string
	}

	interface BuscarProdutosResponse {
		data: Produto[]
		meta: {
			page: number
			perPage: number
			total: number
		}
	}

	type PaginationProps = {
		page: number
		perPage: number
		total: number
		onPageChange: (next: number) => void
	}

	async function handlePageChange(page: number) {
		if (page < 1) page = 1;
		setSearchParams((prev) => {
			prev.set("page", page.toString());
			return prev;
		});
	}

	/* ------------ colunas específicas ------------ */
	const columns: Column<Produto>[] = [
		{ header: 'Código', accessor: 'codprod', className: 'w-28' },
		{ header: 'Tipo', accessor: 'tipo', className: 'w-44' },
		{ header: 'Secao', accessor: 'secao' },
		{ header: 'Bitola', accessor: 'bitola' },
		{ header: 'Acab', accessor: 'acab' },
		{ header: 'Corrida', accessor: 'corrida' },
		{ header: 'Estq. Atual', accessor: 'estqatual' },
		{ header: 'UNI', accessor: 'uni' },
		{ header: 'Tipo Aço', accessor: 'tipoaco' },
		{ header: 'Local', accessor: 'local' },
		{ header: 'Tratamento', accessor: 'tratamento' },
		{ header: 'Observação', accessor: 'obs' },
		{ header: 'Tributo', accessor: 'tributo', hidden: true },
		{ header: 'Class. Fiscal', accessor: 'classifisc', hidden: true },
		{ header: 'Fornecedor', accessor: 'fornecedor', hidden: true },
		{ header: 'Tipo Material', accessor: 'tipomaterial', hidden: true },
		{ header: 'Cod. Bloco', accessor: 'codbloco', hidden: true },
		{ header: 'Registro', accessor: 'registro', hidden: true },
	]

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Produto</h1>
				<Link to="/cadastros/produtos/novo">
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
							<div className="flex flex-col">
								<span className="text-sm text-muted-foreground mb-4">
									<Link to="/" className="hover:underline text-primary">
										Home
									</Link>{" "} / cadastro / Produto
								</span>
								<CardTitle>Lista de Produtos</CardTitle>
							</div>
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


					{data ? (
						<Grid
							columns={columns}
							rows={_produtos}
							getRowKey={(p) => p.sr_recno}
							showDetails={true}
							showActions
							onEdit={(row) => handleEditar(row.sr_recno)}
							onDelete={(row) => handleExcluir(row.sr_recno, row.codprod)}
							pagination={{
								page: data.meta.page,
								totalPages: data.meta.total,
							}}
							onPageChange={handlePageChange}
							isLoading={isFetching}
						/>
					) : (
						<div className="p-6 text-sm text-muted-foreground">Carregando…</div>
					)}


				</CardContent >
			</Card >
		</div >
	);
}

