import {
  Envelope,
  GateQuantize,
  MML,
  Pitch,
  pitchList,
  Track,
  Wave,
} from "./type.ts";

import { fft } from "./fft.ts";
import { mmlStringToEasyReadType } from "./mmlToEasy.ts";

/**
 * BGM用の AudioBuffer を生成（正確なループ長で一括レンダリング）
 */
export const playSound = async (mml: MML): Promise<AudioBuffer> => {
  const sampleRate = 44100;

  // 全トラックの最大演奏時間を算出（正確なループ時間）
  let maxDuration = 0;
  for (const track of mml.trackList) {
    const fullMml = track.intro ? `${track.intro} ${track.loop}` : track.loop;
    const ops = mmlStringToEasyReadType(fullMml);
    let trackDuration = 0;
    for (const op of ops) {
      if (op.c === "note" || op.c === "rest") {
        trackDuration += noteToSeconds(op.length, op.dotted, mml.tempo, 8);
      }
    }
    if (trackDuration > maxDuration) {
      maxDuration = trackDuration;
    }
  }

  const durationSec = Math.max(0.1, maxDuration);
  const length = Math.ceil(sampleRate * durationSec);

  const offlineAudioContext = new OfflineAudioContext({
    numberOfChannels: 2,
    length,
    sampleRate,
  });

  // 全トラックを 1 つのコンテキストに接続して並行レンダリング
  for (const track of mml.trackList) {
    trackCreateOscillator(offlineAudioContext, track, mml.tempo);
  }

  return await offlineAudioContext.startRendering();
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
  return await offlineAudioContext.startRendering();
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
  const fullMml = track.intro ? `${track.intro} ${track.loop}` : track.loop;
  const mmlOperators = mmlStringToEasyReadType(fullMml);

  // トラック全体のボリューム (デフォルト80)
  const trackVolRatio = (track.volume ?? 80) / 127;

  let timeOffset = 0;
  let octave = 4;
  let noteVolume = 100;
  let gateQuantize: GateQuantize = 8;

  // タイで繋がれたノートを合算して処理するための蓄積
  let pendingNote: {
    pitch: Pitch;
    octave: number;
    volume: number;
    gateQuantize: GateQuantize;
    totalSeconds: number;
    startOffset: number;
  } | null = null;

  const flushPendingNote = () => {
    if (!pendingNote) return;
    const effectiveVolume = (pendingNote.volume / 127) * trackVolRatio;
    createOscillator(
      offlineAudioContext,
      wave,
      effectiveVolume,
      pendingNote.pitch,
      pendingNote.octave,
      pendingNote.gateQuantize,
      track.detune,
      track.envelope,
      pendingNote.totalSeconds,
      track.pan,
      pendingNote.startOffset,
    );
    pendingNote = null;
  };

  for (const op of mmlOperators) {
    switch (op.c) {
      case "octaveChange":
        octave = op.octave;
        break;
      case "volumeChange":
        noteVolume = op.volume;
        break;
      case "gateQuantizeChange":
        gateQuantize = op.value;
        break;
      case "note": {
        const durSec = noteToSeconds(op.length, op.dotted, tempo, 8);
        if (
          pendingNote &&
          pendingNote.pitch === op.pitch &&
          pendingNote.octave === octave
        ) {
          // 直前の音とタイで繋がっている
          pendingNote.totalSeconds += durSec;
        } else {
          // 直前のペンディングを完了して発音
          flushPendingNote();
          pendingNote = {
            pitch: op.pitch,
            octave,
            volume: noteVolume,
            gateQuantize,
            totalSeconds: durSec,
            startOffset: timeOffset,
          };
        }

        // タイでなければここで確定
        if (!op.tie) {
          flushPendingNote();
        }
        timeOffset += durSec;
        break;
      }
      case "rest": {
        flushPendingNote();
        const durSec = noteToSeconds(op.length, op.dotted, tempo, 8);
        timeOffset += durSec;
        break;
      }
    }
  }
  flushPendingNote();
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
  pitch: Pitch,
  octave: number,
  gateQuantize: GateQuantize,
  detune: number,
  envelope: Envelope,
  totalDurationSec: number,
  pan: number,
  offset: number,
): void => {
  const oscillatorNode = offlineAudioContext.createOscillator();
  oscillatorNode.frequency.value = noteToFrequency(pitch, octave);
  oscillatorNode.setPeriodicWave(wave);
  oscillatorNode.detune.value = 100 * (detune / 64);

  const pannerNode = createPannerNode(offlineAudioContext, pan);

  /** ゲートクオンタイズを適用した実効ノートオン時間 */
  const noteOnTime = gateQuantize === 0
    ? Math.min(totalDurationSec, 0.02)
    : totalDurationSec * (gateQuantize / 8);

  const gainNode = createGainNode(
    offlineAudioContext,
    offset,
    envelope,
    volume,
    noteOnTime,
  );

  oscillatorNode.connect(pannerNode);
  pannerNode.connect(gainNode);
  gainNode.connect(offlineAudioContext.destination);

  oscillatorNode.start(offset);
  oscillatorNode.stop(offset + noteOnTime + 0.35);
};

/**
 * ステレオパンナー Node を作成する
 * @param value 0(左)～64(中央)～127(右)
 */
const createPannerNode = (
  offlineAudioContext: OfflineAudioContext,
  value: number,
): StereoPannerNode => {
  const pannerNode = offlineAudioContext.createStereoPanner();
  pannerNode.pan.value = Math.max(-1, Math.min(1, (value - 64) / 64));
  return pannerNode;
};

/**
 * プチコン3号準拠の ADSR エンベロープ Node を作成する
 * @param envelope エンベロープ ADSR (各0～127)
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

  // プチコン3号 @E 仕様:
  // Attack: 127で即座に立ち上がり(最速)、0で最遅(フェードイン)
  const attackTime = 0.002 +
    ((127 - Math.min(127, Math.max(0, envelope.attack))) / 127) * 0.4;
  // Decay: 127で減衰が最も遅い(サスティンへの移行が緩やか)、0で即座にサスティンレベルへ
  const decayTime = 0.002 +
    ((127 - Math.min(127, Math.max(0, envelope.decay))) / 127) * 0.4;
  // Sustain: 127で最大音量維持、0で減衰して無音
  const sustainLevel = (Math.min(127, Math.max(0, envelope.sustain)) / 127) *
    volume;
  // Release: ノートオフ後の余韻。127で最長(約0.3秒)、0で即停止
  const releaseTime = 0.005 +
    (Math.min(127, Math.max(0, envelope.release)) / 127) * 0.25;

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
