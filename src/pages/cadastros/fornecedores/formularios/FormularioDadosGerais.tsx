import { ListarResponse } from "@/api/fiscal/listas-produto";
import { TitleSeparator } from "@/components/TitleSeparator";
import {
	Form,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DadosGeraisForm } from "@/pages/cadastros/fornecedores/formularios/FormularioDeFornecedor";
import { formatCep } from "@/utils/formatCep";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { formatTelefone } from "@/utils/formatTel";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const tiposIELabelHash: Record<string, string> = {
	"1": "1 - Contribuinte ICMS (informar a IE do destinatário)",
	"2": "2 - Contribuinte isento de Inscrição no cadastro de Contribuintes do ICMS",
	"9": "9 - Não Contribuinte, que pode ou não possuir Inscrição Estadual no Cadastro",
};

export const dadosGeraisContribuintesValidos = ["1"] as const;

export const dadosGeraisTiposConsumoValidos = ["1"] as const;

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;
	contaData?: ListarResponse;
	carregandoContaContabil: boolean;
	searchConta: string;
	setSearchConta: React.Dispatch<React.SetStateAction<string>>;
	isLoading: boolean;
}

export function FormularioDadosGerais({
	dadosGeraisForm,
	contaData,
	carregandoContaContabil,
	searchConta,
	setSearchConta,
	isLoading
}: FormularioDadosGeraisProps) {

	const {
		watch,
		clearErrors,
		formState: { errors },
	} = dadosGeraisForm;

	//const tipo = watch("tipo");
	const cep = watch("cep");
	//const pracaCep = watch("pracaCep");

	useEffect(() => {
		if (!cep) {
			return;
		}
		const clearedCep = cep.replace(/\D/g, "");
		if (clearedCep.length === 8) {
			fetch(`https://viacep.com.br/ws/${clearedCep}/json/`)
				.then((response) => response.json())
				.then((data) => {
					dadosGeraisForm.setValue("endereco", data.logradouro);
					dadosGeraisForm.setValue("bairro", data.bairro);
					dadosGeraisForm.setValue("cidade", data.localidade);
					dadosGeraisForm.setValue("estado", data.uf);
					clearErrors("cep");
					clearErrors("endereco");
					clearErrors("bairro");
					clearErrors("cidade");
					clearErrors("estado");
				});
		}
	}, [cep, dadosGeraisForm.setValue, clearErrors]);

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center h-64">
					<Loader className="animate-spin" size={"3rem"} />
				</div>
			) : (
				<>
					<Form {...dadosGeraisForm}>
						<form className="flex gap-4 flex-col px-6">
							<TitleSeparator title="Informações" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									control={dadosGeraisForm.control}
									name="codigo"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Código</FormLabel>
											<Input {...field} disabled />
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="nome"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Nome</FormLabel>
											<Input
												placeholder="Nome"
												{...props}
												onChange={(e) => {
													clearErrors("nome");
													onChange(e);
												}}
											/>
											{errors.nome && (
												<FormDescription className="text-destructive">
													{errors.nome.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="cgcfor"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Identificador</FormLabel>
											<Input

												onChange={(e) => {
													const { value } = e.target;
													e.target.value = formatCpfCnpj(value);
													onChange(e);
													clearErrors("cgcfor");
												}}
												{...props}
											/>
											{errors.cgcfor && (
												<FormDescription className="text-destructive">
													{errors.cgcfor.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
							<TitleSeparator title="Fiscal" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									control={dadosGeraisForm.control}
									name="estadualrg"
									render={({ field: { onChange, ...props } }) => (
										<FormItem >
											<FormLabel>IE</FormLabel>
											<Input

												onChange={(e) => {
													onChange(e);
													clearErrors("estadualrg");
												}}
												{...props}
											/>
											{errors.estadualrg && (
												<FormDescription className="text-destructive">
													{errors.estadualrg.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="tipoie"
									render={({ field: { onChange, ...props } }) => (
										<FormItem className="col-span-2">
											<FormLabel>Tipo IE</FormLabel>
											<Select
												onValueChange={(e) => {
													clearErrors("tipoie");
													onChange(e);
												}}
												value={props.value}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{Object.entries(tiposIELabelHash).map(([key, label]) => (
														<SelectItem key={key} value={key}>
															{label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{errors.tipoie && (
												<FormDescription className="text-destructive">
													{errors.tipoie.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-4 gap-4">
								<FormField
									control={dadosGeraisForm.control}
									name="contaContabil"
									render={({ field: { onChange, value } }) => (
										<FormItem className="col-span-2">
											<FormLabel>Conta Contábil</FormLabel>
											<Select
												onValueChange={(val) => {
													clearErrors("contaContabil");
													onChange(val);
												}}
												value={value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Conta Contábil" />
												</SelectTrigger>
												<SelectContent>
													<div className="p-2">
														<input
															className="w-full border p-2 text-sm"
															placeholder="Buscar conta..."
															value={searchConta}
															onChange={(e) => setSearchConta(e.target.value)}
														/>
													</div>

													{[...new Map(contaData?.map(item => [item.value, item])).values()].map(conta => (
														<SelectItem key={conta.value} value={conta.value}>
															{conta.label}
														</SelectItem>
													))}

												</SelectContent>
											</Select>
											{errors.contaContabil && (
												<FormDescription className="text-destructive">
													{errors.contaContabil.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
							<TitleSeparator title="Endereço" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									control={dadosGeraisForm.control}
									name="cep"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>CEP</FormLabel>
											<Input

												onChange={(e) => {
													const { value } = e.target;
													e.target.value = formatCep(value);
													onChange(e);
													clearErrors("cep");
												}}
												{...props}
											/>
											{errors.cep && (
												<FormDescription className="text-destructive">
													{errors.cep.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="endereco"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Rua</FormLabel>
											<Input

												onChange={(e) => {
													onChange(e);
													clearErrors("endereco");
												}}
												{...props}
												disabled
											/>
											{errors.endereco && (
												<FormDescription className="text-destructive">
													{errors.endereco.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="numero"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Número</FormLabel>
											<Input

												onChange={(e) => {
													onChange(e);
													clearErrors("numero");
												}}
												{...props}
											/>
											{errors.numero && (
												<FormDescription className="text-destructive">
													{errors.numero.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<div />
								<FormField
									control={dadosGeraisForm.control}
									name="complemento"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Complemento</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("complemento");
												}}
												{...props}
											/>
											{errors.complemento && (
												<FormDescription className="text-destructive">
													{errors.complemento.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="bairro"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Bairro</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("bairro");
												}}
												{...props}
												disabled
											/>
											{errors.bairro && (
												<FormDescription className="text-destructive">
													{errors.bairro.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="cidade"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Cidade</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("cidade");
												}}
												{...props}
												disabled
											/>
											{errors.cidade && (
												<FormDescription className="text-destructive">
													{errors.cidade.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="estado"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>UF</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("estado");
												}}
												{...props}
												disabled
											/>
											{errors.estado && (
												<FormDescription className="text-destructive">
													{errors.estado.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="observacao"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Observação</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("observacao");
												}}
												{...props}
											/>
											{errors.observacao && (
												<FormDescription className="text-destructive">
													{errors.observacao.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="segmento"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Segmento</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("segmento");
												}}
												{...props}
											/>
											{errors.segmento && (
												<FormDescription className="text-destructive">
													{errors.segmento.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="nomeFantasia"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Fantasia</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("nomeFantasia");
												}}
												{...props}
											/>
											{errors.nomeFantasia && (
												<FormDescription className="text-destructive">
													{errors.nomeFantasia.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
							<TitleSeparator title="Contato" />
							<div className="grid grid-cols-4 gap-4">
								<FormField
									control={dadosGeraisForm.control}
									name="nomeContato"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Nome Contato</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("nomeContato");
												}}
												{...props}
											/>
											{errors.nomeContato && (
												<FormDescription className="text-destructive">
													{errors.nomeContato.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="telefone1"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Telefone 1</FormLabel>
											<Input
												maxLength={15}
												onChange={(e) => {
													const { value } = e.target;
													e.target.value = formatTelefone(value);
													onChange(e);
													clearErrors("telefone1");
												}}
												{...props}
											/>
											{errors.telefone1 && (
												<FormDescription className="text-destructive">
													{errors.telefone1.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="telefone2"
									render={({ field: { onChange, ...props } }) => (
										<FormItem>
											<FormLabel>Telefone 2</FormLabel>
											<Input
												maxLength={15}
												onChange={(e) => {
													const { value } = e.target;
													e.target.value = formatTelefone(value);
													onChange(e);
													clearErrors("telefone2");
												}}
												{...props}
											/>
											{errors.telefone2 && (
												<FormDescription className="text-destructive">
													{errors.telefone2.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<div />
								<FormField
									control={dadosGeraisForm.control}
									name="site"
									render={({ field: { onChange, ...props } }) => (
										<FormItem className="col-span-2">
											<FormLabel>Site</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("site");
												}}
												{...props}
											/>
											{errors.site && (
												<FormDescription className="text-destructive">
													{errors.site.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<div />
								<FormField
									control={dadosGeraisForm.control}
									name="emailComercial"
									render={({ field: { onChange, ...props } }) => (
										<FormItem className="col-span-2 mb-6">
											<FormLabel>E-mail comercial</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("emailComercial");
												}}
												{...props}
											/>
											{errors.emailComercial && (
												<FormDescription className="text-destructive">
													{errors.emailComercial.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
								<FormField
									control={dadosGeraisForm.control}
									name="emailFiscal"
									render={({ field: { onChange, ...props } }) => (
										<FormItem className="col-span-2">
											<FormLabel>E-mail fiscal</FormLabel>
											<Input
												onChange={(e) => {
													onChange(e);
													clearErrors("emailFiscal");
												}}
												{...props}
											/>
											{errors.emailFiscal && (
												<FormDescription className="text-destructive">
													{errors.emailFiscal.message}
												</FormDescription>
											)}
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
				</>
			)}
		</>
	);
}
