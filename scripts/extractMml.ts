/**
 * original/HIDELIKE_GB.txt から BGM および SE の完全な MML データを抽出・マクロ展開・ループ展開し、
 * src/mml/soundData.ts を自動生成するスクリプト
 */

const text = await Deno.readTextFile("./original/HIDELIKE_GB.txt");

/**
 * ループ構文 `[ ... ]n` を展開する
 */
function expandLoops(mml: string): string {
  let result = mml;
  const loopRegex = /\[([^\[\]]+)\](\d*)/;
  let match;
  let safety = 0;
  while ((match = loopRegex.exec(result)) !== null && safety++ < 100) {
    const inner = match[1]!;
    const countStr = match[2];
    const count = countStr && countStr.length > 0 ? parseInt(countStr, 10) : 2;
    const expanded = (" " + inner + " ").repeat(count);
    result = result.slice(0, match.index) + expanded +
      result.slice(match.index + match[0].length);
  }
  return result;
}

/**
 * マクロ `{NAME}` を展開する
 */
function expandMacros(mml: string, macros: { [k: string]: string }): string {
  let result = mml;
  let changed = true;
  let depth = 0;
  while (changed && depth < 20) {
    changed = false;
    depth++;
    for (const [mName, mVal] of Object.entries(macros)) {
      const pattern = new RegExp(`\\{${mName}\\}`, "g");
      if (pattern.test(result)) {
        result = result.replace(pattern, " " + mVal + " ");
        changed = true;
      }
    }
  }
  return result;
}

export type ExtractedTrack = {
  tone: string;
  toneNumber: number;
  pan: number;
  volume: number;
  octave: number;
  detune: number;
  envelope: { attack: number; decay: number; sustain: number; release: number };
  intro: string;
  loop: string;
};

export type ExtractedBgm = {
  tempo: number;
  trackList: ReadonlyArray<ExtractedTrack>;
};

