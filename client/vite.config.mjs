import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
// import { config } from "dotenv";

// Load environment variables from .env file
// config();

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src/", import.meta.url)),
        },
    },
	build: {
		outDir: "dist",
	},
});
