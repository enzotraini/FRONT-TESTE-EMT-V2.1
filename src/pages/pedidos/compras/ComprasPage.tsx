import { useEffect, useState } from "react";
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
import { CalendarIcon, Loader2, Plus, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { AdicionarItemPedidoDialog } from "@/components/dialogs/AdicionarItemPedidoDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

console.log("[ComprasPage] Iniciando carregamento do módulo");

const formSchema = z.object({
  numeroPedido: z.string().min(1, "Número do pedido é obrigatório"),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  dataEmissao: z.date(),
  dataEntrega: z.date(),
  condicaoPagamento: z.string().min(1, "Condição de pagamento é obrigatória"),
  itens: z.array(z.object({
    produto: z.string().min(1, "Produto é obrigatório"),
    quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
    valorUnitario: z.number().min(0, "Valor unitário deve ser maior ou igual a 0"),
    unidade: z.string().min(1, "Unidade é obrigatória"),
  })),
  observacoes: z.string().optional(),
});

export default function ComprasPage() {
  console.log("[ComprasPage] Iniciando renderização do componente");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataEmissao: new Date(),
      dataEntrega: new Date(),
      itens: [],
      observacoes: "",
    },
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log("[ComprasPage] useEffect - Componente montado");
    return () => {
      console.log("[ComprasPage] useEffect - Componente desmontado");
    };
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("[ComprasPage] Iniciando submissão do formulário", values);
    try {
      setIsSubmitting(true);
      // TODO: Implementar integração com API
      console.log("[ComprasPage] Dados do formulário:", values);
      toast.success("Pedido de compra registrado com sucesso!");
    } catch (error) {
      console.error("[ComprasPage] Erro ao submeter formulário:", error);
      toast.error("Erro ao registrar pedido de compra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = (data: any) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      produto: data.produto,
      quantidade: data.quantidade,
      unidade: data.unidade,
      valorUnitario: data.valorUnitario,
      valorTotal: data.quantidade * data.valorUnitario,
    };
    setItems([...items, newItem]);
  };

  const totalPedido = items.reduce((acc, item) => acc + item.valorTotal, 0);

  console.log("[ComprasPage] Renderizando JSX");
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pedido de Compra</h1>
          <p className="text-gray-500 dark:text-gray-400">Registre um novo pedido de compra</p>
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
          Salvar Pedido
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Pedido</CardTitle>
              <CardDescription>Informações básicas do pedido de compra</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numeroPedido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Pedido</FormLabel>
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
                      name="dataEntrega"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Entrega</FormLabel>
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
                                  date < new Date()
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
                    name="condicaoPagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condição de Pagamento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a condição" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">À Vista</SelectItem>
                            <SelectItem value="2">30 Dias</SelectItem>
                            <SelectItem value="3">30/60 Dias</SelectItem>
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
                  <CardTitle>Itens do Pedido</CardTitle>
                  <CardDescription>Produtos a serem comprados</CardDescription>
                </div>
                <AdicionarItemPedidoDialog onSubmit={handleAddItem} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Valor Unitário</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.produto}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">
                        R$ {item.valorUnitario.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {item.valorTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Nenhum item adicionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Card Lateral - Resumo */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
              <CardDescription>Informações gerais do pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total de Itens
                  </p>
                  <p className="text-2xl font-bold">{items.length}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Valor Total
                  </p>
                  <p className="text-2xl font-bold">R$ {totalPedido.toFixed(2)}</p>
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