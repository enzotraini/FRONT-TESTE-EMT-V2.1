import { TitleSeparator } from "@/components/TitleSeparator";
import {
	Form,
	FormDescription,
	FormField,
	FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const booleanSelector = ["0", "1"] as const;

const booleanSelectorLabelHash = {
	0: "Não",
	1: "Sim",
};

const vendedorSchema = z.object({
	codigo: z.string().optional(),
	quantidade: z.coerce.number().optional(),
});

export const dadosAdicionaisFormSchema = z.object({
	vendedor1: z.object({
		codigo: z.string().default(""),
		quantidade: z.coerce.number().default(0)
	}),
	vendedor2: z.object({
		codigo: z.string().default(""),
		quantidade: z.coerce.number().default(0)
	}),
	vendedor3: z.object({
		codigo: z.string().default(""),
		quantidade: z.coerce.number().default(0)
	}),
	vendedor4: z.object({
		codigo: z.string().default(""),
		quantidade: z.coerce.number().default(0)
	}),
	vendedor5: z.object({
		codigo: z.string().default(""),
		quantidade: z.coerce.number().default(0)
	}),
	vendedor6: z.object({
		codigo: z.string().default(""),
		quantidade: z.coerce.number().default(0)
	}),
	isentoJPI: z.enum(booleanSelector).default("0"),
	percentualAumentoTeorico: z.string().default("0"),
	percentualPerda: z.string().default("0"),
	contatosAdicionais: z.array(z.object({
		id: z.string().default("-1"),
		contato: z.string().default(""),
		telefone: z.string().default(""),
		ramal: z.string().default(""),
		setor: z.string().default(""),
		email: z.string().default("")
	})).default([]),
	observacoesGerais: z.string().default("")
});

export type DadosAdicionaisForm = z.infer<typeof dadosAdicionaisFormSchema>;

interface FormularioDadosAdicionaisProps {
	dadosAdicionaisForm: UseFormReturn<DadosAdicionaisForm>;
}

export function FormularioDadosAdicionais({
	dadosAdicionaisForm,
}: FormularioDadosAdicionaisProps) {
	const {
		clearErrors,
		formState: { errors },
	} = dadosAdicionaisForm;

	return (
		<Form {...dadosAdicionaisForm}>
			<form className="flex gap-4 flex-col px-6">
				<TitleSeparator title="Cadastro de Cliente" />
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col gap-6 w-full">
						<Label>Vendedor 1</Label>
						<div className="flex gap-2 w-full justify-between">
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor1.codigo"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											onChange={(e) => {
												clearErrors("vendedor1.codigo");
												onChange(e);
											}}
											placeholder="Código"
											{...props}
										/>
										{errors.vendedor1?.codigo && (
											<FormDescription className="text-destructive">
												{errors.vendedor1.codigo.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor1.quantidade"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											type="number"
											onChange={(e) => {
												clearErrors("vendedor1.quantidade");
												onChange(e);
											}}
											placeholder="Quantidade"
											{...props}
										/>
										{errors.vendedor1?.quantidade && (
											<FormDescription className="text-destructive">
												{errors.vendedor1.quantidade.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-6 w-full">
						<Label>Vendedor 2</Label>
						<div className="flex gap-2 w-full justify-between">
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor2.codigo"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											onChange={(e) => {
												clearErrors("vendedor2.codigo");
												onChange(e);
											}}
											placeholder="Código"
											{...props}
										/>
										{errors.vendedor2?.codigo && (
											<FormDescription className="text-destructive">
												{errors.vendedor2.codigo.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor2.quantidade"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											type="number"
											onChange={(e) => {
												clearErrors("vendedor2.quantidade");
												onChange(e);
											}}
											placeholder="Quantidade"
											{...props}
										/>
										{errors.vendedor2?.quantidade && (
											<FormDescription className="text-destructive">
												{errors.vendedor2.quantidade.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-6 w-full">
						<Label>Vendedor 3</Label>
						<div className="flex gap-2 w-full justify-between">
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor3.codigo"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											onChange={(e) => {
												clearErrors("vendedor3.codigo");
												onChange(e);
											}}
											placeholder="Código"
											{...props}
										/>
										{errors.vendedor3?.codigo && (
											<FormDescription className="text-destructive">
												{errors.vendedor3.codigo.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor3.quantidade"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											type="number"
											onChange={(e) => {
												clearErrors("vendedor3.quantidade");
												onChange(e);
											}}
											placeholder="Quantidade"
											{...props}
										/>
										{errors.vendedor3?.quantidade && (
											<FormDescription className="text-destructive">
												{errors.vendedor3.quantidade.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-6 w-full">
						<Label>Vendedor 4</Label>
						<div className="flex gap-2 w-full justify-between">
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor4.codigo"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											onChange={(e) => {
												clearErrors("vendedor4.codigo");
												onChange(e);
											}}
											placeholder="Código"
											{...props}
										/>
										{errors.vendedor4?.codigo && (
											<FormDescription className="text-destructive">
												{errors.vendedor4.codigo.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor4.quantidade"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											type="number"
											onChange={(e) => {
												clearErrors("vendedor4.quantidade");
												onChange(e);
											}}
											placeholder="Quantidade"
											{...props}
										/>
										{errors.vendedor4?.quantidade && (
											<FormDescription className="text-destructive">
												{errors.vendedor4.quantidade.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-6 w-full">
						<Label>Vendedor 5</Label>
						<div className="flex gap-2 w-full justify-between">
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor5.codigo"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											onChange={(e) => {
												clearErrors("vendedor5.codigo");
												onChange(e);
											}}
											placeholder="Código"
											{...props}
										/>
										{errors.vendedor5?.codigo && (
											<FormDescription className="text-destructive">
												{errors.vendedor5.codigo.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor5.quantidade"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											type="number"
											onChange={(e) => {
												clearErrors("vendedor5.quantidade");
												onChange(e);
											}}
											placeholder="Quantidade"
											{...props}
										/>
										{errors.vendedor5?.quantidade && (
											<FormDescription className="text-destructive">
												{errors.vendedor5.quantidade.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-6 w-full">
						<Label>Vendedor 6</Label>
						<div className="flex gap-2 w-full justify-between">
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor6.codigo"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											onChange={(e) => {
												clearErrors("vendedor6.codigo");
												onChange(e);
											}}
											placeholder="Código"
											{...props}
										/>
										{errors.vendedor6?.codigo && (
											<FormDescription className="text-destructive">
												{errors.vendedor6.codigo.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={dadosAdicionaisForm.control}
								name="vendedor6.quantidade"
								render={({ field: { onChange, ...props } }) => (
									<FormItem>
										<Input
											type="number"
											onChange={(e) => {
												clearErrors("vendedor6.quantidade");
												onChange(e);
											}}
											placeholder="Quantidade"
											{...props}
										/>
										{errors.vendedor6?.quantidade && (
											<FormDescription className="text-destructive">
												{errors.vendedor6.quantidade.message}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>
				<div className="flex w-full justify-center items-center gap-4">
					<FormField
						control={dadosAdicionaisForm.control}
						name="isentoJPI"
						render={({ field: { onChange, ...props } }) => (
							<FormItem className="w-full flex gap-4 items-center">
								<Label className="text-nowrap">Isento JPI</Label>
								<Select
									onValueChange={(e) => {
										clearErrors("isentoJPI");
										onChange(e);
									}}
									value={props.value}
								>
									<SelectTrigger>
										<SelectValue placeholder="Isento JPI" />
									</SelectTrigger>
									<SelectContent>
										{booleanSelector.map((selector) => (
											<SelectItem key={selector} value={selector}>
												{booleanSelectorLabelHash[selector]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.isentoJPI && (
									<FormDescription className="text-destructive">
										{errors.isentoJPI.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosAdicionaisForm.control}
						name="percentualAumentoTeorico"
						render={({ field: { onChange, ...props } }) => (
							<FormItem className="w-full flex gap-4 items-center">
								<Label className="text-nowrap">% Aum. teórico</Label>
								<Input
									onChange={(e) => {
										clearErrors("percentualAumentoTeorico");
										onChange(e);
									}}
									placeholder="0.000"
									{...props}
								/>
								{errors.percentualAumentoTeorico && (
									<FormDescription className="text-destructive">
										{errors.percentualAumentoTeorico.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={dadosAdicionaisForm.control}
						name="percentualPerda"
						render={({ field: { onChange, ...props } }) => (
							<FormItem className="w-full flex gap-4 items-center">
								<Label className="text-nowrap">% Perda</Label>
								<Input
									className="w-full"
									onChange={(e) => {
										clearErrors("percentualPerda");
										onChange(e);
									}}
									placeholder="0.000"
									{...props}
								/>
								{errors.percentualPerda && (
									<FormDescription className="text-destructive">
										{errors.percentualPerda.message}
									</FormDescription>
								)}
							</FormItem>
						)}
					/>
				</div>
				<TitleSeparator title="Cadastro de Cliente" />
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Contato</TableHead>
							<TableHead>Telefone</TableHead>
							<TableHead>Ramal</TableHead>
							<TableHead>Setor</TableHead>
							<TableHead>Email</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{dadosAdicionaisForm
							.getValues("contatosAdicionais")
							?.map((valor, index) => (
								<TableRow key={valor.contato}>
									<TableCell>teste</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</form>
		</Form>
	);
}
