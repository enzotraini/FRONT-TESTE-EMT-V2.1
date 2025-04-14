import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);

	useEffect(() => {
		console.log("[ThemeProvider] Aplicando tema:", theme);
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			
			console.log("[ThemeProvider] Tema do sistema detectado:", systemTheme);
			root.classList.add(systemTheme);
			return;
		}

		console.log("[ThemeProvider] Adicionando classe:", theme);
		root.classList.add(theme);
		
		// Forçar uma re-renderização para garantir que as classes CSS sejam aplicadas
		document.body.style.display = 'none';
		document.body.offsetHeight; // Força um reflow
		document.body.style.display = '';
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			console.log("[ThemeProvider] Definindo tema:", theme);
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
