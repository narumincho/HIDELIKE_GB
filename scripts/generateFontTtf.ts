/**
 * original/HIDELIKE_GB.txt の @FONTDATA から
 * TrueType フォント (.ttf) を自動生成するスクリプト
 */

class BinaryWriter {
  private buffer: Uint8Array;
  private view: DataView;
  private offset = 0;

  constructor(size = 65536) {
    this.buffer = new Uint8Array(size);
    this.view = new DataView(this.buffer.buffer);
  }

  private ensure(size: number) {
    if (this.offset + size > this.buffer.length) {
      const next = new Uint8Array(
        Math.max(this.buffer.length * 2, this.offset + size),
      );
      next.set(this.buffer);
      this.buffer = next;
      this.view = new DataView(this.buffer.buffer);
    }
  }

  writeUint8(val: number): void {
    this.ensure(1);
    this.view.setUint8(this.offset++, val);
  }

  writeUint16(val: number): void {
    this.ensure(2);
    this.view.setUint16(this.offset, val, false);
    this.offset += 2;
  }

  writeInt16(val: number): void {
    this.ensure(2);
    this.view.setInt16(this.offset, val, false);
    this.offset += 2;
  }

  writeUint32(val: number): void {
    this.ensure(4);
    this.view.setUint32(this.offset, val, false);
    this.offset += 4;
  }

  writeBytes(bytes: Uint8Array | ReadonlyArray<number>): void {
    this.ensure(bytes.length);
    this.buffer.set(bytes, this.offset);
    this.offset += bytes.length;
  }

  writeString(str: string): void {
    for (let i = 0; i < str.length; i++) {
      this.writeUint8(str.charCodeAt(i));
    }
  }

  get length(): number {
    return this.offset;
  }

  getBytes(): Uint8Array<ArrayBuffer> {
    return this.buffer.slice(0, this.offset);
  }
}

const calcTableChecksum = (bytes: Uint8Array): number => {
  let sum = 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const n = Math.floor(bytes.length / 4);
  for (let i = 0; i < n; i++) {
    sum = (sum + view.getUint32(i * 4, false)) >>> 0;
  }
  return sum;
};

type Point = { readonly x: number; readonly y: number };
type Contour = ReadonlyArray<Point>;

const hexToContours = (hex: string): ReadonlyArray<Contour> => {
  const contours: Contour[] = [];
  // unitsPerEm = 1024, 1 dot = 128
  for (let y = 0; y < 8; y++) {
    const rowByte = Number.parseInt(hex.slice(y * 2, y * 2 + 2), 16);
    let startX = -1;
    for (let x = 0; x < 8; x++) {
      const isDot = ((rowByte >> (7 - x)) & 1) === 1;
      if (isDot) {
        if (startX === -1) startX = x;
      } else {
        if (startX !== -1) {
          // 矩形 [startX, x - 1]
          // Y座標: y=0 が上端(1024), y=7 が下端(0)
          const y0 = (7 - y) * 128;
          const y1 = (8 - y) * 128;
          const x0 = startX * 128;
          const x1 = x * 128;
          // 時計回り: (x0, y0) -> (x0, y1) -> (x1, y1) -> (x1, y0)
          contours.push([
            { x: x0, y: y0 },
            { x: x0, y: y1 },
            { x: x1, y: y1 },
            { x: x1, y: y0 },
          ]);
          startX = -1;
        }
      }
    }
    if (startX !== -1) {
      const y0 = (7 - y) * 128;
      const y1 = (8 - y) * 128;
      const x0 = startX * 128;
      const x1 = 8 * 128;
      contours.push([
        { x: x0, y: y0 },
        { x: x0, y: y1 },
        { x: x1, y: y1 },
        { x: x1, y: y0 },
      ]);
    }
  }
  return contours;
};

