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
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const dadosGeraisTiposValidos = ["fisica", "juridica"] as const;

const tiposLabelHash = {
	fisica: "Pessoa Física",
	juridica: "Pessoa Jurídica",
};

export const dadosGeraisContribuintesValidos = ["1"] as const;

const contribuintesICMSLabelHash = {
	1: "1 - Contribuinte",
};

export const dadosGeraisTiposConsumoValidos = ["1"] as const;

const tiposConsumoLabelHash = {
	1: "1 - Industrialização",
};

export const dadosGeraisFormSchema = z.object({
	// Informações
	codigo: z
		.string()
		.transform((_) => "")
		.default(""),
	nome: z.string({ required_error: "Nome é obrigatório" }).nonempty({
		message: "Nome é obrigatório.",
	}),
	tipo: z.enum(dadosGeraisTiposValidos, {
		required_error: "Tipo é obrigatório.",
		invalid_type_error: "Tipo inválido.",
	}),
	identificador: z
		.string({
			required_error: "CPF/CNPJ é obrigatório.",
		})
		.refine((doc) => {
			const replacedDoc = doc.replace(/\D/g, "");
			return replacedDoc.length >= 11;
		}, "CPF/CNPJ deve conter no mínimo 11 caracteres.")
		.refine((doc) => {
			const replacedDoc = doc.replace(/\D/g, "");
			return replacedDoc.length <= 14;
		}, "CPF/CNPJ deve conter no máximo 14 caracteres.")
		.refine((doc) => {
			const replacedDoc = doc.replace(/\D/g, "");
			return !!Number(replacedDoc);
		}, "CPF/CNPJ deve conter apenas números."),
	// Endereço
	cep: z
		.string({
			required_error: "CEP é obrigatório.",
		})
		.refine((cep) => cep.replace(/\D/g, "").length === 8, {
			message: "CEP inválido.",
		}),
	rua: z.string({ required_error: "Rua é obrigatória." }).nonempty({
		message: "Rua é obrigatória.",
	}),
	numero: z.string().default(""),
	complemento: z.string().default(""),
	bairro: z.string({ required_error: "Bairro é obrigatório." }).nonempty({
		message: "Bairro é obrigatório.",
	}),
	cidade: z.string({ required_error: "Cidade é obrigatória." }).nonempty({
		message: "Cidade é obrigatória.",
	}),
	estado: z.string({ required_error: "Estado é obrigatório." }).nonempty({
		message: "Estado é obrigatório.",
	}),
	ie: z.string().default(""),
	contribuinteICMS: z.enum(dadosGeraisContribuintesValidos, {
		required_error: "Contribuinte ICMS é obrigatório.",
		invalid_type_error: "Contribuinte ICMS inválido.",
	}),
	isuframa: z.string().default(""),
	nomeFantasia: z.string().default(""),
	tipoConsumo: z.enum(dadosGeraisTiposConsumoValidos, {
		required_error: "Tipo de consumo é obrigatório.",
		invalid_type_error: "Tipo de consumo inválido.",
	}),
	// Praça de pagamento
	pracaCep: z
		.string({
			required_error: "CEP é obrigatório.",
		})
		.refine((cep) => cep.replace(/\D/g, "").length === 8, {
			message: "CEP inválido.",
		}),
	pracaRua: z.string({ required_error: "Rua é obrigatória." }).nonempty({
		message: "Rua é obrigatória.",
	}),
	pracaNumero: z.string().default(""),
	pracaComplemento: z.string().default(""),
	pracaBairro: z.string({ required_error: "Bairro é obrigatório." }).nonempty({
		message: "Bairro é obrigatório.",
	}),
	pracaCidade: z.string({ required_error: "Cidade é obrigatória." }).nonempty({
		message: "Cidade é obrigatória.",
	}),
	pracaEstado: z.string({ required_error: "Estado é obrigatório." }).nonempty({
		message: "Estado é obrigatório.",
	}),
	// Contato
	nomeContato: z.string().default(""),
	telefone1: z.string().default(""),
	telefone2: z.string().default(""),
	fax: z.string().default(""),
	site: z.string().default(""),
	emailComercial: z.string().default(""),
	emailFiscal: z.string().default(""),
	contatosAdicionais: z.array(z.object({
		id: z.string().default("-1"),
		contato: z.string().default(""),
		telefone: z.string().default(""),
		ramal: z.string().default(""),
		setor: z.string().default(""),
		email: z.string().default("")
	})).default([])
});

export type DadosGeraisForm = z.infer<typeof dadosGeraisFormSchema>;

interface FormularioDadosGeraisProps {
	dadosGeraisForm: UseFormReturn<DadosGeraisForm>;
}

