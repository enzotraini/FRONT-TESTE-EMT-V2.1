import { Outlet, useLocation } from "react-router-dom";
import { Logo } from "@/components/ui/logo";

export function AuthLayout() {
	console.log("Renderizando AuthLayout - Início");
	const location = useLocation();
	console.log("AuthLayout - Localização atual:", location.pathname);

	return (
		<div className="flex">
			<div className="p-6 bg-muted flex flex-col justify-between items-start w-[60%] h-screen">
				<header className="flex gap-2 flex-col">
					<h1 className="text-xl text-accent-foreground text-b font-bold">
						EMT Consultoria
					</h1>
					<p className="text-muted-foreground">Seja bem-vindo</p>
				</header>

				<footer>
					<p className="text-muted-foreground">
						Todos os direitos reservados &copy; EMT Consultoria -{" "}
						{new Date().getFullYear()}
					</p>
				</footer>
			</div>
			
			{/* Lado direito com gradiente suave */}
			<div className="h-screen flex-1 flex justify-center items-center bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-800 relative">
				{/* Background pattern mais discreto */}
				<div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 opacity-10"></div>
				
				<div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
