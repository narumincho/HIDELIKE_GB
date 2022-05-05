import { FontAssetType, OtherAssetType, generateFonts } from "fantasticon";

const fontTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz[]-■!🕒():@? ";

generateFonts({
  inputDir: "./font-svg",
  outputDir: "./font-output",
  name: "hide like gb",
  fontTypes: [FontAssetType.TTF, FontAssetType.WOFF, FontAssetType.WOFF2],
  assetTypes: [
    OtherAssetType.TS,
    OtherAssetType.CSS,
    OtherAssetType.JSON,
    OtherAssetType.HTML,
  ],
  codepoints: Object.fromEntries(
    [...fontTable].map((c) => [
      c.codePointAt(0)?.toString(16) ?? "unknown",
      c.codePointAt(0) ?? 0,
    ])
  ),
});
