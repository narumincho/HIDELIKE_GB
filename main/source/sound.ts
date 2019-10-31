import * as fft from "./fft.js";

export const scoreToAudioBuffer = (score: Score): Promise<AudioBuffer> => {
    const sampleRate = 44100;
    const offlineAudioContext = new OfflineAudioContext({
        numberOfChannels: 2,
        length:
            sampleRate *
            score.notes.reduce(
                (time: number, note: Note): number =>
                    time + noteToSeconds(score.tempo, note),
                0
            ),
        sampleRate: sampleRate
    });
    // 227, // 番号
    // 127, // アタック0~127
    // 0, // ディケイ 0～127
    // 127, // サスティン 0～127
    // 123, // リリース 0～127
    // "FFFFFFFF00000000FFFFFFFF00000000", // 波形00～FF
    // 69 - 12 * 2 // 基本音程(69はオクターブ4のラ +1で半音下がり、-1で半音上がる)
    const waveConverted = fft.fft(
        Float32Array.from([1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0])
    );
    const wave = offlineAudioContext.createPeriodicWave(
        waveConverted.real,
        waveConverted.imag
    );

    let offset = 0;
    for (let i = 0; i < score.notes.length; i++) {
        const note = score.notes[i];
        if (note[0] === "R") {
            offset += noteToSeconds(score.tempo, note);
        } else {
            offset = createOscillator(
                offlineAudioContext,
                wave,
                note,
                score.tempo,
                offset
            );
        }
    }
    return offlineAudioContext.startRendering();
};

/**
 * 音を作ってOfflineAudioContextに流す
 * @param offlineAudioContext
 * @param wave 波形データ
 * @param note 音符
 * @param tempo 4分音符が1分間に流れる数
 * @param offset 開始時間
 * @returns 次の音符の開始時間
 */
const createOscillator = (
    offlineAudioContext: OfflineAudioContext,
    wave: PeriodicWave,
    note: [MusicalScale, number, number],
    tempo: number,
    offset: number
): number => {
    const o = offlineAudioContext.createOscillator();
    o.frequency.value = noteToFrequency(note[0], note[1]);
    o.setPeriodicWave(wave);
    o.connect(offlineAudioContext.destination);
    o.start(offset);
    const stopTime = offset + noteToSeconds(tempo, note);
    o.stop(stopTime);
    return stopTime;
};

export const noteToFrequency = (
    musicalScale: MusicalScale,
    octave: number
): number => {
    const base = 27.5 * 2 ** (2 / 12) * 2 ** (octave - 1);
    return base * 2 ** (musicalScaleToNumber(musicalScale) / 12);
};

export const noteToSeconds = (tempo: number, note: Note): number => {
    if (note[0] === "R") {
        return ((4 / note[1]) * 60) / tempo;
    }
    return ((4 / note[2]) * 60) / tempo;
};

/** 音階 */
export type MusicalScale =
    | "C"
    | "C#"
    | "D"
    | "D#"
    | "E"
    | "F"
    | "F#"
    | "G"
    | "G#"
    | "A"
    | "A#"
    | "B";

const musicalScaleToNumber = (musicalScale: MusicalScale): number =>
    ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(
        musicalScale
    );

/** 楽譜 */
export type Score = { tempo: number; notes: Array<Note> };

/** 音符 ["R", length] | [scale, octave, length] */
export type Note = ["R", number] | [MusicalScale, number, number];

export type MML = { tempo: number; track: Array<string> };
