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
 * タイトル画面の女の子の顔部分 (SPDEF 81: U=272, V=256, W=32, H=32) からブラウザアイコン (PNG) を生成
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
  // 128x128 apple-touch-icon.png 用にスケール拡大 (faceRgba が encodePNG で消費される前に作成)
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

  // 2. 128x128 apple-touch-icon.png
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
    "[generateAssets] Favicon PNGs (favicon.png, apple-touch-icon.png) generated.",
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

// CRC32 テーブルと計算
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

const crc32 = (typeStr: string, data: Uint8Array): number => {
  let crc = 0xffffffff;
  for (let i = 0; i < 4; i++) {
    crc = crcTable[(crc ^ typeStr.charCodeAt(i)) & 0xff]! ^ (crc >>> 8);
  }
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]!) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const makePngChunk = (type: string, data: Uint8Array): Uint8Array => {
  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) {
    chunk[4 + i] = type.charCodeAt(i);
  }
  chunk.set(data, 8);
  view.setUint32(8 + data.length, crc32(type, data));
  return chunk;
};

const parsePngChunks = (
  pngBytes: Uint8Array,
): Array<{ type: string; data: Uint8Array }> => {
  let offset = 8;
  const chunks: Array<{ type: string; data: Uint8Array }> = [];
  const view = new DataView(
    pngBytes.buffer,
    pngBytes.byteOffset,
    pngBytes.byteLength,
  );
  while (offset < pngBytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...pngBytes.slice(offset + 4, offset + 8));
    const data = pngBytes.slice(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
  }
  return chunks;
};

/**
 * original/HIDEL_GBSP.grp からタイトル画面のアニメーションAPNG (title.apng) を生成
 */
