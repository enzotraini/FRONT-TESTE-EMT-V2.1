import { Outlet, useLocation } from "react-router-dom";
import { Logo } from "@/components/ui/logo";

export function AuthLayout() {
	console.log("Renderizando AuthLayout - Início");
	const location = useLocation();
	console.log("AuthLayout - Localização atual:", location.pathname);

	return (
		<div className="flex min-h-screen">
			{/* Lado esquerdo com gradiente sóbrio */}
			<div className="p-6 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex flex-col justify-between items-start w-[60%] h-screen relative overflow-hidden">
				{/* Pattern decorativo mais sutil */}
				<div className="absolute inset-0 opacity-5 dark:opacity-10">
					<div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 rounded-full blur-3xl"></div>
					<div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-800 dark:to-slate-900 rounded-full blur-3xl"></div>
				</div>
				
				<header className="flex flex-col gap-3 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
					<Logo size="lg" />
					<p className="text-slate-600 dark:text-slate-400 text-sm ml-1">Seja bem-vindo ao sistema</p>
				</header>

				<footer className="relative z-10 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
					<p className="text-slate-500 dark:text-slate-500 text-xs">
						Todos os direitos reservados &copy; EMT Informática -{" "}
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
