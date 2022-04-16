import {
  GateQuantizeChange,
  MMLOperator,
  Note,
  OctaveChange,
  Rest,
  VolumeChange,
} from "./type";

export const mmlStringToEasyReadType = (
  mml: string
): ReadonlyArray<MMLOperator> => {
  const opList: Array<MMLOperator> = [];
  let length = 4;
  let octave = 4;
  for (let i = 0; i < mml.length; i += 1) {
    const char = mml[i];
    switch (char) {
      case "V": {
        const result = volumeChange(mml, i);
        i += result.useExtendLength;
        opList.push(result.op);
        break;
      }
      case "O": {
        const result = octaveChange(mml, i);
        i += result.useExtendLength;
        opList.push(result.op);
        octave = result.op.octave;
        break;
      }
      case "L": {
        const result = lengthChange(mml, i);
        i += result.useExtendLength;
        length = result.length;
        break;
      }
      case "<": {
        opList.push({ c: "octaveChange", octave: octave + 1 });
        octave += 1;
        break;
      }
      case ">": {
        opList.push({ c: "octaveChange", octave: octave - 1 });
        octave -= 1;
        break;
      }
      case "Q": {
        opList.push(gateQuantizeChange(mml, i));
        i += 1;
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
        i += result.useExtendLength;
        opList.push(result.op);
        break;
      }
      case "R": {
        const result = rest(mml, i, length);
        i += result.useExtendLength;
        opList.push(result.op);
        break;
      }
    }
  }
  return opList;
};

/**
 * useExtendLength (1+何)文字すすめるか (n文字すすめるならn-1)
 */
const volumeChange = (
  mml: string,
  i: number
): { readonly op: VolumeChange; readonly useExtendLength: number } => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    throw new Error("Vコマンドに数値が指定されていない!");
  }
  return {
    op: { c: "volumeChange", volume: result.number },
    useExtendLength: result.useLength,
  };
};

const octaveChange = (
  mml: string,
  i: number
): { readonly op: OctaveChange; readonly useExtendLength: number } => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    throw new Error(
      `オクターブの数値が指定されていない!\ni=${i}\n${mml.slice(
        i - 10,
        i + 10
      )}`
    );
  }
  return {
    op: { c: "octaveChange", octave: result.number },
    useExtendLength: result.useLength,
  };
};

const lengthChange = (
  mml: string,
  i: number
): { length: number; useExtendLength: number } => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    throw new Error(`長さの指定が数値でされていない!${i}`);
  }
  return {
    length: result.number,
    useExtendLength: result.useLength,
  };
};

/**
 * 必ず長さは2になる
 */
const gateQuantizeChange = (mml: string, i: number): GateQuantizeChange => {
  switch (mml.slice(i, i + 2)) {
    case "Q0":
      return { c: "gateQuantizeChange", value: 0 };
    case "Q1":
      return { c: "gateQuantizeChange", value: 1 };
    case "Q2":
      return { c: "gateQuantizeChange", value: 2 };
    case "Q3":
      return { c: "gateQuantizeChange", value: 3 };
    case "Q4":
      return { c: "gateQuantizeChange", value: 4 };
    case "Q5":
      return { c: "gateQuantizeChange", value: 5 };
    case "Q6":
      return { c: "gateQuantizeChange", value: 6 };
    case "Q7":
      return { c: "gateQuantizeChange", value: 7 };
    case "Q8":
      return { c: "gateQuantizeChange", value: 8 };
  }
  throw new Error(`Qの指定がおかしい${i}`);
};

const note = (
  mml: string,
  i: number,
  length: number
): { readonly op: Note; readonly useExtendLength: number } => {
  const scaleName2 = mml.slice(i, i + 2);
  switch (scaleName2) {
    case "C#":
    case "D#":
    case "F#":
    case "G#":
    case "A#": {
      const result = getPostfixNumber(mml, i + 2);
      if (result === null) {
        return {
          op: {
            c: "note",
            length,
            musicalScale: scaleName2,
            dotted: mml.charAt(i + 2) === ".",
          },
          useExtendLength: 0,
        };
      }
      return {
        op: {
          c: "note",
          length: result.number,
          musicalScale: scaleName2,
          dotted: mml.charAt(i + result.useLength + 2) === ".",
        },
        useExtendLength: 1 + result.useLength,
      };
    }
  }
  const scaleName1 = mml.charAt(i);
  switch (scaleName1) {
    case "C":
    case "D":
    case "E":
    case "F":
    case "G":
    case "A":
    case "B": {
      const result = getPostfixNumber(mml, i + 1);
      if (result === null) {
        return {
          op: {
            c: "note",
            length,
            musicalScale: scaleName1,
            dotted: mml.charAt(i + 1) === ".",
          },
          useExtendLength: 0,
        };
      }
      return {
        op: {
          c: "note",
          length: result.number,
          musicalScale: scaleName1,
          dotted: mml.charAt(i + result.useLength + 1) === ".",
        },
        useExtendLength: result.useLength,
      };
    }
  }
  throw new Error(
    `音符の解析で失敗!\ni=${i}\n${scaleName1}\n${scaleName2}\n${mml.slice(
      i - 10,
      i + 10
    )}`
  );
};

const rest = (
  mml: string,
  i: number,
  length: number
): { readonly op: Rest; readonly useExtendLength: number } => {
  const result = getPostfixNumber(mml, i + 1);
  if (result === null) {
    return {
      op: {
        c: "rest",
        length,
        dotted: mml.charAt(i + 1) === ".",
      },
      useExtendLength: 0,
    };
  }
  return {
    op: {
      c: "rest",
      length: result.number,
      dotted: mml.charAt(i + result.useLength + 1) === ".",
    },
    useExtendLength: result.useLength,
  };
};

const getPostfixNumber = (
  mml: string,
  startIndex: number
): { number: number; useLength: number } | null => {
  const value = Number.parseInt(mml.slice(startIndex), 10);
  if (Number.isNaN(value)) {
    return null;
  }
  return {
    number: value,
    useLength: value.toString().length,
  };
};
