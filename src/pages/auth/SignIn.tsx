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
import { toast } from "sonner";
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
		<Card className="w-full max-w-md mx-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
			<CardHeader className="space-y-3 text-center pb-4">
				<div className="flex justify-center">
					<Logo size="sm" showText={false} />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Entrar</h1>
					<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Acesse sua conta para continuar</p>
				</div>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">E-Mail</FormLabel>
									<FormControl>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
											<Input 
												placeholder="admin@example.com" 
												{...field} 
												className="pl-10 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 focus:ring-offset-0 hover:border-slate-400 dark:hover:border-slate-500"
												onChange={(e) => {
													console.log("[SignIn] Email alterado:", e.target.value);
													field.onChange(e);
												}}
											/>
										</div>
									</FormControl>
									<FormDescription className="text-xs text-slate-500 dark:text-slate-400">Digite seu email</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="senha"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</FormLabel>
									<FormControl>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
											<PasswordInput 
												placeholder="••••••••" 
												{...field} 
												className="pl-10 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 focus:ring-offset-0 hover:border-slate-400 dark:hover:border-slate-500"
												onChange={(e) => {
													console.log("[SignIn] Senha alterada");
													field.onChange(e);
												}}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button 
							type="submit" 
							disabled={isLoading}
							className="w-full mt-4 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-slate-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Entrando...
								</>
							) : (
								"Entrar no sistema"
							)}
						</Button>

						<div className="flex flex-col gap-3 text-center text-sm mt-4">
							<Link 
								to="/forgot-password" 
								className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline transition-colors duration-200"
							>
								Esqueceu sua senha?
							</Link>
							<div className="text-slate-500 dark:text-slate-500">
								Não tem uma conta?{" "}
								<Link 
									to="/auth/sign-up" 
									className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline transition-colors duration-200 font-medium"
								>
									Criar conta
								</Link>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
