import { bgm43, bgm47 } from "./mml/soundData";
import { useCallback, useEffect, useState } from "react";
import { Direction } from "./sprite";
import { FrontRectAlphaPhase } from "./FrontRectAlphaPhase";
import { Layer } from "./stage";
import { StageNumber } from "./StageNumber";
import { playSound } from "./mml/audio";

const MAPCHANGE_R_mp3Url = new URL(
  "../assets/MAPCHANGE_R.mp3",
  import.meta.url
);

type BgmAudioBuffer = {
  /** タイトル曲 */
  readonly bgm47: AudioBuffer;
  /** ステージ最初 */
  readonly bgm43: AudioBuffer;
  /** マップ変更効果音 */
  readonly MAPCHANGE_R: AudioBuffer;
};

export type State =
  | {
      readonly type: "loading";
      readonly titleBgmBufferSourceNode: AudioBufferSourceNode | undefined;
      readonly audioContext: AudioContext;
      readonly bgmAudioBuffer: BgmAudioBuffer | undefined;
      readonly mapBlobUrl: { readonly [key in Layer]: string } | undefined;
    }
  | {
      readonly type: "title";
      readonly mapBlobUrl: { readonly [key in Layer]: string };
      readonly titleBgmBufferSourceNode: AudioBufferSourceNode | undefined;
      readonly audioContext: AudioContext;
      readonly bgmAudioBuffer: BgmAudioBuffer | undefined;
    }
  | {
      readonly type: "titleStarted";
      readonly animationPhase: FrontRectAlphaPhase;
      readonly mapBlobUrl: { readonly [key in Layer]: string };
      readonly titleBgmBufferSourceNode: AudioBufferSourceNode | undefined;
      readonly audioContext: AudioContext;
      readonly bgmAudioBuffer: BgmAudioBuffer | undefined;
    }
  | {
      readonly type: "stage";
      readonly stageNumberAndPosition: StageNumberAndPosition;
      readonly mapBlobUrl: { readonly [key in Layer]: string };
      readonly titleBgmBufferSourceNode: AudioBufferSourceNode | undefined;
      readonly audioContext: AudioContext;
      readonly bgmAudioBuffer: BgmAudioBuffer | undefined;
    };

export type StageNumberAndPosition = {
  readonly stageNumber: StageNumber;
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
};

const loadingToTitle = (
  oldState: State,
  newData: {
    readonly titleBgmBufferSourceNode?: AudioBufferSourceNode | undefined;
    readonly bgmAudioBuffer?: BgmAudioBuffer | undefined;
    readonly mapBlobUrl?: { readonly [key in Layer]: string } | undefined;
  }
): State => {
  if (oldState.type !== "loading") {
    return oldState;
  }
  const titleBgmBufferSourceNode: AudioBufferSourceNode | undefined =
    oldState.titleBgmBufferSourceNode ?? newData.titleBgmBufferSourceNode;

  const bgmAudioBuffer: BgmAudioBuffer | undefined =
    oldState.bgmAudioBuffer ?? newData.bgmAudioBuffer;
  const mapBlobUrl: { readonly [key in Layer]: string } | undefined =
    oldState.mapBlobUrl ?? newData.mapBlobUrl;
  if (
    bgmAudioBuffer !== undefined &&
    mapBlobUrl !== undefined &&
    titleBgmBufferSourceNode !== undefined
  ) {
    return {
      type: "title",
      audioContext: oldState.audioContext,
      bgmAudioBuffer,
      mapBlobUrl,
      titleBgmBufferSourceNode,
    };
  }
  return {
    type: "loading",
    audioContext: oldState.audioContext,
    bgmAudioBuffer,
    mapBlobUrl,
    titleBgmBufferSourceNode,
  };
};

const getSe = (audioContext: AudioContext): Promise<AudioBuffer> =>
  new Promise((resolve, reject) => {
    fetch(MAPCHANGE_R_mp3Url.toString())
      .then((v) => v.arrayBuffer())
      .then((v) =>
        audioContext.decodeAudioData(
          v,
          (ok) => {
            resolve(ok);
          },
          (e) => {
            reject(e);
          }
        )
      );
  });

const playBgmOrSe = (
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  loop: boolean
): AudioBufferSourceNode => {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = loop;
  source.connect(audioContext.destination);
  source.start();
  console.log("bgm再生", source);
  return source;
};

const setAnimationPhase =
  (animationPhase: FrontRectAlphaPhase) =>
  (oldState: State): State => {
    if (oldState.type === "loading") {
      return oldState;
    }
    return {
      type: "titleStarted",
      animationPhase,
      mapBlobUrl: oldState.mapBlobUrl,
      audioContext: oldState.audioContext,
      bgmAudioBuffer: oldState.bgmAudioBuffer,
      titleBgmBufferSourceNode: oldState.titleBgmBufferSourceNode,
    };
  };

