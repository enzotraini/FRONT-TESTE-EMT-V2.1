import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, TrendingUp, Activity, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
	{ name: "Jan", vendas: 4000, clientes: 2400 },
	{ name: "Fev", vendas: 3000, clientes: 1398 },
	{ name: "Mar", vendas: 2000, clientes: 9800 },
	{ name: "Abr", vendas: 2780, clientes: 3908 },
	{ name: "Mai", vendas: 1890, clientes: 4800 },
	{ name: "Jun", vendas: 2390, clientes: 3800 },
];

const atividadesRecentes = [
	{
		id: 1,
		titulo: "Novo cliente cadastrado",
		descricao: "Cliente XYZ foi cadastrado no sistema",
		data: "2 minutos atrás",
	},
	{
		id: 2,
		titulo: "Venda realizada",
		descricao: "Venda de R$ 1.500,00 para Cliente ABC",
		data: "15 minutos atrás",
	},
	{
		id: 3,
		titulo: "Atualização de cadastro",
		descricao: "Cliente DEF atualizou informações",
		data: "1 hora atrás",
	},
];

export function Home() {
	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<div className="flex items-center gap-2">
					<Calendar className="w-5 h-5" />
					<span>Hoje, {new Date().toLocaleDateString("pt-BR")}</span>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">R$ 45.231,89</div>
						<p className="text-xs text-muted-foreground">
							+20.1% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+573</div>
						<p className="text-xs text-muted-foreground">
							+201 novos este mês
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">R$ 789,00</div>
						<p className="text-xs text-muted-foreground">
							+12% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">24.57%</div>
						<p className="text-xs text-muted-foreground">
							+4.3% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Vendas e Clientes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={data}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Line type="monotone" dataKey="vendas" stroke="#8884d8" />
									<Line type="monotone" dataKey="clientes" stroke="#82ca9d" />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Atividades Recentes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{atividadesRecentes.map((atividade) => (
								<div key={atividade.id} className="flex items-center gap-4">
									<div className="p-2 bg-primary/10 rounded-full">
										<Activity className="w-4 h-4 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium">{atividade.titulo}</p>
										<p className="text-sm text-muted-foreground">{atividade.descricao}</p>
									</div>
									<span className="text-xs text-muted-foreground">{atividade.data}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
