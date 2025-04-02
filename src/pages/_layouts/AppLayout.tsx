import { Outlet } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { ApplicationCommand } from "@/components/ApplicationCommand";

export function AppLayout() {
	console.log("[AppLayout] Iniciando renderização do AppLayout...");
	
	try {
		const [isSidebarOpen, setIsSidebarOpen] = useState(true);
		
		useEffect(() => {
			console.log("[AppLayout] Componente montado");
			return () => {
				console.log("[AppLayout] Componente desmontado");
			};
		}, []);

		const handleSidebarChange = (e: boolean) => {
			console.log("[AppLayout] Estado do sidebar alterado:", e);
			setIsSidebarOpen(e);
		};
		
		return (
			<SidebarProvider
				onOpenChange={handleSidebarChange}
				open={isSidebarOpen}
			>
				<AppSidebar />
				<main
					className={`flex flex-col ${isSidebarOpen ? "w-[calc(100%-var(--sidebar-width))]" : "w-full"} min-h-screen`}
				>
					<header className="bg-gray-50 border-b border-b-gray-200 dark:bg-gray-950 border-b dark:border-b-gray-800">
						<SidebarTrigger />
					</header>
					<div className="flex-1">
						<Outlet />
					</div>
					<ApplicationCommand />
				</main>
			</SidebarProvider>
		);
	} catch (error) {
		console.error("[AppLayout] Erro ao renderizar:", error);
		throw error;
	}
}
