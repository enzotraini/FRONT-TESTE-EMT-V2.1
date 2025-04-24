import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { alterarSenha } from "@/api/usuario/alterar-senha";

const formSchema = z.object({
  senhaAtual: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  novaSenha: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type FormValues = z.infer<typeof formSchema>;

export function SenhaForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  });
  
  const { mutateAsync: alterarSenhaFn } = useMutation({
    mutationFn: alterarSenha,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      form.reset();
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("[SenhaForm] Erro ao alterar senha:", error);
      toast.error("Erro ao alterar senha. Tente novamente.");
      setIsLoading(false);
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await alterarSenhaFn(data);
    } catch (error) {
      console.error("[SenhaForm] Erro ao alterar senha:", error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="senhaAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Atual</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Digite sua senha atual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="novaSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Digite sua nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmarSenha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirme sua nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Alterando..." : "Alterar senha"}
        </Button>
      </form>
    </Form>
  );
} 