import * as type from "./type";

/**
 * くけいは 12.5%
 */
const wave225: type.Wave = "FF00000000000000FF00000000000000";

/**
 * くけいは 25.0%
 */
const wave226: type.Wave = "FFFF000000000000FFFF000000000000";

/**
 * くけいは 50.0%
 */
const wave227: type.Wave = "FFFFFFFF00000000FFFFFFFF00000000";

/**
 * 75.0% ( 25.0%と おなじおと )
 */
const wave228: type.Wave = "FFFFFFFFFFFF0000FFFFFFFFFFFF0000";

/**
 * さんかくは(Cトラック) その2
 */
const wave230: type.Wave = "0123456789ABCDEFFEDCBA9876543210";

const wave266: type.Wave =
  "908c6c5d6b88a2a6999194938c8d9188736f87967f5d535f728ba19e85768eb8c39e716a88a18f5f3f4861717c84827f848a8d8e836851566b7a81847e716e7a";

const wave310: type.Wave =
  "505156616d757574706a697482898d949da4a6a4a2a2a5aaaba4989191949ca7aba192877f766f6a696b6d6d6d6f757b80858d959a9d9e988f8b8d8f8c898b8f";

export const bgm43: type.MML = (() => {
  const c0 = `V100
    D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
    D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
    D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
    D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8`;

  const c1 = `V100
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8F8A#8
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8F8A#8`;

  const c2 = `V100
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8`;

  return {
    tempo: 140,
    trackList: [
      {
        tone: wave230,
        pan: 84,
        detune: 10,
        intro: "",
        envelope: {
          attack: 127,
          decay: 127,
          sustain: 100,
          release: 127,
        },
        loop: `O5 V100
                R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4
                A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4

                D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
                D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
                A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8
                A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8

                D#2A#2F#2F2 D#2<D#2C#6>B6A#6F#6F6D#6
                D#2A#2F#2F2 D#2<D#2C#2D#4D#4>`,
      },
      {
        tone: wave225,
        pan: 44,
        detune: 10,
        envelope: {
          attack: 127,
          decay: 127,
          sustain: 120,
          release: 117,
        },
        intro: "",
        loop: `O2 @MA127,70,10,0
                D#RRR D#RRR FRRR FRRR F#RRR F#RRR G#RRR G#RRR
                D#RRR D#RRR FRRR FRRR F#RRR F#RRR A#RRR A#RRR
                D#RRR D#RRR FRRR FRRR F#RRR F#RRR G#RRR G#RRR
                D#RRR D#RRR FRRR FRRR F#RRR F#RRR G#RRR G#RRR

                 D#RRR D#RRR C#RRR C#RRR > BRRRBRRR A#RRRA#RRR
                <D#RRR D#RRR C#RRR C#RRR   CRRRCRRR>A#RRRA#RRR
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
        envelope: {
          attack: 127,
          decay: 85,
          sustain: 0,
          release: 127,
        },
        intro: "",
        loop: `O4${c0}${c1}${c2}`,
      },
    ],
  };
})();

export const bgm44: type.MML = (() => {
  const a0 = `V100
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.D8
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.<D8>
    
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.D8
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.<D8>`;

  const a1 = `V100
    D#8<C8D#8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.A#8.F8
    D#8<C8D8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.F8.A#8
     
    D#8<C8D#8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.A#8.F8
    D#8<C8F8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.F8.A#8`;

  const a2 = `V100 Q4
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16
    D#8D#16D#16`;

  return {
    tempo: 120,
    trackList: [
      {
        tone: wave228,
        pan: 64,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 127,
          sustain: 127,
          release: 127,
        },
        intro: "",
        loop: `V80 Q8 O2 @ML16,2,10,7 ${a0}${a1}${a2}`,
      },
      {
        tone: wave266,
        intro: "",
        detune: 0,
        envelope: {
          attack: 127,
          decay: 127,
          sustain: 127,
          release: 124,
        },
        pan: 94,
        loop: `Q0 V100 R8D#8D#8D#8`,
      },
    ],
  };
})();

export const bgm45: type.MML = (() => {
  const a0 = `V100 Q6
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.A`;

  const a1 = `V100
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.R`;

  const a2 = `V100
    R1R1 R1R1 R1R1 R1R1`;

  const b0 = `V100 Q4
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>`;

  const b1 = `V100 Q4
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16>`;

  const b2 = `V100
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16`;

  const c0 = `V100
    R1R1 R1R1 R1R1 R1R1`;

  const c1 = `V100
    RF#<C#>F# G#.A.B
    R<C#DE    F#.E.D>
    RF#<C#>F# G#.A.B
    RBAG#
    `;

  const c2 = `V100 R1R1 R1R1 R1R1 R1R1`;

  const d00 = `V127 L16
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#F#F#F#`;

  const d10 = `V100 RF#`;

  return {
    tempo: 30,
    trackList: [
      {
        tone: wave228,
        pan: 44,
        detune: 0,
        envelope: {
          attack: 87,
          decay: 27,
          sustain: 127,
          release: 127,
        },
        intro: "",
        loop: `V60 ${a0}${a1}${a2}`,
      },
      {
        tone: wave225,
        pan: 64,
        detune: 0,
        envelope: {
          attack: 117,
          decay: 27,
          sustain: 117,
          release: 117,
        },
        intro: "",
        loop: `V70 O2 ${b0}${b1}${b2}`,
      },
      {
        tone: wave227,
        pan: 84,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 127,
          sustain: 127,
          release: 110,
        },
        intro: "",
        loop: `V35 O5 @MA37,2,8,0 ${c0}${c1}${c2}`,
      },
      {
        tone: wave266,
        pan: 34,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 124,
          sustain: 0,
          release: 127,
        },
        intro: "",
        loop: `V90 @MA127,127,0,0 ${d00}`,
      },
      {
        tone: wave310,
        pan: 94,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 107,
          sustain: 60,
          release: 127,
        },
        intro: "",
        loop: `V55 O5 MA10,52,3,0 ${d10}`,
      },
    ],
  };
})();

