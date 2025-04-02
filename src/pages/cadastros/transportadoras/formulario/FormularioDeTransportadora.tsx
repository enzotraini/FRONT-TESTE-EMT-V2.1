import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function FormularioDeTransportadora() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros/transportadoras">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {id ? "Editar Transportadora" : "Nova Transportadora"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Transportadora</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome da Transportadora
                </Label>
                <Input 
                  id="nome" 
                  placeholder="Digite o nome da transportadora"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-sm font-medium">
                  CNPJ
                </Label>
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0000-00"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">
                  Telefone
                </Label>
                <Input 
                  id="telefone" 
                  placeholder="(00) 00000-0000"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contato@transportadora.com"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-sm font-medium">
                Endereço Completo
              </Label>
              <Textarea 
                id="endereco" 
                placeholder="Digite o endereço completo da transportadora"
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link to="/cadastros/transportadoras">
                <Button type="button" variant="outline" className="h-10">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="h-10">
                {id ? "Salvar Alterações" : "Criar Transportadora"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 