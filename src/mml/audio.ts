import {
  Envelope,
  GateQuantize,
  MML,
  Note,
  Pitch,
  pitchList,
  Track,
  Wave,
} from "./type.ts";
import { fft } from "./fft.ts";
import { mmlStringToEasyReadType } from "./mmlToEasy.ts";

export const playSound = async (mml: MML): Promise<AudioBuffer> => {
  console.log(mml);
  // const sampleRate = 32728; //44100;
  const sampleRate = 44100;
  const offlineAudioContext = new OfflineAudioContext({
    numberOfChannels: 2,
    length: sampleRate * 60,
    sampleRate,
  });
  const list = await Promise.all(
    mml.trackList.map(async (track) => {
      const offlineAudioContextInTrack = new OfflineAudioContext({
        numberOfChannels: 2,
        length: sampleRate * 60,
        sampleRate,
      });
      trackCreateOscillator(offlineAudioContextInTrack, track, mml.tempo);
      const buffer = await offlineAudioContextInTrack.startRendering();
      const audioSourceBuffer = offlineAudioContext.createBufferSource();
      audioSourceBuffer.buffer = buffer;
      audioSourceBuffer.connect(offlineAudioContext.destination);
      audioSourceBuffer.loop = true;
      return audioSourceBuffer;
    }),
  );
  for (const audioSourceBuffer of list) {
    audioSourceBuffer.start();
  }

  return offlineAudioContext.startRendering();
};

const stringWaveToWave = (
  wave: Wave,
): {
  readonly real: Float32Array;
  readonly imag: Float32Array;
} => {
  const waveSampleFloatArray = new Float32Array(wave.length / 2);
  for (let i = 0; i < wave.length / 2; i += 1) {
    const num = Number.parseInt(wave.slice(i * 2, i * 2 + 2), 16);
    waveSampleFloatArray[i] = (num / 256) * 2 - 1;
  }
  return fft(waveSampleFloatArray);
};

const trackCreateOscillator = (
  offlineAudioContext: OfflineAudioContext,
  track: Track,
  tempo: number,
): void => {
  const waveConverted = stringWaveToWave(track.tone);
  const wave = offlineAudioContext.createPeriodicWave(
    waveConverted.real,
    waveConverted.imag,
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
          timeOffset,
        );
        timeOffset += noteToSeconds(op.length, op.dotted, tempo, 8);
        break;
      case "rest":
        timeOffset += noteToSeconds(op.length, op.dotted, tempo, 8);
        break;
    }
  }
};
export const noteToFrequency = (pitch: Pitch, octave: number): number => {
  return (
    261.626 *
    (2 ** (1 / 12)) ** ((octave - 5) * pitchList.length + pitchToNumber(pitch))
  );
};

const pitchToNumber = (musicalScale: Pitch): number =>
  pitchList.indexOf(musicalScale);

/** 音がなる時間 */
export const noteToSeconds = (
  length: number,
  dotted: boolean,
  tempo: number,
  gateQuantize: GateQuantize,
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
  offset: number,
): void => {
  const oscillatorNode = offlineAudioContext.createOscillator();
  oscillatorNode.frequency.value = noteToFrequency(note.pitch, octave);
  oscillatorNode.setPeriodicWave(wave);
  oscillatorNode.detune.value = 100 * (detune / 64);

  const pannerNode = createPannerNode(offlineAudioContext, pan);

  /** 音がなっている時間 */
  const noteOnTime = noteToSeconds(
    note.length,
    note.dotted,
    tempo,
    gateQuantize,
  );
  const gainNode = createGainNode(
    offlineAudioContext,
    offset,
    envelope,
    volume / 128,
    noteOnTime,
  );

  oscillatorNode.connect(pannerNode);
  pannerNode.connect(gainNode);
  gainNode.connect(offlineAudioContext.destination);
  oscillatorNode.start(offset);
  oscillatorNode.stop(offset + noteOnTime);
};

/**
 * 音の発生源を左右に動かす Node を作成する
 * @param offlineAudioContext
 * @param value 0(左)～64(中央)～127(右)
 */
const createPannerNode = (
  offlineAudioContext: OfflineAudioContext,
  value: number,
): PannerNode => {
  const pannerNode = offlineAudioContext.createPanner();
  pannerNode.positionX.value = (value / 127) * 2 - 1;
  return pannerNode;
};

/**
 * 音量を増減させる Node を作成する
 * @param offlineAudioContext
 * @param offsetTime 音を変更する時刻
 * @param envelope エンベロープ ADSR (https://ja.wikipedia.org/wiki/ADSR)
 * @param volume 音量 0～1
 * @param noteOnTime 音の鳴っている時間
 */
const createGainNode = (
  offlineAudioContext: OfflineAudioContext,
  offsetTime: number,
  envelope: Envelope,
  volume: number,
  noteOnTime: number,
): GainNode => {
  const gainNode = offlineAudioContext.createGain();
  const scale = 6000;
  gainNode.gain.setValueAtTime(0, offsetTime);
  gainNode.gain.linearRampToValueAtTime(
    volume,
    offsetTime + envelope.attack / scale,
  );
  gainNode.gain.linearRampToValueAtTime(
    (envelope.sustain / 127) * volume,
    offsetTime + envelope.attack / scale + envelope.decay / scale,
  );
  gainNode.gain.setValueAtTime(
    (envelope.sustain / 127) * volume,
    offsetTime + noteOnTime,
  );
  gainNode.gain.linearRampToValueAtTime(
    0,
    offsetTime + noteOnTime + envelope.release / scale,
  );
  return gainNode;
};
