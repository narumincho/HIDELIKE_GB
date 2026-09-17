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
  const sampleRate = 44100;
  // ループ全体の所要時間を概算、余裕を持って最大60秒
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

/** SE用の短いバッファを生成（ループなし） */
export const renderSe = async (
  track: Track,
  tempo: number,
  durationSec = 1.0,
): Promise<AudioBuffer> => {
  const sampleRate = 44100;
  const offlineAudioContext = new OfflineAudioContext({
    numberOfChannels: 2,
    length: Math.ceil(sampleRate * durationSec),
    sampleRate,
  });
  trackCreateOscillator(offlineAudioContext, track, tempo);
  return offlineAudioContext.startRendering();
};

/**
 * 4bit / 8bit 波形データを 1 周期分の PeriodicWave に変換
 */
const stringWaveToWave = (
  wave: Wave,
): {
  readonly real: Float32Array;
  readonly imag: Float32Array;
} => {
  if (wave.length === 32) {
    // プチコン3号のナムコ音源(N106)波形 (4bit / 16進数32文字)
    const firstHalf = wave.slice(0, 16);
    const secondHalf = wave.slice(16, 32);
    const isRepeated16 = firstHalf === secondHalf;

    const sampleCount = 32;
    const waveSampleFloatArray = new Float32Array(sampleCount);

    if (isRepeated16) {
      // 16サンプル周期が2回繰り返されている場合（12.5%矩形波など）
      // 1周期を32サンプルに拡張することで、32サンプル三角波と基本周波数を完全に一致させる
      for (let i = 0; i < 16; i += 1) {
        const val = Number.parseInt(firstHalf[i]!, 16);
        const normalized = (val / 15) * 2 - 1;
        waveSampleFloatArray[i * 2] = normalized;
        waveSampleFloatArray[i * 2 + 1] = normalized;
      }
    } else {
      // 32サンプルで1周期（三角波など）
      for (let i = 0; i < 32; i += 1) {
        const val = Number.parseInt(wave[i]!, 16);
        waveSampleFloatArray[i] = (val / 15) * 2 - 1;
      }
    }
    return fft(waveSampleFloatArray);
  }

  // 8bit 波形 (1サンプル2文字)
  const sampleCount = Math.floor(wave.length / 2);
  const powerOf2Count = sampleCount >= 64 ? 64 : 32;
  const waveSampleFloatArray = new Float32Array(powerOf2Count);
  for (let i = 0; i < powerOf2Count; i += 1) {
    if (i * 2 + 2 <= wave.length) {
      const num = Number.parseInt(wave.slice(i * 2, i * 2 + 2), 16);
      waveSampleFloatArray[i] = (num / 255) * 2 - 1;
    }
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

/**
 * MMLノートから周波数を計算
 * プチコン3号の O4 C が 261.626 Hz (中央ハ)
 */
export const noteToFrequency = (pitch: Pitch, octave: number): number => {
  return (
    261.626 *
    (2 ** (1 / 12)) ** ((octave - 4) * pitchList.length + pitchToNumber(pitch))
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
  oscillatorNode.stop(offset + noteOnTime + 0.1);
};

/**
 * 音の発生源を左右に動かす Node を作成する
 * @param value 0(左)～64(中央)～127(右)
 */
const createPannerNode = (
  offlineAudioContext: OfflineAudioContext,
  value: number,
): PannerNode => {
  const pannerNode = offlineAudioContext.createPanner();
  pannerNode.panningModel = "equalpower";
  pannerNode.positionX.value = (value / 64) - 1;
  return pannerNode;
};

/**
 * 音量を増減させる Node を作成する
 * @param envelope エンベロープ ADSR
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
  const scale = 3000;
  const attackTime = Math.max(0.005, envelope.attack / scale);
  const decayTime = Math.max(0.005, envelope.decay / scale);
  const releaseTime = Math.max(0.01, envelope.release / scale);
  const sustainLevel = Math.max(0, Math.min(1, envelope.sustain / 127)) * volume;

  gainNode.gain.setValueAtTime(0, offsetTime);
  gainNode.gain.linearRampToValueAtTime(volume, offsetTime + attackTime);
  gainNode.gain.linearRampToValueAtTime(
    sustainLevel,
    offsetTime + attackTime + decayTime,
  );
  gainNode.gain.setValueAtTime(sustainLevel, offsetTime + noteOnTime);
  gainNode.gain.linearRampToValueAtTime(
    0,
    offsetTime + noteOnTime + releaseTime,
  );
  return gainNode;
};
