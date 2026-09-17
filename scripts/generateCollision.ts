/**
 * original/HIDEL_GBMAP.dat から各マスの壁判定 (アトリビュート 1) を抽出し、
 * src/mapCollision.ts を自動生成する
 */

export const generateMapCollisionTs = async (): Promise<void> => {
  const mapData = await Deno.readFile("./original/HIDEL_GBMAP.dat");
  const mainOffset = 32 + 32 * 32;
  const bgWidth = 230;
  const bgHeight = 18;

  // 各マスの壁フラグ (230 x 18)
  const isSolid = new Uint8Array(bgWidth * bgHeight);

  // 各マスの属性 (230 x 18)
  const attributes = new Uint8Array(bgWidth * bgHeight);

  for (let tileY = 0; tileY < bgHeight; tileY++) {
    for (let tileX = 0; tileX < bgWidth; tileX++) {
      let a = 0;
      for (let l = 0; l < 4; l++) {
        const idx = bgWidth * bgHeight * l + (tileY * bgWidth + tileX);
        const offset = mainOffset + idx * 2;
        const code = (mapData[offset]! | (mapData[offset + 1]! << 8)) & 0x0fff;
        const atr = mapData[32 + code]!;
        a |= atr;
      }
      isSolid[tileY * bgWidth + tileX] = (a & 1) === 1 ? 1 : 0;
      attributes[tileY * bgWidth + tileX] = a;
    }
  }

  // 1行230文字の文字列の配列として出力
  const rows: string[] = [];
  for (let y = 0; y < bgHeight; y++) {
    let rowStr = "";
    for (let x = 0; x < bgWidth; x++) {
      rowStr += isSolid[y * bgWidth + x] ? "1" : "0";
    }
    rows.push(`  "${rowStr}",`);
  }

  // 属性値の Base64 エンコード文字列
  let binaryString = "";
  for (let i = 0; i < attributes.length; i++) {
    binaryString += String.fromCharCode(attributes[i]!);
  }
  const attributesBase64 = btoa(binaryString);

  const code = [
    "// このファイルは scripts/generateCollision.ts により original/HIDEL_GBMAP.dat から自動生成されました",
    "// 手動で編集しないでください",
    "",
    "/** マップ全体の幅 (マス単位) */",
    `export const MAP_TILE_WIDTH = ${bgWidth};`,
    "/** マップ全体の高さ (マス単位) */",
    `export const MAP_TILE_HEIGHT = ${bgHeight};`,
    "",
    "/**",
    " * 230x18 マップの各タイルの壁判定 ('1' = 壁, '0' = 通行可能)",
    " */",
    "const collisionRows: ReadonlyArray<string> = [",
    ...rows,
    "];",
    "",
    `const attributesRaw = Uint8Array.from(atob("${attributesBase64}"), (c) => c.charCodeAt(0));`,
    "",
    "/**",
    " * ステージ座標 (px, py) が壁かどうかを判定する (原作 GETATR 準拠)",
    " * @param stageNumber ステージ番号 (0〜21)",
    " * @param px ゲーム画面内のX座標 (0〜160)",
    " * @param py ゲーム画面内のY座標 (0〜144)",
    " */",
    "export const isWall = (stageNumber: number, px: number, py: number): boolean => {",
    "  const mapX = stageNumber * 160 + px;",
    "  const mapY = py;",
    "  const tileX = Math.floor(mapX / 16);",
    "  const tileY = Math.floor(mapY / 16);",
    "  if (tileX < 0 || tileX >= MAP_TILE_WIDTH || tileY < 0 || tileY >= MAP_TILE_HEIGHT) {",
    "    return true;",
    "  }",
    "  const row = collisionRows[tileY];",
    "  if (!row) {",
    "    return true;",
    "  }",
    "  return row[tileX] === '1';",
    "};",
    "",
    "/**",
    " * ステージ座標 (px, py) のマップ属性 (GETATR) を取得する",
    " * 2: チェックポイント2, 4: チェックポイント4, 8: チェックポイント8",
    " */",
    "export const getMapAttribute = (stageNumber: number, px: number, py: number): number => {",
    "  const mapX = stageNumber * 160 + px;",
    "  const mapY = py;",
    "  const tileX = Math.floor(mapX / 16);",
    "  const tileY = Math.floor(mapY / 16);",
    "  if (tileX < 0 || tileX >= MAP_TILE_WIDTH || tileY < 0 || tileY >= MAP_TILE_HEIGHT) {",
    "    return 0;",
    "  }",
    `  return attributesRaw[tileY * ${bgWidth} + tileX] ?? 0;`,
    "};",
    "",
  ];

  await Deno.writeTextFile("./src/mapCollision.ts", code.join("\n"));
  const cmd = new Deno.Command("deno", {
    args: ["fmt", "./src/mapCollision.ts"],
  });
  await cmd.output();
  console.log(
    "[generateCollision] Generated src/mapCollision.ts successfully.",
  );
};

if (import.meta.main) {
  await generateMapCollisionTs();
}
