import {
	buscarDadosCompletosDoProduto,
	type BuscarDadosCompletosDoProdutoResponse,
} from "@/api/produto/buscar-dados-completos-do-produto";
import { criarCliente } from "@/api/clientes/criar-cliente";
import { editarCliente } from "@/api/clientes/editar-cliente";
//import { buscarDadosCompletosDoProduto } from "@/api/produto/buscar-dados-completos-do-produto";
import { Button } from "@/components/ui/button";
///import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { cn } from "@/lib/utils";
//import { DadosAdicionaisForm, dadosAdicionaisFormSchema } from "@/pages/cadastros/produtos/formularios/FormularioDadosAdicionais";
import { FormularioDadosGerais } from "@/pages/cadastros/produtos/formularios/FormularioDadosGerais";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { listarClassifisc, listarCsosn, listarAtributo, ListarResponse, BuscarCorridasResponse, buscarCorridas } from "@/api/fiscal/listas-produto";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

import { criarProdutoService } from "@/api/produto/criar-service";
import { toast } from "sonner";
import { editarProduto, editarProdutoService } from "@/api/produto/editar-produto";
import { listarLocais } from "@/api/produto/lista-local";


type DadosGerais = BuscarDadosCompletosDoProdutoResponse["dadosGerais"];
//type DadosAdicionais = BuscarDadosCompletosDoProdutoResponse["dadosAdicionais"];

//modal corrida
//const [modalAberto, setModalAberto] = useState(false);

type Transformations<T> = Partial<{
	[K in keyof T]: (value: T[K]) => T[K] | undefined;
}>;

const transformationsDadosGerais: Transformations<DadosGerais> = {};




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

