import * as fft from "./fft.js";

export const scoreToAudioBuffer = (mml: MML): Promise<AudioBuffer> => {
    const sampleRate = 44100;
    const offlineAudioContext = new OfflineAudioContext({
        numberOfChannels: 2,
        length: sampleRate * 30,
        sampleRate: sampleRate
    });
    // 227, // 番号
    // 127, // アタック0~127
    // 0, // ディケイ 0～127
    // 127, // サスティン 0～127
    // 123, // リリース 0～127
    // "FFFFFFFF00000000FFFFFFFF00000000", // 波形00～FF
    // 69 - 12 * 2 // 基本音程(69はオクターブ4のラ +1で半音下がり、-1で半音上がる)
    for (const track of mml.track) {
        trackCreateOscillator(offlineAudioContext, track, mml.tempo);
    }
    return offlineAudioContext.startRendering();
};

const trackCreateOscillator = (
    offlineAudioContext: OfflineAudioContext,
    track: Track,
    tempo: number
) => {
    const waveConverted = stringWaveToWave(track.tone);
    const wave = offlineAudioContext.createPeriodicWave(
        waveConverted.real,
        waveConverted.imag
    );

    let offset = 0;
    for (let i = 0; i < 9; i++) {
        offset = createOscillator(
            offlineAudioContext,
            wave,
            ["C", 4, 4],
            tempo,
            offset
        );
    }
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

export type MML = {
    tempo: number;
    track: Array<Track>;
};

type Track = {
    tone: Wave;
    intro: string;
    loop: string;
};

/** 波形 */
export type Wave = string;

const stringWaveToWave = (
    wave: Wave
): {
    real: Float32Array;
    imag: Float32Array;
} => {
    const waveSampleFloatArray = new Float32Array(wave.length / 2);
    for (let i = 0; i < wave.length / 2; i++) {
        const num = Number.parseInt(wave[i * 2] + wave[i * 2 + 1], 16);
        waveSampleFloatArray[i] = (num - 128) / 256;
    }
    return fft.fft(waveSampleFloatArray);
};
