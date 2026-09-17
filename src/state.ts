import { useCallback, useEffect, useRef, useState } from "preact/compat";
import { Direction } from "./sprite.tsx";
import { FrontRectAlphaPhase } from "./FrontRectAlphaPhase.ts";
import { Layer } from "./stage.tsx";
import { StageNumber } from "./StageNumber.ts";
import {
  bgm43,
  bgm44,
  bgm45,
  bgm46,
  bgm47,
  bgm48,
  seBullet,
  seBulletCannot,
  seBulletClear,
  seFound,
  seMapChangeL,
  seMapChangeLast,
  seMapChangeR,
} from "./mml/soundData.ts";
import { playSound, renderSe } from "./mml/audio.ts";
import { EnemyData, getStageEnemies } from "./enemyPositionTable.ts";

export type BlackBox = {
  readonly x: number;
  readonly y: number;
  readonly timer: number;
  readonly slideStep: number;
  readonly dx: number;
  readonly dy: number;
};

export type PlayerState = {
  x: number;
  y: number;
  direction: Direction;
  dash: boolean;
};

export type BgmAudioBuffer = {
  bgm47: AudioBuffer;
  bgm43: AudioBuffer;
  bgm44: AudioBuffer;
  bgm45: AudioBuffer;
  bgm46: AudioBuffer;
  bgm48: AudioBuffer;
  seFound: AudioBuffer;
  seBullet: AudioBuffer;
  seBulletClear: AudioBuffer;
  seBulletCannot: AudioBuffer;
  seMapChangeR: AudioBuffer;
  seMapChangeL: AudioBuffer;
  seMapChangeLast: AudioBuffer;
};

export type GameScore = {
  clearTimeFrames: number;
  /** 原作の CLEARTIME。マップ19へ初めて入った時点のフレーム数 */
  clearTimeAtCredits: number | null;
  boxUsedCount: number;
  foundCount: number;
};

export type AlertState = {
  active: boolean;
  x: number;
  y: number;
  timer: number;
};

export type GameState =
  | {
    readonly type: "loading";
  }
  | {
    readonly type: "title";
    readonly mapBlobUrl: { readonly [key in Layer]: string };
  }
  | {
    readonly type: "titleStarted";
    readonly animationPhase: FrontRectAlphaPhase;
    readonly mapBlobUrl: { readonly [key in Layer]: string };
  }
  | {
    readonly type: "stage";
    readonly stageNumber: StageNumber;
    readonly player: PlayerState;
    readonly boxes: ReadonlyArray<BlackBox>;
    readonly enemies: ReadonlyArray<EnemyData>;
    readonly alert: AlertState | null;
    readonly score: GameScore;
    readonly mapBlobUrl: { readonly [key in Layer]: string };
    readonly mapcp: number;
  }
  | {
    readonly type: "ending";
    readonly score: GameScore;
    readonly mapBlobUrl: { readonly [key in Layer]: string };
    readonly endingStep: number;
    readonly showIllustration: boolean;
  };

