import * as fft from "./fft.js";
import * as mmlToEasy from "./mmlToEasy.js";

export const scoreToAudioBuffer = (mml: MML): Promise<AudioBuffer> => {
    const sampleRate = 44100;
    const offlineAudioContext = new OfflineAudioContext({
        numberOfChannels: mml.track.length + 1,
        length: sampleRate * 60,
        sampleRate: sampleRate
    });
    // 227, // 番号
    // 127, // アタック0~127
    // 0, // ディケイ 0～127
    // 127, // サスティン 0～127
    // 123, // リリース 0～127
    // "FFFFFFFF00000000FFFFFFFF00000000", // 波形00～FF
    // 69 - 12 * 2 // 基本音程(69はオクターブ4のラ +1で半音下がり、-1で半音上がる)
    const channelMergerNode = offlineAudioContext.createChannelMerger();

    for (let i = 0; i < mml.track.length; i++) {
        trackCreateOscillator(
            offlineAudioContext,
            channelMergerNode,
            i,
            mml.track[i],
            mml.tempo
        );
    }
    channelMergerNode.channelInterpretation;
    channelMergerNode.connect(offlineAudioContext.destination);
    return offlineAudioContext.startRendering();
};

const trackCreateOscillator = (
    offlineAudioContext: OfflineAudioContext,
    channelMergerNode: ChannelMergerNode,
    trackIndex: number,
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
    let octave = 4;
    let volume = 127;
    let gateQuantize = 8;
    for (const op of mmlOperators) {
        switch (op.c) {
            case "octaveChange":
                octave = op.octave;
                continue;
            case "volumeChange":
                volume = op.volume;
                continue;
            case "gateQuantizeChange":
                gateQuantize = op.value;
                continue;
            case "note":
                timeOffset = createOscillator(
                    offlineAudioContext,
                    channelMergerNode,
                    trackIndex,
                    wave,
                    volume,
                    op,
                    octave,
                    track.detune,
                    tempo,
                    track.pan,
                    timeOffset
                );
                continue;
            case "rest":
                timeOffset += noteToSeconds(op.length, op.dotted, tempo);
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
    channelMergerNode: ChannelMergerNode,
    trackIndex: number,
    wave: PeriodicWave,
    volume: number,
    note: Note,
    octave: number,
    detune: number,
    tempo: number,
    pan: number,
    offset: number
): number => {
    const oscillatorNode = offlineAudioContext.createOscillator();
    oscillatorNode.frequency.value = noteToFrequency(note.musicalScale, octave);
    oscillatorNode.setPeriodicWave(wave);
    oscillatorNode.detune.value = 100 * (detune / 64);

    const pannerNode = offlineAudioContext.createPanner();
    pannerNode.setPosition(pan - 64, 0, 0);
    oscillatorNode.connect(pannerNode);

    const gainNode = offlineAudioContext.createGain();
    gainNode.gain.value = Math.pow(volume / 128, 2);
    pannerNode.connect(gainNode);
    gainNode.connect(channelMergerNode, 0, trackIndex);
    oscillatorNode.start(offset);
    const stopTime = offset + noteToSeconds(note.length, note.dotted, tempo);
    oscillatorNode.stop(stopTime);
    return stopTime;
};

export const noteToFrequency = (
    musicalScale: MusicalScale,
    octave: number
): number =>
    27.5 * 2 ** (octave - 1 + (3 + musicalScaleToNumber(musicalScale)) / 12);

export const noteToSeconds = (
    length: number,
    dotted: boolean,
    tempo: number
): number => ((dotted ? 1.5 : 1) * ((4 / length) * 60)) / tempo;

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
    | OctaveChange
    | VolumeChange
    | GateQuantizeChange
    | Note
    | Rest;

export type OctaveChange = { c: "octaveChange"; octave: number };
export type GateQuantizeChange = {
    c: "gateQuantizeChange";
    value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};
export type VolumeChange = { c: "volumeChange"; volume: number };
export type Note = {
    c: "note";
    musicalScale: MusicalScale;
    length: number;
    dotted: boolean;
};
export type Rest = { c: "rest"; length: number; dotted: boolean };

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