export const bgm46: type.MML = (() => {
  const a0 = `V100 Q6
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.A`;

  const a1 = `V100
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.R`;

  const a2 = `V100
    R1R1 R1R1 R1R1 R1R1`;

  const b0 = `
    V100 Q4
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#9<E16E16  >F#8<D16D16 >F#8<D8>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
    `;
  const b1 = `
    V100 Q4
F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
    >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
    >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
    >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16
    >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>`;

  const b2 = `V100
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16`;

  const c0 = `V100 R1R1 R1R1 R1R1 R1R1`;
  const c1 = `
    V100
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG       G#.F#.R`;
  const c2 = `V100 R1R1 R1R1 R1R1 R1R1`;

  const d0i = `V100 L16 F# F# F# F# F# F# F# F# F# F# F# F# F# F# F# F#`;
  const d1i = `V90 L4 F#8R8 F#8R8 F#8R8 F#16F#16F#16F#16`;
  const d00 = `V127 L16
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F#
    F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#8F#F# F#F#F#F#`;

  return {
    tempo: 150,
    trackList: [
      {
        tone: wave228,
        pan: 44,
        detune: 0,
        envelope: {
          attack: 87,
          decay: 27,
          sustain: 127,
          release: 127,
        },
        intro: "",
        loop: `V65 ${a0}${a1}${a2}`,
      },
      {
        tone: wave225,
        pan: 64,
        detune: 0,
        envelope: {
          attack: 117,
          decay: 27,
          sustain: 117,
          release: 117,
        },
        intro: "",
        loop: `V75 O2 ${b0}${b1}${b2}`,
      },
      {
        tone: wave227,
        pan: 84,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 127,
          sustain: 127,
          release: 110,
        },
        intro: "",
        loop: `V40 O5 @MA37,2,8,0${c0}${c1}${c2}`,
      },
      {
        tone: wave266,
        pan: 34,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 124,
          sustain: 0,
          release: 127,
        },
        intro: `V90 O4 @MA127,127,0,0 ${d0i}`,
        loop: d00,
      },
      {
        tone: wave310,
        pan: 94,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 107,
          sustain: 60,
          release: 127,
        },
        intro: `V70 O5 @MA10,52,3,0 ${d1i}`,
        loop: `V100 RF#`,
      },
    ],
  };
})();