export const generateFontTtf = (
  charPatterns: ReadonlyArray<{ readonly code: number; readonly hex: string }>,
): Uint8Array<ArrayBuffer> => {
  // 1. グリフリストの準備
  // Glyph 0: .notdef
  const glyphContours: Array<ReadonlyArray<Contour>> = [
    // .notdef: 枠線
    [
      [
        { x: 128, y: 128 },
        { x: 128, y: 896 },
        { x: 896, y: 896 },
        { x: 896, y: 128 },
      ],
      [
        { x: 256, y: 256 },
        { x: 768, y: 256 },
        { x: 768, y: 768 },
        { x: 256, y: 768 },
      ],
    ],
  ];

  const charCodeToGlyphId: Array<
    { readonly code: number; readonly glyphId: number }
  > = [];

  for (const p of charPatterns) {
    const glyphId = glyphContours.length;
    glyphContours.push(hexToContours(p.hex));
    charCodeToGlyphId.push({ code: p.code, glyphId });
  }

  const numGlyphs = glyphContours.length;

  // 2. glyf & loca テーブル構築
  const glyfWriter = new BinaryWriter();
  const locaOffsets: number[] = [];

  let maxPoints = 0;
  let maxContours = 0;

  for (let g = 0; g < numGlyphs; g++) {
    locaOffsets.push(glyfWriter.length);
    const contours = glyphContours[g]!;
    if (contours.length === 0) {
      // 空グリフ (スペースなど)
      continue;
    }

    if (contours.length > maxContours) maxContours = contours.length;

    let pointsCount = 0;
    let minX = 32767;
    let minY = 32767;
    let maxX = -32768;
    let maxY = -32768;
    for (const c of contours) {
      pointsCount += c.length;
      for (const pt of c) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }
    }
    if (pointsCount > maxPoints) maxPoints = pointsCount;

    glyfWriter.writeInt16(contours.length);
    glyfWriter.writeInt16(minX);
    glyfWriter.writeInt16(minY);
    glyfWriter.writeInt16(maxX);
    glyfWriter.writeInt16(maxY);

    // endPtsOfContours
    let currentEndPt = -1;
    for (const c of contours) {
      currentEndPt += c.length;
      glyfWriter.writeUint16(currentEndPt);
    }

    // instructionLength = 0
    glyfWriter.writeUint16(0);

    // flags: すべて 0x01 (ON_CURVE, 16bit差分)
    for (let i = 0; i < pointsCount; i++) {
      glyfWriter.writeUint8(0x01);
    }

    // xCoordinates (16bit 符号付き差分)
    let lastX = 0;
    for (const c of contours) {
      for (const pt of c) {
        const dx = pt.x - lastX;
        glyfWriter.writeInt16(dx);
        lastX = pt.x;
      }
    }

    // yCoordinates (16bit 符号付き差分)
    let lastY = 0;
    for (const c of contours) {
      for (const pt of c) {
        const dy = pt.y - lastY;
        glyfWriter.writeInt16(dy);
        lastY = pt.y;
      }
    }

    // 2バイトアライメント
    if (glyfWriter.length % 2 !== 0) {
      glyfWriter.writeUint8(0);
    }
  }
  locaOffsets.push(glyfWriter.length);

  // 4バイトアライメント
  while (glyfWriter.length % 4 !== 0) {
    glyfWriter.writeUint8(0);
  }
  const glyfTable = glyfWriter.getBytes();

  // loca テーブル (Format 1: Long offset, 4 bytes each)
  const locaWriter = new BinaryWriter(locaOffsets.length * 4);
  for (const off of locaOffsets) {
    locaWriter.writeUint32(off);
  }
  const locaTable = locaWriter.getBytes();

  // 3. hmtx テーブル
  const hmtxWriter = new BinaryWriter(numGlyphs * 4);
  for (let i = 0; i < numGlyphs; i++) {
    hmtxWriter.writeUint16(1024); // advanceWidth
    hmtxWriter.writeInt16(0); // lsb
  }
  const hmtxTable = hmtxWriter.getBytes();

  // 4. hhea テーブル (36 bytes)
  const hheaWriter = new BinaryWriter(36);
  hheaWriter.writeUint16(1); // majorVersion
  hheaWriter.writeUint16(0); // minorVersion
  hheaWriter.writeInt16(1024); // ascender
  hheaWriter.writeInt16(0); // descender
  hheaWriter.writeInt16(0); // lineGap
  hheaWriter.writeUint16(1024); // advanceWidthMax
  hheaWriter.writeInt16(0); // minLeftSideBearing
  hheaWriter.writeInt16(0); // minRightSideBearing
  hheaWriter.writeInt16(1024); // xMaxExtent
  hheaWriter.writeInt16(1); // caretSlopeRise
  hheaWriter.writeInt16(0); // caretSlopeRun
  hheaWriter.writeInt16(0); // caretOffset
  hheaWriter.writeInt16(0); // reserved1
  hheaWriter.writeInt16(0); // reserved2
  hheaWriter.writeInt16(0); // reserved3
  hheaWriter.writeInt16(0); // reserved4
  hheaWriter.writeInt16(0); // metricDataFormat
  hheaWriter.writeUint16(numGlyphs); // numberOfHMetrics
  const hheaTable = hheaWriter.getBytes();

  // 5. maxp テーブル (32 bytes)
  const maxpWriter = new BinaryWriter(32);
  maxpWriter.writeUint32(0x00010000);
  maxpWriter.writeUint16(numGlyphs);
  maxpWriter.writeUint16(maxPoints);
  maxpWriter.writeUint16(maxContours);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(1);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  maxpWriter.writeUint16(0);
  const maxpTable = maxpWriter.getBytes();

  // 6. cmap テーブル (Format 4)
  const sortedMappings = [...charCodeToGlyphId].sort((a, b) => a.code - b.code);
  const segCount = sortedMappings.length + 1;
  const segCountX2 = segCount * 2;
  const searchRange = 2 * (2 ** Math.floor(Math.log2(segCount)));
  const entrySelector = Math.floor(Math.log2(segCount));
  const rangeShift = segCountX2 - searchRange;

  const endCodes: number[] = [];
  const startCodes: number[] = [];
  const idDeltas: number[] = [];

  for (const m of sortedMappings) {
    startCodes.push(m.code);
    endCodes.push(m.code);
    idDeltas.push((m.glyphId - m.code) & 0xFFFF);
  }
  // 終端セグメント
  startCodes.push(0xFFFF);
  endCodes.push(0xFFFF);
  idDeltas.push(1);

  const format4Length = 16 + segCount * 8;
  const cmapWriter = new BinaryWriter();
  cmapWriter.writeUint16(0); // version
  cmapWriter.writeUint16(1); // numTables
  // encoding subtable 0 (Platform 3: Windows / Unicode, Encoding 1: BMP)
  cmapWriter.writeUint16(3);
  cmapWriter.writeUint16(1);
  cmapWriter.writeUint32(12); // offset to subtable

  // Subtable Format 4
  cmapWriter.writeUint16(4);
  cmapWriter.writeUint16(format4Length);
  cmapWriter.writeUint16(0); // language
  cmapWriter.writeUint16(segCountX2);
  cmapWriter.writeUint16(searchRange);
  cmapWriter.writeUint16(entrySelector);
  cmapWriter.writeUint16(rangeShift);
  for (const ec of endCodes) cmapWriter.writeUint16(ec);
  cmapWriter.writeUint16(0); // reservedPad
  for (const sc of startCodes) cmapWriter.writeUint16(sc);
  for (const id of idDeltas) cmapWriter.writeUint16(id);
  for (let i = 0; i < segCount; i++) cmapWriter.writeUint16(0); // idRangeOffsets = 0

  while (cmapWriter.length % 4 !== 0) cmapWriter.writeUint8(0);
  const cmapTable = cmapWriter.getBytes();

  // 7. name テーブル
  const fontName = "hide like gb";
  const nameStrings: ReadonlyArray<string> = [fontName, fontName, fontName];
  // UTF-16BE エンコード
  const encodedStrings = nameStrings.map((str) => {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      bytes.push((code >> 8) & 0xFF, code & 0xFF);
    }
    return new Uint8Array(bytes);
  });

  const nameRecordCount = 3;
  const nameHeaderLen = 6 + nameRecordCount * 12;
  const nameWriter = new BinaryWriter();
  nameWriter.writeUint16(0); // format
  nameWriter.writeUint16(nameRecordCount);
  nameWriter.writeUint16(nameHeaderLen); // stringOffset

  let strOff = 0;
  const nameIds = [1, 2, 4];
  for (let i = 0; i < nameRecordCount; i++) {
    nameWriter.writeUint16(3); // platformID: Windows
    nameWriter.writeUint16(1); // encodingID: Unicode BMP
    nameWriter.writeUint16(0x0409); // languageID: English US
    nameWriter.writeUint16(nameIds[i]!); // nameID
    nameWriter.writeUint16(encodedStrings[i]!.length);
    nameWriter.writeUint16(strOff);
    strOff += encodedStrings[i]!.length;
  }
  for (const s of encodedStrings) {
    nameWriter.writeBytes(s);
  }
  while (nameWriter.length % 4 !== 0) nameWriter.writeUint8(0);
  const nameTable = nameWriter.getBytes();

  // 8. post テーブル (32 bytes)
  const postWriter = new BinaryWriter(32);
  postWriter.writeUint32(0x00030000); // Format 3.0
  postWriter.writeUint32(0); // italicAngle
  postWriter.writeInt16(-100); // underlinePosition
  postWriter.writeInt16(50); // underlineThickness
  postWriter.writeUint32(1); // isFixedPitch (monospaced)
  postWriter.writeUint32(0);
  postWriter.writeUint32(0);
  postWriter.writeUint32(0);
  postWriter.writeUint32(0);
  const postTable = postWriter.getBytes();

  // 9. head テーブル (54 bytes)
  const headWriter = new BinaryWriter(54);
  headWriter.writeUint16(1); // majorVersion
  headWriter.writeUint16(0); // minorVersion
  headWriter.writeUint32(0x00010000); // fontRevision
  headWriter.writeUint32(0); // checkSumAdjustment (後で設定)
  headWriter.writeUint32(0x5F0F3CF5); // magicNumber
  headWriter.writeUint16(0x0001); // flags
  headWriter.writeUint16(1024); // unitsPerEm
  headWriter.writeUint32(0);
  headWriter.writeUint32(0);
  headWriter.writeUint32(0);
  headWriter.writeUint32(0);
  headWriter.writeInt16(0); // xMin
  headWriter.writeInt16(0); // yMin
  headWriter.writeInt16(1024); // xMax
  headWriter.writeInt16(1024); // yMax
  headWriter.writeUint16(0); // macStyle
  headWriter.writeUint16(8); // lowestRecPPEM
  headWriter.writeInt16(2); // fontDirectionHint
  headWriter.writeInt16(1); // indexToLocFormat: 1 = Long offsets (uint32)
  headWriter.writeInt16(0); // glyphDataFormat
  while (headWriter.length % 4 !== 0) headWriter.writeUint8(0);
  const headTable = headWriter.getBytes();

  // テーブルリスト (アルファベット順ソート)
  const tables = [
    { tag: "cmap", data: cmapTable },
    { tag: "glyf", data: glyfTable },
    { tag: "head", data: headTable },
    { tag: "hhea", data: hheaTable },
    { tag: "hmtx", data: hmtxTable },
    { tag: "loca", data: locaTable },
    { tag: "maxp", data: maxpTable },
    { tag: "name", data: nameTable },
    { tag: "post", data: postTable },
  ];

  tables.sort((a, b) => a.tag.localeCompare(b.tag));

  const numTables = tables.length;
  const ttfSearchRange = (2 ** Math.floor(Math.log2(numTables))) * 16;
  const ttfEntrySelector = Math.floor(Math.log2(numTables));
  const ttfRangeShift = numTables * 16 - ttfSearchRange;

  const fontWriter = new BinaryWriter();
  fontWriter.writeUint32(0x00010000); // sfntVersion
  fontWriter.writeUint16(numTables);
  fontWriter.writeUint16(ttfSearchRange);
  fontWriter.writeUint16(ttfEntrySelector);
  fontWriter.writeUint16(ttfRangeShift);

  let currentTableOffset = 12 + numTables * 16;
  const tableInfos: Array<
    {
      readonly tag: string;
      readonly offset: number;
      readonly length: number;
      readonly checksum: number;
    }
  > = [];

  for (const t of tables) {
    const checksum = calcTableChecksum(t.data);
    tableInfos.push({
      tag: t.tag,
      offset: currentTableOffset,
      length: t.data.length,
      checksum,
    });
    currentTableOffset += t.data.length;
  }

  for (const info of tableInfos) {
    fontWriter.writeString(info.tag);
    fontWriter.writeUint32(info.checksum);
    fontWriter.writeUint32(info.offset);
    fontWriter.writeUint32(info.length);
  }

  for (const t of tables) {
    fontWriter.writeBytes(t.data);
  }

  const fontBytes = fontWriter.getBytes();

  // head テーブルの checkSumAdjustment
  const wholeCheckSum = calcTableChecksum(fontBytes);
  const adjustment = (0xB1B0AFBA - wholeCheckSum) >>> 0;

  const headInfo = tableInfos.find((t) => t.tag === "head");
  if (headInfo) {
    const view = new DataView(
      fontBytes.buffer,
      fontBytes.byteOffset,
      fontBytes.byteLength,
    );
    view.setUint32(headInfo.offset + 8, adjustment, false);
  }

  return fontBytes;
};

