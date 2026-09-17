import { encodePNG } from "@img/png";
import { generateSoundDataTs } from "./extractMml.ts";
import { generateFontFiles } from "./generateFont.ts";
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
 * PNG バイナリから ICO バイナリを生成 (PNG-compressed ICO)
 */
const createIcoFromPng = (
  pngData: Uint8Array,
  width: number,
  height: number,
): Uint8Array => {
  const icoHeaderSize = 6;
  const directoryEntrySize = 16;
  const totalSize = icoHeaderSize + directoryEntrySize + pngData.length;
  const ico = new Uint8Array(totalSize);
  const view = new DataView(ico.buffer);

  // ICONDIR Header
  view.setUint16(0, 0, true); // Reserved (0)
  view.setUint16(2, 1, true); // Image type (1 = ICO)
  view.setUint16(4, 1, true); // Image count (1)

  // ICONDIRENTRY
  ico[6] = width >= 256 ? 0 : width;
  ico[7] = height >= 256 ? 0 : height;
  ico[8] = 0; // Palette count
  ico[9] = 0; // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, pngData.length, true); // Image data size
  view.setUint32(18, icoHeaderSize + directoryEntrySize, true); // Offset of image data

  // PNG data
  ico.set(pngData, icoHeaderSize + directoryEntrySize);

  return ico;
};

/**
 * RGBA データをニアレストネイバーでスケール拡大
 */
const scaleRgbaNearest = (
  srcRgba: Uint8Array,
  srcW: number,
  srcH: number,
  scale: number,
): Uint8Array<ArrayBuffer> => {
  const dstW = srcW * scale;
  const dstH = srcH * scale;
  const dstRgba = new Uint8Array(new ArrayBuffer(dstW * dstH * 4));
  for (let y = 0; y < dstH; y++) {
    const srcY = Math.floor(y / scale);
    for (let x = 0; x < dstW; x++) {
      const srcX = Math.floor(x / scale);
      const srcOffset = (srcY * srcW + srcX) * 4;
      const dstOffset = (y * dstW + x) * 4;
      dstRgba[dstOffset + 0] = srcRgba[srcOffset + 0]!;
      dstRgba[dstOffset + 1] = srcRgba[srcOffset + 1]!;
      dstRgba[dstOffset + 2] = srcRgba[srcOffset + 2]!;
      dstRgba[dstOffset + 3] = srcRgba[srcOffset + 3]!;
    }
  }
  return dstRgba;
};

/**
 * タイトル画面の女の子の顔部分 (SPDEF 81: U=272, V=256, W=32, H=32) からブラウザアイコンを生成
 */
const generateFavicons = async (spRgba: Uint8Array): Promise<void> => {
  const cropX = 272;
  const cropY = 256;
  const cropW = 32;
  const cropH = 32;

  const faceRgba = new Uint8Array(new ArrayBuffer(cropW * cropH * 4));
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcOffset = ((cropY + y) * 512 + (cropX + x)) * 4;
      const dstOffset = (y * cropW + x) * 4;
      faceRgba[dstOffset + 0] = spRgba[srcOffset + 0]!;
      faceRgba[dstOffset + 1] = spRgba[srcOffset + 1]!;
      faceRgba[dstOffset + 2] = spRgba[srcOffset + 2]!;
      faceRgba[dstOffset + 3] = spRgba[srcOffset + 3]!;
    }
  }
  // 3. 128x128 apple-touch-icon.png 用にスケール拡大 (faceRgba が encodePNG で消費される前に作成)
  const face128Rgba = scaleRgbaNearest(faceRgba, cropW, cropH, 4);

  // 1. 32x32 favicon.png
  const png32 = await encodePNG(faceRgba, {
    width: cropW,
    height: cropH,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  await Deno.writeFile("./cache/favicon.png", png32);
  await Deno.writeFile("./static/favicon.png", png32);

  // 2. favicon.ico (32x32)
  const icoData = createIcoFromPng(png32, cropW, cropH);
  await Deno.writeFile("./cache/favicon.ico", icoData);
  await Deno.writeFile("./static/favicon.ico", icoData);

  // 3. 128x128 apple-touch-icon.png
  const png128 = await encodePNG(face128Rgba, {
    width: cropW * 4,
    height: cropH * 4,
    compression: 0,
    filter: 0,
    interlace: 0,
  });
  await Deno.writeFile("./cache/apple-touch-icon.png", png128);
  await Deno.writeFile("./static/apple-touch-icon.png", png128);

  console.log(
    "[generateAssets] Favicons (favicon.ico, favicon.png, apple-touch-icon.png) generated.",
  );
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

  // 2b. タイトル画面の顔部分からファビコン (favicon.ico, favicon.png, apple-touch-icon.png) 生成
  // 注意: encodePNG は渡された ArrayBuffer を detach (消費) するため、spPng の encode より前に顔領域を切り出す
  await generateFavicons(spRgba);

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

  // 6. Web フォント (font.woff / font.ttf) の生成
  await generateFontFiles();
  console.log("[generateAssets] Web fonts (font.woff / font.ttf) generated.");

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
