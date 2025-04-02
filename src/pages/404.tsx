import { Link } from "react-router-dom";

export function NotFound() {
	return (
		<section className="flex flex-col items-center justify-center w-full h-screen">
			<h2 className="font-bold text-2xl">Página não encontrada</h2>
			<p className="text-muted-foreground text-m">
				A página que você solicitou não foi encontrada ou está em
				desenvolvimento!{" "}
				<Link
					className="text-blue-700 dark:text-blue-400 hover:opacity-85 hover:underline"
					to="/"
				>
					Voltar a página inicial
				</Link>
			</p>
		</section>
	);
}