export const dadosGeraisFormSchema = z.object({
	codprod: z.string().min(1, { message: "Código é obrigatório" }).max(20, { message: "Máximo de 20 caracteres" }),
	lote: z.string().max(1, { message: "Máximo de 1 caractere" }).optional(),
	identific: z.string().max(1, { message: "Máximo de 1 caractere" }).optional(),
	tipo: z.string().max(20, { message: "Máximo de 20 caracteres" }).optional(),
	secao: z.string().max(2, { message: "Máximo de 2 caracteres" }).optional(),
	acab: z.string().max(3, { message: "Máximo de 3 caracteres" }).optional(),
	descricao: z.string().max(40, { message: "Máximo de 40 caracteres" }).optional(),
	unidade: z.string().max(3, { message: "Máximo de 3 caracteres" }).optional(),
	titulo: z.string().max(35, { message: "Máximo de 35 caracteres" }).optional(),
	marca: z.string().max(15, { message: "Máximo de 15 caracteres" }).optional(),
	obs: z.string().max(20, { message: "Máximo de 20 caracteres" }).optional(),

	estoqueatual: z.number().optional(),
	estoqueminimo: z.coerce.number().optional(),
	custoreal: z.coerce.number().optional(),
	custorealporc: z.coerce.number().optional(),
	precovenda: z.coerce.number().optional(),

	classifisc: z.string().max(15, { message: "Máximo de 15 caracteres" }).optional(),
	tributo: z.string().max(4, { message: "Máximo de 4 caracteres" }).optional(),
	csosn: z.string().max(4, { message: "Máximo de 4 caracteres" }).optional(),

	entrablocok: z.boolean().optional(),
	unidadeblocok: z.string().max(2, { message: "Máximo de 2 caracteres" }).optional(),
	codprodutoblocok: z.string().max(20, { message: "Máximo de 20 caracteres" }).optional(),

	corrida: z.string().max(15, { message: "Máximo de 15 caracteres" }).optional().or(z.literal("")),
	tipoaco: z.string().max(2, { message: "Máximo de 2 caracteres" }).optional(),
	tratamento: z.string().max(3, { message: "Máximo de 3 caracteres" }).optional(),

	texto: z.string().max(16, { message: "Máximo de 16 caracteres" }).optional(),

	bitola1: z.coerce.number().optional(),
	bitola2: z.coerce.number().optional(),
	bitola3: z.coerce.number().optional(),

	bitorigi1: z.coerce.number().optional(),
	bitorigi2: z.coerce.number().optional(),
	bitorigi3: z.coerce.number().optional(),

	compriment: z.coerce.number().optional(),

	identificacao: z.string().max(1, { message: "Máximo de 1 caractere" }).optional(),
	proqrama: z.string().max(10, { message: "Máximo de 10 caracteres" }).optional(),
	bitolaoriginal1: z.coerce.number().optional(),
	bitolaoriginal2: z.coerce.number().optional(),
	bitolaoriginal3: z.coerce.number().optional(),
	barras: z.coerce.number()
		.int({ message: "Deve ser um número inteiro" })
		.min(0, { message: "Valor mínimo é 0" })
		.max(999, { message: "Máximo de 3 dígitos" })
		.optional(),
	comprimento: z.coerce.number().optional(),
	local: z.string().max(20, { message: "Máximo de 20 caracteres" }).optional(),

	nfcompra: z.string().max(8, { message: "Máximo de 8 caracteres" }).optional(),
	datacompra: z.string()
		.max(10, { message: "Máximo de 10 caracteres" })
		.optional()
		.refine(value => {
			if (!value) return true;
			const parsed = dayjs(value, "DD/MM/YYYY", true);
			return parsed.isValid();
		}, { message: "Data inválida" })
		.refine(value => {
			if (!value) return true;
			const parsed = dayjs(value, "DD/MM/YYYY", true);
			return parsed.isAfter("2018-12-31");
		}, { message: "Data deve ser após 31/12/2018" })
		.refine(value => {
			if (!value) return true;
			const parsed = dayjs(value, "DD/MM/YYYY", true);
			return parsed.isSameOrBefore(dayjs(), "day");
		}, { message: "Data não pode ser futura" }),
	custocompra: z.coerce.number().optional(),
	fornecedor: z.string().max(40, { message: "Máximo de 40 caracteres" }).optional(),
	certificado: z.string().max(10, { message: "Máximo de 10 caracteres" }).optional(),
	fci: z.string().max(36, { message: "Máximo de 36 caracteres" }).optional(),
	datacad: z.string()
		.max(10, { message: "Máximo de 10 caracteres" })
		.optional()
		.refine(value => {
			if (!value) return true;
			const parsed = dayjs(value, "DD/MM/YYYY", true);
			return parsed.isValid();
		}, { message: "Data inválida" })
		.refine(value => {
			if (!value) return true;
			const parsed = dayjs(value, "DD/MM/YYYY", true);
			return parsed.isAfter("2018-12-31");
		}, { message: "Data deve ser após 31/12/2018" })
		.refine(value => {
			if (!value) return true;
			const parsed = dayjs(value, "DD/MM/YYYY", true);
			return parsed.isSameOrBefore(dayjs(), "day");
		}, { message: "Data não pode ser futura" }),
	observacao: z.string().max(40, { message: "Máximo de 40 caracteres" }).optional(),
	observacoesgerais: z.string().max(500).optional(),
});


export type DadosGeraisForm = z.infer<typeof dadosGeraisFormSchema>;

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;
}

interface Option {
	label: string;
	value: string;
}

