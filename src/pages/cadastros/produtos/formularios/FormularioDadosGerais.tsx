import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormDescription, FormControl, FormLabel } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { TitleSeparator } from "@/components/TitleSeparator";
import { Switch } from "@/components/ui/switch";
import InputMask from "react-input-mask";
import dayjs from "dayjs";
import { DadosGeraisForm } from "@/pages/cadastros/produtos/formularios/FormularioDeProduto";
import { buscarCorridas, BuscarCorridasResponse, listarClassifisc, ListarResponse } from "@/api/fiscal/listas-produto";
import { NumericFormat } from 'react-number-format';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTable } from "@/components/DataTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const tipoAcoOptions = [
	"CM-CONSTRUCAO MECANICA",
	"AF-ACO FERRAMENTA",
	"AC-ACO CONSTRUCAO",
	"AI-ACO INOX",
	"RT-RETALHO RETANGULAR",
	"RE-RETALHO REDONDO",
	"TX-TOOLOX",
	"AO-ACO OUTROS",
	"AR-ACO RAPIDO",
	"AB-ACO CARBONO",
	"CH-CHAPA OXICORTE"
];

const tipoSecaoOptions = [
	"  ", "RD", "SE", "QU", "CH", "U ", "I ", "T ", "TR",
	"TQ", "H ", "CT", "CQ", "CF", "CX", "CG", "RT", "CZ", "BL"
];

const unidadeEstqOptions = ["CEN", "CH", "CX", "ML", "MT", "PC", "KG", "TO", "M2", "M3", "VB", "UN", "CM"];

const localOptions = [""];

import { ColumnDef } from "@tanstack/react-table";
import { Loader, Search } from "lucide-react";
//import { buscarLocais } from "@/api/produto/lista-local";

const unidadeBlocoKOptions = [
	"CH",
	"Falta os outros options"
];

