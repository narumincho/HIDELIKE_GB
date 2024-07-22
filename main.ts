import dist from "./dist.json" with { type: "json" };
import { decodeBase64Url } from "jsr:@std/encoding/base64url";

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
    <script type="module" src="/assets/${dist.scriptHash}"></script>
  </head>
  <body>
    <noscript>
      <p>This app requires JavaScript to run.</p>
    </noscript>
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
        asset.hashValueAsBase64Url === assetMathResult
      );
      if (asset) {
        return new Response(
          decodeBase64Url(asset.contentAsBase64Url),
          {
            headers: {
              "content-type": asset.mimeType,
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
  startHttpServer();
}
