import * as sound from "./sound.js";

export const mmlStringToEasyReadType = (
    mml: string
): Array<sound.MMLOperator> => {
    const opList: Array<sound.MMLOperator> = [];
    for (let i = 0; i < mml.length; i++) {
        const char = mml[i];
        switch (char) {
            case "V": {
                let result = volumeChange(mml, i);
                i += result.useExtendLength;
                opList.push(result.op);
                continue;
            }
            case "O": {
                let result = octaveChange(mml, i);
                i += result.useExtendLength;
                opList.push(result.op);
                continue;
            }
            case "L": {
                let result = lengthChange(mml, i);
                i += result.useExtendLength;
                opList.push(result.op);
                continue;
            }
            case "<": {
                opList.push({ c: "octaveUp" });
                continue;
            }
            case ">": {
                opList.push({ c: "octaveDown" });
                continue;
            }
            case "C":
            case "D":
            case "E":
            case "F":
            case "G":
            case "A":
            case "B": {
                let result = note(mml, i);
                i += result.useExtendLength;
                opList.push(result.op);
                continue;
            }
            case "R": {
                let result = rest(mml, i);
                i += result.useExtendLength;
                opList.push(result.op);
                continue;
            }
            default:
                i += 1;
        }
    }
    console.log(opList);
    return opList;
};

/**
 * useExtendLength (1+何)文字すすめるか (n文字すすめるならn-1)
 */
const volumeChange = (
    mml: string,
    i: number
): { op: sound.VolumeChange; useExtendLength: number } => {
    const result = getPostfixNumber(mml, i + 1);
    if (result === null) {
        throw new Error("Vコマンドに数値が指定されていない!");
    }
    return {
        op: { c: "volumeChange", volume: result.number },
        useExtendLength: result.useLength
    };
};

const octaveChange = (
    mml: string,
    i: number
): { op: sound.OctaveChange; useExtendLength: number } => {
    const result = getPostfixNumber(mml, i + 1);
    if (result === null) {
        throw new Error(`オクターブの数値が指定されていない!${i}`);
    }
    return {
        op: { c: "octaveChange", octave: result.number },
        useExtendLength: result.useLength
    };
};

const lengthChange = (
    mml: string,
    i: number
): { op: sound.LengthChange; useExtendLength: number } => {
    const result = getPostfixNumber(mml, i + 1);
    if (result === null) {
        throw new Error(`長さの指定が数値でされていない!${i}`);
    }
    return {
        op: {
            c: "lengthChange",
            length: result.number
        },
        useExtendLength: result.useLength
    };
};

const note = (
    mml: string,
    i: number
): { op: sound.Note; useExtendLength: number } => {
    const scaleName1 = mml.charAt(i);
    switch (scaleName1) {
        case "C":
        case "D":
        case "E":
        case "F":
        case "G":
        case "A":
        case "B": {
            const result = getPostfixNumber(mml, i + 2);
            if (result === null) {
                return {
                    op: {
                        c: "note",
                        length: null,
                        musicalScale: scaleName1
                    },
                    useExtendLength: 0
                };
            }
            return {
                op: {
                    c: "note",
                    length: result.number,
                    musicalScale: scaleName1
                },
                useExtendLength: result.useLength
            };
        }
    }
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
                        length: null,
                        musicalScale: scaleName2
                    },
                    useExtendLength: 0
                };
            }
            return {
                op: {
                    c: "note",
                    length: result.number,
                    musicalScale: scaleName2
                },
                useExtendLength: 1 + result.useLength
            };
        }
    }
    throw new Error(`音符の解析で失敗!${i}`);
};

const rest = (
    mml: string,
    i: number
): { op: sound.Rest; useExtendLength: number } => {
    const result = getPostfixNumber(mml, i + 1);
    if (result === null) {
        throw new Error(`休符のs長さの指定が数値でされていない!${i}`);
    }
    return {
        op: {
            c: "rest",
            length: result.number
        },
        useExtendLength: result.useLength
    };
};

const getPostfixNumber = (
    mml: string,
    startIndex: number
): { number: number; useLength: number } | null => {
    const value = Number.parseInt(mml.slice(startIndex));
    if (Number.isNaN(value)) {
        return null;
    }
    return {
        number: value,
        useLength: value.toString().length
    };
};
