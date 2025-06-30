import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { buscarTransportadoraPorId, TransportadoraCompleta } from "@/api/transportadoras/buscar-transportadora-por-id";
import { criarTransportadora } from "@/api/transportadoras/criar-transportadora";
import { editarTransportadora } from "@/api/transportadoras/editar-transportadora";
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

const transportadoraFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(40, "Nome deve ter no máximo 40 caracteres"),
  cgccpf: z.string().min(11, "CNPJ/CPF deve ter no mínimo 11 caracteres").max(18, "CNPJ/CPF deve ter no máximo 18 caracteres"),
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório").max(40, "Endereço deve ter no máximo 40 caracteres"),
  bairro: z.string().min(1, "Bairro é obrigatório").max(30, "Bairro deve ter no máximo 30 caracteres"),
  cidade: z.string().min(1, "Cidade é obrigatória").max(30, "Cidade deve ter no máximo 30 caracteres"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  telefone1: z.string().optional(),
  telefone2: z.string().optional(),
  fax: z.string().optional(),
  placa: z.string().optional(),
  estadualrg: z.string().optional(),
  fantasia: z.string().optional(),
  placauf: z.string().optional(),
  contato: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  texto: z.string().optional(),
  placauf1: z.string().optional(),
  antt: z.string().optional(),
});

type TransportadoraFormData = z.infer<typeof transportadoraFormSchema>;

export function FormularioDeTransportadora() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const transportadoraId = id;

  const form = useForm<TransportadoraFormData>({
    resolver: zodResolver(transportadoraFormSchema),
    defaultValues: {
      nome: "",
      cgccpf: "",
      cep: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      telefone1: "",
      telefone2: "",
      fax: "",
      placa: "",
      estadualrg: "",
      fantasia: "",
      placauf: "",
      contato: "",
      email: "",
      texto: "",
      placauf1: "",
      antt: "",
    }
  });

  // Buscar dados da transportadora para edição
  const {
    data: dadosTransportadora,
    isFetching: carregandoDados,
  } = useQuery<TransportadoraCompleta>({
    queryKey: ["buscar-transportadora", transportadoraId],
    queryFn: () => buscarTransportadoraPorId(Number(transportadoraId)),
    enabled: transportadoraId !== undefined && transportadoraId !== "",
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
    if (dadosTransportadora && transportadoraId) {
      const dados = dadosTransportadora.dadosGerais;
      form.setValue("nome", dados.nome || "");
      form.setValue("cgccpf", dados.cgccpf || "");
      form.setValue("cep", dados.cep || "");
      form.setValue("endereco", dados.endereco || "");
      form.setValue("bairro", dados.bairro || "");
      form.setValue("cidade", dados.cidade || "");
      form.setValue("estado", dados.estado || "");
      form.setValue("telefone1", dados.telefone1 || "");
      form.setValue("telefone2", dados.telefone2 || "");
      form.setValue("fax", dados.fax || "");
      form.setValue("placa", dados.placa || "");
      form.setValue("estadualrg", dados.estadualrg || "");
      form.setValue("fantasia", dados.fantasia || "");
      form.setValue("placauf", dados.placauf || "");
      form.setValue("contato", dados.contato || "");
      form.setValue("email", dados.email || "");
      form.setValue("texto", dados.texto || "");
      form.setValue("placauf1", dados.placauf1 || "");
      form.setValue("antt", dados.antt || "");
    }
  }, [dadosTransportadora, transportadoraId, form]);

  // Mutation para criar transportadora
  const { mutateAsync: criarTransportadoraFn } = useMutation({
    mutationFn: criarTransportadora,
    onSuccess: () => {
      toast.success("Transportadora criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transportadoras"] });
      navigate("/cadastros/transportadoras");
    },
    onError: (error) => {
      console.error("Erro ao criar transportadora:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao criar transportadora");
      } else {
        toast.error("Erro ao criar transportadora");
      }
    },
  });

  // Mutation para editar transportadora
  const { mutateAsync: editarTransportadoraFn } = useMutation({
    mutationFn: editarTransportadora,
    onSuccess: () => {
      toast.success("Transportadora editada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transportadoras"] });
      navigate("/cadastros/transportadoras");
    },
    onError: (error) => {
      console.error("Erro ao editar transportadora:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao editar transportadora");
      } else {
        toast.error("Erro ao editar transportadora");
      }
    },
  });

  const handleSubmit = async (data: TransportadoraFormData) => {
    try {
      const dadosBase = {
        ...data,
        cgccpf: data.cgccpf.replace(/\D/g, ""),
        cep: data.cep.replace(/\D/g, ""),
        user_id: 1, // TODO: Pegar do contexto de autenticação
        organizacao_id: 1, // TODO: Pegar do contexto de autenticação
      };

      if (transportadoraId) {
        await editarTransportadoraFn({
          id: Number(transportadoraId),
          ...dadosBase,
        });
      } else {
        await criarTransportadoraFn(dadosBase);
      }
    } catch (error) {
      console.error("Erro ao salvar transportadora:", error);
    }
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/cadastros/transportadoras">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {transportadoraId ? "Editar Transportadora" : "Nova Transportadora"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Transportadora</CardTitle>
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
                      <FormLabel>Nome da Transportadora</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o nome da transportadora"
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
                          placeholder="00.000.000/0000-00"
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
                  name="fantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome fantasia"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do contato"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone 1</FormLabel>
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
                  name="telefone2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone 2</FormLabel>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="contato@transportadora.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 0000-0000"
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

                <FormField
                  control={form.control}
                  name="estadualrg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inscrição Estadual</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="IE"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dados específicos de transportadora */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ABC-1234"
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

                <FormField
                  control={form.control}
                  name="placauf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF da Placa</FormLabel>
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

                <FormField
                  control={form.control}
                  name="antt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ANTT</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Registro ANTT"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="texto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações gerais sobre a transportadora"
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
                  {!transportadoraId && (
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
                  <Link to="/cadastros/transportadoras">
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
                    {transportadoraId ? "Salvar Alterações" : "Criar Transportadora"}
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