export const generateFontTtfFile = async (): Promise<void> => {
  const text = await Deno.readTextFile("./original/HIDELIKE_GB.txt");
  const match = text.match(/@FONTDATA'([\s\S]*?)DATA -1/);
  if (!match || !match[1]) throw new Error("No font data");

  const fontLines = match[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("DATA"));

  type CharPattern = { readonly code: number; readonly hex: string };
  const patterns: CharPattern[] = [];

  // スペース (0x20)
  patterns.push({ code: 0x20, hex: "0000000000000000" });

  for (const line of fontLines) {
    const m = line.match(/DATA\s+&H([0-9A-Fa-f]+)\s*,\s*"([0-9A-Fa-f]+)"/);
    if (m && m[1] && m[2]) {
      patterns.push({ code: Number.parseInt(m[1], 16), hex: m[2] });
    }
  }

  // 記号追加
  patterns.push({ code: ".".charCodeAt(0), hex: "0000000000181800" });
  patterns.push({ code: "/".charCodeAt(0), hex: "0204081020400000" });
  patterns.push({ code: "_".charCodeAt(0), hex: "0000000000007E00" });
  patterns.push({ code: "~".charCodeAt(0), hex: "0000324C00000000" });

  // コード順にソート (cmap のために必須)
  patterns.sort((a, b) => a.code - b.code);

  const ttfBytes = generateFontTtf(patterns);
  await Deno.writeFile("./cache/font.ttf", ttfBytes);
  await Deno.writeFile("./static/font.ttf", ttfBytes);
  console.log(
    `[generateFontTtf] Generated font.ttf successfully (${ttfBytes.length} bytes).`,
  );
};

if (import.meta.main) {
  await generateFontTtfFile();
}
