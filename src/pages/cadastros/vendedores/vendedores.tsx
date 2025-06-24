import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buscarVendedores } from "@/api/vendedor/buscar-vendedores";
import { deletarVendedor } from "@/api/vendedor/deletar-vendedor";
import { useState } from "react";
import { toast } from "sonner";

export function Vendedores() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendedores", page, search],
    queryFn: () => buscarVendedores({ page, perPage: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletarVendedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
      toast.success("Vendedor deletado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar vendedor");
      console.error(error);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este vendedor?")) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return <div className="text-red-500">Erro ao carregar vendedores</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendedores</h1>
        <Link to="/cadastros/vendedores/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Vendedor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Vendedores</CardTitle>
            <div className="flex w-72 items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vendedor..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">CPF/CNPJ</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Contato</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Comissão</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      <p className="mt-2 text-sm text-muted-foreground">Carregando vendedores...</p>
                    </td>
                  </tr>
                ) : data?.vendedores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">Nenhum vendedor encontrado</p>
                    </td>
                  </tr>
                ) : (
                  data?.vendedores.map((vendedor) => (
                    <tr key={vendedor.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{vendedor.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {vendedor.cidade}, {vendedor.estado}
                        </div>
                      </td>
                      <td className="p-4">{vendedor.cgccpf}</td>
                      <td className="p-4">
                        <div className="text-sm">{vendedor.telefone1}</div>
                        <div className="text-sm text-muted-foreground">{vendedor.email}</div>
                      </td>
                      <td className="p-4">{vendedor.comissao}%</td>
                      <td className="p-4">
                        <Badge variant={vendedor.ativo ? "default" : "secondary"}>
                          {vendedor.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/cadastros/vendedores/${vendedor.id}`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(vendedor.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 