/** ステージごとのプレイヤーリスポーン初期位置 (x, y) */
export const getStagePlayerInitialPosition = (
  stageNumber: number,
  mapcp = 0,
): { x: number; y: number; direction: Direction } => {
  switch (stageNumber) {
    case 0:
      return { x: 16 * 2 + 8, y: 16 * 7 + 7, direction: "right" };
    case 1:
      return { x: 16 * 1 + 8, y: 16 * 1 + 7, direction: "right" };
    case 2:
      return { x: 16 * 1 + 8, y: 16 * 7 + 7, direction: "right" };
    case 3:
      return { x: 16 * 1 + 8, y: 16 * 4 + 7, direction: "right" };
    case 4:
      return { x: 16 * 1 + 8, y: 16 * 7 + 7, direction: "right" };
    case 5:
      return { x: 16 * 1 + 8, y: 16 * 7 + 7, direction: "right" };
    case 6:
      return { x: 16 * 1 + 8, y: 16 * 1 + 2, direction: "right" };
    case 7:
      return { x: 16 * 1 + 8, y: 16 * 4 + 7, direction: "right" };
    case 8:
      return { x: 16 * 1 + 8, y: 16 * 4 + 7, direction: "right" };
    case 9:
      return { x: 16 * 1 + 8, y: 16 * 3 + 7, direction: "right" };
    case 10:
      return { x: 16 * 1 + 8, y: 16 * 4 + 7, direction: "right" };
    case 11:
      return { x: 16 * 1 + 8, y: 16 * 7 + 7, direction: "right" };
    case 12:
      return { x: 16 * 1 + 8, y: 16 * 0 + 7, direction: "right" };
    case 13:
      if (mapcp === 4) {
        return { x: 16 * 8 + 8, y: 16 * 6 + 7, direction: "right" };
      }
      return { x: 16 * 1 + 8, y: 16 * 0 + 7, direction: "right" };
    case 14:
      if (mapcp === 8) {
        return { x: 16 * 1 + 8, y: 16 * 8 + 7, direction: "right" };
      }
      return { x: 16 * 1 + 8, y: 16 * 0 + 7, direction: "right" };
    case 15:
      return { x: 16 * 1 + 8, y: 16 * 7 + 7, direction: "right" };
    default:
      return { x: 16 * 1 + 8, y: 16 * 4 + 7, direction: "right" };
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({ type: "loading" });
  const [mapBlobUrl, setMapBlobUrl] = useState<
    { readonly [key in Layer]: string } | undefined
  >(undefined);

  const audioContextRef = useRef<AudioContext | null>(null);
  const bgmBuffersRef = useRef<BgmAudioBuffer | null>(null);
  const currentBgmNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const currentBgmTypeRef = useRef<keyof BgmAudioBuffer | null>(null);
  const targetBgmKeyRef = useRef<keyof BgmAudioBuffer | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const isMutedRef = useRef(true);
  isMutedRef.current = isMuted;

  const getAudioContext = useCallback((): AudioContext => {
    if (!audioContextRef.current) {
      const AudioCtx = globalThis.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playBgm = useCallback((bgmKey: keyof BgmAudioBuffer | null) => {
    targetBgmKeyRef.current = bgmKey;
    if (currentBgmTypeRef.current === bgmKey && currentBgmNodeRef.current) {
      return;
    }
    currentBgmTypeRef.current = bgmKey;
    if (currentBgmNodeRef.current) {
      try {
        currentBgmNodeRef.current.stop();
        currentBgmNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      currentBgmNodeRef.current = null;
    }
    if (isMutedRef.current || !bgmKey || !bgmBuffersRef.current) {
      return;
    }
    const ctx = getAudioContext();
    const buffer = bgmBuffersRef.current[bgmKey];
    if (!buffer) {
      return;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(ctx.destination);
    source.start();
    currentBgmNodeRef.current = source;
  }, [getAudioContext]);

  const playSe = useCallback((seKey: keyof BgmAudioBuffer) => {
    if (isMutedRef.current || !bgmBuffersRef.current) {
      return;
    }
    const ctx = getAudioContext();
    const buffer = bgmBuffersRef.current[seKey];
    if (!buffer) {
      return;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = false;
    source.connect(ctx.destination);
    source.start();
  }, [getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (!next) {
        const ctx = getAudioContext();
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const key = targetBgmKeyRef.current ??
          (gameState.type === "title" ? "bgm47" : null);
        if (key && bgmBuffersRef.current) {
          const buffer = bgmBuffersRef.current[key];
          if (buffer) {
            if (currentBgmNodeRef.current) {
              try {
                currentBgmNodeRef.current.stop();
                currentBgmNodeRef.current.disconnect();
              } catch {
                // ignore
              }
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            source.connect(ctx.destination);
            source.start();
            currentBgmNodeRef.current = source;
            currentBgmTypeRef.current = key;
          }
        }
      } else {
        if (currentBgmNodeRef.current) {
          try {
            currentBgmNodeRef.current.stop();
            currentBgmNodeRef.current.disconnect();
          } catch {
            // ignore
          }
          currentBgmNodeRef.current = null;
        }
      }
      return next;
    });
  }, [getAudioContext, gameState.type]);

  // 音声・MMLバッファの初期プリレンダリング
  useEffect(() => {
    let active = true;
    Promise.all([
      playSound(bgm47),
      playSound(bgm43),
      playSound(bgm44),
      playSound(bgm45),
      playSound(bgm46),
      playSound(bgm48),
      renderSe(seFound, 120, 0.5),
      renderSe(seBullet, 120, 0.4),
      renderSe(seBulletClear, 220, 0.3),
      renderSe(seBulletCannot, 120, 0.4),
      renderSe(seMapChangeR, 140, 0.3),
      renderSe(seMapChangeL, 140, 0.3),
      renderSe(seMapChangeLast, 70, 0.6),
    ]).then(([
      b47,
      b43,
      b44,
      b45,
      b46,
      b48,
      sFound,
      sBullet,
      sBulletClear,
      sBulletCannot,
      sMapR,
      sMapL,
      sMapLast,
    ]) => {
      if (!active) return;
      bgmBuffersRef.current = {
        bgm47: b47,
        bgm43: b43,
        bgm44: b44,
        bgm45: b45,
        bgm46: b46,
        bgm48: b48,
        seFound: sFound,
        seBullet: sBullet,
        seBulletClear: sBulletClear,
        seBulletCannot: sBulletCannot,
        seMapChangeR: sMapR,
        seMapChangeL: sMapL,
        seMapChangeLast: sMapLast,
      };
      console.log("全サウンドバッファ準備完了");
    });
    return () => {
      active = false;
    };
  }, []);

  // マップBlobとサウンドが揃ったらタイトルへ遷移
  useEffect(() => {
    if (mapBlobUrl && gameState.type === "loading") {
      setGameState({
        type: "title",
        mapBlobUrl,
      });
    }
  }, [mapBlobUrl, gameState.type]);

  // タイトル画面でのBGM開始（ユーザーインタラクション時）
  useEffect(() => {
    if (gameState.type === "title") {
      const startTitleBgm = () => {
        playBgm("bgm47");
        globalThis.removeEventListener("pointerdown", startTitleBgm);
        globalThis.removeEventListener("keydown", startTitleBgm);
      };
      globalThis.addEventListener("pointerdown", startTitleBgm);
      globalThis.addEventListener("keydown", startTitleBgm);
      return () => {
        globalThis.removeEventListener("pointerdown", startTitleBgm);
        globalThis.removeEventListener("keydown", startTitleBgm);
      };
    }
  }, [gameState.type, playBgm]);

  // ステージ切り替え時のBGMコントロール
  const updateBgmForStage = useCallback((stageNum: number) => {
    if (stageNum < 3) {
      playBgm("bgm43");
    } else if (stageNum < 7) {
      playBgm("bgm44");
    } else if (stageNum < 8) {
      playBgm(null); // 無音
    } else if (stageNum < 12) {
      playBgm("bgm45");
    } else if (stageNum < 16) {
      playBgm("bgm46");
    } else if (stageNum < 18) {
      playBgm(null); // 無音
    } else if (stageNum === 19) {
      playBgm("bgm48"); // エンディングBGM
    } else {
      playBgm(null);
    }
  }, [playBgm]);

  // ゲームスタート（タイトルからステージ0へ）
  const startGame = useCallback(() => {
    if (gameState.type !== "title") return;
    playSe("seMapChangeR");
    setGameState({
      type: "titleStarted",
      animationPhase: 0,
      mapBlobUrl: gameState.mapBlobUrl,
    });
    globalThis.setTimeout(() => {
      setGameState((prev) =>
        prev.type === "titleStarted" ? { ...prev, animationPhase: 1 } : prev
      );
    }, 500);
    globalThis.setTimeout(() => {
      setGameState((prev) =>
        prev.type === "titleStarted" ? { ...prev, animationPhase: 2 } : prev
      );
    }, 1000);
    globalThis.setTimeout(() => {
      updateBgmForStage(0);
      const initPos = getStagePlayerInitialPosition(0);
      setGameState({
        type: "stage",
        stageNumber: 0,
        player: {
          x: initPos.x,
          y: initPos.y,
          direction: initPos.direction,
          dash: false,
        },
        boxes: [],
        enemies: getStageEnemies(0),
        alert: null,
        score: {
          clearTimeFrames: 0,
          clearTimeAtCredits: null,
          boxUsedCount: 0,
          foundCount: 0,
        },
        mapBlobUrl: gameState.mapBlobUrl,
        mapcp: 0,
      });
    }, 2500);
  }, [gameState, playSe, updateBgmForStage]);

  return {
    gameState,
    setGameState,
    setMapBlobUrl,
    playBgm,
    playSe,
    updateBgmForStage,
    startGame,
    getAudioContext,
    isMuted,
    toggleMute,
  };
};