const generateTitleApng = async (spRgba: Uint8Array): Promise<void> => {
  const width = 160;
  const height = 144;
  const bgU = 176;
  const bgV = 368;
  const faceX = 96;
  const faceY = 80;
  const faceW = 32;
  const faceH = 32;

  // 原作 SPANIM 81,"UV+",200,0,0, 8,0,32, 8,0,64, 0 (60fps基準: 200f, 8f, 8f)
  const faceFrames = [
    { u: 272, v: 256, delay: 200 },
    { u: 272, v: 288, delay: 8 },
    { u: 272, v: 320, delay: 8 },
  ];

  // 各フレームの画像データを生成し、PNGとしてエンコードしてIDATを取得
  const frameIdats: Uint8Array[] = [];
  let ihdrChunkData: Uint8Array | null = null;

  for (const f of faceFrames) {
    const frameRgba = new Uint8Array(new ArrayBuffer(width * height * 4));
    // 1. 背景 (SPDEF 80) をコピー
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcOffset = ((bgV + y) * 512 + (bgU + x)) * 4;
        const dstOffset = (y * width + x) * 4;
        frameRgba[dstOffset + 0] = spRgba[srcOffset + 0]!;
        frameRgba[dstOffset + 1] = spRgba[srcOffset + 1]!;
        frameRgba[dstOffset + 2] = spRgba[srcOffset + 2]!;
        frameRgba[dstOffset + 3] = spRgba[srcOffset + 3]!;
      }
    }
    // 2. 顔アニメーション (SPDEF 81) をアルファ合成
    for (let y = 0; y < faceH; y++) {
      for (let x = 0; x < faceW; x++) {
        const srcFaceOffset = ((f.v + y) * 512 + (f.u + x)) * 4;
        const faceA = spRgba[srcFaceOffset + 3]!;
        if (faceA > 0) {
          const dstOffset = ((faceY + y) * width + (faceX + x)) * 4;
          frameRgba[dstOffset + 0] = spRgba[srcFaceOffset + 0]!;
          frameRgba[dstOffset + 1] = spRgba[srcFaceOffset + 1]!;
          frameRgba[dstOffset + 2] = spRgba[srcFaceOffset + 2]!;
          frameRgba[dstOffset + 3] = faceA;
        }
      }
    }

    const png = await encodePNG(frameRgba, {
      width,
      height,
      compression: 0,
      filter: 0,
      interlace: 0,
    });
    const chunks = parsePngChunks(png);
    if (!ihdrChunkData) {
      const ihdr = chunks.find((c) => c.type === "IHDR");
      if (ihdr) ihdrChunkData = ihdr.data;
    }
    const idatChunks = chunks.filter((c) => c.type === "IDAT");
    const totalIdatLen = idatChunks.reduce((acc, c) => acc + c.data.length, 0);
    const combinedIdat = new Uint8Array(totalIdatLen);
    let offset = 0;
    for (const c of idatChunks) {
      combinedIdat.set(c.data, offset);
      offset += c.data.length;
    }
    frameIdats.push(combinedIdat);
  }

  if (!ihdrChunkData) {
    throw new Error("Failed to extract IHDR for APNG");
  }

  // APNG バイトストリームの構築
  const chunksToWrite: Uint8Array[] = [];

  // 1. PNG シグネチャ
  const pngSignature = new Uint8Array([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ]);

  // 2. IHDR
  chunksToWrite.push(makePngChunk("IHDR", ihdrChunkData));

  // 3. acTL: num_frames=3, num_plays=0 (loop)
  const actlData = new Uint8Array(8);
  const actlView = new DataView(actlData.buffer);
  actlView.setUint32(0, 3); // num_frames
  actlView.setUint32(4, 0); // num_plays (0 = infinite)
  chunksToWrite.push(makePngChunk("acTL", actlData));

  let seq = 0;

  // Frame 0: fcTL + IDAT
  const fctl0 = new Uint8Array(26);
  const fctl0View = new DataView(fctl0.buffer);
  fctl0View.setUint32(0, seq++);
  fctl0View.setUint32(4, width);
  fctl0View.setUint32(8, height);
  fctl0View.setUint32(12, 0); // x_offset
  fctl0View.setUint32(16, 0); // y_offset
  fctl0View.setUint16(20, faceFrames[0]!.delay); // delay_num
  fctl0View.setUint16(22, 60); // delay_den (60fps)
  fctl0[24] = 0; // dispose_op: APNG_DISPOSE_OP_NONE
  fctl0[25] = 0; // blend_op: APNG_BLEND_OP_SOURCE
  chunksToWrite.push(makePngChunk("fcTL", fctl0));
  chunksToWrite.push(makePngChunk("IDAT", frameIdats[0]!));

  // Frame 1 & Frame 2: fcTL + fdAT
  for (let i = 1; i <= 2; i++) {
    const fctl = new Uint8Array(26);
    const fctlView = new DataView(fctl.buffer);
    fctlView.setUint32(0, seq++);
    fctlView.setUint32(4, width);
    fctlView.setUint32(8, height);
    fctlView.setUint32(12, 0);
    fctlView.setUint32(16, 0);
    fctlView.setUint16(20, faceFrames[i]!.delay);
    fctlView.setUint16(22, 60);
    fctl[24] = 0;
    fctl[25] = 0;
    chunksToWrite.push(makePngChunk("fcTL", fctl));

    const idatData = frameIdats[i]!;
    const fdatData = new Uint8Array(4 + idatData.length);
    const fdatView = new DataView(fdatData.buffer);
    fdatView.setUint32(0, seq++);
    fdatData.set(idatData, 4);
    chunksToWrite.push(makePngChunk("fdAT", fdatData));
  }

  // IEND
  chunksToWrite.push(makePngChunk("IEND", new Uint8Array(0)));

  // ファイル書き出し
  const totalLength = pngSignature.length +
    chunksToWrite.reduce((acc, c) => acc + c.length, 0);
  const apngBytes = new Uint8Array(totalLength);
  apngBytes.set(pngSignature, 0);
  let writeOffset = pngSignature.length;
  for (const c of chunksToWrite) {
    apngBytes.set(c, writeOffset);
    writeOffset += c.length;
  }

  await Deno.writeFile("./cache/title.apng", apngBytes);
  await Deno.writeFile("./static/title.apng", apngBytes);
  console.log("[generateAssets] title.apng generated successfully.");
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

  // 2b. タイトル画面の顔部分からファビコン生成
  await generateFavicons(spRgba);

  // 2c. タイトル画面アニメーション APNG (title.apng) を生成
  await generateTitleApng(spRgba);

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

  // 8. 音声 (MAPCHANGE_R.mp3) のキャッシュと配置
  const cacheOnlyFiles: ReadonlyArray<string> = [
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
