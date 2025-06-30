import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				// Ignora avisos de TypeScript durante o build
				if (warning.code === 'UNRESOLVED_IMPORT') return;
				warn(warning);
			}
		}
	},
	server: {
		port: 5173,
		host: true,
		proxy: {
			"/api": {
				target: "http://127.0.0.1:3333",
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
