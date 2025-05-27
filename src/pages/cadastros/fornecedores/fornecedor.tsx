import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  DataTable,
} from "@/components/DataTable";
import { useForm } from "react-hook-form";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  buscarFornecedores,
  type FornecedorDaListagem,
} from "@/api/fornecedor/buscar-fornecedor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
//import { deletarFornecedor } from "@/api/Fornecedor/deletar-fornecedor";
import { Botoes } from "@/pages/cadastros/fornecedores/Botoes";
import { deletarFornecedor } from "@/api/fornecedor/deletar-fornecedor";
import { watch } from "fs";
import { Edit, Trash2 } from "lucide-react";


const buscarFornecedoresFormSchema = z.object({
  search: z.string().optional(),
});

type BuscarFornecedoresData = z.infer<typeof buscarFornecedoresFormSchema>;

export function Fornecedores() {
  const [itensSelecionados, setItensSelecionados] = useState([] as string[]);
  const navigate = useNavigate();

  function handleEditar(id: number) {
    navigate(`/cadastros/fornecedores/editar/${id}`);
  }  


  const buscarFornecedoresForm = useForm<BuscarFornecedoresData>({
    resolver: zodResolver(buscarFornecedoresFormSchema),
  });

  const columns: ColumnDef<FornecedorDaListagem>[] = [	
	{
	  accessorKey: "codigo",
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
	  accessorKey: "cgcfor",
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
	  accessorKey: "segmento",
	  header: "Segmento",
	  size: 160,
	},
	{
		id: "actions",
		header: "Ações",
		cell: ({ row }) => {
		  const id = row.getValue("codigo");
		  const nome = (row.getValue("nome") as string)?.trim();
	  
		  return (
			<div className="flex items-center gap-2">
			  <button
				onClick={() => handleEditar(id)}
				className="text-blue-500 hover:text-blue-700"
				title="Editar"
			  >
				<Edit className="w-4 h-4" />
			  </button>
	  
			  <button
				 onClick={() => {
					const confirmar = window.confirm(
					  `Deseja realmente excluir o fornecedor "${nome}"?`,
					);
					if (confirmar) {
					  deletarFornecedorFn({ fornecedorId: id }).then(() => {
						window.location.reload();
					  });
					}
				  }}
				>
				  <Trash2 className="w-4 h-4 text-red-500" />
			  </button>
			</div>
		  );
		},
		size: 100,
	  },	  
  ];  

  const { register, handleSubmit } = buscarFornecedoresForm;
  const [perPage, setPerPage] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => Math.max(1, page))
    .parse(searchParams.get("page") ?? "1");

  const search = z.coerce.string().parse(searchParams.get("search") ?? "");

  const { data: buscarFornecedoresResponse, isFetching: buscandoFornecedores } =
    useQuery({
      queryKey: ["fornecedores", page, perPage, search],
      queryFn: () => buscarFornecedores({ page, perPage, search }),
      initialData: {
        fornecedores: [],
        meta: { page, perPage, total: 0 },
      },
      initialDataUpdatedAt: 0,
      staleTime: 0,
    });

  const { mutateAsync: deletarFornecedorFn } = useMutation({
    mutationFn: deletarFornecedor,
  });

  async function handlePageChange(page: number) {
    if (page < 1) page = 1;
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  }

  async function searchFornecedores({ search }: BuscarFornecedoresData) {
    setSearchParams((prev) => {
      prev.set("page", "1");
      prev.set("search", search ?? "");
      return prev;
    });
  }

  const searchWatched = buscarFornecedoresForm.watch("search") ?? "";

useEffect(() => {
	if (searchWatched.length >= 3 || searchWatched.length === 0) {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("search", searchWatched); // mantém a page atual!
			return newParams;
		});
	}
}, [searchWatched, setSearchParams]);

	  

  return (
    <section className="flex flex-col w-full max-h-screen">
      <Botoes fornecedoresSelecionados={itensSelecionados} />
      <nav className="p-2 flex gap-2 bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
        <Form {...buscarFornecedoresForm}>
          <form onSubmit={handleSubmit(searchFornecedores)}>
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
        {/* <Button variant="ghost">Ficha de Crédito</Button>
        <Button variant="ghost">Histórico de Alteração</Button> */}
      </nav>
      <DataTable
        meta={{
          page: buscarFornecedoresResponse.meta?.page,
          perPage: buscarFornecedoresResponse.meta?.perPage,
          total: buscarFornecedoresResponse.meta?.total,
        }}
        isLoading={buscandoFornecedores}
        onChangePage={handlePageChange}
        data={buscarFornecedoresResponse.fornecedores}
        columns={columns}
      />
    </section>
  );
}
