import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";
import { extname, join } from "jsr:@std/url";
import { encodeBase64Url } from "jsr:@std/encoding/base64url";
import { contentType } from "jsr:/@std/media-types";

const getStdoutCode = (
  outputFiles: (typeof buildResult)["outputFiles"],
): string => {
  for (const file of outputFiles) {
    if (file.path === "<stdout>") {
      return file.text;
    }
  }
  throw new Error("<stdout> not found in esbuild outputFiles");
};

const assetsFolder = new URL(import.meta.resolve("./assets"));

const assets = await Promise.all(
  (await Array.fromAsync(Deno.readDir(assetsFolder))).map(
    async (asset) => {
      const path = join(assetsFolder, asset.name);
      const mimeType = contentType(extname(path)) ?? "application/octet-stream";
      const content = await Deno.readFile(path);
      const hashValue = await crypto.subtle.digest("SHA-256", content);
      console.log(asset.name, mimeType);
      return {
        name: asset.name,
        mimeType,
        contentAsBase64Url: encodeBase64Url(content),
        hashValue: asset.name + "_" + encodeBase64Url(hashValue),
      };
    },
  ),
);

await Deno.writeTextFile(
  "./distForClient.json",
  JSON.stringify({
    assetHashValue: Object.fromEntries(
      assets.map((
        { name, hashValue },
      ) => [name, hashValue]),
    ),
  }),
);

const buildResult = await esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  minify: true,
  plugins: denoPlugins(),
});

const script = getStdoutCode(buildResult.outputFiles);

esbuild.stop();

await Deno.writeTextFile(
  "./dist.json",
  JSON.stringify({
    assets: assets.map((
      { mimeType, hashValue, contentAsBase64Url },
    ) => ({
      mimeType,
      hashValue,
      contentAsBase64Url,
    })),
    assetHashValue: Object.fromEntries(
      assets.map((
        { name, hashValue },
      ) => [name, hashValue]),
    ),
    scriptHash: encodeBase64Url(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script)),
    ),
    scriptContent: script,
  }),
);
