import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useMutation } from "@tanstack/react-query";
import { authenticate } from "@/api/usuario/authenticate";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { AxiosError } from "axios";
import { Loader2, Mail, Lock } from "lucide-react";

const signInFormSchema = z.object({
	email: z
		.string({
			required_error: "Email é obrigatório",
		})
		.email("Digite um email válido")
		.min(3, "Email muito curto")
		.nonempty("Email é obrigatório"),
	senha: z
		.string({
			required_error: "Senha é obrigatória",
		})
		.nonempty("Senha é obrigatória"),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignIn() {
	console.log("[SignIn] Componente montado");

	const form = useForm<SignInForm>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			senha: ""
		}
	});
	const navigate = useNavigate();
	const {
		handleSubmit,
		control,

		formState: { isLoading, errors },
	} = form;

	const { mutateAsync: authenticateFn } = useMutation({
		mutationFn: authenticate,
		onSuccess: async (response, variables, context) => {
			console.log("[SignIn] Login realizado com sucesso!");
			console.log("[SignIn] Resposta da API:", response);
			console.log("[SignIn] Cookies atuais:", document.cookie);

			// Verifica se há qualquer cookie definido
			if (!document.cookie) {
				console.error("[SignIn] Nenhum cookie encontrado após login");
				toast.error("Erro ao fazer login: cookies não foram definidos");
				return;
			}

			// Verifica especificamente o cookie auth_check
			const hasAuthCheck = document.cookie.includes('auth_check=true');
			if (!hasAuthCheck) {
				console.error("[SignIn] Cookie auth_check não encontrado");
				toast.error("Erro ao fazer login: autenticação incompleta");
				return;
			}

			toast.success("Login realizado com sucesso!");

			// Navega para a rota principal protegida após um pequeno delay
			console.log("[SignIn] Aguardando antes de navegar...");
			await new Promise(resolve => setTimeout(resolve, 1000));

			console.log("[SignIn] Cookies antes da navegação:", document.cookie);
			console.log("[SignIn] Navegando para a rota principal...");

			// Usa replace: true para evitar que o usuário volte para a página de login
			navigate("/", { replace: true });
		},
		onError: (error) => {
			console.error("[SignIn] Erro ao fazer login:", error);

			if (error instanceof AxiosError) {
				console.error("[SignIn] Detalhes do erro:", {
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
					headers: error.response?.headers,
					config: error.config,
				});
				if (error.response?.status === 401) {
					toast.error("Email ou senha inválidos");
				} else if (error.message === "Network Error") {
					toast.error("Erro de conexão com o servidor. Verifique se o backend está rodando.");
				} else if (error.message.includes("cookies")) {
					toast.error("Erro ao definir cookies de autenticação. Verifique se os cookies estão habilitados no navegador.");
				} else {
					toast.error("Erro ao fazer login. Tente novamente.");
				}
			} else {
				toast.error("Erro desconhecido ao fazer login. Tente novamente.");
			}
		},
	});

	const onSubmit = async (data: SignInForm) => {
		console.log("[SignIn] Formulário submetido");
		console.log("[SignIn] Dados do formulário:", data);
		console.log("[SignIn] Cookies antes do login:", document.cookie);

		try {

			await authenticateFn(data);
		} catch (error) {
			console.error("[SignIn] Erro ao fazer login:", error);
		}
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="border-accent-foreground p-4 flex flex-col gap-3"
					noValidate
				>
					<h1 className="text-accent-foreground text-2xl">Entrar</h1>

					{/* --- campos --- */}
					<FormField
						control={control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-Mail</FormLabel>
								<FormControl>
									<Input
										placeholder="E-mail"
										{...field}
										onChange={(e) => {
											console.log('[SignIn] Email alterado:', e.target.value)
											field.onChange(e)
										}}
									/>
								</FormControl>
								<FormDescription>Digite seu email</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="senha"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Senha</FormLabel>
								<FormControl>
									<PasswordInput
										placeholder="Senha"
										{...field}
										onChange={(e) => {
											console.log('[SignIn] Senha alterada')
											field.onChange(e)
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Entrando…' : 'Entrar no sistema'}
					</Button>

					<div className="flex flex-col gap-2 text-center text-sm">
						<Link
							to="/forgot-password"
							className="text-blue-700 dark:text-blue-400 hover:underline"
						>
							Esqueceu sua senha?
						</Link>
						<div>
							Não tem uma conta?{' '}
							<Link
								to="/auth/sign-up"
								className="text-blue-700 dark:text-blue-400 hover:underline"
							>
								Criar conta
							</Link>
						</div>
					</div>
				</form>
			</Form>

			{/* 👇 portal de toasts  —  exibe mensagens como “Email ou senha inválidos” */}
			<Toaster richColors position="top-center" />
		</>
	);
}
