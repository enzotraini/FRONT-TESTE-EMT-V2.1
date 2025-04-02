import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { atualizarConfiguracoes } from "@/services/api/configuracoes/atualizar-configuracoes";

const configuracoesSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cep: z.string().min(1, "CEP é obrigatório"),
  logradouro: z.string().min(1, "Endereço é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
  observacoes: z.string().optional(),
});

type ConfiguracoesFormData = z.infer<typeof configuracoesSchema>;

export function Configuracoes() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfiguracoesFormData>({
    resolver: zodResolver(configuracoesSchema),
  });

  async function onSubmit(data: ConfiguracoesFormData) {
    try {
      const loadingToast = toast.loading({
        title: "Atualizando configurações",
        description: "Aguarde enquanto processamos sua solicitação...",
      });

      await atualizarConfiguracoes(data);
      
      toast.dismiss(loadingToast);
      toast.success({
        title: "Configurações atualizadas com sucesso!",
        description: "As configurações da empresa foram atualizadas.",
      });
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error({
        title: "Erro ao atualizar configurações",
        description: "Ocorreu um erro ao tentar atualizar as configurações. Tente novamente.",
      });
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Configurações da Empresa</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input
                id="nomeEmpresa"
                {...register("nomeEmpresa")}
                className={errors.nomeEmpresa ? "border-red-500" : ""}
              />
              {errors.nomeEmpresa && (
                <p className="text-sm text-red-500">{errors.nomeEmpresa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                {...register("cnpj")}
                className={errors.cnpj ? "border-red-500" : ""}
              />
              {errors.cnpj && (
                <p className="text-sm text-red-500">{errors.cnpj.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register("telefone")}
                className={errors.telefone ? "border-red-500" : ""}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                {...register("cep")}
                className={errors.cep ? "border-red-500" : ""}
              />
              {errors.cep && (
                <p className="text-sm text-red-500">{errors.cep.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logradouro">Endereço</Label>
              <Input
                id="logradouro"
                {...register("logradouro")}
                className={errors.logradouro ? "border-red-500" : ""}
              />
              {errors.logradouro && (
                <p className="text-sm text-red-500">{errors.logradouro.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                {...register("numero")}
                className={errors.numero ? "border-red-500" : ""}
              />
              {errors.numero && (
                <p className="text-sm text-red-500">{errors.numero.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                {...register("complemento")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                {...register("bairro")}
                className={errors.bairro ? "border-red-500" : ""}
              />
              {errors.bairro && (
                <p className="text-sm text-red-500">{errors.bairro.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                {...register("cidade")}
                className={errors.cidade ? "border-red-500" : ""}
              />
              {errors.cidade && (
                <p className="text-sm text-red-500">{errors.cidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                {...register("estado")}
                className={errors.estado ? "border-red-500" : ""}
              />
              {errors.estado && (
                <p className="text-sm text-red-500">{errors.estado.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                {...register("observacoes")}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 