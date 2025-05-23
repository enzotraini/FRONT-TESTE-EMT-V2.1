import type { FornecedorDaListagem } from "@/api/fornecedor/buscar-fornecedor";
import { deletarFornecedor } from "@/api/fornecedor/deletar-fornecedor";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Edit, Plus, Printer, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BotoesProps {
	fornecedoresSelecionados: string[];
}

export function Botoes({ fornecedoresSelecionados }: BotoesProps) {
	const navigate = useNavigate();

	function handleIncluir() {
		navigate("/cadastros/fornecedores/novo");
	}

	function handleAlterar() {
		navigate(`editar/${fornecedoresSelecionados[0]}`);
	}

	const { mutateAsync: deletarFornecedorFn } = useMutation({
		mutationFn: deletarFornecedor,
	});

	function handleExcluir() {
		Promise.all(
			fornecedoresSelecionados.map((fornecedorId) =>
				deletarFornecedorFn({ fornecedorId }),
			),
		).then(() => {
			window.location.reload();
		});
	}

	return (
		<header className="flex gap-4 flex-wrap items-center justify-start p-4 bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
			<Button
				onClick={handleIncluir}
				variant="default"
				disabled={fornecedoresSelecionados.length !== 0}
			>
				<Plus /> Incluir
			</Button>
			{/* <Button
				variant="green"
				onClick={handleAlterar}
				disabled={fornecedoresSelecionados.length !== 1}
			>
				<Edit /> Alterar
			</Button> */}
			{/* <Button variant="ghost">
				<Search /> Consultar
			</Button> */}
			{/* <Button variant="ghost">
				<Printer /> Imprimir Ficha
			</Button> */}
			{/* <Button variant="destructive" onClick={handleExcluir}>
				<Trash /> Excluir seleção
			</Button> */}
		</header>
	);
}
