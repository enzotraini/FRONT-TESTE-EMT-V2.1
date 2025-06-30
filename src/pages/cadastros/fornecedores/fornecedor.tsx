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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Column, Grid } from "@/components/Grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


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

  // const { register, handleSubmit } = buscarFornecedoresForm;
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

  // const { mutateAsync: deletarFornecedorFn } = useMutation({
  //   mutationFn: deletarFornecedor,
  // });

  const queryClient = useQueryClient()

  const { mutate: deletarFornecedorFn } = useMutation({
    mutationFn: deletarFornecedor,
    onSuccess: () => {
      toast.success("Fornecedor excluído")
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
    },
    onError: () => {
      toast.error("Falha ao excluir produto")
    },
  })

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

  function handleExcluir(id: number, codprod: number) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o fornecedor "${codprod}"?`
    );
    if (confirmar) deletarFornecedorFn({ fornecedorId: id });
  }

  const columns: Column<FornecedorDaListagem>[] = [
    { header: "Código", accessor: "codigo", className: "w-24" },
    { header: "Nome", accessor: "nome", className: "w-80" },
    { header: "Fantasia", accessor: "fantasia", className: "w-72" },
    { header: "CNPJ/CPF", accessor: "cgcfor", className: "w-60" },

    /* ─── colunas invisíveis ─── */
    { header: "Contato", accessor: "contato" },
    { header: "Telefone 1", accessor: "telefone1", hidden: true },
    { header: "Telefone 2", accessor: "telefone2", hidden: true },
    { header: "Segmento", accessor: "segmento", hidden: true },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fornecedor</h1>
        <Link to="/cadastros/fornecedores/novo">
          <Button className="px-2 py-1 text-sm h-8 mr-2">
            <Plus className="mr-2 h-3 w-3" />
            Novo Fornecedor
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <Form {...buscarFornecedoresForm}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-4">
                  <Link to="/" className="hover:underline text-primary">
                    Home
                  </Link>{" "} / cadastro / Fornecedor
                </span>
                <CardTitle>Lista de Fornecedores</CardTitle>
              </div>
              <div className="flex w-72 items-center space-x-2">
                <FormField
                  name="search"
                  control={buscarFornecedoresForm.control}
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
          <Grid
            columns={columns}
            rows={buscarFornecedoresResponse.fornecedores}
            getRowKey={(p) => p.codigo}
            showDetails={true}
            showActions
            onEdit={(row) => handleEditar(row.codigo)}
            onDelete={(row) => handleExcluir(row.codigo, row.codigo)}
            pagination={{
              page: buscarFornecedoresResponse.meta.page,
              totalPages: buscarFornecedoresResponse.meta.total,
            }}
            onPageChange={handlePageChange}
            isLoading={buscandoFornecedores}
          />
        </CardContent >
      </Card >
    </div >
  );
}
