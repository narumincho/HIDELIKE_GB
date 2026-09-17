// このファイルは scripts/extractMml.ts により original/HIDELIKE_GB.txt から自動生成されました。
// 手動で編集しないでください。
import * as type from "./type.ts";

/** くけいは 12.5% */
export const wave225: type.Wave = "FF00000000000000FF00000000000000";

/** くけいは 25.0% */
export const wave226: type.Wave = "FFFF000000000000FFFF000000000000";

/** くけいは 50.0% */
export const wave227: type.Wave = "FFFFFFFF00000000FFFFFFFF00000000";

/** 75.0% */
export const wave228: type.Wave = "FFFFFFFFFFFF0000FFFFFFFFFFFF0000";

/** さんかくは */
export const wave230: type.Wave = "0123456789ABCDEFFEDCBA9876543210";

/** ノコギリ波 */
export const wave232: type.Wave = "0123456789ABCDEF0123456789ABCDEF";

/** 8bit波形ドラム/パーカッション */
export const wave266: type.Wave =
  "908c6c5d6b88a2a6999194938c8d9188736f87967f5d535f728ba19e85768eb8c39e716a88a18f5f3f4861717c84827f848a8d8e836851566b7a81847e716e7a";

export const wave310: type.Wave =
  "505156616d757574706a697482898d949da4a6a4a2a2a5aaaba4989191949ca7aba192877f766f6a696b6d6d6d6f757b80858d959a9d9e988f8b8d8f8c898b8f";

/** OP / Title */
export const bgm47: type.MML = {
  tempo: 90,
  trackList: [
    {
      tone: wave227,
      pan: 94,
      volume: 70,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 64, "sustain": 64, "release": 127 },
      loop:
        "@227 @V70 P94 O5 @E127,64,64,127 @MA20,2,11,10 V100 R1 R1 R1 R1 V100 L4 G2.A#4 A2.D#4 F1&F1 A#2.<D4 C2.>F4 G1&G2.C8D8 D#2G4 F2A#8F8 G2.&G2C8D8 D#2G4 F2D4 C2.&C2. R1 R1 R1 R1",
    },
    {
      tone: wave226,
      pan: 64,
      volume: 80,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 64, "sustain": 64, "release": 127 },
      loop:
        "@226 @V80 P64 O3 @E127,64,64,127 V100 L4 CGFA# CGFA# CGFA# CGFA# V100 L4 CGFA# CGFA# CGFA# CGFA# CGFA# CGFA# CGFA# CGFA# CGF CGF CGF CGF CGF CGF CGF C2. R1 R1 R1 R1",
    },
    {
      tone: wave228,
      pan: 34,
      volume: 75,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 64, "sustain": 64, "release": 127 },
      loop:
        "@228 @V75 P34 O2 @E127,64,64,127 V100 R1 R1 R1 R1 V100 R1 R1 R1 R1 R1 R1 R1 R1 R2. R2. R2. R2. C2. C2. C2. C2. R1 R1 R1 R1",
    },
  ],
};

/** Stage 0 - 2 (BGM0) */
export const bgm43: type.MML = {
  tempo: 140,
  trackList: [
    {
      tone: wave230,
      pan: 84,
      volume: 85,
      detune: 10,
      intro: "",
      envelope: { "attack": 127, "decay": 127, "sustain": 100, "release": 127 },
      loop:
        "@V085 @230 P84 O5 @D10 @E127,127,100,127 V100 L8 R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4 A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4 V100 D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4> D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4> A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 V100 D#2A#2F#2F2 D#2<D#2C#6>B6A#6F#6F6D#6 D#2A#2F#2F2 D#2<D#2C#2D#4D#4>",
    },
    {
      tone: wave225,
      pan: 44,
      volume: 50,
      detune: 10,
      intro: "",
      envelope: { "attack": 127, "decay": 127, "sustain": 120, "release": 117 },
      loop:
        "@V050 @225 P44 O2 @D10 @E127,127,120,117 @MA127,70,10,0 V100 L16 D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR A#RRR A#RRR D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR V100 L16 D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRRCRRRCRRR>A#RRRA#RRR <D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRR>BRRRBRRR<DRRRDRRR V100 L16 D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRARRRARRR D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRR <D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR <D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR",
    },
    {
      tone: wave226,
      pan: 64,
      volume: 55,
      detune: 10,
      intro: "",
      envelope: { "attack": 127, "decay": 85, "sustain": 0, "release": 127 },
      loop:
        "@V55 @226 P64 O4 @D10 @E127,85,0,127 V100 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8 V100 <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8 <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8 <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8 <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8 V100 D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8 D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8 D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8 D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8",
    },
  ],
};

