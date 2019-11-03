import * as sound from "./sound.js";

/**
 * くけいは 12.5%
 */
const wave225: sound.Wave = "FF00000000000000FF00000000000000";

/**
 * くけいは 25.0%
 */
const wave226: sound.Wave = "FFFF000000000000FFFF000000000000";

/**
 * くけいは 50.0%
 */
const wave227: sound.Wave = "FFFFFFFF00000000FFFFFFFF00000000";

/**
 * 75.0% ( 25.0%と おなじおと )
 */
const wave228: sound.Wave = "FFFFFFFFFFFF0000FFFFFFFFFFFF0000";

/**
 * さんかくは(Cトラック) その2
 */
const wave230: sound.Wave = "0123456789ABCDEFFEDCBA9876543210";

// TODO
const wave266: sound.Wave = "00112233445566778899AABBCCDDEEFF";

// TODO
const wave310: sound.Wave = "00112233445566778899AABBCCDDEEFF";

export const bgm43: sound.MML = (() => {
    const a0 = `
    V100 L8
    R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4
    A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4
    `;

    const b0 = `
    V100 L16
    D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR
    D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR A#RRR A#RRR
    D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR
    D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR
    `;
    const c0 = `
    V100
     D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
     D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
     D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
     D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
    `;

    const a1 = `
    V100
    D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
    D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
    A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8
    A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8
    `;

    const b1 = `
    V100 L16
    D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRRCRRRCRRR>A#RRRA#RRR
    <D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRR>BRRRBRRR<DRRRDRRR
    `;
    const c1 = `
    V100
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
    <D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8
    `;

    const a2 = `
    V100
    D#2A#2F#2F2 D#2<D#2C#6>B6A#6F#6F6D#6
    D#2A#2F#2F2 D#2<D#2C#2D#4D#4>
    `;

    const b2 = `
    V100 L16
    D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRARRRARRR
    D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRR
    <D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR
    <D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR
    `;

    const c2 = `
    V100
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
    D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
    `;

    return {
        tempo: 140,
        track: [
            {
                tone: wave230,
                intro: "",
                loop: `V085 P84 O5 @D10 @E127,127,100,127
                ${a0}
                ${a1}
                ${a2}`
            },
            {
                tone: wave225,
                intro: "",
                loop: `V050 P44 O2 @D10 @E127,127,120,117 @MA127,70,10,0
                ${b0}
                ${b1}
                ${b2}`
            },
            {
                tone: wave226,
                intro: "",
                loop: `V55 P64 O4 @D10 @E127,85,0,127
              ${c0}
              ${c1}
              ${c2}`
            }
        ]
    };
})();

export const bgm44: sound.MML = (() => {
    const a0 = `V100
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.D8
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.<D8> 
    
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.D8
    F8<D#8C8>F8 A#8.F8.A#8
    F8<D#8C8>F8 A#8.F8.<D8> `;
    const a1 = `V100
    D#8<C8D#8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.A#8.F8
    D#8<C8D8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.F8.A#8
     
    D#8<C8D#8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.A#8.F8
    D#8<C8F8>A#8 A#8.A#8.A#8
    G#8A#8A#8F8   A#8.F8.A#8
    `;

    const a2 = `V100 Q4
    [D#8D#16D#16]4
    [D#8D#16D#16]4
    [D#8D#16D#16]4
    [D#8D#16D#16]4
    `;

    const d00 = `V100
    R8D#8D#8D#8`;

    return {
        tempo: 120,
        track: [
            {
                tone: wave228,
                intro: "",
                loop: `L4 Q8 V80 P64 O2@E127,127,127,127 @ML16,2,10,7 ${a0}${a1}${a2}`
            },
            {
                tone: wave266,
                intro: "",
                loop: `V80 P064 @266 T120 L4 Q0 V95 P94 O4 @E127,127,127,124 ${d00}`
            }
        ]
    };
})();

export const bgm45: sound.MML = (() => {
    const a0 = `V100 Q6
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.A
    `;

    const b0 = `V100 Q4
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>`;

    const c0 = `V100
    R1R1
    R1R1
    R1R1
    R1R1
    `;

    const a1 = `V100
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.R`;

    const b1 = `V100 Q4
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
    F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
      >F#8<E16E16  >F#8<E16E16   >F#8<D16D16>
    `;

    const c1 = `V100
    RF#<C#>F# G#.A.B
    R<C#DE    F#.E.D>
    RF#<C#>F# G#.A.B
    RBAG#
    `;

    const a2 = `
    V100
    R1R1
    R1R1
    R1R1
    R1R1
    `;

    const b2 = `
    V100 
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16
    `;

    const c2 = `V100
    R1R1
    R1R1
    R1R1
    R1R1`;

    const d00 = `V127
    [F#8F#16F#16]32
    [F#8F#16F#16]32
    [F#8F#16F#16]31
    [F#16F#16F#16F#16]1`;
    const d10 = `V100 RF#`;

    return {
        tempo: 30,
        track: [
            {
                tone: wave228,
                intro: "",
                loop: `V60 P44 O4 @E87,27,127,127${a0}${a1}${a2}`
            },
            {
                tone: wave225,
                intro: "",
                loop: `V70 P64 O2 @E117,27,117,117 ${b0}${b1}${b2}`
            },
            {
                tone: wave227,
                intro: "",
                loop: ` V35 P84 O5 @E127,127,127,110 @MA37,2,8,0 ${c0}${c1}${c2}`
            },
            {
                tone: wave266,
                intro: "",
                loop: `V90 P34 O4 @E127,124,0,127 @MA127,127,0,0 ${d00}`
            },
            {
                tone: wave310,
                intro: "",
                loop: `V55 P94 O5 @E127,107,60,127 @MA10,52,3,0 ${d10}`
            }
        ]
    };
})();

