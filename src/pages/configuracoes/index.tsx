import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const perfilSchema = z.object({
	nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("Email inválido"),
});

const senhaSchema = z.object({
	senhaAtual: z.string().min(6, "Senha atual deve ter no mínimo 6 caracteres"),
	novaSenha: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
	confirmarSenha: z.string().min(6, "Confirmação de senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
	message: "As senhas não conferem",
	path: ["confirmarSenha"],
});

type PerfilFormData = z.infer<typeof perfilSchema>;
type SenhaFormData = z.infer<typeof senhaSchema>;

export function ConfiguracoesPage() {
	const { success: toastSuccess, error: toastError } = useToast();
	const [activeTab, setActiveTab] = useState("perfil");

	const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm<PerfilFormData>({
		resolver: zodResolver(perfilSchema),
	});

	const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm<SenhaFormData>({
		resolver: zodResolver(senhaSchema),
	});

	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await api.get("/users/me");
			return response.data;
		},
	});

	const { mutateAsync: atualizarPerfilFn, isPending: isProfileLoading } = useMutation({
		mutationFn: async (data: PerfilFormData) => {
			const response = await api.put("/users/me", data);
			return response.data;
		},
		onSuccess: () => {
			toastSuccess({
				title: "Perfil atualizado",
				description: "Seu perfil foi atualizado com sucesso!",
			});
		},
		onError: () => {
			toastError({
				title: "Erro ao atualizar perfil",
				description: "Ocorreu um erro ao tentar atualizar seu perfil. Tente novamente.",
			});
		},
	});

	const { mutateAsync: atualizarSenhaFn, isPending: isPasswordLoading } = useMutation({
		mutationFn: async (data: SenhaFormData) => {
			const response = await api.put("/users/me/password", {
				senhaAtual: data.senhaAtual,
				novaSenha: data.novaSenha,
			});
			return response.data;
		},
		onSuccess: () => {
			toastSuccess({
				title: "Senha atualizada",
				description: "Sua senha foi atualizada com sucesso!",
			});
			resetPasswordForm();
		},
		onError: () => {
			toastError({
				title: "Erro ao atualizar senha",
				description: "Ocorreu um erro ao tentar atualizar sua senha. Tente novamente.",
			});
		},
	});

	const onSubmitProfile = handleSubmitProfile(async (data) => {
		await atualizarPerfilFn(data);
	});

	const onSubmitPassword = handleSubmitPassword(async (data) => {
		await atualizarSenhaFn(data);
	});

	return (
		<div className="container mx-auto py-6">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
						<p className="text-muted-foreground">
							Gerencie suas preferências e configurações da conta
						</p>
					</div>
				</div>

				<TabsList>
					<TabsTrigger value="perfil">Perfil</TabsTrigger>
					<TabsTrigger value="senha">Senha</TabsTrigger>
				</TabsList>

				<TabsContent value="perfil">
					<Card>
						<CardHeader>
							<CardTitle>Informações do Perfil</CardTitle>
							<CardDescription>
								Atualize suas informações pessoais
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={onSubmitProfile} className="space-y-4">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="nome">Nome</Label>
										<Input
											id="nome"
											{...registerProfile("nome")}
											disabled={isProfileLoading}
										/>
										{profileErrors.nome && (
											<p className="text-sm text-red-500">{profileErrors.nome.message}</p>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											{...registerProfile("email")}
											disabled={isProfileLoading}
										/>
										{profileErrors.email && (
											<p className="text-sm text-red-500">{profileErrors.email.message}</p>
										)}
									</div>
								</div>
								<Button type="submit" disabled={isProfileLoading}>
									{isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Salvar alterações
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="senha">
					<Card>
						<CardHeader>
							<CardTitle>Alterar Senha</CardTitle>
							<CardDescription>
								Atualize sua senha de acesso
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={onSubmitPassword} className="space-y-4">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="senhaAtual">Senha Atual</Label>
										<Input
											id="senhaAtual"
											type="password"
											{...registerPassword("senhaAtual")}
											disabled={isPasswordLoading}
										/>
										{passwordErrors.senhaAtual && (
											<p className="text-sm text-red-500">{passwordErrors.senhaAtual.message}</p>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="novaSenha">Nova Senha</Label>
										<Input
											id="novaSenha"
											type="password"
											{...registerPassword("novaSenha")}
											disabled={isPasswordLoading}
										/>
										{passwordErrors.novaSenha && (
											<p className="text-sm text-red-500">{passwordErrors.novaSenha.message}</p>
										)}
									</div>
									<div className="grid gap-2">
										<Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
										<Input
											id="confirmarSenha"
											type="password"
											{...registerPassword("confirmarSenha")}
											disabled={isPasswordLoading}
										/>
										{passwordErrors.confirmarSenha && (
											<p className="text-sm text-red-500">{passwordErrors.confirmarSenha.message}</p>
										)}
									</div>
								</div>
								<Button type="submit" disabled={isPasswordLoading}>
									{isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Alterar senha
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
} 