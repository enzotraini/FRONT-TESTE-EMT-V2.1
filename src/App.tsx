import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";
import "./styles/global.css";
import { enableMSW } from "./api/mocks/index.ts";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";

console.log("Iniciando aplicação...");

const queryClient = new QueryClient();

function App() {
	console.log("Renderizando App...");
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<Toaster richColors closeButton />
				<RouterProvider router={routes} />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