export const bgm46: sound.MML = (() => {
    const a0 = `V100 Q6
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.A`;
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
    const c0 = `V100
    R1R1
    R1R1
    R1R1
    R1R1
    `;
    const a1 = `V100
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG#      G#.F#.R
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

    const c1 = `
    V100
    RF#<C#>F#  G#.A.B
    R<C#DE     F#.E.D>
    RF#<C#>F#  G#.A.B
    RBAG       G#.F#.R
    `;

    const a2 = `
    V100
 R1R1
 R1R1
 R1R1
 R1R1
    `;
    const b2 = `
    V100 
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
    F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
      F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16
    `;

    const c2 = `
    V100
 R1R1
 R1R1
 R1R1
 R1R1
    `;
    const d0i = `V100 L4 [F#16]16`;
    const d1i = `V90 L4 F#8R8 F#8R8 F#8R8 F#16F#16F#16F#16`;
    const d00 = `V127
    [F#8F#16F#16]32
    [F#8F#16F#16]32
    [F#8F#16F#16]31
    [F#16F#16F#16F#16]1`;
    const d10 = `V100 RF#`;

    return {
        tempo: 150,
        track: [
            {
                tone: wave228,
                intro: "",
                loop: `V65 P44 O4 @E87,27,127,127${a0}${a1}${a2}`
            },
            {
                tone: wave225,
                intro: "",
                loop: `V75 P64 O2 @E117,27,117,117${b0}${b1}${b2}`
            },
            {
                tone: wave227,
                intro: "",
                loop: `V40 P84 O5 @E127,127,127,110 @MA37,2,8,0${c0}${c1}${c2}`
            },
            {
                tone: wave266,
                intro: `V90 P34 O4 @E127,124,0,127 @MA127,127,0,0 ${d0i}`,
                loop: d00
            },
            {
                tone: wave310,
                intro: `V70 P94 O5 @E127,107,60,127 @MA10,52,3,0 ${d1i}`,
                loop: d10
            }
        ]
    };
})();

export const bgm47: sound.MML = (() => {
    const a0 = `V100 [R1]4`;
    const b0 = `V100 L4 [ CGFA# ]4`;
    const c0 = `V100 [R1]4`;
    const a1 = `V100 L4
    G2.A#4  A2.D#4 F1&F1
    A#2.<D4 C2.>F4 G1&G2.C8D8
    D#2G4 F2A#8F8 G2.&G2C8D8
    D#2G4 F2D4 C2.&C2.`;
    const b1 = `V100 L4
    [ CGFA# ]4
    [ CGFA# ]4
    [ CGF ]4
    [ CGF ]3 C2.
    `;
    const c1 = `V100
    [R1]4
    [R1]4
    [R2.]4
    [C2.]4`;
    const rest = `[R1]4`;

    return {
        tempo: 90,
        track: [
            {
                tone: wave227,
                intro: "",
                loop: `V70 P94 O5 @E127,64,64,127 @MA20,2,11,10${a0}${a1}${rest}`
            },
            {
                tone: wave226,
                intro: "",
                loop: `V80 P64 O3 @E127,64,64,127${b0}${b1}${rest}`
            },
            {
                tone: wave228,
                intro: "",
                loop: `V75 P34 O2 @E127,64,64,127${c0}${c1}${rest}`
            }
        ]
    };
})();

export const bgm48: sound.MML = (() => {
    const a0 = ` V100 T70 [R1]4`;
    const b0 = `V100 L4 [ CGFA# CGFD ]2`;
    const c0 = `V100 [C4R4C4R4]4`;
    const a1 = `V100 L4
    G2.A#4  A2.D#4 F1&F1
    A#2.<D4 C2.>F4 G1&G2.C8D8
    D#2G4 F2A#8F8 G2.&G2C8D8
    T65 D#2G4  T60 F2D4  T55C2 
    T50 C12  T45 F12  T40 G12  T30 <C2.`;
    const b1 = `V100 L4
    CGFA# CGFD CGFA# CGFA#
    [ CGFA# ]4
    [ CGF ]4
    >[ CGF ]3 <C2.&C2.`;

    const c1 = `V100
    [C4R4C4R4]4
    [C4R4C4R4]3 C4R4R4C8D8
    D#2G4 F2A#8F8 G2.&G2C8D8
    D#2G4 F2D4 C2C12F12G12 <C2.`;

    return {
        tempo: 70,
        track: [
            {
                tone: wave227,
                intro: `V70 P94 O4 Q4 @E127,94,4,90${a0}${a1}`,
                loop: ""
            },
            {
                tone: wave226,
                intro: `V60 P64 O5 Q1 @E127,64,4,90${b0}${b1}`,
                loop: ""
            },
            {
                tone: wave228,
                intro: ``,
                loop: `V70 P34 O2 Q2 @E127,64,4,90${c0}${c1}`
            }
        ]
    };
})();