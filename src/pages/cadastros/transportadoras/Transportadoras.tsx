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
import { buscarTransportadoras } from "@/api/transportadoras/buscar-transportadoras";
import { deletarTransportadora } from "@/api/transportadoras/deletar-transportadora";
import { useState } from "react";
import { toast } from "sonner";

export function Transportadoras() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [transportadoraParaDeletar, setTransportadoraParaDeletar] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transportadoras", page, search],
    queryFn: () => buscarTransportadoras({ page, perPage: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletarTransportadora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transportadoras"] });
      toast.success("Transportadora deletada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar transportadora");
      console.error(error);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta transportadora?")) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return <div className="text-red-500">Erro ao carregar transportadoras</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transportadoras</h1>
        <Link to="/cadastros/transportadoras/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transportadora
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Transportadoras</CardTitle>
            <div className="flex w-72 items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transportadora..."
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
                  <th className="h-12 px-4 text-left align-middle font-medium">CNPJ</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Contato</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      <p className="mt-2 text-sm text-muted-foreground">Carregando transportadoras...</p>
                    </td>
                  </tr>
                ) : data?.transportadoras.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">Nenhuma transportadora encontrada</p>
                    </td>
                  </tr>
                ) : (
                  data?.transportadoras.map((transportadora) => (
                    <tr key={transportadora.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{transportadora.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {transportadora.cidade}, {transportadora.estado}
                        </div>
                      </td>
                      <td className="p-4">{transportadora.cgccpf}</td>
                      <td className="p-4">
                        <div className="text-sm">{transportadora.telefone1}</div>
                        <div className="text-sm text-muted-foreground">{transportadora.email}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="default">Ativo</Badge>
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
                              <Link to={`/cadastros/transportadoras/${transportadora.id}`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(transportadora.id)}
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