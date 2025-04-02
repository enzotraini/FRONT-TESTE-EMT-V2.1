import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/SearchInput";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Printer, Search, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
} from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import {
	buscarClientes,
	type ClienteDaListagem,
} from "@/api/clientes/buscar-clientes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Botoes } from "@/pages/app/cadastros/clientes/Botoes";
import {
	ContextMenuContent,
	ContextMenuItem,
} from "@/components/ui/context-menu";
import { deletarCliente } from "@/api/clientes/deletar-cliente";

const columns: ColumnDef<ClienteDaListagem>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
		size: 20,
	},
	{
		accessorKey: "id",
		header: "Código",
		size: 60,
	},
	{
		accessorKey: "nome",
		header: "Nome",
		size: 300,
	},
	{
		accessorKey: "fantasia",
		header: "Fantasia",
		size: 200,
	},
	{
		accessorKey: "cnpj",
		header: "CNPJ/CPF",
		size: 120,
	},
	{
		accessorKey: "contato",
		header: "Contato",
		size: 170,
	},
	{
		accessorKey: "telefone1",
		header: "Telefone 1",
		size: 150,
	},
	{
		accessorKey: "telefone2",
		header: "Telefone 2",
		size: 150,
	},
	{
		accessorKey: "fax",
		header: "Fax",
		size: 150,
	},
	{
		accessorKey: "dataCadastro",
		header: "Data de Cadastro",
		size: 140,
	},
	{
		accessorKey: "dataAtual",
		header: "Data Atual",
		size: 130,
	},
	{
		accessorKey: "vendedores",
		header: "Vendedores",
		size: 180,
	},
];

const oneMinute = 1000 * 60 * 2;

const buscarClientesFormSchema = z.object({
	search: z.string().optional(),
});

type BuscarClientesDate = z.infer<typeof buscarClientesFormSchema>;

export function Clientes() {
	const [itemsSelecionados, setItemsSelecionados] = useState([] as string[]);
	const navigate = useNavigate();
	const buscarClientesForm = useForm<BuscarClientesDate>({
		resolver: zodResolver(buscarClientesFormSchema),
	});

	const { register, handleSubmit } = buscarClientesForm;

	const [perPage, setPerPage] = useState(10);

	const [searchParams, setSearchParams] = useSearchParams();

	const page = z.coerce
		.number()
		.transform((page) => Math.max(1, page))
		.parse(searchParams.get("page") ?? "1");

	const search = z.coerce.string().parse(searchParams.get("search") ?? "");

	const { data: buscarClientesResponse, isFetching: buscandoClientes } =
		useQuery({
			queryKey: ["clientes", page, perPage, search],
			queryFn: () => buscarClientes({ page, perPage, search }),
			initialData: { clientes: [], meta: { page, perPage, total: 0 }, teste: {} },
			initialDataUpdatedAt: 0,
			staleTime: 0,
		});

	const { mutateAsync: deletarClienteFn } = useMutation({
		mutationFn: deletarCliente,
	});

	async function handlePageChange(page: number) {
		if (page < 1) page = 1;
		setSearchParams((prev) => {
			prev.set("page", page.toString());
			return prev;
		});
	}

	async function searchClientes({ search }: BuscarClientesDate) {
		setSearchParams((prev) => {
			prev.set("page", "1");
			prev.set("search", search ?? "");

			return prev;
		});
	}

	return (
		<section className="flex flex-col w-full max-h-screen">
			<Botoes clientesSelecionados={itemsSelecionados} />
			<nav className="p-2 flex gap-2 bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
				<Form {...buscarClientesForm}>
					<form onSubmit={handleSubmit(searchClientes)}>
						<FormField
							name="nome"
							render={() => (
								<FormControl>
									<SearchInput
										className="max-w-80 w-full"
										placeholder="Pesquisar"
										{...register("search")}
									/>
								</FormControl>
							)}
						/>
					</form>
				</Form>
				<Button variant="ghost">Ficha crédito</Button>
				<Button variant="ghost">Histórico alteração</Button>
			</nav>
			<DataTable
				meta={{
					page: buscarClientesResponse.meta?.page,
					perPage: buscarClientesResponse.meta?.perPage,
					total: buscarClientesResponse.meta?.total,
				}}
				isLoading={buscandoClientes}
				onChangePage={handlePageChange}
				onChangeSelection={setItemsSelecionados}
				data={buscarClientesResponse.clientes}
				columns={columns}
				renderContextMenuContent={(row) => (
					<ContextMenuContent>
						<ContextMenuItem
							onClick={() => {
								navigate(`editar/${row.getValue("id")}`);
							}}
						>
							Editar
						</ContextMenuItem>
						<ContextMenuItem
							onClick={() => {
								deletarClienteFn({ clienteId: row.getValue("id") }).then(() => {
									window.location.reload();
								});
							}}
						>
							Deletar
						</ContextMenuItem>
					</ContextMenuContent>
				)}
			/>
		</section>
	);
}
