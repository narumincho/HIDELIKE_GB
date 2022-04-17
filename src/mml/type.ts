export type MML = {
  readonly tempo: number;
  readonly trackList: ReadonlyArray<Track>;
};

export type Track = {
  readonly tone: Wave;
  readonly pan: number;
  readonly detune: number;
  readonly envelope: Envelope;
  readonly intro: string;
  readonly loop: string;
};

/**
 * ADSR エンベロープ https://ja.wikipedia.org/wiki/ADSR
 */
export type Envelope = {
  /** 0～127 */
  readonly attack: number;
  /** 0～127 */
  readonly decay: number;
  /** 0～127 */
  readonly sustain: number;
  /** 0～127 */
  readonly release: number;
};

export type MMLOperator =
  | OctaveChange
  | VolumeChange
  | GateQuantizeChange
  | Note
  | Rest;

export type OctaveChange = {
  readonly c: "octaveChange";
  readonly octave: number;
};
export type GateQuantizeChange = {
  readonly c: "gateQuantizeChange";
  readonly value: GateQuantize;
};

export type GateQuantize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type VolumeChange = {
  readonly c: "volumeChange";
  readonly volume: number;
};
export type Note = {
  readonly c: "note";
  readonly pitch: Pitch;
  readonly length: number;
  readonly dotted: boolean;
};
export type Rest = {
  readonly c: "rest";
  readonly length: number;
  readonly dotted: boolean;
};

/** 波形 */
export type Wave = string;

export const pitchList = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

/** 音階 */
export type Pitch = typeof pitchList[number];
