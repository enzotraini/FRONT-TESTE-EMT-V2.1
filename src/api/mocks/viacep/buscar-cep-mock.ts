import { http, HttpResponse } from "msw";

interface ViaCEPResponse {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
}

export const buscarCepMock = http.get<never, never, ViaCEPResponse>(
	"https://viacep.com.br/ws/:cep/json/",
	async ({ params }) => {
		const { cep } = params;
		
		console.log("[Mock] Buscando CEP:", cep);
		
		// Simula um delay para parecer mais real
		await new Promise((resolve) => setTimeout(resolve, 500));
		
		// Retorna dados mockados
		return HttpResponse.json({
			cep: cep.toString(),
			logradouro: "Rua Exemplo",
			complemento: "",
			bairro: "Bairro Teste",
			localidade: "São Paulo",
			uf: "SP",
			ibge: "3550308",
			gia: "1004",
			ddd: "11",
			siafi: "7107"
		});
	}
); 