import type { ClienteDaListagem } from "@/api/clientes/buscar-clientes";
import { deletarCliente } from "@/api/clientes/deletar-cliente";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Edit, Plus, Printer, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BotoesProps {
	clientesSelecionados: string[];
}

export function Botoes({ clientesSelecionados }: BotoesProps) {
	const navigate = useNavigate();

	function handleIncluir() {
		navigate("/cadastros/clientes/incluir");
	}

	function handleAlterar() {
		navigate(`editar/${clientesSelecionados[0]}`);
	}

	const { mutateAsync: deletarClienteFn } = useMutation({
		mutationFn: deletarCliente,
	});

	function handleExcluir() {
		Promise.all(
			clientesSelecionados.map((clienteId) => deletarClienteFn({ clienteId })),
		).then(() => {
			window.location.reload();
		});
	}

	return (
		<header className="flex gap-4 flex-wrap items-center justify-start p-4 bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
			<Button
				onClick={handleIncluir}
				variant="default"
				disabled={clientesSelecionados.length !== 0}
			>
				<Plus /> Incluir
			</Button>
			<Button
				variant="green"
				onClick={handleAlterar}
				disabled={clientesSelecionados.length !== 1}
			>
				<Edit /> Alterar
			</Button>
			<Button variant="ghost">
				<Search /> Consultar
			</Button>
			<Button variant="ghost">
				<Printer /> Imprimir Fichar
			</Button>
			<Button variant="ghost">Obs. Gerais</Button>
			<Button variant="ghost">Aniversário</Button>
			<Button variant="ghost">Obs. Financeira</Button>
			<Button variant="destructive" onClick={handleExcluir}>
				<Trash /> Excluir seleção
			</Button>
		</header>
	);
}