/** Stage 3 - 7 (BGM1) */
export const bgm44: type.MML = {
  tempo: 120,
  trackList: [
    {
      tone: wave228,
      pan: 64,
      volume: 80,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 127, "sustain": 127, "release": 127 },
      loop:
        "@228 T120 L4 Q8 @V80 P64 O2 @E127,127,127,127 @ML16,2,10,7 V100 F8<D#8C8>F8 A#8.F8.A#8 F8<D#8C8>F8 A#8.F8.D8 F8<D#8C8>F8 A#8.F8.A#8 F8<D#8C8>F8 A#8.F8.<D8> F8<D#8C8>F8 A#8.F8.A#8 F8<D#8C8>F8 A#8.F8.D8 F8<D#8C8>F8 A#8.F8.A#8 F8<D#8C8>F8 A#8.F8.<D8> V100 D#8<C8D#8>A#8 A#8.A#8.A#8 G#8A#8A#8F8 A#8.A#8.F8 D#8<C8D8>A#8 A#8.A#8.A#8 G#8A#8A#8F8 A#8.F8.A#8 D#8<C8D#8>A#8 A#8.A#8.A#8 G#8A#8A#8F8 A#8.A#8.F8 D#8<C8F8>A#8 A#8.A#8.A#8 G#8A#8A#8F8 A#8.F8.A#8 V100 Q4 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16 D#8D#16D#16",
    },
    {
      tone: wave266,
      pan: 64,
      volume: 80,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 127, "sustain": 127, "release": 124 },
      loop:
        "@V80 P064 @266 T120 L4 Q0 @V95 P94 O4 @E127,127,127,124 V100 R8D#8D#8D#8",
    },
  ],
};

/** Stage 8 - 12 (BGM2) */
export const bgm45: type.MML = {
  tempo: 30,
  trackList: [
    {
      tone: wave228,
      pan: 44,
      volume: 60,
      detune: 0,
      intro: "",
      envelope: { "attack": 87, "decay": 27, "sustain": 127, "release": 127 },
      loop:
        "@228 @V60P44 O4 @E87,27,127,127 V100 Q6 RF#<C#>F# G#.A.B R<C#DE F#.E.D> RF#<C#>F# G#.A.B RBAG# G#.F#.A V100 RF#<C#>F# G#.A.B R<C#DE F#.E.D> RF#<C#>F# G#.A.B RBAG# G#.F#.R V100 R1R1 R1R1 R1R1 R1R1",
    },
    {
      tone: wave225,
      pan: 64,
      volume: 70,
      detune: 0,
      intro: "",
      envelope: { "attack": 117, "decay": 27, "sustain": 117, "release": 117 },
      loop:
        "@225 @V70 P64 O2 @E117,27,117,117 V100 Q4 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D8> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16R16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> V100 Q4 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D8> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16R16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16> V100 F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8<D16D16> F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8A16A16 F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8<D16D16> F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8G#16G#16",
    },
    {
      tone: wave227,
      pan: 84,
      volume: 35,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 127, "sustain": 127, "release": 110 },
      loop:
        "@227 @V35 P84 O5 @E127,127,127,110 @MA37,2,8,0 V100 R1R1 R1R1 R1R1 R1R1 V100 RF#<C#>F# G#.A.B R<C#DE F#.E.D> RF#<C#>F# G#.A.B RBAG# V100 R1R1 R1R1 R1R1 R1R1",
    },
    {
      tone: wave266,
      pan: 34,
      volume: 90,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 124, "sustain": 0, "release": 127 },
      loop:
        "@266 @V90 P34 O4 @E127,124,0,127 @MA127,127,0,0 V127 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#16F#16F#16F#16",
    },
    {
      tone: wave310,
      pan: 94,
      volume: 55,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 107, "sustain": 60, "release": 127 },
      loop: "@310 @V55 P94 O5 @E127,107,60,127 @MA10,52,3,0 V100 RF#",
    },
  ],
};