export function FormularioDadosGerais({
	dadosGeraisForm,
}: FormularioDadosGeraisProps) {
	const {
		watch,
		clearErrors,
		formState: { errors },
	} = dadosGeraisForm;

	const tipo = watch("tipo");
	const cep = watch("cep");
	const pracaCep = watch("pracaCep");

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

	useEffect(() => {
		if (!pracaCep) {
			return;
		}
		const clearedCep = pracaCep.replace(/\D/g, "");
		if (clearedCep.length === 8) {
			fetch(`https://viacep.com.br/ws/${clearedCep}/json/`)
				.then((response) => response.json())
				.then((data) => {
					dadosGeraisForm.setValue("pracaRua", data.logradouro);
					dadosGeraisForm.setValue("pracaBairro", data.bairro);
					dadosGeraisForm.setValue("pracaCidade", data.localidade);
					dadosGeraisForm.setValue("pracaEstado", data.uf);
					clearErrors("pracaCep");
					clearErrors("pracaRua");
					clearErrors("pracaBairro");
					clearErrors("pracaCidade");
					clearErrors("pracaEstado");
				});
		}
	}, [pracaCep, dadosGeraisForm.setValue, clearErrors]);

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
						name="tipo"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Select
									onValueChange={(e) => {
										clearErrors("tipo");
										onChange(e);
									}}
									value={props.value}
								>
									<SelectTrigger>
										<SelectValue placeholder="Tipo" />
									</SelectTrigger>
									<SelectContent>
										{dadosGeraisTiposValidos.map((tipo) => (
											<SelectItem key={tipo} value={tipo}>
												{tiposLabelHash[tipo]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.tipo && (
									<FormDescription className="text-destructive">
										{errors.tipo.message}
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
									placeholder={tipo === "fisica" ? "CPF" : "CNPJ"}
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
						name="ie"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="IE"
									onChange={(e) => {
										onChange(e);
										clearErrors("ie");
									}}
									{...props}
								/>
								{errors.ie && (
									<FormDescription className="text-destructive">
										{errors.ie.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="contribuinteICMS"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Select
									onValueChange={(e) => {
										clearErrors("contribuinteICMS");
										onChange(e);
									}}
									value={props.value}
								>
									<SelectTrigger>
										<SelectValue placeholder="Contribuinte ICMS" />
									</SelectTrigger>
									<SelectContent>
										{dadosGeraisContribuintesValidos.map((valor) => (
											<SelectItem key={valor} value={valor}>
												{contribuintesICMSLabelHash[valor]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.contribuinteICMS && (
									<FormDescription className="text-destructive">
										{errors.contribuinteICMS.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<div />
					<div />
					<FormField
						control={dadosGeraisForm.control}
						name="isuframa"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="ISuframa"
									onChange={(e) => {
										onChange(e);
										clearErrors("isuframa");
									}}
									{...props}
								/>
								{errors.isuframa && (
									<FormDescription className="text-destructive">
										{errors.isuframa.message}
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
					<FormField
						control={dadosGeraisForm.control}
						name="tipoConsumo"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Select
									onValueChange={(e) => {
										clearErrors("tipoConsumo");
										onChange(e);
									}}
									value={props.value}
								>
									<SelectTrigger>
										<SelectValue placeholder="Tipo de consumo" />
									</SelectTrigger>
									<SelectContent>
										{dadosGeraisTiposConsumoValidos.map((valor) => (
											<SelectItem key={valor} value={valor}>
												{tiposConsumoLabelHash[valor]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.tipoConsumo && (
									<FormDescription className="text-destructive">
										{errors.tipoConsumo.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
				</div>
				<TitleSeparator title="Praça de pagamento" />
				<div className="grid grid-cols-4 gap-4">
					<FormField
						control={dadosGeraisForm.control}
						name="pracaCep"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="CEP"
									onChange={(e) => {
										const { value } = e.target;
										e.target.value = formatCep(value);
										onChange(e);
										clearErrors("pracaCep");
									}}
									{...props}
								/>
								{errors.pracaCep && (
									<FormDescription className="text-destructive">
										{errors.pracaCep.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="pracaRua"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Rua"
									onChange={(e) => {
										onChange(e);
										clearErrors("pracaRua");
									}}
									{...props}
									disabled
								/>
								{errors.pracaRua && (
									<FormDescription className="text-destructive">
										{errors.pracaRua.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="pracaNumero"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Número"
									onChange={(e) => {
										onChange(e);
										clearErrors("pracaNumero");
									}}
									{...props}
								/>
								{errors.pracaNumero && (
									<FormDescription className="text-destructive">
										{errors.pracaNumero.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<div />
					<FormField
						control={dadosGeraisForm.control}
						name="pracaComplemento"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Complemento"
									onChange={(e) => {
										onChange(e);
										clearErrors("pracaComplemento");
									}}
									{...props}
								/>
								{errors.pracaComplemento && (
									<FormDescription className="text-destructive">
										{errors.pracaComplemento.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="pracaBairro"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Bairro"
									onChange={(e) => {
										onChange(e);
										clearErrors("pracaBairro");
									}}
									{...props}
									disabled
								/>
								{errors.pracaBairro && (
									<FormDescription className="text-destructive">
										{errors.pracaBairro.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="pracaCidade"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Cidade"
									onChange={(e) => {
										onChange(e);
										clearErrors("pracaCidade");
									}}
									{...props}
									disabled
								/>
								{errors.pracaCidade && (
									<FormDescription className="text-destructive">
										{errors.pracaCidade.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosGeraisForm.control}
						name="pracaEstado"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="UF"
									onChange={(e) => {
										onChange(e);
										clearErrors("pracaEstado");
									}}
									{...props}
									disabled
								/>
								{errors.pracaEstado && (
									<FormDescription className="text-destructive">
										{errors.pracaEstado.message}
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
									onChange={(e) => {
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
									onChange={(e) => {
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
						name="fax"
						render={({ field: { onChange, ...props } }) => (
							<FormItem>
								<Input
									placeholder="Fax"
									onChange={(e) => {
										onChange(e);
										clearErrors("fax");
									}}
									{...props}
								/>
								{errors.fax && (
									<FormDescription className="text-destructive">
										{errors.fax.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
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