export function extractAllAudio(): {
  bgms: { [label: string]: ExtractedBgm };
  ses: { [name: string]: { tempo: number; track: ExtractedTrack } };
} {
  const bgmRegex =
    /@(BGM\d+)\s*'?[^\n]*\n([\s\S]*?)(?=\n\s*@BGM\d+|\n\s*@\w+|\n\s*DATA\s+0)/g;
  const bgms: { [label: string]: ExtractedBgm } = {};

  let match;
  while ((match = bgmRegex.exec(text)) !== null) {
    const label = match[1]!;
    const block = match[2]!;

    let tempo = 120;
    const macros: { [k: string]: string } = {};
    const trackOrder: number[] = [];
    const trackIntros: { [k: number]: string } = {};
    const trackLoops: { [k: number]: string } = {};

    let currentMacro: string | null = null;
    let currentTrack: number | null = null;
    let inLoop = false;

    const lines = block.split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith("'")) continue;
      const m = line.match(/^DATA\s*"(.*)/i);
      if (!m) continue;
      let content = m[1]!;

      // テンポ
      const tm = content.match(/^T(\d+)/i);
      if (tm) {
        tempo = parseInt(tm[1]!, 10);
      }

      // マクロ定義開始: {NAME= ...
      const macroMatch = content.match(/^\{([A-Z0-9_]+)=(.*)/i);
      if (macroMatch) {
        currentMacro = macroMatch[1]!;
        content = macroMatch[2]!;
        macros[currentMacro] = "";
      }

      // トラック開始: :1[ や :1R1[ や :1
      const trackStartMatch = content.match(/^:(\d+)(.*)/);
      if (trackStartMatch) {
        currentTrack = parseInt(trackStartMatch[1]!, 10);
        if (!trackOrder.includes(currentTrack)) {
          trackOrder.push(currentTrack);
        }
        trackIntros[currentTrack] = "";
        trackLoops[currentTrack] = "";
        inLoop = false;
        content = trackStartMatch[2]!;
      }

      // マクロ追記
      if (currentMacro) {
        if (content.includes("}")) {
          const parts = content.split("}");
          macros[currentMacro] += " " + parts[0];
          currentMacro = null;
        } else {
          macros[currentMacro] += " " + content;
        }
        continue;
      }

      // トラック追記
      if (currentTrack !== null) {
        if (!inLoop) {
          if (content.includes("[")) {
            const parts = content.split("[");
            trackIntros[currentTrack] += " " + parts[0];
            inLoop = true;
            content = parts.slice(1).join("[");
          } else {
            trackIntros[currentTrack] += " " + content;
          }
        }
        if (inLoop) {
          if (content.includes("]")) {
            const parts = content.split("]");
            trackLoops[currentTrack] += " " + parts[0];
            currentTrack = null;
            inLoop = false;
          } else {
            trackLoops[currentTrack] += " " + content;
          }
        }
      }
    }

    const trackList: ExtractedTrack[] = [];
    for (const tNum of trackOrder) {
      const rawIntro = trackIntros[tNum] || "";
      const rawLoop = trackLoops[tNum] || "";

      let effectiveIntro = rawIntro;
      let effectiveLoop = rawLoop;
      if (!rawLoop.trim()) {
        effectiveLoop = rawIntro;
        effectiveIntro = "";
      }

      const expandedIntro = expandLoops(expandMacros(effectiveIntro, macros));
      const expandedLoop = expandLoops(expandMacros(effectiveLoop, macros));
      const combined = (expandedIntro + " " + expandedLoop).trim();

      // ダミートラック（R1のみ等）は除外
      if (combined.replace(/\s+/g, "").match(/^V\d+R\d+$/i)) {
        continue;
      }

      const toneMatch = combined.match(/@(\d{3})/);
      const toneNumber = toneMatch ? parseInt(toneMatch[1]!, 10) : 227;

      const panMatch = combined.match(/P(\d+)/i);
      const pan = panMatch ? parseInt(panMatch[1]!, 10) : 64;

      const volMatch = combined.match(/@V(\d+)/i);
      const volume = volMatch ? parseInt(volMatch[1]!, 10) : 80;

      const octMatch = combined.match(/O(\d+)/i);
      const octave = octMatch ? parseInt(octMatch[1]!, 10) : 4;

      const detMatch = combined.match(/@D([+-]?\d+)/i);
      const detune = detMatch ? parseInt(detMatch[1]!, 10) : 0;

      const envMatch = combined.match(/@E(\d+),(\d+),(\d+),(\d+)/i);
      const envelope = envMatch
        ? {
          attack: parseInt(envMatch[1]!, 10),
          decay: parseInt(envMatch[2]!, 10),
          sustain: parseInt(envMatch[3]!, 10),
          release: parseInt(envMatch[4]!, 10),
        }
        : { attack: 127, decay: 100, sustain: 80, release: 127 };

      trackList.push({
        tone: `wave${toneNumber}`,
        toneNumber,
        pan,
        volume,
        octave,
        detune,
        envelope,
        intro: expandedIntro.replace(/\s+/g, " ").trim(),
        loop: expandedLoop.replace(/\s+/g, " ").trim(),
      });
    }

    bgms[label] = { tempo, trackList };
  }

  // SE 抽出
  const ses: { [name: string]: { tempo: number; track: ExtractedTrack } } = {};
  const seDefs = [
    { name: "seBullet", pattern: /BGMSET\s+PLAYER_BULLET\s*,\s*"([^"\n]+)/ },
    {
      name: "seBulletClear",
      pattern: /BGMSET\s+PLAYER_BULLET_CLEAR\s*,\s*"([^"\n]+)/,
    },
    {
      name: "seBulletCannot",
      pattern: /BGMSET\s+PLAYER_BULLET_CANNOT\s*,\s*"([^"\n]+)/,
    },
    { name: "seMapChangeL", pattern: /BGMSET\s+MAPCHANGE_L\s*,\s*"([^"\n]+)/ },
    { name: "seMapChangeR", pattern: /BGMSET\s+MAPCHANGE_R\s*,\s*"([^"\n]+)/ },
    { name: "seFound", pattern: /BGMSET\s+FOUND\s*,\s*"([^"\n]+)/ },
    {
      name: "seMapChangeLast",
      pattern: /BGMSET\s+MAPCHANGE_LAST\s*,\s*"([^"\n]+)/,
    },
  ];

  for (const se of seDefs) {
    const m = text.match(se.pattern);
    if (!m) continue;
    const raw = m[1]!.trim();

    const tm = raw.match(/T(\d+)/i);
    const tempo = tm ? parseInt(tm[1]!, 10) : 120;

    const toneMatch = raw.match(/@(\d{3})/);
    const toneNumber = toneMatch ? parseInt(toneMatch[1]!, 10) : 227;

    const panMatch = raw.match(/P(\d+)/i);
    const pan = panMatch ? parseInt(panMatch[1]!, 10) : 64;

    const volMatch = raw.match(/@V(\d+)/i);
    const volume = volMatch ? parseInt(volMatch[1]!, 10) : 100;

    const octMatch = raw.match(/O(\d+)/i);
    const octave = octMatch ? parseInt(octMatch[1]!, 10) : 4;

    const detMatch = raw.match(/@D([+-]?\d+)/i);
    const detune = detMatch ? parseInt(detMatch[1]!, 10) : 0;

    const envMatch = raw.match(/@E(\d+),(\d+),(\d+),(\d+)/i);
    const envelope = envMatch
      ? {
        attack: parseInt(envMatch[1]!, 10),
        decay: parseInt(envMatch[2]!, 10),
        sustain: parseInt(envMatch[3]!, 10),
        release: parseInt(envMatch[4]!, 10),
      }
      : { attack: 127, decay: 100, sustain: 80, release: 127 };

    ses[se.name] = {
      tempo,
      track: {
        tone: `wave${toneNumber}`,
        toneNumber,
        pan,
        volume,
        octave,
        detune,
        envelope,
        intro: "",
        loop: raw,
      },
    };
  }

  return { bgms, ses };
}

