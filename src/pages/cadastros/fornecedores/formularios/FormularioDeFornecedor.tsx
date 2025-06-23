import {
	buscarDadosCompletosDoFornecedor,
	type BuscarDadosCompletosDoFornecedorResponse,
} from "@/api/fornecedor/buscar-dados-completos-do-fornecedor";
import { criarCliente } from "@/api/clientes/criar-cliente";
import { editarCliente } from "@/api/clientes/editar-cliente";
//import { buscarDadosCompletosDoFornecedor } from "@/api/fornecedor/buscar-dados-completos-do-fornecedor";
import { criarFornecedorService } from "@/api/fornecedor/criar-service";
import { editarFornecedor } from "@/api/fornecedor/editar-fornecedor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
//import { DadosAdicionaisForm, dadosAdicionaisFormSchema } from "@/pages/cadastros/fornecedores/formularios/FormularioDadosAdicionais";
import { FormularioDadosGerais } from "@/pages/cadastros/fornecedores/formularios/FormularioDadosGerais";
import { formatCep } from "@/utils/formatCep";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ListarResponse, listarDaContaContabil } from "@/api/fiscal/listas-produto";
import { z } from "zod";

const tabTrigger =
	"data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none hover:text-accent-foreground gap-2";

type DadosGerais = BuscarDadosCompletosDoFornecedorResponse["dadosGerais"];
//type DadosAdicionais = BuscarDadosCompletosDoFornecedorResponse["dadosAdicionais"];

type Transformations<T> = Partial<{
	[K in keyof T]: (value: T[K]) => T[K] | undefined;
}>;

const transformationsDadosGerais: Transformations<DadosGerais> = {
	identificador: (value) => formatCpfCnpj(value),
	cep: (value) => formatCep(value)
};

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

export const tiposIEValidos = ["1", "2", "9"] as const;

