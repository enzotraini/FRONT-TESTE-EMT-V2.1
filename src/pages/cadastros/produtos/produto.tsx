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
  buscarProdutos,
  type ProdutoDaListagem,
} from "@/api/produto/buscar-produto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
//import { deletarProduto } from "@/api/Produto/deletar-produto";
//import { Botoes } from "@/pages/cadastros/produtos/Botoes";
import { deletarProduto } from "@/api/produto/deletar-produto";
import { watch } from "fs";
import { Edit, Trash2 } from "lucide-react";
import { Botoes } from "@/pages/cadastros/produtos/Botoes";


const buscarProdutosFormSchema = z.object({
  search: z.string().optional(),
});

type BuscarProdutosData = z.infer<typeof buscarProdutosFormSchema>;

export function Produtos() {
  const [itensSelecionados, setItensSelecionados] = useState([] as string[]);
  const navigate = useNavigate();

  function handleEditar(id: number) {
    navigate(`/cadastros/produtos/editar/${id}`);
  }  


  const buscarProdutosForm = useForm<BuscarProdutosData>({
    resolver: zodResolver(buscarProdutosFormSchema),
  });

  const columns: ColumnDef<ProdutoDaListagem>[] = [	
	{
	  accessorKey: "codigo",
	  header: "Código",
	  size: 60,
	},
	{
	  accessorKey: "tipo",
	  header: "Tipo",
	  size: 300,
	},
	{
	  accessorKey: "secao",
	  header: "Secao",
	  size: 200,
	},
	{
	  accessorKey: "bitola",
	  header: "Bitola",
	  size: 120,
	},
	{
	  accessorKey: "acab",
	  header: "Acab",
	  size: 170,
	},
	{
	  accessorKey: "corrida",
	  header: "Corrida",
	  size: 150,
	},
	{
	  accessorKey: "estqatual",
	  header: "Estq. Atual",
	  size: 150,
	},
	{
	  accessorKey: "uni",
	  header: "UNI",
	  size: 160,
	},
  {
	  accessorKey: "tipoaco",
	  header: "Tipo Aço",
	  size: 160,
	},
  {
	  accessorKey: "local",
	  header: "Local",
	  size: 160,
	},
  {
	  accessorKey: "tratamento",
	  header: "Tratamento",
	  size: 160,
	},
  {
	  accessorKey: "observaocao",
	  header: "Observação",
	  size: 160,
	},
  {
	  accessorKey: "tributo",
	  header: "Tributo",
	  size: 160,
	},
  {
	  accessorKey: "classifisc",
	  header: "Class. Fiscal",
	  size: 160,
	},
  {
	  accessorKey: "fornecedor",
	  header: "Produto",
	  size: 160,
	},
  {
	  accessorKey: "tipomaterial",
	  header: "Tipo Material",
	  size: 160,
	},
   {
	  accessorKey: "codbloco",
	  header: "Cod. Bloco",
	  size: 160,
	},
   {
	  accessorKey: "Registro",
	  header: "registro",
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
					  `Deseja realmente excluir o produto "${nome}"?`,
					);
					if (confirmar) {
					  deletarProdutoFn({ produtoId: id }).then(() => {
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

  const { register, handleSubmit } = buscarProdutosForm;
  const [perPage, setPerPage] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => Math.max(1, page))
    .parse(searchParams.get("page") ?? "1");

  const search = z.coerce.string().parse(searchParams.get("search") ?? "");

  const { data: buscarProdutosResponse, isFetching: buscandoProdutos } =
    useQuery({
      queryKey: ["produtos", page, perPage, search],
      queryFn: () => buscarProdutos({ page, perPage, search }),
      initialData: {
        produtos: [],
        meta: { page, perPage, total: 0 },
      },
      initialDataUpdatedAt: 0,
      staleTime: 0,
    });

  const { mutateAsync: deletarProdutoFn } = useMutation({
    mutationFn: deletarProduto,
  });

  async function handlePageChange(page: number) {
    if (page < 1) page = 1;
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  }

  async function searchProdutos({ search }: BuscarProdutosData) {
    setSearchParams((prev) => {
      prev.set("page", "1");
      prev.set("search", search ?? "");
      return prev;
    });
  }

  const searchWatched = buscarProdutosForm.watch("search") ?? "";

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
      <Botoes produtosSelecionados={itensSelecionados} />
      <nav className="p-2 flex gap-2 bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
        <Form {...buscarProdutosForm}>
          <form onSubmit={handleSubmit(searchProdutos)}>
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
          page: buscarProdutosResponse.meta?.page,
          perPage: buscarProdutosResponse.meta?.perPage,
          total: buscarProdutosResponse.meta?.total,
        }}
        isLoading={buscandoProdutos}
        onChangePage={handlePageChange}
        data={buscarProdutosResponse.produtos}
        columns={columns}
      />
    </section>
  );
}
