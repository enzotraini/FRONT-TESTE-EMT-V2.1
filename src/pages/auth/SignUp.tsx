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
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { criarUsuario } from "@/api/usuario/criar-usuario";

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
		<Form {...form}>
			<form
				onSubmit={handleSubmit(handleSignUp)}
				className="border-accent-foreground p-4 flex flex-col gap-3"
			>
				<h1 className="text-accent-foreground text-2xl">Criar conta</h1>

				<FormField
					control={control}
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Nome completo" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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

				<FormField
					control={control}
					name="senha"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Senha</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Senha" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="confirmarSenha"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmar Senha</FormLabel>
							<FormControl>
								<PasswordInput placeholder="Confirmar senha" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					Criar conta
				</Button>

				<div className="text-center text-sm">
					Já tem uma conta?{" "}
					<Link to="/auth/sign-in" className="text-blue-700 dark:text-blue-400 hover:underline">
						Faça login
					</Link>
				</div>
			</form>
		</Form>
	);
} 