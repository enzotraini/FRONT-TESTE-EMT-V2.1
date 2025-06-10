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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { listarClassifisc, listarCsosn, listarAtributo, ListarResponse, BuscarCorridasResponse, buscarCorridas } from "@/api/fiscal/listas-produto";
import dayjs from "dayjs";
import { criarProdutoService } from "@/api/produto/criar-service";
import { toast } from "sonner";
import { editarProduto } from "@/api/produto/editar-produto";


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
	codprod: z.string().min(1, { message: "Código é obrigatório" }).max(20),
	lote: z.string().max(1).optional(),
	identific: z.string().max(1).optional(),
	tipo: z.string().max(20).optional(),
	secao: z.string().max(2).optional(),
	acab: z.string().max(3).optional(),
	descricao: z.string().max(40).optional(),
	unidade: z.string().max(3).optional(),
	titulo: z.string().max(35).optional(),
	marca: z.string().max(15).optional(),
	obs: z.string().max(20).optional(),

	estoqueatual: z.coerce.number()
		.max(999999.999, "Máximo permitido é 999999.999")
		.refine(val => Number.isFinite(val) && Number((val * 1000) % 1) === 0, {
			message: "Até 3 casas decimais permitidas",
		})
		.optional(),
	estoqueminimo: z.coerce.number().optional(),    // numeric(9,3)
	custoreal: z.coerce.number().optional(),        // numeric(12,2)
	custorealporc: z.coerce.number().optional(),    // CUSTOREAL1
	precovenda: z.coerce.number().optional(),       // numeric(12,2)

	classifisc: z.string().max(15).optional(),
	tributo: z.string().max(4).optional(),
	csosn: z.string().max(4).optional(),

	entrablocok: z.boolean().optional(),                       // bit
	unidadeblocok: z.string().max(2).optional(),            // UNIDBLOCOK
	codprodutoblocok: z.string().max(20).optional(),           // COD_ITEM_K

	corrida: z
		.string()
		.max(15, { message: "Máximo de 15 caracteres" })
		.optional()
		.or(z.literal("")),
	tipoaco: z.string().max(2).optional(),
	tratamento: z.string().max(3).optional(),

	texto: z.string().max(16).optional(),

	bitola1: z.coerce.number().optional(),
	bitola2: z.coerce.number().optional(),
	bitola3: z.coerce.number().optional(),

	bitorigi1: z.coerce.number().optional(),
	bitorigi2: z.coerce.number().optional(),
	bitorigi3: z.coerce.number().optional(),

	compriment: z.coerce.number().optional(),

	identificacao: z.string().max(1).optional(),    // IDENTIFIC
	proqrama: z.string().max(10).optional(),        // PROGRAMA
	bitolaoriginal1: z.coerce.number().optional(),   // BITORIGI1 
	bitolaoriginal2: z.coerce.number().optional(),   // BITORIGI2 
	bitolaoriginal3: z.coerce.number().optional(),   // BITORIGI3 
	barras: z.coerce.number().optional(),           // numeric(3,0)
	comprimento: z.coerce.number().optional(),      // numeric(3,0)
	local: z.string().max(2).optional(),

	nfcompra: z.string().max(8).optional(),         // NRODOCTO
	datacompra: z
		.string()
		.max(10)
		.optional()
		.refine((value) => {
			if (!value) return true;
			return dayjs(value, "DD/MM/YYYY", true).isValid();
		}, { message: "Data inválida" })
		.refine((value) => {
			if (!value) return true;
			const date = dayjs(value, "DD/MM/YYYY", true);
			return date.isAfter(dayjs("31/12/2018", "DD/MM/YYYY"));
		}, { message: "Data deve ser após 31/12/2018" })
		.refine((value) => {
			if (!value) return true;
			const date = dayjs(value, "DD/MM/YYYY", true);
			return date.isBefore(dayjs());
		}, { message: "Data não pode ser futura" }).optional(),
	custocompra: z.coerce.number().optional(),      // CUSULTCPA
	fornecedor: z.string().max(40).optional(),      // FORNECEDOR
	certificado: z.string().max(10).optional(),     // NROCERTI

	fci: z.string().max(36).optional(),
	datacad: z
		.string()
		.max(10)
		.optional()
		.refine(
			(value) => {
				if (!value) return true; // se for opcional
				const date = dayjs(value, "DD/MM/YYYY", true);
				return date.isValid();
			},
			{ message: "Data inválida" }
		)
		.refine(
			(value) => {
				if (!value) return true;
				const date = dayjs(value, "DD/MM/YYYY", true);
				return date.isAfter("2018-12-31");
			},
			{ message: "Data deve ser após 31/12/2018" }
		)
		.refine(
			(value) => {
				if (!value) return true;
				const date = dayjs(value, "DD/MM/YYYY", true);
				return date.isBefore(dayjs());
			},
			{ message: "Data não pode ser futura" }
		).optional(),
	observacao: z.string().max(40).optional(),      // TEXTO pode ser separado se for textarea
	observacoesgerais: z.string().optional(),       // mapeável para TEXTO ou outro campo
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

	//Listas de Combos
	const [searchClassifisc, setSearchClassifisc] = useState("");
	const [searchAtributo, setSearchAtributo] = useState("");
	const [searchCsosn, setSearchCsosn] = useState("");

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
	//const { setError, clearErrors } = useFormContext();

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
		debugger;

		// Validar formulário
		const dadosGeraisValidos = await dadosGeraisForm.trigger();
		if (!dadosGeraisValidos) {
			console.log("Formulário inválido, abortando...");
			return;
		}

		const dadosGerais = dadosGeraisForm.getValues();

		try {
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
				observacoesgerais: dadosGerais.observacoesgerais,
				user_id: 1,
				organizacao_id: 1
			};

			if (produtoId) {
				await editarProdutoFn({
					codigo: produtoId,
					...produto,
				});
				toast.success("Produto editado com sucesso!");
				queryClient.invalidateQueries({ queryKey: ["listar-produtos"] });
				navigate("/cadastros/produtos");
			} else {
				await criarProdutoFn(produto);
				toast.success("Produto criado com sucesso!");
				navigate("/cadastros/produtos");
			}
		} catch (error) {
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
					{produtoId ? "" :
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
			//validarCorrida={validarCorrida}
			/>

		</div>
	);

}

