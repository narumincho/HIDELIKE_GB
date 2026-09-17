import { encodePNG } from "@img/png";
import { generateSoundDataTs } from "./extractMml.ts";
import { generateFontTtfFile } from "./generateFontTtf.ts";
import { generateMapCollisionTs } from "./generateCollision.ts";

/**
 * GRP バイナリから RGBA データを生成
 */
const decodeGrp = (
  grpBinary: Uint8Array,
  width = 512,
  height = 512,
): Uint8Array<ArrayBuffer> => {
  const rgba = new Uint8Array(new ArrayBuffer(width * height * 4));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = y * width + x;
      const pixel0 = grpBinary[offset * 2 + 0]!;
      const pixel1 = grpBinary[offset * 2 + 1]!;
      // R
      rgba[offset * 4 + 0] = ((pixel1 >> 3) & 31) * 8;
      // G
      rgba[offset * 4 + 1] = (((pixel1 & 7) << 2) + (pixel0 >> 6)) * 8;
      // B
      rgba[offset * 4 + 2] = ((pixel0 >> 1) & 31) * 8;
      // A
      rgba[offset * 4 + 3] = (pixel0 & 1) * 255;
    }
  }
  return rgba;
};

/**
 * HIDELIKE_GB.txt の @FONTDATA から font.png 用の RGBA データを生成
 */
const generateFontRgba = async (): Promise<
  { width: number; height: number; rgba: Uint8Array<ArrayBuffer> }
> => {
  const text = await Deno.readTextFile("./original/HIDELIKE_GB.txt");
  const match = text.match(/@FONTDATA'([\s\S]*?)DATA -1/);
  if (!match || !match[1]) {
    throw new Error("@FONTDATA not found in HIDELIKE_GB.txt");
  }

  const fontLines = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("DATA"));

  const fontPatterns: string[] = [];
  for (const line of fontLines) {
    const m = line.match(/DATA\s+&H[0-9A-Fa-f]+\s*,\s*"([0-9A-Fa-f]+)"/);
    if (m && m[1]) {
      fontPatterns.push(m[1]);
    }
  }

  const charCount = fontPatterns.length;
  const width = charCount * 8;
  const height = 8;
  const rgba = new Uint8Array(new ArrayBuffer(width * height * 4));

  for (let c = 0; c < charCount; c++) {
    const pattern = fontPatterns[c]!;
    for (let y = 0; y < 8; y++) {
      const rowByte = Number.parseInt(pattern.slice(y * 2, y * 2 + 2), 16);
      for (let x = 0; x < 8; x++) {
        const isDot = ((rowByte >> (7 - x)) & 1) === 1;
        const offset = (y * width + (c * 8 + x)) * 4;
        rgba[offset + 0] = isDot ? 255 : 0;
        rgba[offset + 1] = isDot ? 255 : 0;
        rgba[offset + 2] = isDot ? 255 : 0;
        rgba[offset + 3] = isDot ? 255 : 0;
      }
    }
  }

  return { width, height, rgba };
};

const copyFileIfExists = async (src: string, dest: string) => {
  try {
    const data = await Deno.readFile(src);
    await Deno.writeFile(dest, data);
  } catch {
    // ignore
  }
};

/**
 * original/ から全アセットを生成し、./cache および ./static に配置
 */
export const generateAssets = async (): Promise<void> => {
  console.log("[generateAssets] Generating assets from original/...");

  await Deno.mkdir("./cache", { recursive: true });
  await Deno.mkdir("./static", { recursive: true });

  // 1. BG.png 生成
  const bgGrp = await Deno.readFile("./original/HIDEL_GBBG.grp");
  const bgRgba = decodeGrp(bgGrp);
  const bgPng = await encodePNG(bgRgba, {
    width: 512,
    height: 512,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  await Deno.writeFile("./cache/BG.png", bgPng);
  await Deno.writeFile("./static/BG.png", bgPng);
  console.log("[generateAssets] BG.png generated.");

  // 2. sprite.png 生成
  const spGrp = await Deno.readFile("./original/HIDEL_GBSP.grp");
  const spRgba = decodeGrp(spGrp);
  const spPng = await encodePNG(spRgba, {
    width: 512,
    height: 512,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  await Deno.writeFile("./cache/sprite.png", spPng);
  await Deno.writeFile("./static/sprite.png", spPng);
  console.log("[generateAssets] sprite.png generated.");

  // 3. font.png 生成
  const fontData = await generateFontRgba();
  const fontPng = await encodePNG(fontData.rgba, {
    width: fontData.width,
    height: fontData.height,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  await Deno.writeFile("./cache/font.png", fontPng);
  await Deno.writeFile("./static/font.png", fontPng);
  console.log("[generateAssets] font.png generated.");

  // 4. マップデータ (HIDEL_GBMAP.dat)
  const mapData = await Deno.readFile("./original/HIDEL_GBMAP.dat");
  await Deno.writeFile("./cache/HIDEL_GBMAP.dat", mapData);
  await Deno.writeFile("./static/HIDEL_GBMAP.dat", mapData);
  console.log("[generateAssets] HIDEL_GBMAP.dat copied.");

  // 5. MMLサウンドデータの生成
  await generateSoundDataTs();
  console.log("[generateAssets] MML soundData.ts generated.");

  // 6. TrueType フォント (font.ttf) の生成
  await generateFontTtfFile();
  console.log("[generateAssets] Font font.ttf generated.");

  // 7. マップ壁当たり判定データの生成
  await generateMapCollisionTs();
  console.log("[generateAssets] Map collision mapCollision.ts generated.");

  // 8. APNG、音声 (MAPCHANGE_R.mp3) のキャッシュと配置
  const cacheOnlyFiles: ReadonlyArray<string> = [
    "title.apng",
    "MAPCHANGE_R.mp3",
  ];
  for (const file of cacheOnlyFiles) {
    try {
      await Deno.stat(`./cache/${file}`);
    } catch {
      await copyFileIfExists(`./assets/${file}`, `./cache/${file}`);
    }
    await copyFileIfExists(`./cache/${file}`, `./static/${file}`);
  }
  console.log("[generateAssets] Cached font and audio assets placed.");

  console.log("[generateAssets] All assets successfully generated and placed.");
};

if (import.meta.main) {
  await generateAssets();
}
