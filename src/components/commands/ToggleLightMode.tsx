import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

export function ToggleLightMode() {
	const { setTheme } = useTheme();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "m" && e.ctrlKey) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<CommandItem onSelect={() => setOpen((state) => !state)}>
					Alterar entre modo claro e escuro
					<CommandShortcut>Ctrl + J</CommandShortcut>
				</CommandItem>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Procure pelo modo" />
					<CommandList>
						<CommandEmpty>Nenhum modo encontrado.</CommandEmpty>
						<CommandGroup>
							<CommandItem onSelect={() => setTheme("light")}>
								<span>Claro</span>
							</CommandItem>
							<CommandItem onSelect={() => setTheme("dark")}>
								<span>Escuro</span>
							</CommandItem>
							<CommandItem onSelect={() => setTheme("system")}>
								<span>Sistema</span>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
