import * as type from "./type.ts";

/** くけいは 12.5% */
export const wave225: type.Wave = "FF00000000000000FF00000000000000";

/** くけいは 25.0% */
export const wave226: type.Wave = "FFFF000000000000FFFF000000000000";

/** くけいは 50.0% */
export const wave227: type.Wave = "FFFFFFFF00000000FFFFFFFF00000000";

/** 75.0% ( 25.0%と おなじおと ) */
export const wave228: type.Wave = "FFFFFFFFFFFF0000FFFFFFFFFFFF0000";

/** さんかくは(Cトラック) その2 */
export const wave230: type.Wave = "0123456789ABCDEFFEDCBA9876543210";

/** ノコギリ波 */
export const wave232: type.Wave = "0123456789ABCDEF0123456789ABCDEF";

/** 8bit波形 */
export const wave266: type.Wave =
  "908c6c5d6b88a2a6999194938c8d9188736f87967f5d535f728ba19e85768eb8c39e716a88a18f5f3f4861717c84827f848a8d8e836851566b7a81847e716e7a";

export const wave310: type.Wave =
  "505156616d757574706a697482898d949da4a6a4a2a2a5aaaba4989191949ca7aba192877f766f6a696b6d6d6d6f757b80858d959a9d9e988f8b8d8f8c898b8f";

/** BGM47 (OP / Title) */
export const bgm47: type.MML = {
  tempo: 90,
  trackList: [
    {
      tone: wave227,
      pan: 64,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 100, sustain: 80, release: 127 },
      loop: `O4 V100
        R1 R1 R1 R1
        A#2.<D4 C2.>F4 G1&G2.C8D8
        D#2G4 F2A#8F8 G2.&G2C8D8
        D#2G4 F2D4 C2 C12F12G12 <C2.
      `,
    },
    {
      tone: wave226,
      pan: 44,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 80, sustain: 60, release: 127 },
      loop: `O5 V90
        [C4R4C4R4]4
        [C4R4C4R4]3 C4R4R4C8D8
        D#2G4 F2A#8F8 G2.&G2C8D8
        D#2G4 F2D4 C2 C12F12G12 <C2.
      `,
    },
    {
      tone: wave225,
      pan: 84,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 80, sustain: 90, release: 110 },
      loop: `O3 V90
        [CGFA# CGFD]2
        CGFA# CGFD CGFA# CGFA#
        [CGFA#]4
        [CGF]4
      `,
    },
  ],
};

/** BGM43 (Stage 0 - 2) */
export const bgm43: type.MML = {
  tempo: 140,
  trackList: [
    {
      tone: wave230,
      pan: 84,
      detune: 10,
      intro: "",
      envelope: { attack: 127, decay: 127, sustain: 100, release: 127 },
      loop: `O5 V100
        R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4
        A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4

        D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
        D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
        A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8
        A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8

        D#2A#2F#2F2 D#2<D#2C#6>B6A#6F#6F6D#6
        D#2A#2F#2F2 D#2<D#2C#2D#4D#4>
      `,
    },
    {
      tone: wave225,
      pan: 44,
      detune: 10,
      intro: "",
      envelope: { attack: 127, decay: 127, sustain: 120, release: 117 },
      loop: `O3 V90
        D#RRR D#RRR FRRR FRRR F#RRR F#RRR G#RRR G#RRR
        D#RRR D#RRR FRRR FRRR F#RRR F#RRR A#RRR A#RRR
        D#RRR D#RRR FRRR FRRR F#RRR F#RRR G#RRR G#RRR
        D#RRR D#RRR FRRR FRRR F#RRR F#RRR G#RRR G#RRR

        D#RRR D#RRR C#RRR C#RRR > BRRRBRRR A#RRRA#RRR
        <D#RRR D#RRR C#RRR C#RRR CRRRCRRR>A#RRRA#RRR
        <D#RRR D#RRR C#RRR C#RRR > BRRRBRRR A#RRRA#RRR
        <D#RRR D#RRR C#RRR C#RRR > BRRRBRRR<D RRRD RRR

        D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRARRRARRR
        D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRR
        <D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR
        <D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR
      `,
    },
    {
      tone: wave226,
      pan: 64,
      detune: 10,
      intro: "",
      envelope: { attack: 127, decay: 85, sustain: 0, release: 127 },
      loop: `O4 V85
        D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
        D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
        D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
        D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8

        <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
        <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8
        <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
        <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8

        D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
        D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
        D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
        D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
      `,
    },
  ],
};

/** BGM44 (Stage 3 - 6) */
export const bgm44: type.MML = {
  tempo: 120,
  trackList: [
    {
      tone: wave228,
      pan: 64,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 127, sustain: 127, release: 127 },
      loop: `O3 V90
        F8<D#8C8>F8 A#8.F8.A#8
        F8<D#8C8>F8 A#8.F8.D8
        F8<D#8C8>F8 A#8.F8.A#8
        F8<D#8C8>F8 A#8.F8.<D8>
        F8<D#8C8>F8 A#8.F8.A#8
        F8<D#8C8>F8 A#8.F8.D8
        F8<D#8C8>F8 A#8.F8.A#8
        F8<D#8C8>F8 A#8.F8.<D8>

        D#8<C8D#8>A#8 A#8.A#8.A#8
        G#8A#8A#8F8 A#8.A#8.F8
        D#8<C8D8>A#8 A#8.A#8.A#8
        G#8A#8A#8F8 A#8.F8.A#8
        D#8<C8D#8>A#8 A#8.A#8.A#8
        G#8A#8A#8F8 A#8.A#8.F8
        D#8<C8F8>A#8 A#8.A#8.A#8
        G#8A#8A#8F8 A#8.F8.A#8

        D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16
      `,
    },
    {
      tone: wave226,
      pan: 84,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 100, sustain: 70, release: 110 },
      loop: `O4 V80
        R1 R1 R1 R1
        R1 R1
        D#8<D#8C8>A#8 A#8.A#8.A#8
        D#8<D#8C8>A#8 A#8.A#8.<C8>
        R1 R1 R1 R1
        R1 R1
        D#8<C8F8>A#8 A#8.A#8.A#8
        G#8A#8A#8F8 A#8.F8.A#8
      `,
    },
  ],
};

