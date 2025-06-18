import {
	buscarDadosCompletosDoCliente,
	type BuscarDadosCompletosDoClienteResponse,
} from "@/api/clientes/buscar-dados-completos-do-cliente";
import { criarCliente } from "@/api/clientes/criar-cliente";
import { editarCliente } from "@/api/clientes/editar-cliente";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	type DadosAdicionaisForm,
	dadosAdicionaisFormSchema,
	FormularioDadosAdicionais,
} from "@/pages/app/cadastros/clientes/formulario/formularios/FormularioDadosAdicionais";
import {
	type DadosGeraisForm,
	dadosGeraisFormSchema,
	FormularioDadosGerais,
} from "@/pages/app/cadastros/clientes/formulario/formularios/FormularioDadosGerais";
import { formatCep } from "@/utils/formatCep";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader, RotateCw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const tabTrigger =
	"data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none hover:text-accent-foreground gap-2";

type DadosGerais = BuscarDadosCompletosDoClienteResponse["dadosGerais"];
type DadosAdicionais = BuscarDadosCompletosDoClienteResponse["dadosAdicionais"];

type Transformations<T> = Partial<{
	[K in keyof T]: (value: T[K]) => T[K] | undefined;
}>;

const transformationsDadosGerais: Transformations<DadosGerais> = {
	identificador: (value) => formatCpfCnpj(value),
	cep: (value) => formatCep(value),
	pracaCep: (value) => formatCep(value),
};

const transformationsDadosAdicionais: Transformations<DadosAdicionais> = {};

function transformValue<T, K extends keyof T>(
	key: K,
	value: T[K],
	transformations: Transformations<T>,
): T[K] | undefined {
	const transformFn = transformations[key];
	if (transformFn) {
		return transformFn(value);
	}
	return value;
}

