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
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { criarUsuario } from "@/api/usuario/criar-usuario";
import { Loader2, User, Mail, Lock, CheckCircle } from "lucide-react";

const signUpFormSchema = z.object({
	nome: z
		.string({
			required_error: "Nome é obrigatório",
		})
		.min(3, "Nome muito curto")
		.nonempty("Nome é obrigatório"),
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
		.min(6, "Senha deve ter no mínimo 6 caracteres")
		.nonempty("Senha é obrigatória"),
	confirmarSenha: z
		.string({
			required_error: "Confirmação de senha é obrigatória",
		})
		.nonempty("Confirmação de senha é obrigatória"),
}).refine((data) => data.senha === data.confirmarSenha, {
	message: "As senhas não coincidem",
	path: ["confirmarSenha"],
});

type SignUpForm = z.infer<typeof signUpFormSchema>;

export function SignUp() {
	console.log("Renderizando SignUp - Início");
	const form = useForm<SignUpForm>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			nome: "",
			email: "",
			senha: "",
			confirmarSenha: ""
		}
	});
	console.log("Renderizando SignUp - Form inicializado");
	const navigate = useNavigate();
	const {
		handleSubmit,
		control,
		formState: { isLoading },
	} = form;

	const { mutateAsync: criarUsuarioFn } = useMutation({
		mutationFn: criarUsuario,
		onSuccess: () => {
			console.log("Usuário criado com sucesso");
			toast.success("Usuário criado com sucesso!");
			navigate("/auth/sign-in");
		},
		onError: (error) => {
			console.error("Erro ao criar usuário:", error);
			if (error instanceof AxiosError) {
				if (error.response?.status === 400) {
					toast.error(error.response.data.message || "Email já está em uso");
				} else {
					toast.error(error.response?.data.message || "Erro ao criar usuário");
				}
				return;
			}

			toast.error("Erro desconhecido");
		},
	});

	async function handleSignUp({ nome, email, senha }: SignUpForm) {
		console.log("Tentando criar usuário:", { nome, email });
		await criarUsuarioFn({ nome, email, senha });
	}

	console.log("Renderizando SignUp - Antes do return");
	return (
		<Card className="w-full max-w-md mx-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
			<CardHeader className="space-y-3 text-center pb-4">
				<div className="flex justify-center">
					<Logo size="sm" showText={false} />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Criar conta</h1>
					<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Crie sua conta para começar</p>
				</div>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={handleSubmit(handleSignUp)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={control}
							name="nome"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome</FormLabel>
									<FormControl>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
											<Input 
												placeholder="Nome completo" 
												{...field} 
												className="pl-10 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 focus:ring-offset-0 hover:border-slate-400 dark:hover:border-slate-500"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
												placeholder="seu@email.com" 
												{...field} 
												className="pl-10 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 focus:ring-offset-0 hover:border-slate-400 dark:hover:border-slate-500"
											/>
										</div>
									</FormControl>
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
												placeholder="Mínimo 6 caracteres" 
												{...field} 
												className="pl-10 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 focus:ring-offset-0 hover:border-slate-400 dark:hover:border-slate-500"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="confirmarSenha"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirmar Senha</FormLabel>
									<FormControl>
										<div className="relative">
											<CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
											<PasswordInput 
												placeholder="Confirme sua senha" 
												{...field} 
												className="pl-10 transition-all duration-200 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 focus:ring-offset-0 hover:border-slate-400 dark:hover:border-slate-500"
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
									Criando conta...
								</>
							) : (
								"Criar conta"
							)}
						</Button>

						<div className="text-center text-sm mt-4">
							<div className="text-slate-500 dark:text-slate-500">
								Já tem uma conta?{" "}
								<Link 
									to="/auth/sign-in" 
									className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline transition-colors duration-200 font-medium"
								>
									Faça login
								</Link>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
} 