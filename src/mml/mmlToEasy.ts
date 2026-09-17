import {
  GateQuantize,
  GateQuantizeChange,
  MMLOperator,
  Note,
  OctaveChange,
  Rest,
  VolumeChange,
} from "./type.ts";

export const mmlStringToEasyReadType = (
  rawMml: string,
): ReadonlyArray<MMLOperator> => {
  const mml = rawMml.toUpperCase();
  const opList: Array<MMLOperator> = [];
  let length = 4;
  let octave = 4;

  for (let i = 0; i < mml.length; i += 1) {
    const char = mml[i];
    if (char === undefined) continue;

    // 空白、改行、タブはスキップ
    if (/\s/.test(char)) {
      continue;
    }

    // @コマンド（音色、エフェクト等）をスキップ: 例 "@228", "@E127,127,127,127", "@MA..."
    if (char === "@") {
      i += 1;
      while (i < mml.length && /^[A-Z0-9,\-_]/i.test(mml[i]!)) {
        i += 1;
      }
      i -= 1; // loopでインクリメントされるため
      continue;
    }

    // タイ記号 & の処理
    if (char === "&") {
      const lastOp = opList[opList.length - 1];
      if (lastOp && lastOp.c === "note") {
        opList[opList.length - 1] = { ...lastOp, tie: true };
      }
      continue;
    }

    // [ または ] ループ記号はスキップ
    if (char === "[" || char === "]") {
      continue;
    }

    // テンポ T コマンドはスキップ
    if (char === "T") {
      i += 1;
      while (i < mml.length && /^[0-9]/.test(mml[i]!)) {
        i += 1;
      }
      i -= 1;
      continue;
    }

    // パン P コマンドはスキップ
    if (char === "P") {
      i += 1;
      while (i < mml.length && /^[0-9]/.test(mml[i]!)) {
        i += 1;
      }
      i -= 1;
      continue;
    }

    switch (char) {
      case "V": {
        const result = volumeChange(mml, i);
        if (result) {
          i += result.useExtendLength;
          opList.push(result.op);
        }
        break;
      }
      case "O": {
        const result = octaveChange(mml, i);
        if (result) {
          i += result.useExtendLength;
          opList.push(result.op);
          octave = result.op.octave;
        }
        break;
      }
      case "L": {
        const result = lengthChange(mml, i);
        if (result) {
          i += result.useExtendLength;
          length = result.length;
        }
        break;
      }
      case "<": {
        octave += 1;
        opList.push({ c: "octaveChange", octave });
        break;
      }
      case ">": {
        octave -= 1;
        opList.push({ c: "octaveChange", octave });
        break;
      }
      case "Q": {
        const qResult = gateQuantizeChange(mml, i);
        if (qResult) {
          opList.push(qResult);
          i += 1;
        }
        break;
      }
      case "C":
      case "D":
      case "E":
      case "F":
      case "G":
      case "A":
      case "B": {
        const result = note(mml, i, length);
        if (result) {
          i += result.useExtendLength;
          opList.push(result.op);
        }
        break;
      }
      case "R": {
        const result = rest(mml, i, length);
        if (result) {
          i += result.useExtendLength;
          opList.push(result.op);
        }
        break;
      }
    }
  }
  return opList;
};

const volumeChange = (
  mml: string,
  i: number,
): { readonly op: VolumeChange; readonly useExtendLength: number } | null => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    return null;
  }
  return {
    op: { c: "volumeChange", volume: result.number },
    useExtendLength: result.useLength,
  };
};

const octaveChange = (
  mml: string,
  i: number,
): { readonly op: OctaveChange; readonly useExtendLength: number } | null => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    return null;
  }
  return {
    op: { c: "octaveChange", octave: result.number },
    useExtendLength: result.useLength,
  };
};

const lengthChange = (
  mml: string,
  i: number,
): { length: number; useExtendLength: number } | null => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    return null;
  }
  return {
    length: result.number,
    useExtendLength: result.useLength,
  };
};

const gateQuantizeChange = (
  mml: string,
  i: number,
): GateQuantizeChange | null => {
  const qValStr = mml.slice(i + 1, i + 2);
  const qVal = Number.parseInt(qValStr, 10);
  if (qVal >= 0 && qVal <= 8) {
    return { c: "gateQuantizeChange", value: qVal as GateQuantize };
  }
  return null;
};

const note = (
  mml: string,
  i: number,
  length: number,
): { readonly op: Note; readonly useExtendLength: number } | null => {
  const scaleName2 = mml.slice(i, i + 2);
  if (
    scaleName2 === "C#" ||
    scaleName2 === "D#" ||
    scaleName2 === "F#" ||
    scaleName2 === "G#" ||
    scaleName2 === "A#"
  ) {
    const result = getPostfixNumber(mml, i + 2);
    if (result === null) {
      return {
        op: {
          c: "note",
          length,
          pitch: scaleName2,
          dotted: mml.charAt(i + 2) === ".",
        },
        useExtendLength: mml.charAt(i + 2) === "." ? 1 : 0,
      };
    }
    const isDotted = mml.charAt(i + 2 + result.useLength) === ".";
    return {
      op: {
        c: "note",
        length: result.number,
        pitch: scaleName2,
        dotted: isDotted,
      },
      useExtendLength: 1 + result.useLength + (isDotted ? 1 : 0),
    };
  }

  const scaleName1 = mml.charAt(i);
  if (["C", "D", "E", "F", "G", "A", "B"].includes(scaleName1)) {
    const result = getPostfixNumber(mml, i + 1);
    if (result === null) {
      const isDotted = mml.charAt(i + 1) === ".";
      return {
        op: {
          c: "note",
          length,
          pitch: scaleName1 as Note["pitch"],
          dotted: isDotted,
        },
        useExtendLength: isDotted ? 1 : 0,
      };
    }
    const isDotted = mml.charAt(i + 1 + result.useLength) === ".";
    return {
      op: {
        c: "note",
        length: result.number,
        pitch: scaleName1 as Note["pitch"],
        dotted: isDotted,
      },
      useExtendLength: result.useLength + (isDotted ? 1 : 0),
    };
  }

  return null;
};

const rest = (
  mml: string,
  i: number,
  length: number,
): { readonly op: Rest; readonly useExtendLength: number } | null => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    const isDotted = mml.charAt(i + 1) === ".";
    return {
      op: {
        c: "rest",
        length,
        dotted: isDotted,
      },
      useExtendLength: isDotted ? 1 : 0,
    };
  }
  const isDotted = mml.charAt(i + 1 + result.useLength) === ".";
  return {
    op: {
      c: "rest",
      length: result.number,
      dotted: isDotted,
    },
    useExtendLength: result.useLength + (isDotted ? 1 : 0),
  };
};

const getPostfixNumber = (
  mml: string,
  startIndex: number,
): { number: number; useLength: number } | null => {
  const slice = mml.slice(startIndex);
  const match = slice.match(/^[0-9]+/);
  if (!match || !match[0]) {
    return null;
  }
  const value = Number.parseInt(match[0], 10);
  return {
    number: value,
    useLength: match[0].length,
  };
};
