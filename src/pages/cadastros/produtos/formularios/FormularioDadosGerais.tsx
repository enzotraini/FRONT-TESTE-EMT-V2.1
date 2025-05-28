import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormDescription, FormControl } from "@/components/ui/form";

const tipoAcoOptions = [
  "CM-CONSTRUCAO MECANICA",
  "AF-ACO FERRAMENTA",
  "AC-ACO CONSTRUCAO",
  "AI-ACO INOX",
  "RT-RETALHO RETANGULAR",
  "RE-RETALHO REDONDO",
  "TX-TOOLOX",
  "AO-ACO OUTROS",
  "AR-ACO RAPIDO",
  "AB-ACO CARBONO",
  "CH-CHAPA OXICORTE"
];

const tratamentoOptions = [
  "STT-SEM TRATAMENTO",
  "COA-COALESCIDO",
  "REC-RECOZIDO",
  "ESF-ESFEROIDIZADO",
  "NOR-NORMALIZADO",
  "TEM-TEMPERADO",
  "T.R-TEMPERADO E REVENIDO"
];

const produtoSchema = z.object({
  codprod: z.string().max(20),
  tipo: z.string().max(20),
  secao: z.string().max(2),
  bitola: z.string().max(17),
  acab: z.string().max(3),
  unidade: z.string().max(3),
  corrida: z.string().max(15),
  tipoaco: z.string().max(2),
  tratamento: z.string().max(3),
  classifisc: z.string().max(15),
  tributo: z.string().max(4),
  csosn: z.string().max(4),
  observacao: z.string().max(40).optional()
});

type ProdutoForm = z.infer<typeof produtoSchema>;

export function FormularioProduto() {
  const form = useForm<ProdutoForm>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      codprod: "",
      tipo: "",
      secao: "",
      bitola: "",
      acab: "",
      unidade: "",
      corrida: "",
      tipoaco: "",
      tratamento: "",
      classifisc: "",
      tributo: "",
      csosn: "",
      observacao: ""
    }
  });

  return (
    <Form {...form}>
      <form className="grid grid-cols-4 gap-4 p-4">
        <FormField name="codprod" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Código" {...field} /></FormItem>
        )} />
        <FormField name="tipo" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Tipo" {...field} /></FormItem>
        )} />
        <FormField name="secao" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Seção" {...field} /></FormItem>
        )} />
        <FormField name="bitola" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Bitola" {...field} /></FormItem>
        )} />

        <FormField name="acab" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Acabamento" {...field} /></FormItem>
        )} />
        <FormField name="unidade" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Unidade" {...field} /></FormItem>
        )} />
        <FormField name="corrida" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Corrida" {...field} /></FormItem>
        )} />

        <FormField name="tipoaco" control={form.control} render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Tipo Aço" /></SelectTrigger>
              <SelectContent>
                {tipoAcoOptions.map((option) => (
                  <SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )} />

        <FormField name="tratamento" control={form.control} render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Tratamento" /></SelectTrigger>
              <SelectContent>
                {tratamentoOptions.map((option) => (
                  <SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )} />

        <FormField name="classifisc" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Classificação Fiscal" {...field} /></FormItem>
        )} />
        <FormField name="tributo" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Tributo" {...field} /></FormItem>
        )} />
        <FormField name="csosn" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="CSOSN" {...field} /></FormItem>
        )} />
        <FormField name="observacao" control={form.control} render={({ field }) => (
          <FormItem><Input placeholder="Observação" {...field} /></FormItem>
        )} />
      </form>
    </Form>
  );
}