/** BGM45 (Stage 8 - 11) */
export const bgm45: type.MML = {
  tempo: 130,
  trackList: [
    {
      tone: wave228,
      pan: 44,
      detune: 0,
      intro: "",
      envelope: { attack: 87, decay: 27, sustain: 127, release: 127 },
      loop: `O4 V80
        RF#<C#>F# G#.A.B
        R<C#DE F#.E.D>
        RF#<C#>F# G#.A.B
        RBAG# G#.F#.A
        RF#<C#>F# G#.A.B
        R<C#DE F#.E.D>
        RF#<C#>F# G#.A.B
        RBAG# G#.F#.R
      `,
    },
    {
      tone: wave225,
      pan: 64,
      detune: 0,
      intro: "",
      envelope: { attack: 117, decay: 27, sustain: 117, release: 117 },
      loop: `O3 V90
        F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16
        >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D8>
        F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16
        >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16R16>
        F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16
        F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
      `,
    },
  ],
};

/** BGM46 (Stage 12 - 15) */
export const bgm46: type.MML = {
  tempo: 150,
  trackList: [
    {
      tone: wave228,
      pan: 44,
      detune: 0,
      intro: "",
      envelope: { attack: 87, decay: 27, sustain: 127, release: 127 },
      loop: `O4 V85
        RF#<C#>F# G#.A.B
        R<C#DE F#.E.D
        RF#<C#>F# G#.A.B
        RBAG# G#.F#.A
      `,
    },
    {
      tone: wave225,
      pan: 64,
      detune: 0,
      intro: "",
      envelope: { attack: 117, decay: 27, sustain: 117, release: 117 },
      loop: `O3 V95
        F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16
        >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D8>
      `,
    },
  ],
};

/** BGM48 (Ending) */
export const bgm48: type.MML = {
  tempo: 70,
  trackList: [
    {
      tone: wave227,
      pan: 94,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 94, sustain: 40, release: 90 },
      loop: `O4 V85
        R1 R1 R1 R1
        G2.A#4 A2.D#4 F1&F1
        A#2.<D4 C2.>F4 G1&G2.C8D8
        D#2G4 F2A#8F8 G2.&G2C8D8
        D#2G4 F2D4 C2
        C12 F12 G12 <C2.
      `,
    },
    {
      tone: wave226,
      pan: 64,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 64, sustain: 40, release: 90 },
      loop: `O5 V75
        CGFA# CGFD CGFA# CGFD
        CGFA# CGFD CGFA# CGFA#
        [CGFA#]4
        [CGF]4
        >[CGF]3 <C2.&C2.
      `,
    },
    {
      tone: wave228,
      pan: 34,
      detune: 0,
      intro: "",
      envelope: { attack: 127, decay: 64, sustain: 40, release: 90 },
      loop: `O3 V85
        [C4R4C4R4]4
        [C4R4C4R4]4
        [C4R4C4R4]3 C4R4R4C8D8
        D#2G4 F2A#8F8 G2.&G2C8D8
        D#2G4 F2D4 C2C12F12G12 <C2.
      `,
    },
  ],
};

/** 効果音: 発見音 (!) */
export const seFound: type.Track = {
  tone: wave228,
  pan: 64,
  detune: 0,
  envelope: { attack: 127, decay: 127, sustain: 127, release: 127 },
  intro: "",
  loop: "T120 L4 Q8 O5 V100 F32A#32<D#4",
};

/** 効果音: 箱設置 */
export const seBullet: type.Track = {
  tone: wave227,
  pan: 64,
  detune: 0,
  envelope: { attack: 127, decay: 127, sustain: 60, release: 100 },
  intro: "",
  loop: "T120 L4 Q8 O5 V100 B32D16",
};

/** 効果音: 箱消滅 */
export const seBulletClear: type.Track = {
  tone: wave227,
  pan: 64,
  detune: 0,
  envelope: { attack: 20, decay: 127, sustain: 127, release: 107 },
  intro: "",
  loop: "T220 L8 Q8 O5 V120 C16",
};

/** 効果音: マップ右移動 */
export const seMapChangeR: type.Track = {
  tone: wave227,
  pan: 64,
  detune: 0,
  envelope: { attack: 127, decay: 127, sustain: 100, release: 100 },
  intro: "",
  loop: "T140 L4 Q2 O5 V100 C32<C32",
};

/** 効果音: マップ左移動 */
export const seMapChangeL: type.Track = {
  tone: wave227,
  pan: 64,
  detune: 0,
  envelope: { attack: 127, decay: 127, sustain: 100, release: 100 },
  intro: "",
  loop: "T140 L4 Q2 O4 V100 C32<C32",
};

/** 効果音: エンディング開始音 */
export const seMapChangeLast: type.Track = {
  tone: wave227,
  pan: 64,
  detune: 0,
  envelope: { attack: 127, decay: 127, sustain: 100, release: 100 },
  intro: "",
  loop: "T70 L4 Q2 O5 V100 C32R8<C32",
};
