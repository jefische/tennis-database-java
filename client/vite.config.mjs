import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath, URL } from "node:url";
// import { config } from "dotenv";

// Load environment variables from .env file
// config();

export default defineConfig({
	plugins: [react(), tailwindcss(), visualizer({ open: true, gzipSize: true })],
	server: {
		host: true,
		allowedHosts: [".ngrok-free.dev"],
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src/", import.meta.url)),
		},
	},
	build: {
		outDir: "dist",
	},
});
