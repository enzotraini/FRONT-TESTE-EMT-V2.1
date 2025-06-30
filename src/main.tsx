import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { routes } from './routes'
import './styles/global.css'
import { Toaster } from 'sonner'    // ② portal de toasts

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={routes} />

				{/* ③ único Toaster, fora do Router para todas as rotas */}
				<Toaster richColors closeButton position="top-center" />
			</QueryClientProvider>
		</ThemeProvider>
	</React.StrictMode>,
)
