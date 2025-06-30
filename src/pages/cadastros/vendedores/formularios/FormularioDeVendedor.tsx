import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { formatCep } from "@/utils/formatCep";
import { formatTelefone } from "@/utils/formatTel";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { criarVendedor } from "@/api/vendedor/criar-vendedor";
import { editarVendedor } from "@/api/vendedor/editar-vendedor";
import { buscarVendedorPorId } from "@/api/vendedor/buscar-vendedor-por-id";

const vendedorFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(40, "Nome deve ter no máximo 40 caracteres"),
  cgccpf: z.string().min(11, "CNPJ/CPF deve ter no mínimo 11 caracteres").max(18, "CNPJ/CPF deve ter no máximo 18 caracteres"),
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório").max(40, "Endereço deve ter no máximo 40 caracteres"),
  bairro: z.string().min(1, "Bairro é obrigatório").max(30, "Bairro deve ter no máximo 30 caracteres"),
  cidade: z.string().min(1, "Cidade é obrigatória").max(30, "Cidade deve ter no máximo 30 caracteres"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  telefone: z.string().optional(),
  celular1: z.string().optional(),
  celular2: z.string().optional(),
  comissao: z.string().optional(),
  estadualrg: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  observacoes: z.string().optional(),
});

type VendedorFormData = z.infer<typeof vendedorFormSchema>;

export function FormularioDeVendedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const vendedorId = id;

  const form = useForm<VendedorFormData>({
    resolver: zodResolver(vendedorFormSchema),
    defaultValues: {
      nome: "",
      cgccpf: "",
      cep: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      telefone: "",
      celular1: "",
      celular2: "",
      comissao: "",
      estadualrg: "",
      email: "",
      observacoes: "",
    }
  });

  // Mutation para criar vendedor
  const { mutateAsync: criarVendedorFn } = useMutation({
    mutationFn: async (data: VendedorFormData) => {
      return await criarVendedor({
        codigo: Number(data.cgccpf.replace(/\D/g, '').slice(-6)), // Gera código baseado no CPF/CNPJ
        nome: data.nome,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        telefone1: data.telefone || "",
        telefone2: "",
        celular1: data.celular1 || "",
        email: data.email || "",
        cgccpf: data.cgccpf,
        inscricaoestadual: data.estadualrg || "",
        comissao: Number(data.comissao) || 0,
        observacoes: data.observacoes || "",
        ativo: true,
        user_id: 1, // TODO: Pegar do contexto de autenticação
        organizacao_id: 1, // TODO: Pegar do contexto de autenticação
      });
    },
    onSuccess: () => {
      toast.success("Vendedor criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
      navigate("/cadastros/vendedores");
    },
    onError: (error) => {
      console.error("Erro ao criar vendedor:", error);
      toast.error("Erro ao criar vendedor");
    },
  });

  // Mutation para editar vendedor
  const { mutateAsync: editarVendedorFn } = useMutation({
    mutationFn: async (data: VendedorFormData) => {
      return await editarVendedor({
        id: Number(vendedorId),
        codigo: Number(data.cgccpf.replace(/\D/g, '').slice(-6)), // Gera código baseado no CPF/CNPJ
        nome: data.nome,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        telefone1: data.telefone || "",
        telefone2: "",
        celular1: data.celular1 || "",
        email: data.email || "",
        cgccpf: data.cgccpf,
        inscricaoestadual: data.estadualrg || "",
        comissao: Number(data.comissao) || 0,
        observacoes: data.observacoes || "",
        ativo: true,
        user_id: 1, // TODO: Pegar do contexto de autenticação
        organizacao_id: 1, // TODO: Pegar do contexto de autenticação
      });
    },
    onSuccess: () => {
      toast.success("Vendedor editado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
      navigate("/cadastros/vendedores");
    },
    onError: (error) => {
      console.error("Erro ao editar vendedor:", error);
      toast.error("Erro ao editar vendedor");
    },
  });

  // Query para buscar dados do vendedor
  const {
    data: dadosVendedor,
    isFetching: carregandoDados,
  } = useQuery({
    queryKey: ["buscar-vendedor", vendedorId],
    queryFn: async () => {
      if (!vendedorId) return null;
      return await buscarVendedorPorId(vendedorId);
    },
    enabled: vendedorId !== undefined && vendedorId !== "",
    retry: (retries, error) => {
      if (!(error instanceof AxiosError)) {
        return false;
      }
      if (error.status && error.status >= 400 && error.status <= 499) {
        return false;
      }
      if (retries > 2) {
        return false;
      }
      return true;
    },
  });

  // Preencher formulário quando dados forem carregados
  useEffect(() => {
    if (dadosVendedor && vendedorId) {
      const dados = dadosVendedor.dadosGerais;
      form.setValue("nome", dados.nome || "");
      form.setValue("cgccpf", dados.cgccpf || "");
      form.setValue("cep", dados.cep || "");
      form.setValue("endereco", dados.endereco || "");
      form.setValue("bairro", dados.bairro || "");
      form.setValue("cidade", dados.cidade || "");
      form.setValue("estado", dados.estado || "");
      form.setValue("telefone", dados.telefone || "");
      form.setValue("celular1", dados.celular1 || "");
      form.setValue("celular2", dados.celular2 || "");
      form.setValue("comissao", dados.comissao || "");
      form.setValue("estadualrg", dados.estadualrg || "");
      form.setValue("email", dados.email || "");
      form.setValue("observacoes", dados.observacoes || "");
    }
  }, [dadosVendedor, vendedorId, form]);

  const handleSubmit = async (data: VendedorFormData) => {
    if (vendedorId) {
      await editarVendedorFn(data);
    } else {
      await criarVendedorFn(data);
    }
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros/vendedores">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {vendedorId ? "Editar Vendedor" : "Novo Vendedor"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Vendedor</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o nome do vendedor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cgccpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ/CPF</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCpfCnpj(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="vendedor@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estadualrg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG/Inscrição Estadual</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="RG ou IE"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 0000-0000"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatTelefone(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="celular1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular 1</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatTelefone(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="celular2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular 2</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatTelefone(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comissão (%)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCep(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Rua, Avenida, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Bairro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Cidade"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="UF"
                          maxLength={2}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações gerais sobre o vendedor"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  {!vendedorId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={carregandoDados}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Resetar
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link to="/cadastros/vendedores">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={carregandoDados || form.formState.isSubmitting}
                  >
                    {carregandoDados || form.formState.isSubmitting ? (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {vendedorId ? "Salvar Alterações" : "Criar Vendedor"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 