export const useAppState = (): {
  readonly state: State;
  readonly setMapBlobUrl: (mapBlobUrl: {
    readonly [key in Layer]: string;
  }) => void;
  readonly onChangeStageNumberAndPosition: (
    func: (old: StageNumberAndPosition) => StageNumberAndPosition
  ) => void;
} => {
  const [state, setState] = useState<State>(() => ({
    type: "loading",
    audioContext: new AudioContext(),
    titleBgmBufferSourceNode: undefined,
    bgmAudioBuffer: undefined,
    mapBlobUrl: undefined,
  }));

  const setBgmAudioBuffer = useCallback((bgmAudioBuffer: BgmAudioBuffer) => {
    setState((oldState) => {
      return loadingToTitle(oldState, { bgmAudioBuffer });
    });
  }, []);

  const setTitleBgmBufferSourceNode = useCallback(
    (titleBgmBufferSourceNode: AudioBufferSourceNode) => {
      setState((oldState) => {
        return loadingToTitle(oldState, { titleBgmBufferSourceNode });
      });
    },
    []
  );

  // BGM の読み込み
  useEffect(() => {
    Promise.all([
      playSound(bgm43),
      playSound(bgm47),
      getSe(state.audioContext),
    ]).then(([bgm43Buffer, bgm47Buffer, seBuffer]) => {
      console.log("bgm loaded");
      setBgmAudioBuffer({
        bgm43: bgm43Buffer,
        bgm47: bgm47Buffer,
        MAPCHANGE_R: seBuffer,
      });
    });
  }, [setBgmAudioBuffer, state.audioContext]);

  useEffect(() => {
    let removed = false;
    const removeListener = () => {
      if (removed) {
        return;
      }
      window.removeEventListener("pointerdown", bgmStart);
      window.removeEventListener("keydown", bgmStart);
      removed = true;
    };
    const bgmStart = () => {
      setState((oldState) => {
        if (
          oldState.titleBgmBufferSourceNode === undefined &&
          oldState.bgmAudioBuffer !== undefined
        ) {
          console.log("bgm再生");
          setTitleBgmBufferSourceNode(
            playBgmOrSe(
              oldState.audioContext,
              oldState.bgmAudioBuffer.bgm47,
              true
            )
          );
          removeListener();
        }
        return oldState;
      });
    };
    window.addEventListener("pointerdown", bgmStart);
    window.addEventListener("keydown", bgmStart);
    return removeListener;
  }, [setTitleBgmBufferSourceNode]);

  useEffect(() => {
    console.log("イベント再登録!");

    const onKeyDown = (event: KeyboardEvent): void => {
      setState((oldState): State => {
        console.log("キー入力を受け取った", event.key);
        if (oldState.type === "title" && event.key === " ") {
          const endTime = oldState.audioContext.currentTime + 2;
          const gainNode = oldState.audioContext.createGain();
          gainNode.gain.linearRampToValueAtTime(0, endTime);
          if (oldState.titleBgmBufferSourceNode !== undefined) {
            oldState.titleBgmBufferSourceNode.disconnect();
            oldState.titleBgmBufferSourceNode.connect(gainNode);
            gainNode.connect(oldState.audioContext.destination);
          }
          if (oldState.bgmAudioBuffer !== undefined) {
            console.log("効果音再生!");
            playBgmOrSe(
              oldState.audioContext,
              oldState.bgmAudioBuffer.MAPCHANGE_R,
              false
            );
          }
          window.setTimeout(() => {
            setState(setAnimationPhase(1));
          }, (30 * 1000) / 60);
          window.setTimeout(() => {
            setState(setAnimationPhase(2));
          }, ((30 + 30) * 1000) / 60);
          window.setTimeout(() => {
            setState((oldOldState) => {
              if (oldOldState.type === "loading") {
                return oldOldState;
              }
              if (oldOldState.bgmAudioBuffer !== undefined) {
                playBgmOrSe(
                  oldOldState.audioContext,
                  oldOldState.bgmAudioBuffer.bgm43,
                  false
                );
              }
              return {
                type: "stage",
                stageNumberAndPosition: {
                  stageNumber: 0,
                  x: 16 * 1,
                  y: 16 * 7 + 7,
                  direction: "right",
                },
                mapBlobUrl: oldOldState.mapBlobUrl,
                audioContext: oldOldState.audioContext,
                bgmAudioBuffer: oldOldState.bgmAudioBuffer,
                titleBgmBufferSourceNode: oldOldState.titleBgmBufferSourceNode,
              };
            });
          }, ((30 + 30 + 90) * 1000) / 60);

          return {
            type: "titleStarted",
            animationPhase: 0,
            mapBlobUrl: oldState.mapBlobUrl,
            audioContext: oldState.audioContext,
            bgmAudioBuffer: oldState.bgmAudioBuffer,
            titleBgmBufferSourceNode: oldState.titleBgmBufferSourceNode,
          };
        }
        return oldState;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const setMapBlobUrl = useCallback(
    (mapBlobUrl: { readonly [key in Layer]: string }) => {
      setState((oldState): State => {
        return loadingToTitle(oldState, { mapBlobUrl });
      });
    },
    []
  );

  const onChangeStageNumberAndPosition = useCallback(
    (func: (old: StageNumberAndPosition) => StageNumberAndPosition) => {
      setState((oldState) => {
        if (oldState.type !== "stage") {
          return oldState;
        }
        return {
          type: "stage",
          stageNumberAndPosition: func(oldState.stageNumberAndPosition),
          mapBlobUrl: oldState.mapBlobUrl,
          audioContext: oldState.audioContext,
          bgmAudioBuffer: oldState.bgmAudioBuffer,
          titleBgmBufferSourceNode: oldState.titleBgmBufferSourceNode,
        };
      });
    },
    []
  );

  return { state, setMapBlobUrl, onChangeStageNumberAndPosition };
};
