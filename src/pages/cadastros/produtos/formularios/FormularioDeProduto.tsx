import {
	buscarDadosCompletosDoProduto,
	type BuscarDadosCompletosDoProdutoResponse,
} from "@/api/produto/buscar-dados-completos-do-produto";
import { criarCliente } from "@/api/clientes/criar-cliente";
import { editarCliente } from "@/api/clientes/editar-cliente";
//import { buscarDadosCompletosDoProduto } from "@/api/produto/buscar-dados-completos-do-produto";
import { criarProdutoService } from "@/api/produto/criar-service";
import { editarProduto } from "@/api/produto/editar-produto";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
//import { DadosAdicionaisForm, dadosAdicionaisFormSchema } from "@/pages/cadastros/produtos/formularios/FormularioDadosAdicionais";
import { DadosGeraisForm, dadosGeraisFormSchema, FormularioDadosGerais } from "@/pages/cadastros/produtos/formularios/FormularioDadosGerais";
import { formatCep } from "@/utils/formatCep";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ListarContaContabilResponse, listarDaContaContabil } from "@/api/fiscal/get-conta-contabil";

const tabTrigger =
	"data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none hover:text-accent-foreground gap-2";

type DadosGerais = BuscarDadosCompletosDoProdutoResponse["dadosGerais"];
//type DadosAdicionais = BuscarDadosCompletosDoProdutoResponse["dadosAdicionais"];

type Transformations<T> = Partial<{
	[K in keyof T]: (value: T[K]) => T[K] | undefined;
}>;

const transformationsDadosGerais: Transformations<DadosGerais> = {
	identificador: (value) => formatCpfCnpj(value),
	cep: (value) => formatCep(value)
};

//const transformationsDadosAdicionais: Transformations<DadosAdicionais> = {};

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