/** Stage 13 - 18 (BGM3) */
export const bgm46: type.MML = {
  tempo: 150,
  trackList: [
    {
      tone: wave228,
      pan: 44,
      volume: 65,
      detune: 0,
      intro: "R1",
      envelope: { "attack": 87, "decay": 27, "sustain": 127, "release": 127 },
      loop:
        "@228 @V65 P44 O4 @E87,27,127,127 V100 Q6 RF#<C#>F# G#.A.B R<C#DE F#.E.D RF#<C#>F# G#.A.B RBAG# G#.F#.A V100 RF#<C#>F# G#.A.B R<C#DE F#.E.D> RF#<C#>F# G#.A.B RBAG# G#.F#.R V100 R1R1 R1R1 R1R1 R1R1",
    },
    {
      tone: wave225,
      pan: 64,
      volume: 75,
      detune: 0,
      intro: "R1",
      envelope: { "attack": 117, "decay": 27, "sustain": 117, "release": 117 },
      loop:
        "@225 @V75 P64 O2 @E117,27,117,117 V100 Q4 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#9<E16E16 >F#8<D16D16 >F#8<D8> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16R16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> V100 Q4 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D8> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16R16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 >F#8<E16E16 >F#8<E16E16 >F#8<D16D16 >F#8<D16D16> V100 F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8<D16D16> F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8A16A16 F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8<D16D16> F#8<C#16C#16 >F#8B16B16 F#8A16A16 F#8G#16G#16 F#8A16A16 F#8B16B16 F#8<C#16C#16 >F#8G#16G#16",
    },
    {
      tone: wave227,
      pan: 84,
      volume: 40,
      detune: 0,
      intro: "R1",
      envelope: { "attack": 127, "decay": 127, "sustain": 127, "release": 110 },
      loop:
        "@227 @V40 P84 O5 @E127,127,127,110 @MA37,2,8,0 V100 R1R1 R1R1 R1R1 R1R1 V100 RF#<C#>F# G#.A.B R<C#DE F#.E.D> RF#<C#>F# G#.A.B RBAG G#.F#.R V100 R1R1 R1R1 R1R1 R1R1",
    },
    {
      tone: wave266,
      pan: 34,
      volume: 90,
      detune: 0,
      intro:
        "@266 @V90 P34 O4 @E127,124,0,127 @MA127,127,0,0 V100 L4 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16 F#16",
      envelope: { "attack": 127, "decay": 124, "sustain": 0, "release": 127 },
      loop:
        "V127 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#8F#16F#16 F#16F#16F#16F#16",
    },
    {
      tone: wave310,
      pan: 94,
      volume: 70,
      detune: 0,
      intro:
        "@310 @V70 P94 O5 @E127,107,60,127 @MA10,52,3,0 V90 L4 F#8R8 F#8R8 F#8R8 F#16F#16F#16F#16",
      envelope: { "attack": 127, "decay": 107, "sustain": 60, "release": 127 },
      loop: "V100 RF#",
    },
  ],
};

