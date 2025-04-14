import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FormularioDeEntradaDeMercadoria() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros/entrada-mercadoria">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {id ? "Editar Entrada" : "Nova Entrada"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-sm font-medium">
                  Número da Entrada
                </Label>
                <Input 
                  id="numero" 
                  placeholder="ENT-001"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data" className="text-sm font-medium">
                  Data
                </Label>
                <Input 
                  id="data" 
                  type="date"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor" className="text-sm font-medium">
                  Fornecedor
                </Label>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Fornecedor A</SelectItem>
                    <SelectItem value="2">Fornecedor B</SelectItem>
                    <SelectItem value="3">Fornecedor C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notaFiscal" className="text-sm font-medium">
                  Nota Fiscal
                </Label>
                <Input 
                  id="notaFiscal" 
                  placeholder="123456"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm font-medium">
                Observações
              </Label>
              <Textarea 
                id="observacoes" 
                placeholder="Digite as observações da entrada"
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link to="/cadastros/entrada-mercadoria">
                <Button type="button" variant="outline" className="h-10">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="h-10">
                {id ? "Salvar Alterações" : "Criar Entrada"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 