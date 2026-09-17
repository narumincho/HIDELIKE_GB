/**
 * original/HIDELIKE_GB.txt の @FONTDATA から
 * Web フォント (.woff / .ttf) を自動生成するスクリプト
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
  const remainder = bytes.length % 4;
  if (remainder > 0) {
    let lastWord = 0;
    for (let r = 0; r < remainder; r++) {
      lastWord |= (bytes[n * 4 + r] ?? 0) << (24 - r * 8);
    }
    sum = (sum + (lastWord >>> 0)) >>> 0;
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
          // 時計回り (外側輪郭): (x0, y0) -> (x0, y1) -> (x1, y1) -> (x1, y0)
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

type Glyph = {
  readonly code: number;
  readonly contours: ReadonlyArray<Contour>;
  readonly xMin: number;
  readonly yMin: number;
  readonly xMax: number;
  readonly yMax: number;
};

const buildGlyph = (code: number, hex: string): Glyph => {
  const contours = hexToContours(hex);
  if (contours.length === 0) {
    return { code, contours: [], xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
  }
  let xMin = 1024;
  let yMin = 1024;
  let xMax = 0;
  let yMax = 0;
  for (const c of contours) {
    for (const p of c) {
      if (p.x < xMin) xMin = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.x > xMax) xMax = p.x;
      if (p.y > yMax) yMax = p.y;
    }
  }
  return { code, contours, xMin, yMin, xMax, yMax };
};

const encodeSimpleGlyph = (glyph: Glyph): Uint8Array<ArrayBuffer> => {
  if (glyph.contours.length === 0) {
    return new Uint8Array(0);
  }
  const writer = new BinaryWriter();
  const numberOfContours = glyph.contours.length;
  writer.writeInt16(numberOfContours);
  writer.writeInt16(glyph.xMin);
  writer.writeInt16(glyph.yMin);
  writer.writeInt16(glyph.xMax);
  writer.writeInt16(glyph.yMax);

  let endPt = -1;
  for (const c of glyph.contours) {
    endPt += c.length;
    writer.writeUint16(endPt);
  }

  // instructionLength
  writer.writeUint16(0);

  // 全頂点の収集
  type FlatPoint = { x: number; y: number };
  const allPoints: FlatPoint[] = [];
  for (const c of glyph.contours) {
    for (const p of c) {
      allPoints.push({ x: p.x, y: p.y });
    }
  }

  // flags (すべて on-curve = 0x01)
  for (let i = 0; i < allPoints.length; i++) {
    writer.writeUint8(0x01);
  }

  // xCoordinates (相対座標, 16bit signed)
  let lastX = 0;
  for (const p of allPoints) {
    const dx = p.x - lastX;
    writer.writeInt16(dx);
    lastX = p.x;
  }

  // yCoordinates (相対座標, 16bit signed)
  let lastY = 0;
  for (const p of allPoints) {
    const dy = p.y - lastY;
    writer.writeInt16(dy);
    lastY = p.y;
  }

  // 4バイト境界アライン
  while (writer.length % 4 !== 0) {
    writer.writeUint8(0);
  }

  return writer.getBytes();
};

export const generateFontTtf = (
  patterns: ReadonlyArray<{ readonly code: number; readonly hex: string }>,
): Uint8Array<ArrayBuffer> => {
  // Glyph 0: .notdef (四角枠)
  const notdefContours: ReadonlyArray<Contour> = [
    [
      { x: 128, y: 128 },
      { x: 128, y: 896 },
      { x: 896, y: 896 },
      { x: 896, y: 128 },
    ],
    // 内側の穴 (反時計回り)
    [
      { x: 256, y: 256 },
      { x: 768, y: 256 },
      { x: 768, y: 768 },
      { x: 256, y: 768 },
    ],
  ];
  const notdefGlyph: Glyph = {
    code: -1,
    contours: notdefContours,
    xMin: 128,
    yMin: 128,
    xMax: 896,
    yMax: 896,
  };

  const glyphs: Glyph[] = [notdefGlyph];
  for (const p of patterns) {
    glyphs.push(buildGlyph(p.code, p.hex));
  }

  const numGlyphs = glyphs.length;

  // glyf & loca テーブル構築
  const glyfWriter = new BinaryWriter();
  const locaOffsets: number[] = [];

  for (const g of glyphs) {
    locaOffsets.push(glyfWriter.length);
    const data = encodeSimpleGlyph(g);
    glyfWriter.writeBytes(data);
  }
  locaOffsets.push(glyfWriter.length);

  const glyfTable = glyfWriter.getBytes();

  // loca テーブル (32-bit format)
  const locaWriter = new BinaryWriter();
  for (const off of locaOffsets) {
    locaWriter.writeUint32(off);
  }
  const locaTable = locaWriter.getBytes();

  // cmap テーブル (Format 4)
  type CmapSegment = {
    startCode: number;
    endCode: number;
    idDelta: number;
    useRangeOffset: boolean;
    glyphIndices: number[];
  };
  const cmapSegments: CmapSegment[] = [];

  let curStart = -1;
  let curEnd = -1;
  let curStartIdx = -1;
  let curGlyphs: number[] = [];

  for (let i = 1; i < numGlyphs; i++) {
    const code = glyphs[i]!.code;
    if (curStart === -1) {
      curStart = code;
      curEnd = code;
      curStartIdx = i;
      curGlyphs = [i];
    } else if (code === curEnd + 1) {
      curEnd = code;
      curGlyphs.push(i);
    } else {
      const delta = curStartIdx - curStart;
      const fitsInInt16 = delta >= -32768 && delta <= 32767;
      cmapSegments.push({
        startCode: curStart,
        endCode: curEnd,
        idDelta: fitsInInt16 ? delta : 0,
        useRangeOffset: !fitsInInt16,
        glyphIndices: curGlyphs,
      });
      curStart = code;
      curEnd = code;
      curStartIdx = i;
      curGlyphs = [i];
    }
  }
  if (curStart !== -1) {
    const delta = curStartIdx - curStart;
    const fitsInInt16 = delta >= -32768 && delta <= 32767;
    cmapSegments.push({
      startCode: curStart,
      endCode: curEnd,
      idDelta: fitsInInt16 ? delta : 0,
      useRangeOffset: !fitsInInt16,
      glyphIndices: curGlyphs,
    });
  }

  // 終端セグメント
  cmapSegments.push({
    startCode: 0xFFFF,
    endCode: 0xFFFF,
    idDelta: 1,
    useRangeOffset: false,
    glyphIndices: [],
  });

  const segCount = cmapSegments.length;
  const searchRange = (2 ** Math.floor(Math.log2(segCount))) * 2;
  const entrySelector = Math.floor(Math.log2(segCount));
  const rangeShift = 2 * segCount - searchRange;

  // glyphIdArray と idRangeOffsets を構築
  const glyphIdArray: number[] = [];
  const idRangeOffsets: number[] = [];

  for (let s = 0; s < segCount; s++) {
    const seg = cmapSegments[s]!;
    if (!seg.useRangeOffset) {
      idRangeOffsets.push(0);
    } else {
      const offsetInWords = (segCount - s) + glyphIdArray.length;
      idRangeOffsets.push(offsetInWords * 2);
      for (const gIdx of seg.glyphIndices) {
        glyphIdArray.push(gIdx);
      }
    }
  }

  const subtableLength = 16 + 8 * segCount + 2 * glyphIdArray.length;
  const cmapWriter = new BinaryWriter();
  // cmap header
  cmapWriter.writeUint16(0); // version
  cmapWriter.writeUint16(1); // numTables
  // encoding record (Unicode 2.0+ / Windows BMP)
  cmapWriter.writeUint16(3); // platformID: Windows
  cmapWriter.writeUint16(1); // encodingID: Unicode BMP
  cmapWriter.writeUint32(12); // offset to subtable

  // format 4 subtable
  cmapWriter.writeUint16(4); // format
  cmapWriter.writeUint16(subtableLength); // length
  cmapWriter.writeUint16(0); // language
  cmapWriter.writeUint16(segCount * 2); // segCountX2
  cmapWriter.writeUint16(searchRange);
  cmapWriter.writeUint16(entrySelector);
  cmapWriter.writeUint16(rangeShift);

  for (const s of cmapSegments) cmapWriter.writeUint16(s.endCode);
  cmapWriter.writeUint16(0); // reservedPad
  for (const s of cmapSegments) cmapWriter.writeUint16(s.startCode);
  for (const s of cmapSegments) cmapWriter.writeInt16(s.idDelta);
  for (const ro of idRangeOffsets) cmapWriter.writeUint16(ro);
  for (const gid of glyphIdArray) cmapWriter.writeUint16(gid);

  while (cmapWriter.length % 4 !== 0) {
    cmapWriter.writeUint8(0);
  }
  const cmapTable = cmapWriter.getBytes();

  // head テーブル
  const headWriter = new BinaryWriter();
  headWriter.writeUint16(1); // majorVersion
  headWriter.writeUint16(0); // minorVersion
  headWriter.writeUint32(0x00010000); // fontRevision (1.0)
  headWriter.writeUint32(0); // checkSumAdjustment (後で計算)
  headWriter.writeUint32(0x5F0F3CF5); // magicNumber
  headWriter.writeUint16(0x0001); // flags
  headWriter.writeUint16(1024); // unitsPerEm
  // created & modified (8 bytes each)
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
  headWriter.writeInt16(1); // indexToLocFormat: 1 (long / 32-bit)
  headWriter.writeInt16(0); // glyphDataFormat
  const headTable = headWriter.getBytes();

  // hhea テーブル
  const hheaWriter = new BinaryWriter();
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
  hheaWriter.writeInt16(0); // reserved
  hheaWriter.writeInt16(0); // reserved
  hheaWriter.writeInt16(0); // reserved
  hheaWriter.writeInt16(0); // reserved
  hheaWriter.writeInt16(0); // metricDataFormat
  hheaWriter.writeUint16(numGlyphs); // numberOfHMetrics
  const hheaTable = hheaWriter.getBytes();

  // hmtx テーブル (等幅: 1024 units advance, 0 lsb)
  const hmtxWriter = new BinaryWriter();
  for (let i = 0; i < numGlyphs; i++) {
    hmtxWriter.writeUint16(1024); // advanceWidth
    hmtxWriter.writeInt16(0); // lsb
  }
  const hmtxTable = hmtxWriter.getBytes();

  // maxp テーブル
  const maxpWriter = new BinaryWriter();
  maxpWriter.writeUint32(0x00010000); // version 1.0
  maxpWriter.writeUint16(numGlyphs);
  maxpWriter.writeUint16(64); // maxPoints
  maxpWriter.writeUint16(16); // maxContours
  maxpWriter.writeUint16(0); // maxCompositePoints
  maxpWriter.writeUint16(0); // maxCompositeContours
  maxpWriter.writeUint16(1); // maxZones
  maxpWriter.writeUint16(0); // maxTwilightPoints
  maxpWriter.writeUint16(0); // maxStorage
  maxpWriter.writeUint16(0); // maxFunctionDefs
  maxpWriter.writeUint16(0); // maxInstructionDefs
  maxpWriter.writeUint16(0); // maxStackElements
  maxpWriter.writeUint16(0); // maxSizeOfInstructions
  maxpWriter.writeUint16(0); // maxComponentElements
  maxpWriter.writeUint16(0); // maxComponentDepth
  const maxpTable = maxpWriter.getBytes();

  // OS/2 テーブル
  const os2Writer = new BinaryWriter();
  os2Writer.writeUint16(4); // version
  os2Writer.writeInt16(1024); // xAvgCharWidth
  os2Writer.writeUint16(400); // usWeightClass (Normal)
  os2Writer.writeUint16(5); // usWidthClass (Medium)
  os2Writer.writeUint16(0); // fsType (Installable)
  os2Writer.writeInt16(128); // ySubscriptXSize
  os2Writer.writeInt16(128); // ySubscriptYSize
  os2Writer.writeInt16(0); // ySubscriptXOffset
  os2Writer.writeInt16(64); // ySubscriptYOffset
  os2Writer.writeInt16(128); // ySuperscriptXSize
  os2Writer.writeInt16(128); // ySuperscriptYSize
  os2Writer.writeInt16(0); // ySuperscriptXOffset
  os2Writer.writeInt16(128); // ySuperscriptYOffset
  os2Writer.writeInt16(64); // yStrikeoutSize
  os2Writer.writeInt16(512); // yStrikeoutPosition
  os2Writer.writeInt16(0); // sFamilyClass
  // panose (10 bytes)
  os2Writer.writeBytes([2, 0, 5, 9, 0, 0, 0, 0, 0, 0]);
  // ulUnicodeRange 1-4
  os2Writer.writeUint32(0x00000001);
  os2Writer.writeUint32(0);
  os2Writer.writeUint32(0);
  os2Writer.writeUint32(0);
  // achVendID
  os2Writer.writeString("NONE");
  os2Writer.writeUint16(0x0040); // fsSelection
  os2Writer.writeUint16(0x0020); // usFirstCharIndex
  os2Writer.writeUint16(0x007E); // usLastCharIndex
  os2Writer.writeInt16(1024); // sTypoAscender
  os2Writer.writeInt16(0); // sTypoDescender
  os2Writer.writeInt16(0); // sTypoLineGap
  os2Writer.writeUint16(1024); // usWinAscent
  os2Writer.writeUint16(0); // usWinDescent
  os2Writer.writeUint32(1); // ulCodePageRange1
  os2Writer.writeUint32(0); // ulCodePageRange2
  os2Writer.writeInt16(768); // sxHeight
  os2Writer.writeInt16(1024); // sCapHeight
  os2Writer.writeUint16(0); // usDefaultChar
  os2Writer.writeUint16(0x0020); // usBreakChar
  os2Writer.writeUint16(0); // usMaxContext
  const os2Table = os2Writer.getBytes();

  // name テーブル
  const fontName = "hide like gb";
  const nameEntries = [
    { nameID: 1, str: fontName }, // Family
    { nameID: 2, str: "Regular" }, // Subfamily
    { nameID: 3, str: "1.000;NONE;HideLikeGB" }, // Unique identifier
    { nameID: 4, str: fontName }, // Full name
    { nameID: 5, str: "Version 1.000" }, // Version
    { nameID: 6, str: "HideLikeGB" }, // Postscript name
  ];

  const stringStorageWriter = new BinaryWriter();
  type NameRecord = {
    readonly platformID: number;
    readonly encodingID: number;
    readonly languageID: number;
    readonly nameID: number;
    readonly length: number;
    readonly offset: number;
  };
  const nameRecords: NameRecord[] = [];

  // Mac Roman (platformID: 1, encodingID: 0, languageID: 0)
  for (const entry of nameEntries) {
    const offset = stringStorageWriter.length;
    for (let i = 0; i < entry.str.length; i++) {
      stringStorageWriter.writeUint8(entry.str.charCodeAt(i));
    }
    const len = stringStorageWriter.length - offset;
    nameRecords.push({
      platformID: 1,
      encodingID: 0,
      languageID: 0,
      nameID: entry.nameID,
      length: len,
      offset,
    });
  }

  // Windows Unicode (platformID: 3, encodingID: 1, languageID: 0x0409)
  for (const entry of nameEntries) {
    const offset = stringStorageWriter.length;
    for (let i = 0; i < entry.str.length; i++) {
      stringStorageWriter.writeUint16(entry.str.charCodeAt(i));
    }
    const len = stringStorageWriter.length - offset;
    nameRecords.push({
      platformID: 3,
      encodingID: 1,
      languageID: 0x0409,
      nameID: entry.nameID,
      length: len,
      offset,
    });
  }

  const nameWriter = new BinaryWriter();
  nameWriter.writeUint16(0); // format
  nameWriter.writeUint16(nameRecords.length); // count
  const stringOffset = 6 + nameRecords.length * 12;
  nameWriter.writeUint16(stringOffset); // stringOffset

  for (const r of nameRecords) {
    nameWriter.writeUint16(r.platformID);
    nameWriter.writeUint16(r.encodingID);
    nameWriter.writeUint16(r.languageID);
    nameWriter.writeUint16(r.nameID);
    nameWriter.writeUint16(r.length);
    nameWriter.writeUint16(r.offset);
  }
  nameWriter.writeBytes(stringStorageWriter.getBytes());

  while (nameWriter.length % 4 !== 0) {
    nameWriter.writeUint8(0);
  }
  const nameTable = nameWriter.getBytes();

  // post テーブル
  const postWriter = new BinaryWriter();
  postWriter.writeUint32(0x00030000); // format 3.0 (no glyph names)
  postWriter.writeUint32(0); // italicAngle
  postWriter.writeInt16(0); // underlinePosition
  postWriter.writeInt16(0); // underlineThickness
  postWriter.writeUint32(1); // isFixedPitch: 1 (等幅)
  postWriter.writeUint32(0); // minMemType42
  postWriter.writeUint32(0); // maxMemType42
  postWriter.writeUint32(0); // minMemType1
  postWriter.writeUint32(0); // maxMemType1
  const postTable = postWriter.getBytes();

  // 全テーブルリスト (タグ順にソート)
  type TableEntry = { readonly tag: string; readonly data: Uint8Array };
  const rawTables: ReadonlyArray<TableEntry> = [
    { tag: "OS/2", data: os2Table },
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

  const tables = [...rawTables].sort((a, b) => a.tag.localeCompare(b.tag));

  const ttfNumTables = tables.length;
  const ttfSearchRange = (2 ** Math.floor(Math.log2(ttfNumTables))) * 16;
  const ttfEntrySelector = Math.floor(Math.log2(ttfNumTables));
  const ttfRangeShift = ttfNumTables * 16 - ttfSearchRange;

  const fontWriter = new BinaryWriter();
  fontWriter.writeUint32(0x00010000); // sfntVersion
  fontWriter.writeUint16(ttfNumTables);
  fontWriter.writeUint16(ttfSearchRange);
  fontWriter.writeUint16(ttfEntrySelector);
  fontWriter.writeUint16(ttfRangeShift);

  let currentTableOffset = 12 + ttfNumTables * 16;
  type TableInfo = {
    readonly tag: string;
    readonly offset: number;
    readonly length: number;
    readonly checksum: number;
    readonly paddedLength: number;
  };
  const tableInfos: TableInfo[] = [];

  for (const t of tables) {
    const checksum = calcTableChecksum(t.data);
    const paddedLength = (t.data.length + 3) & ~3;
    tableInfos.push({
      tag: t.tag,
      offset: currentTableOffset,
      length: t.data.length,
      checksum,
      paddedLength,
    });
    currentTableOffset += paddedLength;
  }

  for (const info of tableInfos) {
    fontWriter.writeString(info.tag);
    fontWriter.writeUint32(info.checksum);
    fontWriter.writeUint32(info.offset);
    fontWriter.writeUint32(info.length);
  }

  for (let i = 0; i < tables.length; i++) {
    const t = tables[i]!;
    const info = tableInfos[i]!;
    fontWriter.writeBytes(t.data);
    for (let p = 0; p < info.paddedLength - t.data.length; p++) {
      fontWriter.writeUint8(0);
    }
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

const compressDeflate = async (
  data: Uint8Array,
): Promise<Uint8Array<ArrayBuffer>> => {
  const stream = new Blob([data as Uint8Array<ArrayBuffer>]).stream()
    .pipeThrough(
      new CompressionStream("deflate"),
    );
  const response = new Response(stream);
  return new Uint8Array(await response.arrayBuffer());
};

/**
 * TrueType (SFNT) バイナリを W3C WOFF 1.0 バイナリに変換
 */
