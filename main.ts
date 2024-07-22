import dist from "./dist.json" with { type: "json" };
import { decodeBase64Url } from "jsr:@std/encoding/base64url";
import { assetHashValueToToUrl } from "./src/url.ts";

export const startHttpServer = async (
  serveOptions: Deno.ServeOptions,
): Promise<void> => {
  const httpServer = Deno.serve(serveOptions, (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(
        `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HIDELIKE BG WEB</title>
    <script type="module" src="${
          assetHashValueToToUrl(dist.scriptHash)
        }"></script>
    <style>
@font-face {
  font-family: "hide like gb";
  src: url("${
          assetHashValueToToUrl(dist.assetHashValue["font.woff2"])
        }") format("woff2")
}
    </style>
  </head>
  <body>
    <noscript>HIDE LIKE GB WEB requires JavaScript to run.</noscript>
  </body>
</html>
`,
        {
          headers: {
            "content-type": "text/html; charset=UTF-8",
          },
        },
      );
    }
    const assetMathResult = url.pathname.match(/\/assets\/(.+)\/?/u)?.[1];
    console.log(url.pathname, assetMathResult);
    if (assetMathResult) {
      const asset = dist.assets.find((asset) =>
        asset.hashValue === assetMathResult
      );
      if (asset) {
        return new Response(
          decodeBase64Url(asset.contentAsBase64Url),
          {
            headers: {
              "content-type": asset.mimeType,
              "cache-control": "public, max-age=604800, immutable",
            },
          },
        );
      }
      if (assetMathResult === dist.scriptHash) {
        return new Response(
          dist.scriptContent,
          {
            headers: {
              "content-type": "application/javascript; charset=UTF-8",
              "cache-control": "public, max-age=604800, immutable",
            },
          },
        );
      }
    }
    return new Response("not found", { status: 404 });
  });
  await httpServer.finished;
};

if (import.meta.main) {
  startHttpServer({});
}