export const dadosGeraisFormSchema = z.object({
	codigo: z.string().optional(),
	nome: z
		.string({ required_error: "Nome é obrigatório" })
		.min(1, "Nome é obrigatório.")
		.max(100, "Nome deve ter no máximo 100 caracteres."),
	cgcfor: z
		.string({ required_error: "CPF/CNPJ é obrigatório." })
		.min(11, "CPF/CNPJ deve ter no mínimo 11 caracteres.")
		.max(18, "CPF/CNPJ deve ter no máximo 18 caracteres."),
	cep: z
		.string({ required_error: "CEP é obrigatório." })
		.refine((cep) => cep.replace(/\D/g, "").length === 8, {
			message: "CEP inválido.",
		}),
	//.max(9, "CEP deve ter no máximo 9 caracteres."),
	endereco: z
		.string({ required_error: "Rua é obrigatória." })
		.min(1, "Rua é obrigatória.")
		.max(100, "Rua deve ter no máximo 100 caracteres."),
	numero: z.coerce.number(),
	complemento: z
		.string()
		.max(30, "Complemento deve ter no máximo 30 caracteres.")
		.optional(),
	bairro: z
		.string({ required_error: "Bairro é obrigatório." })
		.min(1, "Bairro é obrigatório.")
		.max(30, "Bairro deve ter no máximo 30 caracteres."),
	cidade: z
		.string({ required_error: "Cidade é obrigatória." })
		.min(1, "Cidade é obrigatória.")
		.max(30, "Cidade deve ter no máximo 30 caracteres."),
	estado: z
		.string({ required_error: "Estado é obrigatório." })
		.min(1, "Estado é obrigatório.")
		.max(2, "Estado deve ter no máximo 2 caracteres."),
	nomeFantasia: z.string().max(20, "Nome Fantasia deve ter no máximo 20 caracteres.").optional(),
	observacao: z.string().max(40, "Observação deve ter no máximo 40 caracteres.").optional(),
	nomeContato: z.string().max(15, "Nome do contato deve ter no máximo 15 caracteres.").optional(),
	telefone1: z.string().max(15, "Telefone 1 deve ter no máximo 15 caracteres.").optional(),
	telefone2: z.string().max(15, "Telefone 2 deve ter no máximo 15 caracteres.").optional(),
	segmento: z.string().max(30, "Segmento deve ter no máximo 30 caracteres.").optional(),
	site: z.string().max(100, "Site deve ter no máximo 100 caracteres.").optional(),
	estadualrg: z.string().max(15, "IE deve ter no máximo 15 caracteres.").optional(),
	tipoie: z.preprocess(
		(val) => String(val),
		z.enum(tiposIEValidos, {
			required_error: "Tipo de IE é obrigatório",
			invalid_type_error: "Tipo de IE inválido"
		})
	),
	contaContabil: z.string().max(8, "Conta contábil inválida").optional(),
	emailComercial: z
		.string()
		.max(50, "Email comercial deve ter no máximo 50 caracteres.")
		.refine(
			(val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
			{ message: "Email comercial inválido." }
		)
		.optional(),
	emailFiscal: z
		.string()
		.max(100, "Email fiscal deve ter no máximo 100 caracteres.")
		.refine(
			(val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
			{ message: "Email fiscal inválido." }
		)
		.optional(),
});

export type DadosGeraisForm = z.infer<typeof dadosGeraisFormSchema>;

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;
}

export function FormularioFornecedor() {
	const navigate = useNavigate();
	const { id } = useParams();
	const fornecedorId = id;
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	const dadosGeraisForm = useForm<DadosGeraisForm>({
		resolver: zodResolver(dadosGeraisFormSchema),
		defaultValues: {
			nome: "",
			//tipo: "fisica",
			cgcfor: "",
			cep: "",
			endereco: "",
			numero: 0,
			complemento: "",
			bairro: "",
			cidade: "",
			estado: "",
			estadualrg: "",
			tipoie: undefined,
			contaContabil: "",
			nomeFantasia: "",
			observacao: "",
			nomeContato: "",
			telefone1: "",
			telefone2: "",
			site: "",
			emailComercial: "",
			emailFiscal: "",
			codigo: ""
		}
	});

	const {
		trigger: triggerDadosGerais,
		handleSubmit: handleSubmitDadosGerais,
		setValue: setValueDadosGerais,
		formState: { touchedFields: touchedFieldsDadosGerais },
	} = dadosGeraisForm;

	const {
		failureReason: falhaAoBuscardadosDoFornecedor,
		data: dadosDoFornecedor,
		isFetching: carregandoDadosDoFornecedor,
	} = useQuery<BuscarDadosCompletosDoFornecedorResponse>({
		queryKey: ["buscar-dados-completos-do-fornecedor", fornecedorId],
		queryFn: () =>
			buscarDadosCompletosDoFornecedor({ fornecedorId: fornecedorId ?? "" }),
		enabled: fornecedorId !== undefined && fornecedorId !== "",
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

	const [search, setSearch] = useState("");

	const {
		failureReason: falhaAoBuscarContasContabeis,
		data: dadosDaContaContabil,
		isFetching: carregandoContaContabil,
	} = useQuery<ListarResponse>({
		queryKey: ["listar-conta-contabil", search],
		queryFn: () => listarDaContaContabil({ contaContabil: search ?? "" }),
		enabled: search === "" || search.length > 3,
		retry: (retries, error) => {
			if (!(error instanceof AxiosError)) return false;
			if (error.status && error.status >= 400 && error.status <= 499) return false;
			return retries <= 2;
		},
		staleTime: 1000 * 60 * 5,
	});

	// return {
	// 	falhaAoBuscarContasContabeis,
	// 	dadosDaContaContabil,
	// 	carregandoContaContabil,
	// };

	// const { mutateAsync: criarFornecedorFn } = useMutation({
	// 	mutationFn: criarFornecedorService,
	// 	onSuccess: (data) => {
	// 		console.log("Sucesso na criação do cliente:", data);
	// 		toast.success("Cliente criado com sucesso!");
	// 		queryClient.invalidateQueries({ queryKey: ["listar-fornecedores"] });
	// 		navigate("/cadastros/fornecedores");
	// 	},
	// 	onError: (error) => {
	// 		console.error("Erro ao criar cliente:", error);
	// 		if (error instanceof AxiosError) {
	// 			console.error("Detalhes do erro:", error.response?.data);
	// 		}
	// 		toast.error("Erro ao criar cliente");
	// 	}
	// });

	const { mutateAsync: editarFornecedorFn } = useMutation({
		mutationFn: editarFornecedor,
	});

	const { mutateAsync: criarFornecedorFn } = useMutation({
		mutationFn: criarFornecedorService,
	});

	useEffect(() => {
		if (!dadosDoFornecedor || !dadosDoFornecedor.dadosGerais) return;

		console.log("Populando campos do formulário exceto contaContabil");

		const dados = dadosDoFornecedor.dadosGerais;

		for (const key of Object.keys(dados) as Array<keyof DadosGerais>) {
			if (key === "contaContabil") continue; // pula contaContabil aqui

			const valor = transformValue(key, dados[key], transformationsDadosGerais);
			setValueDadosGerais(key, valor);
		}
	}, [dadosDoFornecedor, setValueDadosGerais]);

	// Preenche o campo contaContabil quando combo estiver carregado
	useEffect(() => {

		if (
			!dadosDoFornecedor?.dadosGerais?.ctacontabi ||
			!dadosDaContaContabil ||
			!Array.isArray(dadosDaContaContabil)
		) {
			return;
		}

		const existe = dadosDaContaContabil.some(
			(c) => c.value === dadosDoFornecedor.dadosGerais.ctacontabi,
		);

		if (existe) {
			console.log("Setando contaContabil:", dadosDoFornecedor.dadosGerais.ctacontabi);
			setValueDadosGerais("contaContabil", dadosDoFornecedor.dadosGerais.ctacontabi);
		}
	}, [dadosDoFornecedor?.dadosGerais?.ctacontabi, dadosDaContaContabil, setValueDadosGerais]);

	const handleSave = async () => {
		console.log("Iniciando processo de salvar...");

		// Validar formulários
		const dadosGeraisValidos = await dadosGeraisForm.trigger();

		if (!dadosGeraisValidos) {
			console.log("Formulário inválido");
			return;
		}

		const dadosGerais = dadosGeraisForm.getValues();

		try {
			setIsLoading(true);
			// Limpar e validar o CPF/CNPJ
			const identificadorLimpo = dadosGerais?.cgcfor.replace(/\D/g, "");

			if (identificadorLimpo.length !== 11 && identificadorLimpo.length !== 14) {
				toast.error("CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos");
				return;
			}

			// Preparar dados no formato que o backend espera
			const dadosBase = {
				// Dados Gerais
				codigo: dadosGerais?.codigo || "",
				nome: dadosGerais?.nome,
				cgcfor: identificadorLimpo, // Campo correto para o backend
				// Endereço
				endereco: dadosGerais?.endereco,
				numero: Number(dadosGerais?.numero) || 0,
				complemento: dadosGerais?.complemento || "",
				bairro: dadosGerais?.bairro,
				cidade: dadosGerais?.cidade,
				cep: dadosGerais?.cep.replace(/\D/g, ""),
				estado: dadosGerais?.estado,
				// Dados opcionais
				nomeFantasia: dadosGerais?.nomeFantasia || "",
				observacao: dadosGerais?.observacao || "",
				nomeContato: dadosGerais?.nomeContato || "",
				telefone1: dadosGerais?.telefone1 || "",
				telefone2: dadosGerais?.telefone2 || "",
				segmento: dadosGerais?.segmento || "",
				site: dadosGerais?.site || "",
				estadualrg: dadosGerais?.estadualrg || "",
				tipoie: dadosGerais?.tipoie,
				contaContabil: dadosGerais?.contaContabil || "",
				emailComercial: dadosGerais?.emailComercial || "",
				emailFiscal: dadosGerais?.emailFiscal || "",
				empresa: "001"
			};

			console.log("Dados preparados para envio:", dadosBase);

			if (fornecedorId) {
				await editarFornecedorFn({
					codigo: fornecedorId,
					...dadosBase,
				});
				toast.success("Fornecedor editado com sucesso!");
				queryClient.invalidateQueries({ queryKey: ["listar-fornecedores"] });
				navigate("/cadastros/fornecedores");
				setIsLoading(false);
			} else {
				await criarFornecedorFn(dadosBase);
				navigate("/cadastros/fornecedores");
				toast.success("Fornecedor criado com sucesso!");
				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Erro ao salvar fornecedor:", error);
			if (error instanceof AxiosError) {
				console.error("Detalhes do erro:", error.response?.data);
				toast.error(error.response?.data?.message || "Erro ao salvar fornecedor");
			} else {
				toast.error("Erro ao salvar fornecedor");
			}
		}
	};

	function handleReset() {
		if (!dadosGeraisForm) return;

		// Resetar dados gerais
		const dadosGeraisOriginais = dadosGeraisForm;
		for (const key of Object.keys(touchedFieldsDadosGerais) as Array<keyof typeof dadosGeraisOriginais>) {
			const valor = transformValue(key, dadosGeraisOriginais[key], transformationsDadosGerais);
			setValueDadosGerais(key, valor ?? "");
		}
	}
	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">
					{fornecedorId ? "Editar Fornecedor" : "Novo Fornecedor"}
				</h1>
				<div className="flex gap-2">
					<Link to="/cadastros/fornecedores">
						<Button type="button" variant="outline" className="h-10">
							Cancelar
						</Button>
					</Link>
					<Button className=" mr-2" onClick={handleSave} disabled={carregandoDadosDoFornecedor}>
						{carregandoDadosDoFornecedor ? (
							<Loader className="h-4 w-4 mr-2 animate-spin" />
						) : null}
						Salvar
					</Button>
				</div>
			</div>

			{/* <FormularioDadosGerais dadosGeraisForm={dadosGeraisForm} /> */}

			<FormularioDadosGerais
				dadosGeraisForm={dadosGeraisForm}
				contaData={dadosDaContaContabil}
				carregandoContaContabil={carregandoContaContabil}
				setSearchConta={setSearch} // função que altera o search
				searchConta={search}
				isLoading={isLoading}
			/>
		</div>
	);
}

