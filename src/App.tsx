import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { AppLayout } from "./pages/_layouts/AppLayout";
import { isAuthenticated } from "./routes";

const queryClient = new QueryClient();

export default function App() {
	const location = useLocation();
	const isAuth = isAuthenticated();
	const isPublicRoute = location.pathname.startsWith('/entrada-mercadoria') || 
		location.pathname.startsWith('/pedidos/compras');

	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<Toaster richColors closeButton />
				{isAuth || isPublicRoute ? (
					<AppLayout>
						<Outlet />
					</AppLayout>
				) : (
					<Outlet />
				)}
			</QueryClientProvider>
		</ThemeProvider>
	);
}
