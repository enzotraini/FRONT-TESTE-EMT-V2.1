import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/routes";

export function NotFound() {
	const navigate = useNavigate();

	const handleGoBack = () => {
		if (isAuthenticated()) {
			navigate("/app/dashboard", { replace: true });
		} else {
			navigate("/", { replace: true });
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
			<p className="text-muted-foreground mb-8">
				A página que você está procurando não existe ou foi movida.
			</p>
			<Button onClick={handleGoBack}>
				Voltar para a página inicial
			</Button>
		</div>
	);
} 