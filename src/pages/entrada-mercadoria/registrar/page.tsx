import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, PackageOpen, Plus, Save, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const formSchema = z.object({
  numeroNF: z.string().min(1, "Número da NF é obrigatório"),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  dataEmissao: z.date(),
  dataEntrada: z.date(),
  transportadora: z.string().optional(),
  itens: z.array(z.object({
    produto: z.string().min(1, "Produto é obrigatório"),
    quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
    valorUnitario: z.number().min(0, "Valor unitário deve ser maior ou igual a 0"),
    unidade: z.string().min(1, "Unidade é obrigatória"),
  })),
  observacoes: z.string().optional(),
});

export default function RegistrarEntradaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataEmissao: new Date(),
      dataEntrada: new Date(),
      itens: [],
      observacoes: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // TODO: Implementar integração com API
      console.log(values);
      toast.success("Entrada de mercadoria registrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao registrar entrada de mercadoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Registrar Entrada de Mercadoria</h1>
          <p className="text-gray-500 dark:text-gray-400">Preencha os dados para registrar uma nova entrada</p>
        </div>
        <Button 
          variant="outline" 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar Entrada
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Nota Fiscal</CardTitle>
              <CardDescription>Informações básicas da nota fiscal de entrada</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numeroNF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número da NF</FormLabel>
                          <FormControl>
                            <Input placeholder="000000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fornecedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fornecedor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o fornecedor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Fornecedor 1</SelectItem>
                              <SelectItem value="2">Fornecedor 2</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dataEmissao"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Emissão</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dataEntrada"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Entrada</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="transportadora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportadora</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a transportadora" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Transportadora 1</SelectItem>
                            <SelectItem value="2">Transportadora 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Itens da Nota</CardTitle>
                  <CardDescription>Produtos recebidos nesta entrada</CardDescription>
                </div>
                <Button variant="outline" onClick={() => {}}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Produto</th>
                      <th className="py-3 px-4 text-left">Quantidade</th>
                      <th className="py-3 px-4 text-left">Unidade</th>
                      <th className="py-3 px-4 text-left">Valor Unit.</th>
                      <th className="py-3 px-4 text-left">Total</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4" colSpan={6}>
                        <p className="text-center text-gray-500">
                          Nenhum item adicionado
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Lateral - Resumo */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Entrada</CardTitle>
              <CardDescription>Informações gerais da nota</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total de Itens
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Valor Total
                  </p>
                  <p className="text-2xl font-bold">R$ 0,00</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <div className="mt-1 flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2" />
                    <p className="text-sm font-medium">Pendente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[100px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Digite observações adicionais..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 