import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { atualizarPerfil } from "@/api/usuario/atualizar-perfil";

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type FormValues = z.infer<typeof formSchema>;

export function PerfilForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "Usuário", // Isso será substituído pelos dados reais do usuário
      email: "usuario@exemplo.com", // Isso será substituído pelos dados reais do usuário
    },
  });
  
  const { mutateAsync: atualizarPerfilFn } = useMutation({
    mutationFn: atualizarPerfil,
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("[PerfilForm] Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
      setIsLoading(false);
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await atualizarPerfilFn(data);
    } catch (error) {
      console.error("[PerfilForm] Erro ao atualizar perfil:", error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
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
                <Input placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
} 