const tratamentoOptions = [
	"STT-SEM TRATAMENTO",
	"COA-COALESCIDO",
	"REC-RECOZIDO",
	"ESF-ESFEROIDIZADO",
	"NOR-NORMALIZADO",
	"TEM-TEMPERADO",
	"T.R-TEMPERADO E REVENIDO"
];

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;

	classifiscData?: ListarResponse;
	carregandoClassifisc: boolean;
	setSearchClassifisc: React.Dispatch<React.SetStateAction<string>>;
	searchClassifisc: string;

	atributoData?: ListarResponse;
	carregandoAtributo: boolean;
	setSearchAtributo: React.Dispatch<React.SetStateAction<string>>;
	searchAtributo: string;

	csosnData?: ListarResponse;
	carregandoCsosn: boolean;
	setSearchCsosn: React.Dispatch<React.SetStateAction<string>>;
	searchCsosn: string;

	corridaData?: BuscarCorridasResponse;
	carregandoCorrida: boolean;
	setSearchCorrida: React.Dispatch<React.SetStateAction<string>>;
	searchCorrida: string;
	modalAberto: boolean;
	setModalAberto: React.Dispatch<React.SetStateAction<boolean>>;
	handlePageChangeCorrida: (page: number) => void;
	corridaSelecionada: string;
	setCorridaSelecionada: (valor: string) => void;

	localData?: ListarResponse;
	carregandoLocal: boolean;
	setSearchLocal: React.Dispatch<React.SetStateAction<string>>;
	searchLocal: string;

	isLoading: boolean;
}

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export function FormularioDadosGerais({ dadosGeraisForm,
	classifiscData,
	carregandoClassifisc,
	searchClassifisc,
	setSearchClassifisc,

	atributoData,
	carregandoAtributo,
	setSearchAtributo,
	searchAtributo,

	csosnData,
	carregandoCsosn,
	setSearchCsosn,
	searchCsosn,

	corridaData,
	carregandoCorrida,
	setSearchCorrida,
	searchCorrida,
	modalAberto,
	setModalAberto,
	handlePageChangeCorrida,
	corridaSelecionada,
	setCorridaSelecionada,

	localData,
	carregandoLocal,
	setSearchLocal,
	searchLocal,

	isLoading
}: FormularioDadosGeraisProps) {

	const { control, formState: { errors }, clearErrors } = dadosGeraisForm;
	const [filtroCorrida, setFiltroCorrida] = useState("");
	const debouncedFiltroCorrida = useDebounce(filtroCorrida, 300); // por exemplo

	useEffect(() => {
		if (debouncedFiltroCorrida.length === 0 || debouncedFiltroCorrida.length >= 2) {
			setSearchCorrida(debouncedFiltroCorrida);
		}
	}, [debouncedFiltroCorrida]);

	useEffect(() => {
		if (modalAberto) {
			setFiltroCorrida(""); // limpa o campo ao abrir o modal
		}
	}, [modalAberto]);

	//modal corrida
	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "corrida2",
			header: "Corrida",
			size: 60,
		},
		{
			accessorKey: "tipo2",
			header: "Tipo",
			size: 60,
		},
		{
			accessorKey: "secao2",
			header: "SE",
			size: 60,
		},
		{
			accessorKey: "bitola2",
			header: "Bitola",
			size: 60,
		},
		{
			accessorKey: "acab2",
			header: "Aca",
			size: 60,
		},
		{
			accessorKey: "dataco",
			header: "Data",
			size: 60,
		},
		{
			id: "acoes",
			header: "",
			cell: ({ row }) => (
				<button
					onClick={() => {
						const corrida2 = row.original?.corrida2;
						if (corrida2) {
							setCorridaSelecionada(corrida2);
							setModalAberto(false);
						}
					}}
					className="text-blue-500 hover:underline"
				>
					<Search size={18} />
				</button>
			),
		},
	];

	//teste de penetração
	const dadosTeste = {
		codprod: "PROD123456789012345",       // max 20 chars
		lote: "A",                           // max 1 char
		tipo: "TipoProdutoX",                // max 20 chars
		secao: "01",                        // max 2 chars
		bitola1: 12.345,                    // número
		bitola2: 10.001,                    // número
		bitola3: 5.678,                     // número
		acab: "ABC",                       // max 3 chars
		unidade: "",                     // max 3 chars
		local: "A",                        // max 1 char
		barras: 123,                      // número, até 3 dígitos
		comprimento: 100,                 // número
		titulo: "Título do Produto",      // max 35 chars
		marca: "MarcaX",                  // max 15 chars
		corrida: "CorridaExemplo",        // max 15 chars
		tipoaco: "TA",                   // max 2 chars
		unidadeblocok: "UB",             // max 2 chars
		tratamento: "TRT",               // max 3 chars
		classifisc: "CLASF1234567890",  // max 15 chars
		tributo: "TRIB",                 // max 4 chars
		csosn: "CSOS",                  // max 4 chars
		codprodutoblocok: "CPBLOCK1234567890", // max 20 chars
		observacao: "Observação teste",  // max 40 chars
		estoqueminimo: 10.000,            // número
		estoqueatual: 100.123,            // número
		custoreal: 1500.55,               // número
		custorealporc: 10.50,             // número percentual
		precovenda: 1800.99,              // número
		obs: "Observação breve",          // max 20 chars
		entrablocok: true,                // booleano
		identificacao: "I",               // max 1 char
		proqrama: "PROG12345",            // max 10 chars
		bitolaoriginal1: 12.345,          // número
		bitolaoriginal2: 10.000,          // número
		bitolaoriginal3: 5.678,           // número
		nfcompra: "12345678",             // max 8 chars
		datacompra: "15/06/2025",         // string data válida DD/MM/YYYY
		custocompra: 1400.50,             // número
		fornecedor: "Fornecedor Exemplo", // max 40 chars
		certificado: "CERT12345",          // max 10 chars
		fci: "78901234567890123456", // max 36 chars
		datacad: "10/06/2025",             // string data válida DD/MM/YYYY
		observacoesgerais: "Observações gerais do produto para teste" // string opcional livre
	};

	// você pode popular assim ao montar o componente (exemplo):
	// useEffect(() => {
	// 	dadosGeraisForm.reset(dadosTeste);
	// }, [dadosGeraisForm]);

	return (

		<>
			{isLoading ? (
				<div className="flex items-center justify-center h-64">
					<Loader className="animate-spin" size={"3rem"} />
				</div>
			) : (
				<>
					<Form {...dadosGeraisForm}>
						<form className="flex gap-1 flex-col px-6 mb-6">
							<TitleSeparator title="Identificação do Produto" />
							<div className="grid grid-cols-[auto_auto_auto_auto_1fr] gap-6">

								<FormField name="codprod" control={control} render={({ field }) => (
									<FormItem className="col-span-1 place-self-start">
										<FormLabel>Código</FormLabel>
										<Input {...field} />
										{errors.codprod && (
											<FormDescription className="text-destructive">
												{errors.codprod.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField name="lote" control={control} render={({ field }) => (
									<FormItem className="col-span-1 place-self-start">
										<FormLabel>Lote</FormLabel>
										<Input {...field} />
										{errors.lote && (
											<FormDescription className="text-destructive">
												{errors.lote.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField name="tipo" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de Material</FormLabel>
										<Input {...field} />
										{errors.tipo && (
											<FormDescription className="text-destructive">
												{errors.tipo.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField name="secao" control={control} render={({ field }) => (
									<FormItem className="w-[165px]">
										<FormLabel>Seção</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent>
												{tipoSecaoOptions.map((option) => (
													<SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.secao && (
											<FormDescription className="text-destructive">
												{errors.secao.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<fieldset className="w-max border p-2 rounded-md">
									<legend className="text-sm font-medium text-gray-700 px-2">Bitolas</legend>
									<div className="flex gap-2">
										<FormField name="bitola1" control={control} render={({ field }) => (
											<FormItem>
												<FormLabel>Bitola 1</FormLabel>
												<Input
													{...field}
													type="number"
													step={0.001}
													min={0}
													max={99999.999}
													onChange={e => {
														const value = e.target.value;
														if (
															value === "" ||
															(/^\d{0,5}(\.\d{0,3})?$/.test(value) && Number(value) <= 99999.999)
														) {
															field.onChange(value === "" ? undefined : Number(value));
														}
													}}
												/>
												{errors.bitola1 && <FormDescription className="text-destructive">{errors.bitola1.message}</FormDescription>}
											</FormItem>
										)} />

										x
										<FormField name="bitola2" control={control} render={({ field }) => (
											<FormItem>
												<FormLabel>Bitola 2</FormLabel>
												<Input
													{...field}
													type="number"
													step={0.001}
													min={0}
													max={99999.999}
													onChange={e => {
														const value = e.target.value;
														if (
															value === "" ||
															(/^\d{0,5}(\.\d{0,3})?$/.test(value) && Number(value) <= 99999.999)
														) {
															field.onChange(value === "" ? undefined : Number(value));
														}
													}}
												/>
												{errors.bitola2 && <FormDescription className="text-destructive">{errors.bitola2.message}</FormDescription>}
											</FormItem>
										)} />

										x
										<FormField name="bitola3" control={control} render={({ field }) => (
											<FormItem>
												<FormLabel>Bitola 3</FormLabel>
												<Input
													{...field}
													type="number"
													step={0.001}
													min={0}
													max={99999.999}
													onChange={e => {
														const value = e.target.value;
														if (
															value === "" ||
															(/^\d{0,5}(\.\d{0,3})?$/.test(value) && Number(value) <= 99999.999)
														) {
															field.onChange(value === "" ? undefined : Number(value));
														}
													}}
												/>
												{errors.bitola3 && <FormDescription className="text-destructive">{errors.bitola3.message}</FormDescription>}
											</FormItem>
										)} />

									</div>
								</fieldset>

							</div>

							<TitleSeparator title="Dados do Estoque" />
							<div className="grid grid-cols-[auto_auto_auto_auto_1fr] gap-6">
								<FormField name="acab" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Acabamento</FormLabel>
										<Input {...field} />
										{errors.acab && (
											<FormDescription className="text-destructive">
												{errors.acab.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
								<FormField name="unidade" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Unidade Estq.</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent>
												{unidadeEstqOptions.map((option) => (
													<SelectItem key={option} value={option}>{option}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.unidade && (
											<FormDescription className="text-destructive">
												{errors.unidade.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField
									control={dadosGeraisForm.control}
									name="local"
									render={({ field: { onChange, value } }) => (
										<FormItem className="col-span-2">
											<FormLabel>Local</FormLabel>
											<Select
												onValueChange={(val) => {
													clearErrors("local");
													onChange(val);
												}}
												value={value}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<div className="p-2">
														<input
															className="w-full border p-2 text-sm"
															value={searchLocal}
															onChange={(e) => setSearchLocal(e.target.value)}
														/>
													</div>
													{[...new Map(localData?.map(item => [item.value, item])).values()].map(local => (
														<SelectItem key={local.value} value={local.value}>
															{local.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{errors.local && (
												<FormDescription className="text-destructive">
													{errors.local.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>

								<FormField name="barras" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Barras</FormLabel>
										<Input
											{...field}
											type="number"
											step={1}
											min={0}
											max={999}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,3}$/.test(value) && Number(value) <= 999)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.barras && <FormDescription className="text-destructive">{errors.barras.message}</FormDescription>}
									</FormItem>
								)} />

								<FormField name="comprimento" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Comprimento</FormLabel>
										<Input
											{...field}
											type="number"
											step={1}
											min={0}
											max={999}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,3}$/.test(value) && Number(value) <= 999)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.comprimento && <FormDescription className="text-destructive">{errors.comprimento.message}</FormDescription>}
									</FormItem>
								)} />

								<FormField name="estoqueminimo" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Estoque Mínimo</FormLabel>
										<Input
											{...field}
											type="number"
											step={0.001}
											min={0}
											max={999999.999}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,6}(\.\d{0,3})?$/.test(value) && Number(value) <= 999999.999)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.estoqueminimo && <FormDescription className="text-destructive">{errors.estoqueminimo.message}</FormDescription>}
									</FormItem>
								)} />
								<FormField name="estoqueatual" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Estoque Atual</FormLabel>
										<Input
											{...field}
											type="number"
											step={0.001}
											min={0}
											max={999999.999}
											onChange={e => {
												const value = e.target.value;
												// Regex para números com até 6 dígitos antes da vírgula e até 3 decimais
												if (
													value === "" ||
													/^(\d{1,6})(\.\d{0,3})?$/.test(value) &&
													Number(value) <= 999999.999
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.estoqueatual && <FormDescription className="text-destructive">{errors.estoqueatual.message}</FormDescription>}
									</FormItem>
								)} />

							</div>
							<TitleSeparator title="Descrição e Observação" />
							<div className="grid grid-cols-4 gap-4">
								<FormField name="titulo" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Titulo</FormLabel>
										<Input {...field} />
										{errors.titulo && (
											<FormDescription className="text-destructive">
												{errors.titulo.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
								<FormField name="obs" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Observacao</FormLabel>
										<Input {...field} />
										{errors.obs && (
											<FormDescription className="text-destructive">
												{errors.obs.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
								<FormField name="marca" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
										<Input {...field} />
										{errors.marca && (
											<FormDescription className="text-destructive">
												{errors.marca.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
							</div>
							<TitleSeparator title="Fiscal" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									control={dadosGeraisForm.control}
									name="classifisc"
									render={({ field: { onChange, value } }) => (
										<FormItem className="col-span-2">
											<FormLabel>Classificação Fiscal</FormLabel>
											<Select
												onValueChange={(val) => {
													clearErrors("classifisc");
													onChange(val);
												}}

												value={value}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<div className="p-2">
														<input
															className="w-full border p-2 text-sm"
															value={searchClassifisc}
															onChange={(e) => setSearchClassifisc(e.target.value)}
														/>
													</div>

													{[...new Map(classifiscData?.map(item => [item.value, item])).values()].map(conta => (
														<SelectItem key={conta.value} value={conta.value}>
															{conta.label}
														</SelectItem>
													))}

												</SelectContent>
											</Select>
											{errors.classifisc && (
												<FormDescription className="text-destructive">
													{errors.classifisc.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="tributo"
									render={({ field: { onChange, value } }) => (
										<FormItem className="col-span-2">
											<FormLabel>Tributo</FormLabel>
											<Select
												onValueChange={(val) => {
													clearErrors("tributo");
													onChange(val);
												}}
												value={value}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<div className="p-2">
														<input
															className="w-full border p-2 text-sm"
															value={searchAtributo}
															onChange={(e) => setSearchAtributo(e.target.value)}
														/>
													</div>
													{[...new Map(atributoData?.map(item => [item.value, item])).values()].map(tributo => (
														<SelectItem key={tributo.value} value={tributo.value}>
															{tributo.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{errors.tributo && (
												<FormDescription className="text-destructive">
													{errors.tributo.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="csosn"
									render={({ field: { onChange, value } }) => (
										<FormItem className="col-span-2">
											<FormLabel>CSOSN</FormLabel>
											<Select
												onValueChange={(val) => {
													clearErrors("csosn");
													onChange(val);
												}}
												value={value}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<div className="p-2">
														<input
															className="w-full border p-2 text-sm"
															value={searchCsosn}
															onChange={(e) => setSearchCsosn(e.target.value)}
														/>
													</div>
													{[...new Map(csosnData?.map(item => [item.value, item])).values()].map(csosn => (
														<SelectItem key={csosn.value} value={csosn.value}>
															{csosn.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{errors.csosn && (
												<FormDescription className="text-destructive">
													{errors.csosn.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
							<TitleSeparator title="Preço e Custo" />
							<div className="grid grid-cols-4 gap-4">
								<FormField name="custoreal" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Custo Real</FormLabel>
										<Input
											{...field}
											type="number"
											step={0.01}
											min={0}
											max={9999999999.99}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,10}(\.\d{0,2})?$/.test(value) && Number(value) <= 9999999999.99)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.custoreal && <FormDescription className="text-destructive">{errors.custoreal.message}</FormDescription>}
									</FormItem>
								)} />
								<FormField name="custorealporc" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Custo Real %</FormLabel>
										<Input
											{...field}
											type="number"
											step={0.01}
											min={0}
											max={9999999999.99}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,10}(\.\d{0,2})?$/.test(value) && Number(value) <= 9999999999.99)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.custorealporc && <FormDescription className="text-destructive">{errors.custorealporc.message}</FormDescription>}
									</FormItem>
								)} />
								<FormField name="precovenda" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Preço Venda</FormLabel>
										<Input
											{...field}
											type="number"
											step={0.01}
											min={0}
											max={9999999999.99}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,10}(\.\d{0,2})?$/.test(value) && Number(value) <= 9999999999.99)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.precovenda && <FormDescription className="text-destructive">{errors.precovenda.message}</FormDescription>}
									</FormItem>
								)} />

							</div>
							<TitleSeparator title="Preço e Custo" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									name="entrablocok"
									control={control}
									render={({ field }) => (
										<FormItem className="flex items-center space-x-3">
											<Switch
												checked={field.value}
												onCheckedChange={(checked) => field.onChange(!!checked)}
												id="entraBlocoK"
											/>
											<label htmlFor="entraBlocoK" className="text-sm">
												Entra Bloco K
											</label>
										</FormItem>
									)}
								/>
								<FormField name="unidadeblocok" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Unidade</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent>
												{unidadeBlocoKOptions.map((option) => (
													<SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.unidadeblocok && (
											<FormDescription className="text-destructive">
												{errors.unidadeblocok.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

							</div>
							<TitleSeparator title="Preço e Custo" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									name="corrida"
									control={dadosGeraisForm.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Corrida</FormLabel>
											<div className="flex items-center gap-2">
												<Input
													{...field}
													value={corridaSelecionada}
													onChange={(e) => {
														const valor = e.target.value;
														field.onChange(valor);
														setCorridaSelecionada(valor);
														dadosGeraisForm.clearErrors("corrida");
													}}
													onBlur={async () => {
														//if (!corridaSelecionada) return;

														const response = await buscarCorridas({
															search: corridaSelecionada,
															page: 1,
															perPage: 1,
														});

														const corridaEncontrada = response?.corridas?.[0];

														if (!corridaEncontrada) {
															dadosGeraisForm.setError("corrida", {
																type: "manual",
																message: "Corrida inexistente na base",
															});
														} else {
															dadosGeraisForm.clearErrors("corrida");
														}
													}}
												/>

												<button
													type="button"
													onClick={() => {
														setFiltroCorrida("");
														setSearchCorrida("");
														setModalAberto(true);
													}}
													className="p-2 border rounded text-gray-600 hover:bg-gray-100"
													title="Buscar Corrida"
												>
													🔍
												</button>
											</div>

											{dadosGeraisForm.formState.errors.corrida && (
												<FormDescription className="text-destructive">
													{dadosGeraisForm.formState.errors.corrida.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>


								<FormField name="tipoaco" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo Aço</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent>
												{tipoAcoOptions.map((option) => (
													<SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.tipoaco && (
											<FormDescription className="text-destructive">
												{errors.tipoaco.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField name="identificacao" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Identificação</FormLabel>
										<Input {...field} />
										{errors.identificacao && (
											<FormDescription className="text-destructive">
												{errors.identificacao.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField
									name="observacao"
									control={control}
									render={({ field }) => (
										<FormItem className="col-span-2">
											<FormLabel>Observação</FormLabel>
											<Textarea
												className="resize-none"
												rows={4}
												{...field}
											/>
											{errors.observacao && (
												<FormDescription className="text-destructive">
													{errors.observacao.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
							<TitleSeparator title="Identificação Complementar" />
							<div className="grid grid-cols-2 gap-4">

								<FormField name="proqrama" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Programa</FormLabel>
										<Input {...field} />
										{errors.proqrama && (
											<FormDescription className="text-destructive">
												{errors.proqrama.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField name="tratamento" control={control} render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Tratamento</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger><SelectValue /></SelectTrigger>
											<SelectContent>
												{tratamentoOptions.map((option) => (
													<SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.tratamento && (
											<FormDescription className="text-destructive">
												{errors.tratamento.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<fieldset className="border border-gray-300 p-4 rounded-md">
									<legend className="text-sm font-medium text-gray-700 px-2">Bitolas Originais</legend>

									<div className="flex gap-4 mt-2">
										<FormField name="bitolaoriginal1" control={control} render={({ field }) => (
											<FormItem>
												<FormLabel>1</FormLabel>
												<Input
													{...field}
													type="number"
													step={0.001}
													min={0}
													max={99999.999}
													onChange={e => {
														const value = e.target.value;
														if (
															value === "" ||
															(/^\d{0,5}(\.\d{0,3})?$/.test(value) && Number(value) <= 99999.999)
														) {
															field.onChange(value === "" ? undefined : Number(value));
														}
													}}
												/>
												{errors.bitolaoriginal1 && <FormDescription className="text-destructive">{errors.bitolaoriginal1.message}</FormDescription>}
											</FormItem>
										)} />

										x
										<FormField name="bitolaoriginal2" control={control} render={({ field }) => (
											<FormItem>
												<FormLabel>2</FormLabel>
												<Input
													{...field}
													type="number"
													step={0.001}
													min={0}
													max={99999.999}
													onChange={e => {
														const value = e.target.value;
														if (
															value === "" ||
															(/^\d{0,5}(\.\d{0,3})?$/.test(value) && Number(value) <= 99999.999)
														) {
															field.onChange(value === "" ? undefined : Number(value));
														}
													}}
												/>
												{errors.bitolaoriginal2 && <FormDescription className="text-destructive">{errors.bitolaoriginal2.message}</FormDescription>}
											</FormItem>
										)} />

										x
										<FormField name="bitolaoriginal3" control={control} render={({ field }) => (
											<FormItem>
												<FormLabel>3</FormLabel>
												<Input
													{...field}
													type="number"
													step={0.001}
													min={0}
													max={99999.999}
													onChange={e => {
														const value = e.target.value;
														if (
															value === "" ||
															(/^\d{0,5}(\.\d{0,3})?$/.test(value) && Number(value) <= 99999.999)
														) {
															field.onChange(value === "" ? undefined : Number(value));
														}
													}}
												/>
												{errors.bitolaoriginal3 && <FormDescription className="text-destructive">{errors.bitolaoriginal3.message}</FormDescription>}
											</FormItem>
										)} />
									</div>
								</fieldset>
							</div>
							<TitleSeparator title="Dados do Fornecedor de Compras" />
							<div className="grid grid-cols-3 gap-4">
								<FormField name="nfcompra" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Nr. NF Compra</FormLabel>
										<Input {...field} />
									</FormItem>
								)} />

								<FormField
									name="datacompra"
									control={control}
									render={({ field }) => (
										<FormItem className="flex flex-col space-y-4">
											<FormLabel>Data da Compra</FormLabel>
											<DatePicker
												selected={field.value ? dayjs(field.value, 'DD/MM/YYYY').toDate() : null}
												onChange={(date) => {
													if (!date) {
														field.onChange('');
														return;
													}
													const formatted = dayjs(date).format('DD/MM/YYYY');
													field.onChange(formatted);
												}}
												dateFormat="dd/MM/yyyy"
												placeholderText=""
												className="w-full border border-input bg-background text-sm rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
											/>
											{errors.datacompra && (
												<FormDescription className="text-destructive">
													{errors.datacompra.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>

								<FormField name="custocompra" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Custo Compra</FormLabel>
										<Input
											{...field}
											type="number"
											step={0.01}
											min={0}
											max={9999999999.99}
											onChange={e => {
												const value = e.target.value;
												if (
													value === "" ||
													(/^\d{0,10}(\.\d{0,2})?$/.test(value) && Number(value) <= 9999999999.99)
												) {
													field.onChange(value === "" ? undefined : Number(value));
												}
											}}
										/>
										{errors.custocompra && <FormDescription className="text-destructive">{errors.custocompra.message}</FormDescription>}
									</FormItem>
								)} />

								<FormField name="fornecedor" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Fornecedor</FormLabel>
										<Input {...field} />
										{errors.fornecedor && (
											<FormDescription className="text-destructive">
												{errors.fornecedor.message}
											</FormDescription>
										)}
									</FormItem>
								)} />

								<FormField name="certificado" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>Nro. Certificado</FormLabel>
										<Input {...field} />
										{errors.certificado && (
											<FormDescription className="text-destructive">
												{errors.certificado.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
							</div>

							<TitleSeparator title="Outros Dados" />
							<div className="grid grid-cols-4 gap-4">
								<FormField name="fci" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>FCI</FormLabel>
										<Input {...field} />
										{errors.fci && (
											<FormDescription className="text-destructive">
												{errors.fci.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
								{/* <FormField
									name="datacad"
									control={control}
									render={({ field }) => (
										<FormItem className="w-48">
											<FormLabel>Data de Cadastro</FormLabel>
											<Input
												type="date"
												{...field}
												// Ajusta para evitar conflito com formato diferente
												onChange={(e) => {
													// Converte 'yyyy-mm-dd' para 'dd/mm/yyyy'
													const val = e.target.value;
													if (!val) {
														field.onChange('');
														return;
													}
													const [year, month, day] = val.split('-');
													field.onChange(`${day}/${month}/${year}`);
												}}
												value={
													// Converte de DD/MM/YYYY para yyyy-mm-dd para exibir no input
													(() => {
														const v = field.value;
														if (!v) return '';
														const parts = v.split('/');
														if (parts.length !== 3) return '';
														return `${parts[2]}-${parts[1]}-${parts[0]}`;
													})()
												}
											/>
											{errors.datacad && (
												<FormDescription className="text-destructive">
													{errors.datacad.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/> */}

								<FormField name="observacoesgerais" control={control} render={({ field }) => (
									<FormItem className="col-span-2 mt-4">
										<FormLabel>Observações Gerais</FormLabel>
										<Textarea rows={4} {...field} />
										{errors.observacoesgerais && (
											<FormDescription className="text-destructive">
												{errors.observacoesgerais.message}
											</FormDescription>
										)}
									</FormItem>
								)} />
							</div>
						</form>
					</Form>

					<Dialog open={modalAberto} onOpenChange={setModalAberto}>
						<DialogContent className="w-[80%] max-w-none !w-[70%] h-[70vh] !h-[70vh]">
							{/* Campo de filtro */}
							<div className="mb-4 flex items-center gap-2">
								<label htmlFor="filtroCorrida" className="font-medium">
									Localizar
								</label>
								<input
									type="text"
									className="w-full border rounded px-3 py-2 w-64"
									value={filtroCorrida}
									onChange={(e) => setFiltroCorrida(e.target.value)}
									placeholder="Digite ao menos 2 caracteres..."
								/>
							</div>

							<DataTable
								meta={{
									page: corridaData?.meta?.page ?? 1,
									perPage: corridaData?.meta?.perPage ?? 10,
									total: corridaData?.meta?.total ?? 0,
								}}
								isLoading={carregandoCorrida}
								onChangePage={(page) => {
									handlePageChangeCorrida(page);
									return Promise.resolve();
								}}
								data={corridaData?.corridas ?? []}
								columns={columns}
							/>
						</DialogContent>
					</Dialog>
				</>
			)}
		</>
	);
}