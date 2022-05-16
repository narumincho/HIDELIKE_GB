import { bgm43, bgm47 } from "./mml/soundData";
import { useCallback, useEffect, useState } from "react";
import { Direction } from "./sprite";
import { FrontRectAlphaPhase } from "./FrontRectAlphaPhase";
import { Layer } from "./stage";
import { StageNumber } from "./StageNumber";
import { playSound } from "./mml/audio";
import { useAnimationFrame } from "./useAnimationFrame";

const MAPCHANGE_R_mp3Url = new URL(
  "../assets/MAPCHANGE_R.mp3",
  import.meta.url
);

export const gameScreenWidth = 160;
export const gameScreenHeight = 144;

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
      readonly inputState: {
        readonly [key in Direction]: boolean;
      };
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
                inputState: {
                  up: false,
                  down: false,
                  left: false,
                  right: false,
                },
              };
            });
          }, ((30 + 30 + 90) * 1000) / 60);

          return {
            ...oldState,
            type: "titleStarted",
            animationPhase: 0,
          };
        }
        if (oldState.type === "stage") {
          switch (event.key) {
            case "w":
            case "ArrowUp":
              return {
                ...oldState,
                inputState: { ...oldState.inputState, up: true },
              };

            case "a":
            case "ArrowLeft":
              return {
                ...oldState,
                inputState: { ...oldState.inputState, left: true },
              };

            case "s":
            case "ArrowDown":
              return {
                ...oldState,
                inputState: { ...oldState.inputState, down: true },
              };

            case "d":
            case "ArrowRight":
              return {
                ...oldState,
                inputState: { ...oldState.inputState, right: true },
              };
          }
        }
        return oldState;
      });
    };

    const onKeyUp = (event: KeyboardEvent) => {
      console.log("onKeyUp", event.key);
      setState((oldState) => {
        if (oldState.type !== "stage") {
          return oldState;
        }
        switch (event.key) {
          case "w":
          case "ArrowUp":
            return {
              ...oldState,
              inputState: { ...oldState.inputState, up: false },
            };

          case "a":
          case "ArrowLeft":
            return {
              ...oldState,
              inputState: { ...oldState.inputState, left: false },
            };

          case "s":
          case "ArrowDown":
            return {
              ...oldState,
              inputState: { ...oldState.inputState, down: false },
            };

          case "d":
          case "ArrowRight":
            return {
              ...oldState,
              inputState: { ...oldState.inputState, right: false },
            };
        }
        return oldState;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
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

  const loop = useCallback(() => {
    console.log("無限ループ");
    setState((oldState) => {
      if (oldState.type !== "stage") {
        return oldState;
      }
      let newStageNumberAndPosition = oldState.stageNumberAndPosition;
      if (oldState.inputState.up) {
        newStageNumberAndPosition = updateStageNumberAndPositionWithClamp(
          newStageNumberAndPosition,
          "up"
        );
      }
      if (oldState.inputState.down) {
        newStageNumberAndPosition = updateStageNumberAndPositionWithClamp(
          newStageNumberAndPosition,
          "down"
        );
      }
      if (oldState.inputState.left) {
        newStageNumberAndPosition = updateStageNumberAndPositionWithClamp(
          newStageNumberAndPosition,
          "left"
        );
      }
      if (oldState.inputState.right) {
        newStageNumberAndPosition = updateStageNumberAndPositionWithClamp(
          newStageNumberAndPosition,
          "right"
        );
      }
      return {
        ...oldState,
        stageNumberAndPosition: newStageNumberAndPosition,
      };
    });
  }, []);

  useAnimationFrame(loop);

  return { state, setMapBlobUrl };
};

const updateStageNumberAndPositionWithClamp = (
  stageNumberAndPosition: StageNumberAndPosition,
  command: Direction
): StageNumberAndPosition => {
  const moved = updateStageNumberAndPosition(stageNumberAndPosition, command);
  return {
    stageNumber: moved.stageNumber,
    direction: moved.direction,
    x: Math.max(8, Math.min(moved.x, gameScreenWidth - 8)),
    y: Math.max(7, Math.min(moved.y, gameScreenHeight - 9)),
  };
};

const updateStageNumberAndPosition = (
  stageNumberAndPosition: StageNumberAndPosition,
  command: Direction
): StageNumberAndPosition => {
  const newPositionAndDirection = updatePositionAndDirection(
    stageNumberAndPosition,
    command
  );
  // 右のステージへの移動
  if (gameScreenWidth < newPositionAndDirection.x + 9) {
    return {
      stageNumber: (stageNumberAndPosition.stageNumber + 1) as StageNumber,
      x: 16,
      y: newPositionAndDirection.y,
      direction: "right",
    };
  }
  // 左のステージへの移動
  if (
    stageNumberAndPosition.stageNumber > 0 &&
    newPositionAndDirection.x - 9 < 0
  ) {
    return {
      stageNumber: (stageNumberAndPosition.stageNumber - 1) as StageNumber,
      x: gameScreenWidth - 16,
      y: newPositionAndDirection.y,
      direction: "right",
    };
  }

  return {
    stageNumber: stageNumberAndPosition.stageNumber,
    x: newPositionAndDirection.x,
    y: newPositionAndDirection.y,
    direction: newPositionAndDirection.direction,
  };
};

type PositionAndDirection = {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
};

const updatePositionAndDirection = (
  stageNumberAndPosition: PositionAndDirection,
  command: Direction
): PositionAndDirection => {
  switch (command) {
    case "up":
      return {
        x: stageNumberAndPosition.x,
        y: stageNumberAndPosition.y - 1,
        direction: "up",
      };
    case "down":
      return {
        x: stageNumberAndPosition.x,
        y: stageNumberAndPosition.y + 1,
        direction: "down",
      };
    case "left":
      return {
        x: stageNumberAndPosition.x - 1,
        y: stageNumberAndPosition.y,
        direction: "left",
      };
    case "right":
      return {
        x: stageNumberAndPosition.x + 1,
        y: stageNumberAndPosition.y,
        direction: "right",
      };
  }
};
