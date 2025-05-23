import { ToggleLightMode } from "@/components/commands/ToggleLightMode";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { ToggleRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function ApplicationCommand() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Digite o que deseja fazer" />
			<CommandList>
				<CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
				<CommandGroup heading="Home">
					<CommandItem asChild>
						<Link to="/">Dashboard</Link>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Cadastros">
					<CommandItem asChild>
						<Link to="/cadastros/produtos">Cadastro de produtos</Link>
					</CommandItem>
					<CommandItem>
						<Link to="/cadastros/clientes">Cadastro de clientes</Link>
					</CommandItem>
					<CommandItem>
						<Link to="/cadastros/clientes">Cadastro de Fornecedores</Link>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Configurações">
					<CommandItem>Perfil</CommandItem>
					<ToggleLightMode />
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
