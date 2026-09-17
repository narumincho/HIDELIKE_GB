import type { Plugin } from "vite";
import { generateAssets } from "./generateAssets.ts";

export const originalAssetPlugin = (): Plugin => {
  return {
    name: "original-asset-plugin",
    async buildStart() {
      await generateAssets();
    },
  };
};