export const bgm47: type.MML = (() => {
  const a0 = `V100 R1 R1 R1 R1`;

  const a1 = `V100 L4
    G2.A#4  A2.D#4 F1&F1
    A#2.<D4 C2.>F4 G1&G2.C8D8
    D#2G4 F2A#8F8 G2.&G2C8D8
    D#2G4 F2D4 C2.&C2.`;

  const b0 = `V100 L4 CGFA# CGFA# CGFA# CGFA#`;
  const b1 = `V100 L4
    CGFA# CGFA# CGFA# CGFA#
    CGFA# CGFA# CGFA# CGFA#
    CGF CGF CGF CGF
    CGF CGF CGF C2.`;
  const c0 = `V100 R1 R1 R1 R1`;
  const c1 = `V100
    R1 R1 R1 R1
    R1 R1 R1 R1 
    R2. R2. R2. R2.
    C2. C2. C2. C2.`;
  const rest = `R1 R1 R1 R1`;

  return {
    tempo: 90,
    trackList: [
      {
        tone: wave227,
        pan: 94,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 64,
          sustain: 64,
          release: 127,
        },
        intro: "",
        loop: `V70 O5 @MA20,2,11,10 ${a0}${a1}${rest}`,
      },
      {
        tone: wave226,
        pan: 64,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 64,
          sustain: 64,
          release: 127,
        },
        intro: "",
        loop: `V80 O3 ${b0}${b1}${rest}`,
      },
      {
        tone: wave228,
        pan: 34,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 64,
          sustain: 64,
          release: 127,
        },
        intro: "",
        loop: `V75 O2 ${c0}${c1}${rest}`,
      },
    ],
  };
})();

export const bgm48: type.MML = (() => {
  const a0 = ` V100 T70 R1 R1 R1 R1`;

  const a1 = `V100 L4
    G2.A#4  A2.D#4 F1&F1
    A#2.<D4 C2.>F4 G1&G2.C8D8
    D#2G4 F2A#8F8 G2.&G2C8D8
    T65 D#2G4  T60 F2D4  T55C2 
    T50 C12  T45 F12  T40 G12  T30 <C2.`;

  const b0 = `V100 L4 CGFA# CGFD CGFA# CGFD`;
  const b1 = `V100 L4
    CGFA# CGFD CGFA# CGFA#
    CGFA# CGFA# CGFA# CGFA#
    CGF CGF CGF CGF
    > CGF CGF CGF <C2.&C2.`;

  const c0 = `V100 C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4`;

  const c1 = `V100
    C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4C4R4
    C4R4C4R4 C4R4C4R4 C4R4C4R4 C4R4R4C8D8
    D#2G4 F2A#8F8 G2.&G2C8D8
    D#2G4 F2D4 C2C12F12G12 <C2.`;

  return {
    tempo: 70,
    trackList: [
      {
        tone: wave227,
        pan: 94,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 94,
          sustain: 4,
          release: 90,
        },
        intro: `V70 Q4 ${a0}${a1}`,
        loop: "",
      },
      {
        tone: wave226,
        pan: 64,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 64,
          sustain: 4,
          release: 90,
        },
        intro: `V60 O5 Q1 ${b0}${b1}`,
        loop: "",
      },
      {
        tone: wave228,
        pan: 34,
        intro: ``,
        detune: 0,
        envelope: {
          attack: 127,
          decay: 64,
          sustain: 4,
          release: 90,
        },
        loop: `V70 O2 Q2 ${c0}${c1}`,
      },
    ],
  };
})();

export const MAPCHANGE_R: type.MML = {
  tempo: 140,
  trackList: [
    {
      tone: wave227,
      pan: 64,
      intro: "O5C32<C32",
      detune: 0,
      envelope: {
        attack: 127,
        decay: 64,
        sustain: 4,
        release: 90,
      },
      loop: "",
    },
  ],
};