/** Ending (BGM_ED) */
export const bgm48: type.MML = {
  tempo: 70,
  trackList: [
    {
      tone: wave227,
      pan: 94,
      volume: 70,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 94, "sustain": 4, "release": 90 },
      loop:
        "@227 @V70 P94 O4 Q4 @E127,94,4,90 V100 T70 R1 R1 R1 R1 V100 L4 G2.A#4 A2.D#4 F1&F1 A#2.<D4 C2.>F4 G1&G2.C8D8 D#2G4 F2A#8F8 G2.&G2C8D8 T65 D#2G4 T60 F2D4 T55C2 T50 C12 T45 F12 T40 G12 T30 <C2.",
    },
    {
      tone: wave226,
      pan: 64,
      volume: 60,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 64, "sustain": 4, "release": 90 },
      loop:
        "@226 @V60 P64 O5 Q1 @E127,64,4,90 V100 L4 CGFA# CGFD CGFA# CGFD V100 L4 CGFA# CGFD CGFA# CGFA# CGFA# CGFA# CGFA# CGFA# CGF CGF CGF CGF > CGF CGF CGF <C2.&C2.",
    },
    {
      tone: wave228,
      pan: 34,
      volume: 70,
      detune: 0,
      intro: "",
      envelope: { "attack": 127, "decay": 64, "sustain": 4, "release": 90 },
      loop:
        "@228 @V70 P34 O2 Q2 @E127,64,4,90 V100 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4 V100 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4R4C8D8 D#2G4 F2A#8F8 G2.&G2C8D8 D#2G4 F2D4 C2C12F12G12 <C2.",
    },
  ],
};

export const seBullet: type.Track = {
  tone: wave310,
  pan: 64,
  volume: 100,
  detune: 0,
  intro: "",
  envelope: { "attack": 127, "decay": 100, "sustain": 80, "release": 127 },
  loop: "@310 T120 L4 Q8 @V100 V100 P64 O5 B32D",
};

export const seBulletClear: type.Track = {
  tone: wave310,
  pan: 64,
  volume: 120,
  detune: 0,
  intro: "",
  envelope: { "attack": 20, "decay": 127, "sustain": 127, "release": 107 },
  loop: "@310 T220 L8 Q8 @V120 V120 P64 O5 @E20,127,127,107 C",
};

export const seBulletCannot: type.Track = {
  tone: wave228,
  pan: 64,
  volume: 77,
  detune: -108,
  intro: "",
  envelope: { "attack": 127, "decay": 117, "sustain": 0, "release": 127 },
  loop: "@228 @V77 P64 O4 @D-108 @E127,117,0,127 @MP127,5,100,0 B16B16",
};

export const seMapChangeL: type.Track = {
  tone: wave227,
  pan: 64,
  volume: 100,
  detune: 0,
  intro: "",
  envelope: { "attack": 127, "decay": 100, "sustain": 80, "release": 127 },
  loop: "@227 T140 L4 Q2 @V100 V90 P64 O4C32<C32",
};

export const seMapChangeR: type.Track = {
  tone: wave227,
  pan: 64,
  volume: 100,
  detune: 0,
  intro: "",
  envelope: { "attack": 127, "decay": 100, "sustain": 80, "release": 127 },
  loop: "@227 T140 L4 Q2 @V100 V90 P64 O5C32<C32",
};

export const seFound: type.Track = {
  tone: wave228,
  pan: 64,
  volume: 100,
  detune: 0,
  intro: "",
  envelope: { "attack": 127, "decay": 127, "sustain": 127, "release": 127 },
  loop:
    "@228 T120 L4 Q8 @V100 V60 P64 O5 @E127,127,127,127 @MA127,112,107,1 F32A#32<D#",
};

export const seMapChangeLast: type.Track = {
  tone: wave227,
  pan: 64,
  volume: 100,
  detune: 0,
  intro: "",
  envelope: { "attack": 127, "decay": 100, "sustain": 80, "release": 127 },
  loop: "@227 T70 L4 Q2 @V100 V90 P64 O5C32R8<C32",
};
