import * as fft from "./fft.js";
import * as mmlToEasy from "./mmlToEasy.js";

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
    const mmlOperators: Array<MMLOperator> = mmlToEasy.mmlStringToEasyReadType(
        track.loop
    );

    let timeOffset = 0;
    let length = 4;
    let octave = 4;
    let volume = 127;
    let gateQuantize = 8;
    for (const op of mmlOperators) {
        switch (op.c) {
            case "lengthChange":
                length = op.length;
                continue;
            case "octaveChange":
                octave = op.octave;
                continue;
            case "volumeChange":
                volume = op.volume;
                continue;
            case "octaveUp":
                octave += 1;
                continue;
            case "octaveDown":
                octave -= 1;
                continue;
            case "gateQuantizeChange":
                gateQuantize = op.value;
                continue;
            case "note":
                timeOffset = createOscillator(
                    offlineAudioContext,
                    wave,
                    volume,
                    op.musicalScale,
                    octave,
                    track.detune,
                    op.length === null ? length : op.length,
                    tempo,
                    track.pan,
                    timeOffset
                );
                continue;
            case "rest":
                timeOffset += noteToSeconds(
                    op.length == null ? length : op.length,
                    tempo
                );
                continue;
        }
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
    volume: number,
    musicalScale: MusicalScale,
    octave: number,
    detune: number,
    length: number,
    tempo: number,
    pan: number,
    offset: number
): number => {
    const oscillatorNode = offlineAudioContext.createOscillator();
    oscillatorNode.frequency.value = noteToFrequency(musicalScale, octave);
    oscillatorNode.setPeriodicWave(wave);
    oscillatorNode.detune.value = 100 * (detune / 64);

    const pannerNode = offlineAudioContext.createPanner();
    pannerNode.setPosition(pan - 64, 0, 0);
    oscillatorNode.connect(pannerNode);

    const gainNode = offlineAudioContext.createGain();
    gainNode.gain.value = Math.pow(volume / 128, 2);
    pannerNode.connect(gainNode);

    gainNode.connect(offlineAudioContext.destination);
    oscillatorNode.start(offset);
    const stopTime = offset + noteToSeconds(length, tempo);
    oscillatorNode.stop(stopTime);
    return stopTime;
};

export const noteToFrequency = (
    musicalScale: MusicalScale,
    octave: number
): number => {
    console.log(octave);
    const base = 27.5 * 2 ** (2 / 12) * 2 ** (octave - 1);
    return base * 2 ** (musicalScaleToNumber(musicalScale) / 12);
};

export const noteToSeconds = (length: number, tempo: number): number =>
    ((4 / length) * 60) / tempo;

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
export type MML = {
    tempo: number;
    track: Array<Track>;
};

type Track = {
    tone: Wave;
    pan: number;
    detune: number;
    envelope: {
        attack: number;
        decay: number;
        sustain: number;
        release: number;
    };
    intro: string;
    loop: string;
};

export type MMLOperator =
    | LengthChange
    | OctaveChange
    | VolumeChange
    | OctaveUp
    | OctaveDown
    | GateQuantizeChange
    | Note
    | Rest;

export type LengthChange = { c: "lengthChange"; length: number };
export type OctaveChange = { c: "octaveChange"; octave: number };
export type OctaveUp = { c: "octaveUp" };
export type OctaveDown = { c: "octaveDown" };
export type GateQuantizeChange = {
    c: "gateQuantizeChange";
    value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};
export type VolumeChange = { c: "volumeChange"; volume: number };
export type Note = {
    c: "note";
    musicalScale: MusicalScale;
    length: number | null;
};
export type Rest = { c: "rest"; length: number | null };

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