export const convertTtfToWoff = async (
  ttfBytes: Uint8Array,
): Promise<Uint8Array<ArrayBuffer>> => {
  const ttfView = new DataView(
    ttfBytes.buffer,
    ttfBytes.byteOffset,
    ttfBytes.byteLength,
  );
  const numTables = ttfView.getUint16(4, false);

  type ProcessedTable = {
    readonly tag: string;
    readonly origLength: number;
    readonly compLength: number;
    readonly origChecksum: number;
    readonly data: Uint8Array;
  };

  const processedList: ProcessedTable[] = [];

  for (let i = 0; i < numTables; i++) {
    const entryOffset = 12 + i * 16;
    let tag = "";
    for (let c = 0; c < 4; c++) {
      tag += String.fromCharCode(ttfBytes[entryOffset + c]!);
    }
    const checksum = ttfView.getUint32(entryOffset + 4, false);
    const offset = ttfView.getUint32(entryOffset + 8, false);
    const length = ttfView.getUint32(entryOffset + 12, false);

    const tableData = ttfBytes.subarray(offset, offset + length);
    const compressed = await compressDeflate(tableData);
    const useComp = compressed.length < length;
    const finalData = useComp ? compressed : tableData;

    processedList.push({
      tag,
      origLength: length,
      compLength: finalData.length,
      origChecksum: checksum,
      data: finalData,
    });
  }

  const headerSize = 44;
  const dirSize = 20 * numTables;
  let currentOffset = headerSize + dirSize;

  type PlacedTable = ProcessedTable & { readonly offset: number };
  const placedList: PlacedTable[] = [];

  for (const t of processedList) {
    placedList.push({
      ...t,
      offset: currentOffset,
    });
    // 4-byte alignment
    const paddedLength = (t.compLength + 3) & ~3;
    currentOffset += paddedLength;
  }

  const totalWoffSize = currentOffset;
  const woffBytes = new Uint8Array(new ArrayBuffer(totalWoffSize));
  const woffView = new DataView(woffBytes.buffer);

  let totalSfntSize = 12 + numTables * 16;
  for (const t of processedList) {
    totalSfntSize += (t.origLength + 3) & ~3;
  }

  // WOFF 1.0 Header (44 bytes)
  woffView.setUint32(0, 0x774F4646, false); // "wOFF"
  woffView.setUint32(4, 0x00010000, false); // flavor (TrueType)
  woffView.setUint32(8, totalWoffSize, false); // total size
  woffView.setUint16(12, numTables, false); // numTables
  woffView.setUint16(14, 0, false); // reserved
  woffView.setUint32(16, totalSfntSize, false); // totalSfntSize
  woffView.setUint16(20, 1, false); // majorVersion
  woffView.setUint16(22, 0, false); // minorVersion
  woffView.setUint32(24, 0, false); // metaOffset
  woffView.setUint32(28, 0, false); // metaLength
  woffView.setUint32(32, 0, false); // metaOrigLength
  woffView.setUint32(36, 0, false); // privOffset
  woffView.setUint32(40, 0, false); // privLength

  // Table Directory (20 bytes * numTables)
  let dirOffset = headerSize;
  for (const p of placedList) {
    for (let c = 0; c < 4; c++) {
      woffBytes[dirOffset + c] = p.tag.charCodeAt(c);
    }
    woffView.setUint32(dirOffset + 4, p.offset, false);
    woffView.setUint32(dirOffset + 8, p.compLength, false);
    woffView.setUint32(dirOffset + 12, p.origLength, false);
    woffView.setUint32(dirOffset + 16, p.origChecksum, false);
    dirOffset += 20;

    // Table Data
    woffBytes.set(p.data, p.offset);
  }

  return woffBytes;
};