export function FormularioProduto() {
	const navigate = useNavigate();
	const { id } = useParams();
	const produtoId = id;
	const queryClient = useQueryClient();

	const dadosGeraisForm = useForm<DadosGeraisForm>({
		resolver: zodResolver(dadosGeraisFormSchema),
		defaultValues: {
			codprod: "",
			lote: "",
			tipo: "",
			secao: "",
			bitola1: undefined,
			bitola2: undefined,
			bitola3: undefined,
			acab: "",
			unidade: "",
			local: "",
			barras: undefined,
			comprimento: undefined,
			titulo: "",
			marca: "",
			corrida: "",
			tipoaco: "",
			unidadeblocok: "",
			tratamento: "",
			classifisc: "",
			tributo: "",
			csosn: "",
			codprodutoblocok: "",
			observacao: "",
			estoqueminimo: undefined,
			estoqueatual: undefined,
			custoreal: undefined,
			custorealporc: undefined,
			precovenda: undefined,
			obs: "",
			entrablocok: false,
			identificacao: "",
			proqrama: "",
			bitolaoriginal1: undefined,
			bitolaoriginal2: undefined,
			bitolaoriginal3: undefined,
			nfcompra: "",
			datacompra: "",
			custocompra: undefined,
			fornecedor: "",
			certificado: "",
			fci: "",
			datacad: "",
			observacoesgerais: ""
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

	// const { mutateAsync: criarProdutoFn } = useMutation({
	// 	mutationFn: criarProdutoService,
	// 	onSuccess: (data) => {
	// 		queryClient.invalidateQueries({ queryKey: ["listar-produtos"] });
	// 	},
	// 	onError: (error) => {
	// 		console.error("Erro ao criar cliente:", error);
	// 		if (error instanceof AxiosError) {
	// 			console.error("Detalhes do erro:", error.response?.data);
	// 		}
	// 		toast.error("Erro ao criar cliente");
	// 	}
	// });

	const { mutateAsync: editarProdutoFn } = useMutation({
		mutationFn: editarProdutoService,
	});

	const { mutateAsync: criarProdutoFn } = useMutation({
		mutationFn: criarProdutoService,
	});

	//Listas de Combos
	const [searchClassifisc, setSearchClassifisc] = useState("");
	const [searchAtributo, setSearchAtributo] = useState("");
	const [searchCsosn, setSearchCsosn] = useState("");
	const [searchLocal, setSearchLocal] = useState("");

	const {
		data: classifiscData,
		isFetching: carregandoClassifisc,
		failureReason: falhaAoBuscarClassifisc,
	} = useQuery<ListarResponse>({
		queryKey: ["listar-classifisc", searchClassifisc],
		queryFn: () => listarClassifisc(searchClassifisc ?? ""),
		enabled: searchClassifisc === "" || searchClassifisc.length > 3,
		retry: (retries, error) => {
			if (!(error instanceof AxiosError)) return false;
			if (error.status && error.status >= 400 && error.status <= 499) return false;
			return retries <= 2;
		},
		staleTime: 1000 * 60 * 5,
	});

	const {
		data: atributoData,
		isFetching: carregandoAtributo,
		failureReason: falhaAoBuscarAtributo,
	} = useQuery({
		queryKey: ["listar-tributo", searchAtributo],
		queryFn: () => listarAtributo(searchAtributo ?? ""),
		enabled: searchAtributo === "" || searchAtributo.length > 3,
		staleTime: 1000 * 60 * 5,
		retry: (retries, error) => {
			if (!(error instanceof AxiosError)) return false;
			if (error.status && error.status >= 400 && error.status <= 499) return false;
			return retries <= 2;
		},
	});

	const {
		data: localData,
		isFetching: carregandoLocal,
		failureReason: falhaAoBuscarLocal,
	} = useQuery({
		queryKey: ["listar-local", searchLocal],
		queryFn: () => listarLocais(searchLocal ?? ""),
		enabled: searchLocal === "" || searchLocal.length > 3,
		staleTime: 1000 * 60 * 5,
		retry: (retries, error) => {
			if (!(error instanceof AxiosError)) return false;
			if (error.status && error.status >= 400 && error.status <= 499) return false;
			return retries <= 2;
		},
	});

	const {
		data: csosnData,
		isFetching: carregandoCsosn,
		failureReason: falhaAoBuscarCsosn,
	} = useQuery({
		queryKey: ["listar-csosn", searchCsosn],
		queryFn: () => listarCsosn(searchCsosn ?? ""),
		enabled: searchCsosn === "" || searchCsosn.length > 3,
		staleTime: 1000 * 60 * 5,
		retry: (retries, error) => {
			if (!(error instanceof AxiosError)) return false;
			if (error.status && error.status >= 400 && error.status <= 499) return false;
			return retries <= 2;
		},
	});

	const [modalAberto, setModalAberto] = useState(false);
	const [searchCorrida, setSearchCorrida] = useState("");
	const [pageCorrida, setPageCorrida] = useState(1);
	const [searchParams, setSearchParams] = useSearchParams();
	const [corridaSelecionada, setCorridaSelecionada] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const {
		data: corridaData,
		isFetching: carregandoCorrida,
	} = useQuery<BuscarCorridasResponse>({
		queryKey: ["listar-corridas", searchCorrida, pageCorrida],
		queryFn: () => buscarCorridas({ search: searchCorrida, page: pageCorrida, perPage: 10 }),
		enabled: searchCorrida === "" || searchCorrida.length >= 2,
	});

	const handlePageChangeCorrida = async (page: number) => {
		if (page < 1) page = 1;
		setPageCorrida(page);
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.set("page", page.toString());
			return newParams;
		});
	};

	// async function validarCorrida() {
	// 	if (!corridaSelecionada) return;

	// 	try {
	// 		const resultado = await buscarCorridas({ search: corridaSelecionada, page: 1, perPage: 1 });

	// 		if (!resultado.corridas || resultado.corridas.length === 0) {
	// 			setError("corrida", { message: "Corrida inexistente na base" });
	// 		} else {
	// 			clearErrors("corrida");
	// 		}
	// 	} catch (error) {
	// 		setError("corrida", { message: "Erro ao validar corrida" });
	// 	}
	// }

	useEffect(() => {
		if (!dadosDoProduto || !dadosDoProduto.dadosGerais) return;

		console.log("Populando campos do formulário exceto contaContabil");

		const dados = dadosDoProduto.dadosGerais;

		for (const key of Object.keys(dados) as Array<keyof DadosGerais>) {
			const valor = transformValue(key, dados[key], transformationsDadosGerais);
			setValueDadosGerais(key, valor);
		}
	}, [dadosDoProduto, setValueDadosGerais]);



	const handleSave = async () => {
		// Validar formulário
		const dadosGeraisValidos = await dadosGeraisForm.trigger();
		if (!dadosGeraisValidos) {
			console.log("Formulário inválido, abortando...");
			return;
		}

		const dadosGerais = dadosGeraisForm.getValues();

		try {
			setIsLoading(true);
			// Montar o objeto no formato que o backend espera
			const produto = {
				codprod: dadosGerais.codprod,
				tipo: dadosGerais.tipo,
				secao: dadosGerais.secao,
				bitola1: dadosGerais.bitola1,
				bitola2: dadosGerais.bitola2,
				bitola3: dadosGerais.bitola3,
				acab: dadosGerais.acab,
				unidade: dadosGerais.unidade,
				local: dadosGerais.local,
				barras: Number(dadosGerais.barras) || 0,
				compriment: Number(dadosGerais.comprimento) || 0,
				titulo: dadosGerais.titulo,
				marca: dadosGerais.marca,
				corrida: dadosGerais.corrida,
				tipoaco: dadosGerais.tipoaco,
				unidblocok: dadosGerais.unidadeblocok,
				tratamento: dadosGerais.tratamento,
				classifisc: dadosGerais.classifisc,
				tributo: dadosGerais.tributo,
				csosn: dadosGerais.csosn,
				cod_item_k: dadosGerais.codprodutoblocok,
				observacao: dadosGerais.observacao,
				estoqueminimo: parseDecimal(dadosGerais.estoqueminimo),
				estoqueatual: parseDecimal(dadosGerais.estoqueatual),
				custoreal: Number(dadosGerais.custoreal) || 0,
				custoreal1: Number(dadosGerais.custorealporc) || 0,
				precovenda: Number(dadosGerais.precovenda) || 0,
				obs: dadosGerais.obs,
				blocok: dadosGerais.entrablocok,
				identific: dadosGerais.identificacao,
				programa: dadosGerais.proqrama,
				bitorigi1: Number(dadosGerais.bitolaoriginal) || 0,
				bitorigi2: Number(dadosGerais.bitolaoriginal2) || 0,
				bitorigi3: Number(dadosGerais.bitolaoriginal3) || 0,
				nrodocto: dadosGerais.nfcompra,
				dtultcpa: dadosGerais.datacompra,
				cusultcpa: Number(dadosGerais.custocompra) || 0,
				fornecedor: dadosGerais.fornecedor,
				nrocerti: dadosGerais.certificado,
				fci: dadosGerais.fci,
				dtcadastro: dadosGerais.datacad,
				texto: dadosGerais.observacoesgerais,
				user_id: 1,
				organizacao_id: 1
			};

			if (produtoId) {
				await editarProdutoFn({
					codigo: produtoId,
					...produto,
				});
				setIsLoading(false);
				toast.success("Produto editado com sucesso!");
				queryClient.invalidateQueries({ queryKey: ["listar-produtos"] });
				navigate("/cadastros/produtos");
			} else {
				await criarProdutoFn(produto);
				setIsLoading(false);
				toast.success("Produto criado com sucesso!");
				navigate("/cadastros/produtos");
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Erro ao salvar produto:", error);
			if (error instanceof AxiosError) {
				console.error("Detalhes do erro:", error.response?.data);
				toast.error(error.response?.data?.message || "Erro ao salvar produto");
			} else {
				toast.error("Erro ao salvar produto");
			}
		}
	};

	const parseDecimal = (valor: any): number => {
		if (typeof valor === 'string') {
			// Remove milhares e troca ',' por '.'
			return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
		}
		return Number(valor) || 0;
	};


	function handleReset() {
		// if (!dadosGeraisForm) return;

		// // Resetar dados gerais
		// const dadosGeraisOriginais = dadosGeraisForm;
		// for (const key of Object.keys(touchedFieldsDadosGerais) as Array<keyof typeof dadosGeraisOriginais>) {
		// 	const valor = transformValue(key, dadosGeraisOriginais[key], transformationsDadosGerais);
		// 	setValueDadosGerais(key, valor ?? "");
		// }	
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">
					{produtoId ? "Editar Produto" : "Novo Produto"}
				</h1>
				<div className="flex gap-2">
					<Link to="/cadastros/produtos">
						<Button type="button" variant="outline" className="h-10">
							Cancelar
						</Button>
					</Link>

					<Button className="mr-2" onClick={handleSave} disabled={carregandoDadosDoProduto}>
						{carregandoDadosDoProduto ? (
							<Loader className="h-4 w-4 mr-2 animate-spin" />
						) : null}
						Salvar
					</Button>
					{/* <Button onClick={handleSave} disabled={criandoProduto}>
						{criandoProduto ? (
							<>
								<Loader className="animate-spin mr-2 h-4 w-4" />
								Salvando...
							</>
						) : (
							"Salvar"
						)}
					</Button> */}


				</div>
			</div>

			<FormularioDadosGerais
				dadosGeraisForm={dadosGeraisForm}

				classifiscData={classifiscData}
				carregandoClassifisc={carregandoClassifisc}
				setSearchClassifisc={setSearchClassifisc}
				searchClassifisc={searchClassifisc}

				atributoData={atributoData}
				carregandoAtributo={carregandoAtributo}
				setSearchAtributo={setSearchAtributo}
				searchAtributo={searchAtributo}

				csosnData={csosnData}
				carregandoCsosn={carregandoCsosn}
				setSearchCsosn={setSearchCsosn}
				searchCsosn={searchCsosn}

				corridaData={corridaData}
				carregandoCorrida={carregandoCorrida}
				setSearchCorrida={setSearchCorrida}
				searchCorrida={searchCorrida}
				modalAberto={modalAberto}
				setModalAberto={setModalAberto}
				handlePageChangeCorrida={handlePageChangeCorrida}
				corridaSelecionada={corridaSelecionada}
				setCorridaSelecionada={setCorridaSelecionada}

				localData={localData}
				carregandoLocal={carregandoLocal}
				setSearchLocal={setSearchLocal}
				searchLocal={searchLocal}

				isLoading={isLoading}
			/>
		</div>
	);

}

