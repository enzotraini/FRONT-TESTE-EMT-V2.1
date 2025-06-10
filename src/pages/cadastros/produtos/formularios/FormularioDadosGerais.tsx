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

const unidadeEstqOptions = [
	"CH",
	"Falta os outros options"
];

const localOptions = [
	"CH",
	"Falta os outros options"
];

import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";



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
	setCorridaSelecionada
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

	return (

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
							</FormItem>
						)} />

						<FormField name="tipo" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de Material</FormLabel>
								<Input {...field} />
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
							</FormItem>
						)} />

						<fieldset className="w-max border p-2 rounded-md">
							<legend className="text-sm font-medium text-gray-700 px-2">Bitolas</legend>
							<div className="flex gap-2">
								<FormField name="bitola1" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>1</FormLabel>
										<Input className="w-20" {...field} />
									</FormItem>
								)} />
								x
								<FormField name="bitola2" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>2</FormLabel>
										<Input className="w-20" {...field} />
									</FormItem>
								)} />
								x
								<FormField name="bitola3" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>3</FormLabel>
										<Input className="w-20" {...field} />
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
							</FormItem>
						)} />
						<FormField name="unidade" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Unidade Estq.</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										{unidadeEstqOptions.map((option) => (
											<SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)} />
						<FormField name="local" control={control} render={({ field }) => (
							<FormItem className="w-20">
								<FormLabel>Local</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										{localOptions.map((option) => (
											<SelectItem key={option} value={option.split("-")[0]}>{option}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)} />
						<FormField name="barras" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Barras</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField name="comprimento" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Comprimento</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField name="estoqueminimo" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Estq Minimo</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField
							name="estoqueatual"
							control={control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Estq Atual</FormLabel>
									<NumericFormat
										decimalScale={3}
										allowNegative={false}
										thousandSeparator="."
										decimalSeparator=","
										customInput={Input}
										value={field.value}
										onValueChange={(values) => {
											field.onChange(values.floatValue);
										}}
										isAllowed={({ floatValue }) => {
											if (floatValue === undefined) return true;

											// Limita a parte inteira a no máximo 9 dígitos
											const [inteiros = "", decimais = ""] = floatValue.toString().split(".");
											return inteiros.length <= 9 && decimais.length <= 3;
										}}
									/>

								</FormItem>
							)}
						/>
					</div>
					<TitleSeparator title="Descrição e Observação" />
					<div className="grid grid-cols-4 gap-4">
						<FormField name="titulo" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Titulo</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField name="obs" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Observacao</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField name="marca" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Marca</FormLabel>
								<Input {...field} />
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
								<Input {...field} />
							</FormItem>
						)} />
						<FormField name="custorealporc" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Custo Real 12%</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField name="precovenda" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Preço de Venda</FormLabel>
								<Input {...field} />
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
							</FormItem>
						)} />

						<FormField name="identificacao" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Identificação</FormLabel>
								<Input {...field} />
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
							</FormItem>
						)} />

						<fieldset className="border border-gray-300 p-4 rounded-md">
							<legend className="text-sm font-medium text-gray-700 px-2">Bitolas Originais</legend>

							<div className="flex gap-4 mt-2">
								<FormField name="bitolaoriginal1" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>1</FormLabel>
										<Input className="w-32" {...field} />
									</FormItem>
								)} />
								x
								<FormField name="bitolaoriginal2" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>2</FormLabel>
										<Input className="w-32" {...field} />
									</FormItem>
								)} />
								x
								<FormField name="bitolaoriginal3" control={control} render={({ field }) => (
									<FormItem>
										<FormLabel>3</FormLabel>
										<Input className="w-32" {...field} />
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
								<FormItem>
									<FormLabel>Data da Compra</FormLabel>
									<InputMask
										mask="99/99/9999"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
									>
										{(inputProps) => (
											<Input
												{...inputProps}
												ref={field.ref}
											/>
										)}
									</InputMask>

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
								<Input {...field} />
							</FormItem>
						)} />

						<FormField name="fornecedor" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Fornecedor</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />

						<FormField name="certificado" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>Nro. Certificado</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
					</div>

					<TitleSeparator title="Outros Dados" />
					<div className="grid grid-cols-4 gap-4">
						<FormField name="fci" control={control} render={({ field }) => (
							<FormItem>
								<FormLabel>FCI</FormLabel>
								<Input {...field} />
							</FormItem>
						)} />
						<FormField
							name="datacad"
							control={control}
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Data de Cadastro</FormLabel>
									<InputMask
										mask="99/99/9999"
										{...field}
									>
										{(inputProps) => <Input {...inputProps} />}
									</InputMask>
								</FormItem>
							)}
						/>
						<FormField name="observacoesgerais" control={control} render={({ field }) => (
							<FormItem className="col-span-2 mt-4">
								<FormLabel>Observações Gerais</FormLabel>
								<Textarea rows={4} {...field} />
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
	);
}