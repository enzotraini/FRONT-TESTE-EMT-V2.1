import { Outlet, useLocation } from "react-router-dom";

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
			<div className="h-screen flex-1 flex justify-center items-center">
				{console.log("AuthLayout - Renderizando Outlet para:", location.pathname)}
				<div className="w-full max-w-md">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
