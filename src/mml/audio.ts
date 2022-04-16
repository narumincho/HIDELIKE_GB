import type {
  Envelope,
  GateQuantize,
  MML,
  MusicalScale,
  Note,
  Track,
  Wave,
} from "./type";
import { fft } from "./fft";
import { mmlStringToEasyReadType } from "./mmlToEasy";

export const playSound = async (
  audioContext: AudioContext,
  mml: MML
): Promise<void> => {
  //  const sampleRate = 32728; //44100;
  const sampleRate = 44100;
  const list = await Promise.all(
    mml.trackList.map(async (track) => {
      const offlineAudioContext = new OfflineAudioContext({
        numberOfChannels: 2,
        length: sampleRate * 60,
        sampleRate,
      });
      trackCreateOscillator(offlineAudioContext, track, mml.tempo);
      const buffer = await offlineAudioContext.startRendering();
      const audioSourceBuffer = audioContext.createBufferSource();
      audioSourceBuffer.buffer = buffer;
      audioSourceBuffer.connect(audioContext.destination);
      audioSourceBuffer.loop = true;
      return audioSourceBuffer;
    })
  );
  for (const audioSourceBuffer of list) {
    audioSourceBuffer.start();
  }
};

const stringWaveToWave = (
  wave: Wave
): {
  readonly real: Float32Array;
  readonly imag: Float32Array;
} => {
  const waveSampleFloatArray = new Float32Array(wave.length / 2);
  for (let i = 0; i < wave.length / 2; i += 1) {
    const num = Number.parseInt(
      (wave[i * 2] as string) + (wave[i * 2 + 1] as string),
      16
    );
    waveSampleFloatArray[i] = (num - 128) / 256;
  }
  return fft(waveSampleFloatArray);
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
  const mmlOperators = mmlStringToEasyReadType(track.loop);

  let timeOffset = 0;
  let octave = 4;
  let volume = 127;
  let gateQuantize: GateQuantize = 8;
  for (const op of mmlOperators) {
    switch (op.c) {
      case "octaveChange":
        octave = op.octave;
        break;
      case "volumeChange":
        volume = op.volume;
        break;
      case "gateQuantizeChange":
        gateQuantize = op.value;
        break;
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
        break;
      case "rest":
        timeOffset += noteToSeconds(op.length, op.dotted, tempo, 8);
        break;
    }
  }
};
export const noteToFrequency = (
  musicalScale: MusicalScale,
  octave: number
): number =>
  27.5 * 2 ** (octave - 1 + (3 + musicalScaleToNumber(musicalScale)) / 12);

const musicalScaleToNumber = (musicalScale: MusicalScale): number =>
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(
    musicalScale
  );

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
