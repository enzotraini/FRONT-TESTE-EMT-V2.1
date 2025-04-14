import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";
import "./styles/global.css";
import { enableMSW } from "./api/mocks/index.ts";
import { ThemeProvider } from "./components/theme-provider";

console.log("Iniciando aplicação...");

const queryClient = new QueryClient();

enableMSW().then(() => {
	console.log("MSW habilitado");
	console.log("Iniciando renderização da aplicação...");
	
	const root = document.getElementById("root");
	console.log("Elemento root encontrado:", !!root);
	
	if (!root) {
		console.error("Elemento root não encontrado!");
		return;
	}
	
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={routes} />
				</QueryClientProvider>
			</ThemeProvider>
		</React.StrictMode>,
	);
});
