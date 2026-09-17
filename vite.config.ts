import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { originalAssetPlugin } from "./scripts/originalAssetPlugin.ts";

export default defineConfig({
  plugins: [originalAssetPlugin(), fresh(), tailwindcss()],
});
