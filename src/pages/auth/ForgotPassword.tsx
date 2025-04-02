import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { recuperarSenha } from "@/api/usuario/recuperar-senha";

const forgotPasswordFormSchema = z.object({
	email: z
		.string({
			required_error: "Email é obrigatório",
		})
		.email("Digite um email válido")
		.min(3, "Email muito curto")
		.nonempty("Email é obrigatório"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPassword() {
	const form = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordFormSchema),
	});
	const {
		handleSubmit,
		control,
		formState: { isLoading },
	} = form;

	const { mutateAsync: recuperarSenhaFn } = useMutation({
		mutationFn: recuperarSenha,
		onSuccess: () => {
			toast.success("Email de recuperação enviado com sucesso!");
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
				return;
			}

			toast.error("Erro desconhecido");
		},
	});

	async function handleForgotPassword({ email }: ForgotPasswordForm) {
		await recuperarSenhaFn({ email });
	}

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(handleForgotPassword)}
				className="border-accent-foreground p-4 flex flex-col gap-3"
			>
				<h1 className="text-accent-foreground text-2xl">Recuperar senha</h1>

				<p className="text-sm text-muted-foreground">
					Digite seu email para receber as instruções de recuperação de senha.
				</p>

				<FormField
					control={control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-Mail</FormLabel>
							<FormControl>
								<Input placeholder="E-mail" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					Enviar instruções
				</Button>

				<div className="text-center text-sm">
					Lembrou sua senha?{" "}
					<Link to="/auth/sign-in" className="text-blue-700 dark:text-blue-400 hover:underline">
						Faça login
					</Link>
				</div>
			</form>
		</Form>
	);
} 