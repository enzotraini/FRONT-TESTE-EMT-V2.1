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
import { formatCep } from "@/utils/formatCep";
import { formatCpfCnpj } from "@/utils/formatCpfCnpj";
import { formatTelefone } from "@/utils/formatTel";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const tiposIELabelHash: Record<string, string> = {
	"1": "1 - Contribuinte ICMS (informar a IE do destinatário)",
	"2": "2 - Contribuinte isento de Inscrição no cadastro de Contribuintes do ICMS",
	"9": "9 - Não Contribuinte, que pode ou não possuir Inscrição Estadual no Cadastro",
};

export const tiposIEValidos = ["1", "2", "9"] as const;

export const dadosGeraisContribuintesValidos = ["1"] as const;

export const dadosGeraisTiposConsumoValidos = ["1"] as const;

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;
	contaData?: ListarResponse;
	carregandoContaContabil: boolean;
	searchConta: string;
	setSearchConta: React.Dispatch<React.SetStateAction<string>>;
}

export const dadosGeraisFormSchema = z.object({
	codigo: z.string().default(""),
	nome: z
		.string({ required_error: "Nome é obrigatório" })
		.min(1, "Nome é obrigatório.")
		.max(100, "Nome deve ter no máximo 100 caracteres."),
	identificador: z
		.string({ required_error: "CPF/CNPJ é obrigatório." })
		.min(11, "CPF/CNPJ deve ter no mínimo 11 caracteres.")
		.max(18, "CPF/CNPJ deve ter no máximo 18 caracteres."),
	cep: z
		.string({ required_error: "CEP é obrigatório." })
		.refine((cep) => cep.replace(/\D/g, "").length === 8, {
			message: "CEP inválido.",
		}),
	//.max(9, "CEP deve ter no máximo 9 caracteres."),
	rua: z
		.string({ required_error: "Rua é obrigatória." })
		.min(1, "Rua é obrigatória.")
		.max(100, "Rua deve ter no máximo 100 caracteres."),
	numero: z.coerce.number(),
	complemento: z
		.string()
		.max(30, "Complemento deve ter no máximo 30 caracteres.")
		.default(""),
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
	nomeFantasia: z.string().max(20, "Nome Fantasia deve ter no máximo 20 caracteres.").default(""),
	observacao: z.string().max(40, "Observação deve ter no máximo 40 caracteres.").default(""),
	nomeContato: z.string().max(15, "Nome do contato deve ter no máximo 15 caracteres.").default(""),
	telefone1: z.string().max(15, "Telefone 1 deve ter no máximo 15 caracteres.").default(""),
	telefone2: z.string().max(15, "Telefone 2 deve ter no máximo 15 caracteres.").default(""),
	segmento: z.string().max(30, "Segmento deve ter no máximo 30 caracteres.").default(""),
	site: z.string().max(100, "Site deve ter no máximo 100 caracteres.").default(""),
	estadualrg: z.string().max(15, "IE deve ter no máximo 15 caracteres.").default(""),
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
		.default(""),
	emailFiscal: z
		.string()
		.max(100, "Email fiscal deve ter no máximo 100 caracteres.")
		.refine(
			(val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
			{ message: "Email fiscal inválido." }
		)
		.default(""),
});

export type DadosGeraisForm = z.infer<typeof dadosGeraisFormSchema>;

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;
}

export function FormularioDadosGerais({
	dadosGeraisForm,
	contaData,
	carregandoContaContabil,
	searchConta,
	setSearchConta,
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
					dadosGeraisForm.setValue("rua", data.logradouro);
					dadosGeraisForm.setValue("bairro", data.bairro);
					dadosGeraisForm.setValue("cidade", data.localidade);
					dadosGeraisForm.setValue("estado", data.uf);
					clearErrors("cep");
					clearErrors("rua");
					clearErrors("bairro");
					clearErrors("cidade");
					clearErrors("estado");
				});
		}
	}, [cep, dadosGeraisForm.setValue, clearErrors]);

	return (
		<Form {...dadosGeraisForm}>
			<form className="flex gap-4 flex-col px-6">
				<TitleSeparator title="Informações" />
				<div className="grid grid-cols-4 gap-4">
					<FormField
						control={dadosGeraisForm.control}
						name="codigo"
						render={({ field }) => (
							<FormItem>
								<Input placeholder="Código" {...field} disabled />
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="nome"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
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
						name="identificador"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder={"CNPJ/CPF"}
									onChange={(e) => {
										const { value } = e.target;
										e.target.value = formatCpfCnpj(value);
										onChange(e);
										clearErrors("identificador");
									}}
									{...props}
								/>
								{errors.identificador && (
									<FormDescription className="text-destructive">
										{errors.identificador.message}
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
								<Input
									placeholder="IE"
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
								<Select
									onValueChange={(e) => {
										clearErrors("tipoie");
										onChange(e);
									}}
									value={props.value}
								>
									<SelectTrigger>
										<SelectValue placeholder="Tipo de IE" />
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
								<Input
									placeholder="CEP"
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
						name="rua"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Rua"
									onChange={(e) => {
										onChange(e);
										clearErrors("rua");
									}}
									{...props}
									disabled
								/>
								{errors.rua && (
									<FormDescription className="text-destructive">
										{errors.rua.message}
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
								<Input
									placeholder="Número"
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
								<Input
									placeholder="Complemento"
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
								<Input
									placeholder="Bairro"
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
								<Input
									placeholder="Cidade"
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
								<Input
									placeholder="UF"
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
								<Input
									placeholder="Observação"
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
								<Input
									placeholder="Segmento"
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
								<Input
									placeholder="Fantasia"
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
								<Input
									placeholder="Nome do contato"
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
								<Input
									placeholder="Telefone comercial"
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
								<Input
									placeholder="Telefone"
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
								<Input
									placeholder="Site"
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
							<FormItem className="col-span-2">
								<Input
									placeholder="E-mail comercial"
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
								<Input
									placeholder="E-mail fiscal"
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
	);
}
