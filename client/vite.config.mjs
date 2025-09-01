import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import { config } from "dotenv";

// Load environment variables from .env file
// config();

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "dist",
	},
});
