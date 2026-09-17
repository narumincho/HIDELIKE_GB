import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import { originalAssetPlugin } from "./scripts/originalAssetPlugin.ts";

export default defineConfig({
  plugins: [originalAssetPlugin(), fresh()],
});
