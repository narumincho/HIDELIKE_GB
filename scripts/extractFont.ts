/**
 * original/HIDELIKE_GB.txt の @FONTDATA から
 * 8x8 ドット絵フォントの SVG パスデータを抽出し、src/fontData.ts を自動生成する
 */

/**
 * 16進文字列（8バイト＝64ビット）から 8x8 ドットの SVG パス文字列を生成
 */
const hexToSvgPath = (hex: string): string => {
  const parts: string[] = [];
  for (let y = 0; y < 8; y++) {
    const rowByte = Number.parseInt(hex.slice(y * 2, y * 2 + 2), 16);
    let startX = -1;
    for (let x = 0; x < 8; x++) {
      const isDot = ((rowByte >> (7 - x)) & 1) === 1;
      if (isDot) {
        if (startX === -1) {
          startX = x;
        }
      } else {
        if (startX !== -1) {
          const w = x - startX;
          parts.push(`M${startX} ${y}h${w}v1h-${w}Z`);
          startX = -1;
        }
      }
    }
    if (startX !== -1) {
      const w = 8 - startX;
      parts.push(`M${startX} ${y}h${w}v1h-${w}Z`);
    }
  }
  return parts.join("");
};

/**
 * 未定義文字（記号など）のフォールバックパターン
 */
const extraFallbackPatterns: ReadonlyMap<string, string> = new Map([
  [".", "0000000000181800"],
  ["/", "0204081020400000"],
  ["_", "0000000000007E00"],
  ["~", "0000324C00000000"],
]);

export const generateFontDataTs = async (): Promise<void> => {
  const text = await Deno.readTextFile("./original/HIDELIKE_GB.txt");
  const match = text.match(/@FONTDATA'([\s\S]*?)DATA -1/);
  if (!match || !match[1]) {
    throw new Error("@FONTDATA not found in HIDELIKE_GB.txt");
  }

  const fontLines = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("DATA"));

  const charPaths: Record<string, string> = {};

  for (const line of fontLines) {
    const m = line.match(/DATA\s+&H([0-9A-Fa-f]+)\s*,\s*"([0-9A-Fa-f]+)"/);
    if (m && m[1] && m[2]) {
      const code = Number.parseInt(m[1], 16);
      const char = String.fromCharCode(code);
      const path = hexToSvgPath(m[2]);
      charPaths[char] = path;
    }
  }

  // フォールバック記号を追加
  for (const [char, hex] of extraFallbackPatterns.entries()) {
    if (!charPaths[char]) {
      charPaths[char] = hexToSvgPath(hex);
    }
  }

  const lines: string[] = [
    "// このファイルは scripts/extractFont.ts により original/HIDELIKE_GB.txt から自動生成されました",
    "// 手動で編集しないでください",
    "",
    "/** 8x8 ドット絵フォントの各文字の SVG パスデータ */",
    "export const fontPathMap: ReadonlyMap<string, string> = new Map<string, string>([",
  ];

  for (const [char, path] of Object.entries(charPaths)) {
    const escapedChar = JSON.stringify(char);
    lines.push(`  [${escapedChar}, "${path}"],`);
  }

  lines.push("]);", "");

  await Deno.writeTextFile("./src/fontData.ts", lines.join("\n"));
  const cmd = new Deno.Command("deno", {
    args: ["fmt", "./src/fontData.ts"],
  });
  await cmd.output();
  console.log("[extractFont] Generated src/fontData.ts successfully.");
};

if (import.meta.main) {
  await generateFontDataTs();
}
