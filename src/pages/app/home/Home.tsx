import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, TrendingUp, Activity, Calendar, Package, ShoppingCart, FileText, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const data = [
	{ name: "Jan", vendas: 4000, clientes: 2400, pedidos: 150 },
	{ name: "Fev", vendas: 3000, clientes: 1398, pedidos: 120 },
	{ name: "Mar", vendas: 2000, clientes: 9800, pedidos: 200 },
	{ name: "Abr", vendas: 2780, clientes: 3908, pedidos: 180 },
	{ name: "Mai", vendas: 1890, clientes: 4800, pedidos: 160 },
	{ name: "Jun", vendas: 2390, clientes: 3800, pedidos: 140 },
];

const pedidosPorStatus = [
	{ name: "Concluídos", value: 400 },
	{ name: "Em Andamento", value: 300 },
	{ name: "Pendentes", value: 200 },
	{ name: "Cancelados", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const atividadesRecentes = [
	{
		id: 1,
		titulo: "Novo cliente cadastrado",
		descricao: "Cliente XYZ foi cadastrado no sistema",
		data: "2 minutos atrás",
		tipo: "cliente",
		status: "success"
	},
	{
		id: 2,
		titulo: "Venda realizada",
		descricao: "Venda de R$ 1.500,00 para Cliente ABC",
		data: "15 minutos atrás",
		tipo: "venda",
		status: "success"
	},
	{
		id: 3,
		titulo: "Atualização de cadastro",
		descricao: "Cliente DEF atualizou informações",
		data: "1 hora atrás",
		tipo: "cliente",
		status: "info"
	},
	{
		id: 4,
		titulo: "Pedido cancelado",
		descricao: "Pedido #123 foi cancelado pelo cliente",
		data: "2 horas atrás",
		tipo: "pedido",
		status: "warning"
	},
	{
		id: 5,
		titulo: "Estoque baixo",
		descricao: "Produto ABC está com estoque abaixo do mínimo",
		data: "3 horas atrás",
		tipo: "estoque",
		status: "error"
	}
];

const getStatusColor = (status: string) => {
	switch (status) {
		case "success":
			return "bg-green-500/10 text-green-500";
		case "warning":
			return "bg-yellow-500/10 text-yellow-500";
		case "error":
			return "bg-red-500/10 text-red-500";
		default:
			return "bg-blue-500/10 text-blue-500";
	}
};

const getStatusIcon = (tipo: string) => {
	switch (tipo) {
		case "cliente":
			return <Users className="w-4 h-4" />;
		case "venda":
			return <DollarSign className="w-4 h-4" />;
		case "pedido":
			return <ShoppingCart className="w-4 h-4" />;
		case "estoque":
			return <Package className="w-4 h-4" />;
		default:
			return <Activity className="w-4 h-4" />;
	}
};

export function Home() {
	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="w-5 h-5" />
					<span>Hoje, {new Date().toLocaleDateString("pt-BR")}</span>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="hover:shadow-lg transition-shadow">
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

				<Card className="hover:shadow-lg transition-shadow">
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

				<Card className="hover:shadow-lg transition-shadow">
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

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">23</div>
						<p className="text-xs text-muted-foreground">
							5 precisam de atenção
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4 hover:shadow-lg transition-shadow">
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
									<Line type="monotone" dataKey="vendas" stroke="#8884d8" strokeWidth={2} />
									<Line type="monotone" dataKey="clientes" stroke="#82ca9d" strokeWidth={2} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3 hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle>Atividades Recentes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{atividadesRecentes.map((atividade) => (
								<div key={atividade.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent/50 transition-colors">
									<div className={`p-2 rounded-full ${getStatusColor(atividade.status)}`}>
										{getStatusIcon(atividade.tipo)}
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

			<div className="grid gap-4 md:grid-cols-2">
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle>Pedidos por Status</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={pedidosPorStatus}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{pedidosPorStatus.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle>Pedidos por Mês</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={data}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="pedidos" fill="#8884d8" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