export function FormularioProduto() {
	const navigate = useNavigate();
	const { id } = useParams();
	const produtoId = id;
	const queryClient = useQueryClient();

	const dadosGeraisForm = useForm<DadosGeraisForm>({
		resolver: zodResolver(dadosGeraisFormSchema),
		defaultValues: {
			nome: "",
			//tipo: "fisica",
			identificador: "",
			cep: "",
			rua: "",
			numero: 0,
			complemento: "",
			bairro: "",
			cidade: "",
			estado: "",
			estadualrg: "",
			tipoie: 0,
			ctacontabi: "",
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
		failureReason: falhaAoBuscardadosDoProduto,
		data: dadosDoProduto,
		isFetching: carregandoDadosDoProduto,
	} = useQuery<BuscarDadosCompletosDoProdutoResponse>({
		queryKey: ["buscar-dados-completos-do-produto", produtoId],
		queryFn: () =>
			buscarDadosCompletosDoProduto({ produtoId: produtoId ?? "" }),
		enabled: produtoId !== undefined && produtoId !== "",
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
	} = useQuery<ListarContaContabilResponse>({
		queryKey: ["listar-conta-contabil", search ],
		queryFn: () => listarDaContaContabil({ contaContabil: search ?? ""  }),
		enabled: search === "" || search.length > 3,
		retry: (retries, error) => {
		if (!(error instanceof AxiosError)) return false;
		if (error.status && error.status >= 400 && error.status <= 499) return false;
		return retries <= 2;
		},
		staleTime: 1000 * 60 * 5,
	});

	const { mutateAsync: criarProdutoFn } = useMutation({
		mutationFn: criarProdutoService,
		onSuccess: (data) => {
			console.log("Sucesso na criação do cliente:", data);
			toast.success("Cliente criado com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["listar-produtos"] });
			navigate("/cadastros/produtos");
		},
		onError: (error) => {
			console.error("Erro ao criar cliente:", error);
			if (error instanceof AxiosError) {
				console.error("Detalhes do erro:", error.response?.data);
			}
			toast.error("Erro ao criar cliente");
		}
	});
	
	const { mutateAsync: editarProdutoFn } = useMutation({
		mutationFn: editarProduto,
	});

	// Preenche o formulário com todos os dados exceto contaContabil
	// useEffect(() => {
	// 	if (!dadosDoProduto || !dadosDoProduto.dadosGerais) return;

	// 	console.log("Populando campos do formulário exceto contaContabil");

	// 	const dados = dadosDoProduto.dadosGerais;

	// 	for (const key of Object.keys(dados) as Array<keyof DadosGerais>) {
	// 		if (key === "contaContabil") continue; // pula contaContabil aqui

	// 		const valor = transformValue(key, dados[key], transformationsDadosGerais);
	// 		setValueDadosGerais(key, valor);
	// 	}
	// }, [dadosDoProduto, setValueDadosGerais]);

	// Preenche o campo contaContabil quando combo estiver carregado
	// useEffect(() => {
		
	// 	if (
	// 		!dadosDoProduto?.dadosGerais?.ctacontabi ||
	// 		!dadosDaContaContabil ||
	// 		!Array.isArray(dadosDaContaContabil)
	// 	) {
	// 		return;
	// 	}

	// 	const existe = dadosDaContaContabil.some(
	// 		(c) => c.value === dadosDoProduto.dadosGerais.ctacontabi,
	// 	);

	// 	if (existe) {
	// 		console.log("Setando contaContabil:", dadosDoProduto.dadosGerais.ctacontabi);
	// 		setValueDadosGerais("contaContabil", dadosDoProduto.dadosGerais.ctacontabi);
	// 	}
	// }, [dadosDoProduto?.dadosGerais?.ctacontabi, dadosDaContaContabil, setValueDadosGerais]);

	const handleSave = async () => {
		console.log("Iniciando processo de salvar...");
		
		// Validar formulários
		const dadosGeraisValidos = await dadosGeraisForm.trigger();
		
		console.log("Validação dos formulários:", {
			dadosGeraisValidos,
		});

		const dadosGerais1 = dadosGeraisForm.getValues();
		console.log("📦 Dados do formulário:", dadosGerais1);

		if (!dadosGeraisValidos) {
			console.log("Formulários inválidos, abortando...");
			return;
		}

		const dadosGerais = dadosGeraisForm.getValues();
		//const dadosAdicionais = dadosAdicionaisForm.getValues();		

		console.log("Dados coletados dos formulários:", {
			dadosGerais,
		});

		try {
			// Preparar dados no formato que o backend espera
			const dadosBase = {
				// Dados Gerais
				empresa: "001",
				cgcfor: dadosGerais?.identificador.replace(/\D/g, ""),
				nome: dadosGerais?.nome,	
				// Endereço
				endereco: dadosGerais?.rua,
				nro: Number(dadosGerais?.numero) || 0,
				bairro: dadosGerais?.bairro,
				cidade: dadosGerais?.cidade,
				cep: dadosGerais?.cep.replace(/\D/g, ""),
				complement: dadosGerais?.complemento || "",
				estado: dadosGerais?.estado,
				observacao: dadosGerais?.observacao,
				fantasia: dadosGerais?.nomeFantasia,
				// Dados fiscais
				estadualrg: dadosGerais.estadualrg?.replace(/\D/g, ""),
				tipoie: dadosGerais?.tipoie,		
				ctacontabi: dadosGerais?.contaContabil,		
				// Contato
				contato: dadosGerais?.nomeContato || "",
				telefone1: dadosGerais?.telefone1 || "",
				telefone2: dadosGerais?.telefone2 || "",
				segmento: dadosGerais?.segmento,
				site: dadosGerais?.site || "",
				email: dadosGerais?.emailComercial || "",
				emailfis: dadosGerais?.emailFiscal || "",
				user_id: 1, // Valor fixo para teste
				organizacao_id: 1 // Valor fixo para teste
			};

			console.log("Dados preparados para envio:", dadosBase);

			if (produtoId) {
				await editarProdutoFn({
					codigo: produtoId,
					...dadosBase,
				});
				toast.success("Produto editado com sucesso!");
				queryClient.invalidateQueries({ queryKey: ["listar-clientes"] });
				navigate("/cadastros/produtos");
			} else {
				await criarProdutoFn(dadosBase);
			}
		} catch (error) {
			console.error("Erro ao salvar produto:", error);
			if (error instanceof AxiosError) {
				console.error("Detalhes do erro:", error.response?.data);
				toast.error(error.response?.data?.message || "Erro ao salvar cliente");
			} else {
				toast.error("Erro ao salvar cliente");
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
					{produtoId ? "Editar Produto" : "Novo Produto"}
				</h1>
				<div className="flex gap-2">
					{produtoId ? "":
					<Button
						variant="outline"
						onClick={handleReset}
						disabled={carregandoDadosDoProduto}
					>
						<RotateCw className="h-4 w-4 mr-2" />
						Resetar
					</Button>}
					<Button onClick={handleSave} disabled={carregandoDadosDoProduto}>
						{carregandoDadosDoProduto ? (
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
			/>
		</div>
	);
	
}

