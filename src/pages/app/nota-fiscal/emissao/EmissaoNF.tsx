import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
	Calendar, 
	Clock, 
	FileText, 
	Users, 
	User, 
	Plus, 
	Save, 
	Trash, 
	Calculator,
	Package,
	DollarSign,
	Search,
	Printer,
	Send
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const formSchema = z.object({
	serie: z.string().min(1, "Série é obrigatória"),
	cliente: z.string().min(1, "Cliente é obrigatório"),
	tipoNota: z.string().min(1, "Tipo da nota é obrigatório"),
	codFiscal: z.string().min(1, "Código fiscal é obrigatório"),
	observacoes: z.string().optional(),
});

interface ItemNota {
	id: string;
	produto: string;
	descricao: string;
	quantidade: number;
	unidade: string;
	valorUnitario: number;
	valorTotal: number;
	codFiscal: string;
}

export function EmissaoNF() {
	const [itens, setItens] = useState<ItemNota[]>([]);
	const [editandoItem, setEditandoItem] = useState<ItemNota | null>(null);
	const [novoItem, setNovoItem] = useState({
		produto: "",
		descricao: "",
		quantidade: 0,
		unidade: "UN",
		valorUnitario: 0,
		codFiscal: "5.102"
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			serie: "1",
			cliente: "",
			tipoNota: "consumidor",
			codFiscal: "5.102",
			observacoes: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("Emitindo nota fiscal:", values, "Itens:", itens);
		// Aqui seria a integração com a API
	};

	const adicionarItem = () => {
		if (!novoItem.produto || novoItem.quantidade <= 0 || novoItem.valorUnitario <= 0) {
			return;
		}

		const item: ItemNota = {
			id: Math.random().toString(36).substr(2, 9),
			produto: novoItem.produto,
			descricao: novoItem.descricao,
			quantidade: novoItem.quantidade,
			unidade: novoItem.unidade,
			valorUnitario: novoItem.valorUnitario,
			valorTotal: novoItem.quantidade * novoItem.valorUnitario,
			codFiscal: novoItem.codFiscal
		};

		setItens([...itens, item]);
		setNovoItem({
			produto: "",
			descricao: "",
			quantidade: 0,
			unidade: "UN",
			valorUnitario: 0,
			codFiscal: "5.102"
		});
	};

	const removerItem = (id: string) => {
		setItens(itens.filter(item => item.id !== id));
	};



	const totalNota = itens.reduce((acc, item) => acc + item.valorTotal, 0);

	return (
		<section className="flex flex-col w-full max-h-screen">
			{/* Botões de Ação */}
			<header className="flex gap-3 items-center justify-between p-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
				<div className="flex gap-3">
					<Button 
						variant="default" 
						onClick={form.handleSubmit(handleSubmit)}
						disabled={itens.length === 0}
					>
						<Save className="h-4 w-4 mr-2" />
						Salvar NF
					</Button>
					<Button 
						variant="green"
						disabled={itens.length === 0}
					>
						<Send className="h-4 w-4 mr-2" />
						Emitir NFe
					</Button>
					<Button variant="ghost">
						<Printer className="h-4 w-4 mr-2" />
						Pré-visualizar
					</Button>
					<Button variant="outline">
						<Calculator className="h-4 w-4 mr-2" />
						Calcular
					</Button>
				</div>

				<div className="flex items-center gap-3">
					<Badge variant="outline" className="bg-green-50 text-green-700">
						{itens.length} itens
					</Badge>
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						Total: {formatarMoeda(totalNota)}
					</Badge>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Formulário Principal */}
				<div className="w-1/3 flex flex-col bg-white border-r border-gray-200 p-6">
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Nova Nota Fiscal</h2>
						<p className="text-gray-600">Preencha os dados para emitir uma nova NF</p>
					</div>

					<Form {...form}>
						<form className="space-y-4 flex-1">
							{/* Dados da Nota */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-base">Dados da Nota</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-3">
										<FormField
											control={form.control}
											name="serie"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Série</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div>
											<label className="text-sm font-medium">Número</label>
											<Input value="Automático" disabled className="bg-gray-50" />
										</div>
									</div>

									<FormField
										control={form.control}
										name="tipoNota"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tipo da Nota</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Selecione o tipo" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="consumidor">Consumidor Final</SelectItem>
														<SelectItem value="revenda">Revenda</SelectItem>
														<SelectItem value="industrializacao">Industrialização</SelectItem>
														<SelectItem value="devolucao">Devolução</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="codFiscal"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Código Fiscal Padrão</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="5.102">5.102 - Venda de mercadoria adquirida</SelectItem>
														<SelectItem value="5.101">5.101 - Venda de produção do estabelecimento</SelectItem>
														<SelectItem value="6.102">6.102 - Venda de mercadoria adquirida (fora do estado)</SelectItem>
														<SelectItem value="6.101">6.101 - Venda de produção (fora do estado)</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Cliente */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-base flex items-center gap-2">
										<Users className="h-4 w-4" />
										Cliente
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="cliente"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Selecionar Cliente</FormLabel>
												<div className="flex gap-2">
													<FormControl>
														<Input 
															{...field} 
															placeholder="Digite para buscar cliente..."
														/>
													</FormControl>
													<Button type="button" variant="outline" size="icon">
														<Search className="h-4 w-4" />
													</Button>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									{form.watch("cliente") && (
										<div className="p-3 bg-gray-50 rounded-lg text-sm">
											<p className="font-medium">Cliente selecionado:</p>
											<p className="text-gray-600">{form.watch("cliente")}</p>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Observações */}
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-base">Observações</CardTitle>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="observacoes"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Observações da nota fiscal..."
														className="min-h-20 resize-none"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</form>
					</Form>
				</div>

				{/* Itens da Nota */}
				<div className="w-2/3 flex flex-col bg-white">
					{/* Adicionar Item */}
					<div className="p-4 border-b border-gray-200">
						<div className="flex items-center gap-2 mb-4">
							<Package className="h-5 w-5" />
							<h3 className="text-lg font-medium">Itens da Nota Fiscal</h3>
						</div>

						<div className="grid grid-cols-6 gap-2 items-end">
							<div>
								<label className="text-xs font-medium text-gray-500">Produto</label>
								<Input
									placeholder="Código/Nome"
									value={novoItem.produto}
									onChange={(e) => setNovoItem({...novoItem, produto: e.target.value})}
								/>
							</div>
							<div>
								<label className="text-xs font-medium text-gray-500">Descrição</label>
								<Input
									placeholder="Descrição"
									value={novoItem.descricao}
									onChange={(e) => setNovoItem({...novoItem, descricao: e.target.value})}
								/>
							</div>
							<div>
								<label className="text-xs font-medium text-gray-500">Qtd</label>
								<Input
									type="number"
									value={novoItem.quantidade || ""}
									onChange={(e) => setNovoItem({...novoItem, quantidade: Number(e.target.value)})}
								/>
							</div>
							<div>
								<label className="text-xs font-medium text-gray-500">Unidade</label>
								<Select value={novoItem.unidade} onValueChange={(value) => setNovoItem({...novoItem, unidade: value})}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="UN">UN</SelectItem>
										<SelectItem value="KG">KG</SelectItem>
										<SelectItem value="MT">MT</SelectItem>
										<SelectItem value="PC">PC</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-xs font-medium text-gray-500">Valor Unit.</label>
								<Input
									type="number"
									step="0.01"
									value={novoItem.valorUnitario || ""}
									onChange={(e) => setNovoItem({...novoItem, valorUnitario: Number(e.target.value)})}
								/>
							</div>
							<Button onClick={adicionarItem} size="sm">
								<Plus className="h-4 w-4 mr-1" />
								Adicionar
							</Button>
						</div>
					</div>

					{/* Lista de Itens */}
					<div className="flex-1 overflow-auto">
						{itens.length === 0 ? (
							<div className="flex-1 flex items-center justify-center text-gray-500 py-12">
								<div className="text-center">
									<Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
									<p className="text-lg font-medium mb-2">Nenhum item adicionado</p>
									<p className="text-sm text-gray-400">Adicione itens para criar a nota fiscal</p>
								</div>
							</div>
						) : (
							<Table>
								<TableHeader className="sticky top-0 bg-white border-b border-gray-200">
									<TableRow>
										<TableHead className="w-32">Produto</TableHead>
										<TableHead className="w-80">Descrição</TableHead>
										<TableHead className="w-24">Qtd</TableHead>
										<TableHead className="w-24">Unid.</TableHead>
										<TableHead className="w-32">Valor Unit.</TableHead>
										<TableHead className="w-32">Valor Total</TableHead>
										<TableHead className="w-20">Ações</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{itens.map((item) => (
										<TableRow key={item.id} className="hover:bg-gray-50">
											<TableCell className="font-medium">{item.produto}</TableCell>
											<TableCell>{item.descricao}</TableCell>
											<TableCell>{item.quantidade}</TableCell>
											<TableCell>{item.unidade}</TableCell>
											<TableCell>{formatarMoeda(item.valorUnitario)}</TableCell>
											<TableCell className="font-medium">{formatarMoeda(item.valorTotal)}</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removerItem(item.id)}
													className="text-red-600 hover:text-red-700"
												>
													<Trash className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>

					{/* Resumo */}
					{itens.length > 0 && (
						<div className="p-4 border-t border-gray-200 bg-gray-50">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-4">
									<div className="text-sm">
										<span className="text-gray-500">Total de Itens:</span>
										<span className="font-medium ml-2">{itens.length}</span>
									</div>
									<div className="text-sm">
										<span className="text-gray-500">Quantidade Total:</span>
										<span className="font-medium ml-2">{itens.reduce((acc, item) => acc + item.quantidade, 0)}</span>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm text-gray-500">Total da Nota</p>
									<p className="text-2xl font-bold text-green-600">{formatarMoeda(totalNota)}</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
} 