/**
 * soundData.ts を自動生成する
 */
export async function generateSoundDataTs(): Promise<void> {
  const { bgms, ses } = extractAllAudio();

  const code: string[] = [
    `// このファイルは scripts/extractMml.ts により original/HIDELIKE_GB.txt から自動生成されました。`,
    `// 手動で編集しないでください。`,
    `import * as type from "./type.ts";`,
    ``,
    `/** くけいは 12.5% */`,
    `export const wave225: type.Wave = "FF00000000000000FF00000000000000";`,
    ``,
    `/** くけいは 25.0% */`,
    `export const wave226: type.Wave = "FFFF000000000000FFFF000000000000";`,
    ``,
    `/** くけいは 50.0% */`,
    `export const wave227: type.Wave = "FFFFFFFF00000000FFFFFFFF00000000";`,
    ``,
    `/** 75.0% */`,
    `export const wave228: type.Wave = "FFFFFFFFFFFF0000FFFFFFFFFFFF0000";`,
    ``,
    `/** さんかくは */`,
    `export const wave230: type.Wave = "0123456789ABCDEFFEDCBA9876543210";`,
    ``,
    `/** ノコギリ波 */`,
    `export const wave232: type.Wave = "0123456789ABCDEF0123456789ABCDEF";`,
    ``,
    `/** 8bit波形ドラム/パーカッション */`,
    `export const wave266: type.Wave =`,
    `  "908c6c5d6b88a2a6999194938c8d9188736f87967f5d535f728ba19e85768eb8c39e716a88a18f5f3f4861717c84827f848a8d8e836851566b7a81847e716e7a";`,
    ``,
    `export const wave310: type.Wave =`,
    `  "505156616d757574706a697482898d949da4a6a4a2a2a5aaaba4989191949ca7aba192877f766f6a696b6d6d6d6f757b80858d959a9d9e988f8b8d8f8c898b8f";`,
    ``,
  ];

  // BGM 定義出力
  // @BGM47 -> bgm47, @BGM43 -> bgm43, ...
  const bgmOrder = [
    { key: "bgm47", label: "BGM47", desc: "OP / Title" },
    { key: "bgm43", label: "BGM43", desc: "Stage 0 - 2 (BGM0)" },
    { key: "bgm44", label: "BGM44", desc: "Stage 3 - 7 (BGM1)" },
    { key: "bgm45", label: "BGM45", desc: "Stage 8 - 12 (BGM2)" },
    { key: "bgm46", label: "BGM46", desc: "Stage 13 - 18 (BGM3)" },
    { key: "bgm48", label: "BGM48", desc: "Ending (BGM_ED)" },
  ];

  for (const b of bgmOrder) {
    const info = bgms[b.label];
    if (!info) continue;
    code.push(`/** ${b.desc} */`);
    code.push(`export const ${b.key}: type.MML = {`);
    code.push(`  tempo: ${info.tempo},`);
    code.push(`  trackList: [`);
    for (const trk of info.trackList) {
      code.push(`    {`);
      code.push(`      tone: ${trk.tone},`);
      code.push(`      pan: ${trk.pan},`);
      code.push(`      volume: ${trk.volume},`);
      code.push(`      detune: ${trk.detune},`);
      code.push(`      intro: ${JSON.stringify(trk.intro)},`);
      code.push(`      envelope: ${JSON.stringify(trk.envelope)},`);
      code.push(`      loop: ${JSON.stringify(trk.loop)},`);
      code.push(`    },`);
    }
    code.push(`  ],`);
    code.push(`};`);
    code.push(``);
  }

  // SE 定義出力
  for (const [seKey, seData] of Object.entries(ses)) {
    code.push(`export const ${seKey}: type.Track = {`);
    code.push(`  tone: ${seData.track.tone},`);
    code.push(`  pan: ${seData.track.pan},`);
    code.push(`  volume: ${seData.track.volume},`);
    code.push(`  detune: ${seData.track.detune},`);
    code.push(`  intro: "",`);
    code.push(`  envelope: ${JSON.stringify(seData.track.envelope)},`);
    code.push(`  loop: ${JSON.stringify(seData.track.loop)},`);
    code.push(`};`);
    code.push(``);
  }

  await Deno.writeTextFile("./src/mml/soundData.ts", code.join("\n"));
  const cmd = new Deno.Command("deno", {
    args: ["fmt", "./src/mml/soundData.ts"],
  });
  await cmd.output();
  console.log("[extractMml] Generated src/mml/soundData.ts successfully.");
}

if (import.meta.main) {
  await generateSoundDataTs();
}
