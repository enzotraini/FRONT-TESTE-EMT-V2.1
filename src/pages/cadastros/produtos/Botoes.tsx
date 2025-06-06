//import type { FornecedorDaListagem } from "@/api/fornecedor/buscar-fornecedor";
//import { deletarFornecedor } from "@/api/fornecedor/deletar-fornecedor";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Edit, Plus, Printer, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Botoes() {
	const navigate = useNavigate();

	function handleIncluir() {
		navigate("/cadastros/produtos/novo");
	}

	return (
		<header className="flex gap-4 flex-wrap items-center justify-start p-4 bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
			<Button
				onClick={handleIncluir}
				variant="default"
			>
				<Plus /> Incluir
			</Button>
		</header>
	);
}