export const generateFontFiles = async (): Promise<void> => {
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

  // プチコン3号独自文字に対応する標準Unicode文字のエイリアス
  // 0xE214 (時計) -> U+23F1 (⏱ STOPWATCH), U+231A (⌚ WATCH)
  patterns.push({ code: 0x23F1, hex: "00182C6E623C1800" });
  patterns.push({ code: 0x231A, hex: "00182C6E623C1800" });
  // 0xE2B1 (箱・四角形) -> U+25A0 (■ BLACK SQUARE)
  patterns.push({ code: 0x25A0, hex: "007E7E7E7E7E7E00" });

  // 重複排除とコード順ソート (cmap のために必須)
  const patternMap = new Map<number, string>();
  for (const p of patterns) {
    patternMap.set(p.code, p.hex);
  }
  const uniquePatterns = Array.from(patternMap.entries()).map((
    [code, hex],
  ) => ({
    code,
    hex,
  }));
  uniquePatterns.sort((a, b) => a.code - b.code);

  const ttfBytes = generateFontTtf(uniquePatterns);
  const woffBytes = await convertTtfToWoff(ttfBytes);

  await Deno.writeFile("./cache/font.ttf", ttfBytes);
  await Deno.writeFile("./static/font.ttf", ttfBytes);
  await Deno.writeFile("./cache/font.woff", woffBytes);
  await Deno.writeFile("./static/font.woff", woffBytes);

  console.log(
    `[generateFont] Generated font.woff (${woffBytes.length} bytes) and font.ttf (${ttfBytes.length} bytes).`,
  );
};

if (import.meta.main) {
  await generateFontFiles();
}
