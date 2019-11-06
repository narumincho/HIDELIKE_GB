import * as fft from "./fft.js";
import * as mmlToEasy from "./mmlToEasy.js";

export const playSound = async (
    audioContext: AudioContext,
    mml: MML
): Promise<void> => {
    const sampleRate = 32728; //44100;
    const audioSourceBufferList: Array<AudioBufferSourceNode> = [];
    for (let i = 0; i < mml.track.length; i++) {
        const offlineAudioContext = new OfflineAudioContext({
            numberOfChannels: 2,
            length: sampleRate * 60,
            sampleRate: sampleRate
        });
        trackCreateOscillator(offlineAudioContext, mml.track[i], mml.tempo);
        const buffer = await offlineAudioContext.startRendering();
        const audioSourceBuffer = audioContext.createBufferSource();
        audioSourceBuffer.buffer = buffer;
        audioSourceBuffer.connect(audioContext.destination);
        audioSourceBuffer.loop = true;
        audioSourceBufferList.push(audioSourceBuffer);
    }
    for (let i = 0; i < mml.track.length; i++) {
        audioSourceBufferList[i].start();
    }
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
    let octave = 4;
    let volume = 127;
    let gateQuantize: GateQuantize = 8;
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
                createOscillator(
                    offlineAudioContext,
                    wave,
                    volume,
                    op,
                    gateQuantize,
                    octave,
                    track.detune,
                    track.envelope,
                    tempo,
                    track.pan,
                    timeOffset
                );
                timeOffset += noteToSeconds(op.length, op.dotted, tempo, 8);
                continue;
            case "rest":
                timeOffset += noteToSeconds(op.length, op.dotted, tempo, 8);
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
 */
const createOscillator = (
    offlineAudioContext: OfflineAudioContext,
    wave: PeriodicWave,
    volume: number,
    note: Note,
    gateQuantize: GateQuantize,
    octave: number,
    detune: number,
    envelope: Envelope,
    tempo: number,
    pan: number,
    offset: number
): void => {
    const oscillatorNode = offlineAudioContext.createOscillator();
    oscillatorNode.frequency.value = noteToFrequency(note.musicalScale, octave);
    oscillatorNode.setPeriodicWave(wave);
    oscillatorNode.detune.value = 100 * (detune / 64);

    const pannerNode = offlineAudioContext.createPanner();
    pannerNode.positionX.value = (pan - 64) / 64;
    oscillatorNode.connect(pannerNode);

    const gainNode = offlineAudioContext.createGain();

    const value = volume / 128;
    const noteOnTime = noteToSeconds(
        note.length,
        note.dotted,
        tempo,
        gateQuantize
    );
    gainNode.gain.setValueAtTime(0, offset);
    const sum = envelope.attack + envelope.decay + 150 + envelope.release;
    const attackTime = offset + (envelope.attack * noteOnTime) / sum;
    const decayTime = attackTime + (envelope.decay * noteOnTime) / sum;
    const sustainTime = decayTime + (150 * noteOnTime) / sum;
    const releaseTime = sustainTime + (envelope.release * noteOnTime) / sum;
    const sustainValue = (value * envelope.sustain) / 127;
    gainNode.gain.linearRampToValueAtTime(value, attackTime);
    gainNode.gain.setTargetAtTime(sustainValue, attackTime, decayTime);
    gainNode.gain.setTargetAtTime(0, sustainTime, releaseTime);

    pannerNode.connect(gainNode);
    gainNode.connect(offlineAudioContext.destination);
    oscillatorNode.start(offset);
    oscillatorNode.stop(offset + noteOnTime);
};

export const noteToFrequency = (
    musicalScale: MusicalScale,
    octave: number
): number =>
    27.5 * 2 ** (octave - 1 + (3 + musicalScaleToNumber(musicalScale)) / 12);

export const noteToSeconds = (
    length: number,
    dotted: boolean,
    tempo: number,
    gateQuantize: GateQuantize
): number => {
    if (gateQuantize === 0) {
        return ((4 / 192) * 60) / tempo;
    }
    return (
        ((dotted ? 1.5 : 1) * ((4 / length) * 60) * (gateQuantize / 8)) / tempo
    );
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
export type MML = {
    tempo: number;
    track: Array<Track>;
};

type Track = {
    tone: Wave;
    pan: number;
    detune: number;
    envelope: Envelope;
    intro: string;
    loop: string;
};

type Envelope = {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
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
    value: GateQuantize;
};

type GateQuantize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

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