export function FormularioDeClientes() {
	const navigate = useNavigate();
	const { clienteId } = useParams();
	const queryClient = useQueryClient();
	const dadosGeraisForm = useForm<DadosGeraisForm>({
		resolver: zodResolver(dadosGeraisFormSchema),
	});
	const {
		trigger: triggerDadosGerais,
		handleSubmit: handleSubmitDadosGerais,
		setValue: setValueDadosGerais,
		formState: { touchedFields: touchedFieldsDadosGerais },
	} = dadosGeraisForm;

	const dadosAdicionaisForm = useForm<DadosAdicionaisForm>({
		resolver: zodResolver(dadosAdicionaisFormSchema),
	});
	const {
		trigger: triggerDadosAdicionais,
		handleSubmit: handleSubmitDadosAdicionais,
		setValue: setValueDadosAdicionais,
		formState: { touchedFields: touchedFieldsDadosAdicionais },
	} = dadosAdicionaisForm;

	const {
		failureReason: falhaAoBuscarDadosDoCliente,
		data: dadosDoCliente,
		isFetching: carregandoDadosDoCliente,
	} = useQuery<BuscarDadosCompletosDoClienteResponse>({
		queryKey: ["buscar-dados-completos-do-cliente", clienteId],
		queryFn: () =>
			buscarDadosCompletosDoCliente({ clienteId: clienteId ?? "" }),
		enabled: clienteId !== undefined && clienteId !== "",
		retry: (retries, error) => {
			if (!(error instanceof AxiosError)) {
				return false;
			}
			if (error.status && error.status >= 400 && error.status <= 499) {
				return false;
			}
			if (retries > 2) {
				return false;
			}
			return true;
		},
	});

	const { mutateAsync: criarClienteFn } = useMutation({
		mutationFn: criarCliente,
		onSuccess: (data) => {
			console.log("Sucesso na criação do cliente:", data);
			toast.success("Cliente criado com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["listar-clientes"] });
			navigate("/cadastros/clientes");
		},
		onError: (error) => {
			console.error("Erro ao criar cliente:", error);
			if (error instanceof AxiosError) {
				console.error("Detalhes do erro:", error.response?.data);
			}
			toast.error("Erro ao criar cliente");
		}
	});

	const { mutateAsync: editarClienteFn } = useMutation({
		mutationFn: editarCliente,
	});

	useEffect(() => {
		if (!falhaAoBuscarDadosDoCliente) return;

		if (falhaAoBuscarDadosDoCliente instanceof AxiosError) {
			toast.error(falhaAoBuscarDadosDoCliente.response?.data.message);
		} else {
			toast.error(falhaAoBuscarDadosDoCliente.message);
		}
		navigate("/cadastros/clientes");
	}, [falhaAoBuscarDadosDoCliente, navigate]);

	useEffect(() => {
		if (!dadosDoCliente) return;

		for (const key of Object.keys(dadosDoCliente.dadosGerais) as Array<
			keyof DadosGerais
		>) {
			const valor = transformValue(
				key,
				dadosDoCliente.dadosGerais[key] ?? "",
				transformationsDadosGerais,
			);
			setValueDadosGerais(key, valor);
		}
		for (const key of Object.keys(dadosDoCliente.dadosAdicionais) as Array<
			keyof DadosAdicionais
		>) {
			const valor = transformValue(
				key,
				dadosDoCliente.dadosAdicionais[key] ?? "",
				transformationsDadosAdicionais,
			);

			setValueDadosAdicionais(key, valor);
		}
	}, [dadosDoCliente, setValueDadosGerais, setValueDadosAdicionais]);

	const handleSave = async () => {
		console.log("Iniciando processo de salvar...");
		
		// Validar formulários
		const dadosGeraisValidos = await triggerDadosGerais();
		const dadosAdicionaisValidos = await triggerDadosAdicionais();
		
		console.log("Validação dos formulários:", {
			dadosGeraisValidos,
			dadosAdicionaisValidos
		});

		if (!dadosGeraisValidos || !dadosAdicionaisValidos) {
			console.log("Formulários inválidos, abortando...");
			return;
		}

		const dadosGerais = dadosGeraisForm.getValues();
		const dadosAdicionais = dadosAdicionaisForm.getValues();

		console.log("Dados coletados dos formulários:", {
			dadosGerais,
			dadosAdicionais
		});

		try {
			// Preparar dados no formato que o backend espera
			const dadosBase = {
				// Dados Gerais
				codigo: dadosGerais.codigo || "",
				nome: dadosGerais.nome,
				tipo: dadosGerais.tipo, // Mantendo como string ('fisica' ou 'juridica')
				identificador: dadosGerais.identificador.replace(/\D/g, ""),
				
				// Endereço
				cep: dadosGerais.cep.replace(/\D/g, ""),
				rua: dadosGerais.rua,
				numero: Number(dadosGerais.numero) || 0,
				complemento: dadosGerais.complemento || "",
				bairro: dadosGerais.bairro,
				cidade: dadosGerais.cidade,
				estado: dadosGerais.estado,
				
				// Dados fiscais
				ie: Number(dadosGerais.ie?.replace(/\D/g, "")) || 0,
				contribuinteICMS: "1", // Valor fixo conforme schema
				isuframa: dadosGerais.isuframa || "",
				nomeFantasia: dadosGerais.nomeFantasia || "",
				tipoConsumo: "1", // Valor fixo conforme schema
				
				// Praça de pagamento
				pracaCep: dadosGerais.pracaCep.replace(/\D/g, ""),
				pracaRua: dadosGerais.pracaRua,
				pracaNumero: Number(dadosGerais.pracaNumero) || 0,
				pracaComplemento: dadosGerais.pracaComplemento || "",
				pracaBairro: dadosGerais.pracaBairro,
				pracaCidade: dadosGerais.pracaCidade,
				pracaEstado: dadosGerais.pracaEstado,
				
				// Contato
				nomeContato: dadosGerais.nomeContato || "",
				telefone1: dadosGerais.telefone1 || "",
				telefone2: dadosGerais.telefone2 || "",
				fax: dadosGerais.fax || "",
				site: dadosGerais.site || "",
				emailComercial: dadosGerais.emailComercial || "",
				emailFiscal: dadosGerais.emailFiscal || "",
				
				// Dados Adicionais
				vendedor1: {
					codigo: dadosAdicionais.vendedor1.codigo || "",
					quantidade: Number(dadosAdicionais.vendedor1.quantidade) || 0
				},
				vendedor2: {
					codigo: dadosAdicionais.vendedor2.codigo || "",
					quantidade: Number(dadosAdicionais.vendedor2.quantidade) || 0
				},
				vendedor3: {
					codigo: dadosAdicionais.vendedor3.codigo || "",
					quantidade: Number(dadosAdicionais.vendedor3.quantidade) || 0
				},
				vendedor4: {
					codigo: dadosAdicionais.vendedor4.codigo || "",
					quantidade: Number(dadosAdicionais.vendedor4.quantidade) || 0
				},
				vendedor5: {
					codigo: dadosAdicionais.vendedor5.codigo || "",
					quantidade: Number(dadosAdicionais.vendedor5.quantidade) || 0
				},
				vendedor6: {
					codigo: dadosAdicionais.vendedor6.codigo || "",
					quantidade: Number(dadosAdicionais.vendedor6.quantidade) || 0
				},
				isentoJPI: dadosAdicionais.isentoJPI || "0",
				percentualAumentoTeorico: Number(dadosAdicionais.percentualAumentoTeorico) || 0,
				percentualPerda: Number(dadosAdicionais.percentualPerda) || 0,
				contatosAdicionais: dadosAdicionais.contatosAdicionais || [],
				observacoesGerais: dadosAdicionais.observacoesGerais || ""
				// user_id e organizacao_id são obtidos automaticamente do JWT no backend
			};

			console.log("Dados preparados para envio:", dadosBase);

			if (clienteId) {
				await editarClienteFn({
					clienteId,
					...dadosBase,
				});
				toast.success("Cliente editado com sucesso!");
				queryClient.invalidateQueries({ queryKey: ["listar-clientes"] });
				navigate("/cadastros/clientes");
			} else {
				await criarClienteFn(dadosBase);
			}
		} catch (error) {
			console.error("Erro ao salvar cliente:", error);
			if (error instanceof AxiosError) {
				console.error("Detalhes do erro:", error.response?.data);
				toast.error(error.response?.data?.message || "Erro ao salvar cliente");
			} else {
				toast.error("Erro ao salvar cliente");
			}
		}
	};

	async function handleReset() {
		for (const key in touchedFieldsDadosAdicionais) {
			const keyFromDadosAdicionais = key as keyof DadosAdicionais;
			let valor = (
				dadosDoCliente?.dadosAdicionais[keyFromDadosAdicionais]
					? transformValue(
							keyFromDadosAdicionais,
							dadosDoCliente?.dadosAdicionais[keyFromDadosAdicionais],
							transformationsDadosAdicionais,
						)
					: undefined
			) as DadosAdicionais[keyof DadosAdicionais];

			if (keyFromDadosAdicionais.includes("vendedor")) {
				valor = {
					codigo: "",
					quantidade: 0,
				} as DadosAdicionais["vendedor1"];
			}

			setValueDadosAdicionais(keyFromDadosAdicionais, valor);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">
					{clienteId ? "Editar Cliente" : "Novo Cliente"}
				</h1>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={handleReset}
						disabled={carregandoDadosDoCliente}
					>
						<RotateCw className="h-4 w-4 mr-2" />
						Resetar
					</Button>
					<Button onClick={handleSave} disabled={carregandoDadosDoCliente}>
						{carregandoDadosDoCliente ? (
							<Loader className="h-4 w-4 mr-2 animate-spin" />
						) : null}
						Salvar
					</Button>
				</div>
			</div>
			<Tabs defaultValue="Dados Gerais" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="Dados Gerais" className={cn(tabTrigger)}>
						Dados Gerais
					</TabsTrigger>
					<TabsTrigger value="Dados Adicionais" className={cn(tabTrigger)}>
						Dados Adicionais
					</TabsTrigger>
				</TabsList>
				<TabsContent value="Dados Gerais">
					<FormularioDadosGerais dadosGeraisForm={dadosGeraisForm} />
				</TabsContent>
				<TabsContent value="Dados Adicionais">
					<FormularioDadosAdicionais dadosAdicionaisForm={dadosAdicionaisForm} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
