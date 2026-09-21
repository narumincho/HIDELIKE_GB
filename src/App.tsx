import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact";
import { CharacterSymbolList, Direction, GbFrame } from "./sprite.tsx";
import { StageCanvas } from "./stage.tsx";
import {
  BlackBox,
  getStagePlayerInitialPosition,
  useGameState,
} from "./state.ts";
import { getStageEnemies } from "./enemyPositionTable.ts";
import { StageNumber } from "./StageNumber.ts";
import { getMapAttribute, isWall } from "./mapCollision.ts";
import { SpeakerIcon } from "./speakerIcon.tsx";
import {
  GameScreenContent,
  gameScreenHeight,
  gameScreenWidth,
} from "./gameScreenContent.tsx";
import { ActiveInputState, PadDirection, VirtualPad } from "./virtualPad.tsx";

const randomDirs: ReadonlyArray<Direction> = ["up", "down", "left", "right"];

const randomDirectionExcept = (
  excluded: ReadonlyArray<Direction>,
): Direction => {
  const available = randomDirs.filter((direction) =>
    !excluded.includes(direction)
  );
  return available[Math.floor(Math.random() * available.length)]!;
};

export function App(): JSX.Element {
  const {
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
  } = useGameState();

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const gamepadActionPrevRef = useRef(false);
  const gamepadDebugPrevRef = useRef(false);
  const gamepadGreenPrevRef = useRef(false);
  const frameCountRef = useRef(0);

  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isGbGreen, setIsGbGreen] = useState(false);
  const [keyboardHighlight, setKeyboardHighlight] = useState<ActiveInputState>({
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
  });

  const updateKeyboardHighlight = useCallback(() => {
    const keys = keysPressed.current;
    const up = Boolean(
      keys["ArrowUp"] || keys["w"] || keys["KeyW"] || keys["W"],
    );
    const down = Boolean(
      keys["ArrowDown"] || keys["s"] || keys["KeyS"] || keys["S"],
    );
    const left = Boolean(
      keys["ArrowLeft"] || keys["a"] || keys["KeyA"] || keys["A"],
    );
    const right = Boolean(
      keys["ArrowRight"] || keys["d"] || keys["KeyD"] || keys["D"],
    );
    const a = Boolean(
      keys[" "] || keys["Enter"] || keys["z"] || keys["KeyZ"] || keys["Z"] ||
        keys["j"] || keys["KeyJ"] || keys["J"],
    );
    const b = Boolean(
      keys["Shift"] || keys["ShiftLeft"] || keys["ShiftRight"] ||
        keys["k"] || keys["KeyK"] || keys["K"] ||
        keys["x"] || keys["KeyX"] || keys["X"],
    );
    setKeyboardHighlight((prev) => {
      if (
        prev.up === up && prev.down === down && prev.left === left &&
        prev.right === right && prev.a === a && prev.b === b
      ) {
        return prev;
      }
      return { up, down, left, right, a, b };
    });
  }, []);

  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === "undefined") return false;
    return globalThis.matchMedia("(max-aspect-ratio: 400/240)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = globalThis.matchMedia("(max-aspect-ratio: 400/240)");
    const onChange = () => setIsPortrait(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // 箱を設置するアクション (またはエンディングでのイラスト表示切替)
  const placeBox = useCallback(() => {
    setGameState((prev) => {
      if (prev.type === "ending") {
        playSe("seBullet");
        return {
          ...prev,
          showIllustration: !prev.showIllustration,
        };
      }
      if (prev.type !== "stage" || prev.alert) return prev;
      const stg = prev.stageNumber;

      // 原作: マップ13以降は箱を置けない。マップ13〜16では警告音
      if (stg >= 13) {
        if (stg < 17) {
          playSe("seBulletCannot");
        }
        return prev;
      }

      let dx = 0;
      let dy = 0;
      switch (prev.player.direction) {
        case "up":
          dy = -1;
          break;
        case "down":
          dy = 1;
          break;
        case "left":
          dx = -1;
          break;
        case "right":
          dx = 1;
          break;
      }

      // 原作: 置いた瞬間はプレイヤー位置 (px, py)
      const newBox: BlackBox = {
        x: prev.player.x,
        y: prev.player.y,
        timer: 0,
        slideStep: 0,
        dx,
        dy,
      };

      const currentBoxes = [...prev.boxes];
      if (currentBoxes.length >= 3) {
        currentBoxes.shift(); // 最大3個
      }
      currentBoxes.push(newBox);
      playSe("seBullet");

      return {
        ...prev,
        boxes: currentBoxes,
        score: {
          ...prev.score,
          boxUsedCount: prev.score.boxUsedCount + 1,
        },
      };
    });
  }, [playSe, setGameState]);

  const virtualPadRef = useRef<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    dash: boolean;
    action: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
    dash: false,
    action: false,
  });

  const handleVirtualDirectionChange = useCallback((dir: PadDirection) => {
    virtualPadRef.current.up = dir.up;
    virtualPadRef.current.down = dir.down;
    virtualPadRef.current.left = dir.left;
    virtualPadRef.current.right = dir.right;
  }, []);

  const handleVirtualDashChange = useCallback((dash: boolean) => {
    virtualPadRef.current.dash = dash;
  }, []);

  const handleVirtualActionChange = useCallback((pressed: boolean) => {
    virtualPadRef.current.action = pressed;
    if (pressed) getAudioContext();
  }, [getAudioContext]);

  // キーボードイベントハンドラ
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.code] = true;
      updateKeyboardHighlight();

      // 原作デバッグモードトグル (原作通り L+R+X)
      const isLrx = (keysPressed.current["l"] || keysPressed.current["KeyL"]) &&
        (keysPressed.current["r"] || keysPressed.current["KeyR"]) &&
        (e.key.toLowerCase() === "x" || e.code === "KeyX");
      if (isLrx) {
        setIsDebugMode((prev) => {
          const next = !prev;
          playSe(next ? "seMapChangeR" : "seMapChangeL");
          return next;
        });
      }

      // 原作GB GREENモードトグル (原作通り L+R+Y)
      const isLry = (keysPressed.current["l"] || keysPressed.current["KeyL"]) &&
        (keysPressed.current["r"] || keysPressed.current["KeyR"]) &&
        (e.key.toLowerCase() === "y" || e.code === "KeyY");
      if (isLry) {
        setIsGbGreen((prev) => {
          const next = !prev;
          playSe(next ? "seMapChangeR" : "seMapChangeL");
          return next;
        });
      }

      // デバッグ・テスト用マップ遷移ショートカット (N: 次へ, P: 前へ)
      if (gameState.type === "stage") {
        if (e.key === "n" || e.key === "N") {
          const nextStage = (gameState.stageNumber + 1) as StageNumber;
          if (nextStage >= 22) {
            playSe("seMapChangeLast");
            playBgm("bgm48");
            setGameState({
              type: "ending",
              score: gameState.score,
              mapBlobUrl: gameState.mapBlobUrl,
              endingStep: 0,
              showIllustration: false,
            });
          } else {
            playSe("seMapChangeR");
            updateBgmForStage(nextStage);
            setGameState({
              ...gameState,
              stageNumber: nextStage,
              player: {
                x: 16,
                y: gameState.player.y,
                direction: "right",
                dash: false,
              },
              enemies: getStageEnemies(nextStage),
              boxes: [],
              mapcp: 0,
            });
          }
        } else if (e.key === "p" || e.key === "P") {
          if (gameState.stageNumber > 0) {
            const prevStage = (gameState.stageNumber - 1) as StageNumber;
            playSe("seMapChangeL");
            updateBgmForStage(prevStage);
            setGameState({
              ...gameState,
              stageNumber: prevStage,
              player: {
                x: gameScreenWidth - 16,
                y: gameState.player.y,
                direction: "left",
                dash: false,
              },
              enemies: getStageEnemies(prevStage),
              boxes: [],
              mapcp: 0,
            });
          }
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.key.toUpperCase()] = false;
      keysPressed.current[e.code] = false;
      updateKeyboardHighlight();
    };

    const onBlur = () => {
      keysPressed.current = {};
      updateKeyboardHighlight();
    };

    globalThis.addEventListener("keydown", onKeyDown);
    globalThis.addEventListener("keyup", onKeyUp);
    globalThis.addEventListener("blur", onBlur);
    return () => {
      globalThis.removeEventListener("keydown", onKeyDown);
      globalThis.removeEventListener("keyup", onKeyUp);
      globalThis.removeEventListener("blur", onBlur);
    };
  }, [gameState, startGame, playSe, setGameState, updateKeyboardHighlight]);

  // 60Hz 固定タイムステップ用のアキュムレータと前回時間
  const lastTimeRef = useRef<number | null>(null);
  const accumulatorRef = useRef<number>(0);

  // メインゲームループ (原作 VSYNC 1 準拠の 60Hz 固定ステップ実行)
  useEffect(() => {
    let animId: number;

    const stepGame = () => {
      frameCountRef.current += 1;
      const frame = frameCountRef.current;

      // ゲームパッド入力のチェック
      const gamepads = typeof navigator !== "undefined" && navigator.getGamepads
        ? navigator.getGamepads()
        : [];
      let padUp = false;
      let padDown = false;
      let padLeft = false;
      let padRight = false;
      let padAction = false;
      let padDash = false;
      let padDebug = false;
      let padGreen = false;

      for (let pIdx = 0; pIdx < gamepads.length; pIdx++) {
        const pad = gamepads[pIdx];
        if (!pad) continue;
        const dpadUp = pad.buttons[12]?.pressed ?? false;
        const dpadDown = pad.buttons[13]?.pressed ?? false;
        const dpadLeft = pad.buttons[14]?.pressed ?? false;
        const dpadRight = pad.buttons[15]?.pressed ?? false;
        const axisX = pad.axes[0] ?? 0;
        const axisY = pad.axes[1] ?? 0;

        if (dpadUp || axisY < -0.35) padUp = true;
        if (dpadDown || axisY > 0.35) padDown = true;
        if (dpadLeft || axisX < -0.35) padLeft = true;
        if (dpadRight || axisX > 0.35) padRight = true;

        if (pad.buttons[0]?.pressed ?? false) {
          padAction = true;
        }

        const lb = pad.buttons[4]?.pressed ?? false;
        const rb = pad.buttons[5]?.pressed ?? false;
        const btnX = pad.buttons[2]?.pressed ?? false;
        const btnY = pad.buttons[3]?.pressed ?? false;

        // 原作隠しコマンド: LB + RB + X (デバッグモード), LB + RB + Y (GB GREEN)
        if (lb && rb && btnX) padDebug = true;
        if (lb && rb && btnY) padGreen = true;

        if (
          (pad.buttons[1]?.pressed ?? false) || // B
          btnX || btnY || lb || rb ||
          (pad.buttons[6]?.pressed ?? false) || // LT
          (pad.buttons[7]?.pressed ?? false) || // RT
          (pad.buttons[10]?.pressed ?? false) // L3
        ) {
          padDash = true;
        }
      }

      const keyboardAction = keysPressed.current[" "] ||
        keysPressed.current["Enter"] || keysPressed.current["z"] ||
        keysPressed.current["KeyZ"] || keysPressed.current["j"] ||
        keysPressed.current["KeyJ"];
      const actionHeld = padAction || keyboardAction ||
        virtualPadRef.current.action;
      const padActionTriggered = actionHeld && !gamepadActionPrevRef.current;
      gamepadActionPrevRef.current = actionHeld;

      if (padActionTriggered) {
        if (gameState.type === "title") {
          startGame();
        } else if (gameState.type === "stage" && !gameState.alert) {
          // キーボード・ボタン長押しで連続射出せず、1回押すごとに1個射出
          placeBox();
        } else if (gameState.type === "ending") {
          placeBox();
        }
      }

      const padDebugTriggered = padDebug && !gamepadDebugPrevRef.current;
      gamepadDebugPrevRef.current = padDebug;
      if (padDebugTriggered) {
        setIsDebugMode((prev) => {
          const next = !prev;
          playSe(next ? "seMapChangeR" : "seMapChangeL");
          return next;
        });
      }

      const padGreenTriggered = padGreen && !gamepadGreenPrevRef.current;
      gamepadGreenPrevRef.current = padGreen;
      if (padGreenTriggered) {
        setIsGbGreen((prev) => {
          const next = !prev;
          playSe(next ? "seMapChangeR" : "seMapChangeL");
          return next;
        });
      }

      setGameState((prevState) => {
        if (prevState.type === "ending") {
          return {
            ...prevState,
            endingStep: prevState.endingStep + 1,
          };
        }
        if (prevState.type !== "stage") {
          return prevState;
        }

        const score = {
          ...prevState.score,
          clearTimeFrames: prevState.score.clearTimeFrames + 1,
        };

        // 発見アラート中の処理 (30フレーム後にチェックポイントへリスポーン)
        if (prevState.alert && prevState.alert.active) {
          const newAlertTimer = prevState.alert.timer + 1;
          if (newAlertTimer >= 30) {
            const initPos = getStagePlayerInitialPosition(
              prevState.stageNumber,
              prevState.mapcp,
            );
            return {
              ...prevState,
              player: {
                x: initPos.x,
                y: initPos.y,
                direction: initPos.direction,
                dash: false,
              },
              enemies: getStageEnemies(prevState.stageNumber),
              boxes: [],
              alert: null,
              score,
            };
          }
          return {
            ...prevState,
            alert: { ...prevState.alert, timer: newAlertTimer },
            score,
          };
        }

        // 1. 箱の射出スライドアニメーション & タイマー更新 & 消滅判定
        const updatedBoxes: BlackBox[] = [];
        for (const box of prevState.boxes) {
          let bx = box.x;
          let by = box.y;
          let step = box.slideStep;
          if (step === 0) {
            // 1フレーム目: +16
            const nx = bx + 16 * box.dx;
            const ny = by + 16 * box.dy;
            bx = nx;
            by = ny;
            step = 1;
          } else if (step === 1) {
            // 2フレーム目: +16
            const nx = bx + 16 * box.dx;
            const ny = by + 16 * box.dy;
            bx = nx;
            by = ny;
            step = 2;
          } else if (step === 2) {
            // 3フレーム目: +9 (合計 41px スライド)
            const nx = bx + 9 * box.dx;
            const ny = by + 9 * box.dy;
            bx = nx;
            by = ny;
            step = 3;
          }

          const nextTimer = box.timer + 1;
          if (nextTimer >= 360) {
            playSe("seBulletClear");
          } else {
            updatedBoxes.push({
              ...box,
              x: bx,
              y: by,
              timer: nextTimer,
              slideStep: step,
            });
          }
        }

        // 2. 敵の巡回移動・向き変更AI
        const updatedEnemies = prevState.enemies.map((enemy) => {
          const e = { ...enemy };
          if (e.moveType === "map10") {
            if (e.id === 1) {
              e.x = e.initialX + Math.sin(frame * 0.04) * (16 * 3 - 8);
            } else if (e.id === 2) {
              e.x = e.initialX + Math.cos(frame * 0.04) * (16 * 3 - 8);
            }
          } else if (e.moveType === "map11") {
            if (e.id === 1) {
              e.y = e.initialY + Math.sin(frame * 0.02) * (16 * 2);
            } else if (e.id === 2) {
              e.x = e.initialX + Math.cos(frame * 0.04) * (16 * 3);
            }
          } else if (e.moveType === "map14") {
            e.y = e.initialY + Math.sin(frame * 0.05) * (16 * 3 - 12);
          } else if (e.moveType === "map13") {
            if (frame % 60 === 0) {
              e.direction = e.id === 2
                ? randomDirectionExcept(["down", "right"])
                : e.id === 3
                ? randomDirectionExcept(["up", "right"])
                : randomDirectionExcept([]);
            }
          } else if (e.moveType === "map15") {
            if (frame % 45 === 0) {
              e.direction = e.id === 1
                ? randomDirectionExcept(["up"])
                : e.id === 4
                ? randomDirectionExcept(["right"])
                : randomDirectionExcept([]);
            }
          }
          return e;
        });

        // 3. プレイヤー移動入力
        let vx = 0;
        let vy = 0;
        let dir = prevState.player.direction;

        const isUp = keysPressed.current["ArrowUp"] ||
          keysPressed.current["w"] || keysPressed.current["KeyW"] || padUp ||
          virtualPadRef.current.up;
        const isDown = keysPressed.current["ArrowDown"] ||
          keysPressed.current["s"] || keysPressed.current["KeyS"] || padDown ||
          virtualPadRef.current.down;
        const isLeft = keysPressed.current["ArrowLeft"] ||
          keysPressed.current["a"] || keysPressed.current["KeyA"] || padLeft ||
          virtualPadRef.current.left;
        const isRight = keysPressed.current["ArrowRight"] ||
          keysPressed.current["d"] || keysPressed.current["KeyD"] || padRight ||
          virtualPadRef.current.right;
        const isDash: boolean = Boolean(
          keysPressed.current["Shift"] || keysPressed.current["ShiftLeft"] ||
            keysPressed.current["ShiftRight"] ||
            keysPressed.current["k"] || keysPressed.current["KeyK"] ||
            keysPressed.current["x"] || keysPressed.current["KeyX"] ||
            padDash ||
            virtualPadRef.current.dash,
        );

        if (isUp) {
          vy -= 1;
          dir = "up";
        }
        if (isDown) {
          vy += 1;
          dir = "down";
        }
        if (isLeft) {
          vx -= 1;
          dir = "left";
        }
        if (isRight) {
          vx += 1;
          dir = "right";
        }

        // 斜め移動補正
        if (vx !== 0 && vy !== 0) {
          vx /= Math.SQRT2;
          vy /= Math.SQRT2;
        }

        let speed = isDash ? 1.1 : 0.7;
        // 原作演出: クレジットマップでの減速
        if (prevState.stageNumber === 16) speed /= 1.3;
        if (prevState.stageNumber === 17) speed /= 1.5;
        if (prevState.stageNumber === 18) speed /= 1.7;
        if (prevState.stageNumber === 19) speed /= 2.0;
        if (prevState.stageNumber === 20) speed /= 3.0;
        if (prevState.stageNumber === 21) {
          if (prevState.player.x > 16 * 6) {
            speed /= 5.0;
          } else if (prevState.player.x > 16 * 4) {
            speed /= 4.5;
          } else {
            speed /= 4.0;
          }
        }

        let px = prevState.player.x;
        let py = prevState.player.y;

        // 壁当たり判定 (原作準拠: 足元1点 targetPx, targetPy + 8 の判定、壁ならX/Y両方を巻き戻して壁ずりしない)
        const targetPx = px + vx * speed;
        const targetPy = py + vy * speed;

        // マップ境界の遷移エリアへの移動チェック (画面外への脱出移動は許可)
        const isExitingRight = vx > 0 && targetPx >= gameScreenWidth - 8;
        const isExitingLeft = vx < 0 && targetPx <= 8 &&
          prevState.stageNumber > 0 && prevState.stageNumber < 19;

        if (isExitingRight || isExitingLeft) {
          px = targetPx;
          py = Math.max(7, Math.min(targetPy, gameScreenHeight - 9));
        } else if (vx !== 0 || vy !== 0) {
          // 原作 GETATR(PX-8, PY): (targetPx, targetPy + 8) が壁でなければ移動
          if (!isWall(prevState.stageNumber, targetPx, targetPy + 8)) {
            px = Math.max(8, Math.min(targetPx, gameScreenWidth - 8));
            py = Math.max(7, Math.min(targetPy, gameScreenHeight - 9));
          }
        }

        // 4. マップ遷移チェック (右へ移動)
        if (px >= gameScreenWidth - 8) {
          const nextStage = (prevState.stageNumber + 1) as StageNumber;
          if (nextStage >= 22) {
            playSe("seMapChangeLast");
            playBgm("bgm48");
            return {
              type: "ending",
              score,
              mapBlobUrl: prevState.mapBlobUrl,
              endingStep: 0,
              showIllustration: false,
            };
          }

          playSe("seMapChangeR");
          updateBgmForStage(nextStage);
          const nextScore =
            nextStage === 19 && score.clearTimeAtCredits === null
              ? { ...score, clearTimeAtCredits: score.clearTimeFrames }
              : score;
          return {
            ...prevState,
            stageNumber: nextStage,
            player: {
              x: 16,
              y: py,
              direction: "right",
              dash: isDash,
            },
            enemies: getStageEnemies(nextStage),
            boxes: [],
            score: nextScore,
            mapcp: 0,
          };
        }

        // マップ遷移チェック (左へ戻る)
        if (
          px <= 8 && prevState.stageNumber > 0 && prevState.stageNumber < 19
        ) {
          const prevStage = (prevState.stageNumber - 1) as StageNumber;
          playSe("seMapChangeL");
          updateBgmForStage(prevStage);
          return {
            ...prevState,
            stageNumber: prevStage,
            player: {
              x: gameScreenWidth - 16,
              y: py,
              direction: "left",
              dash: isDash,
            },
            enemies: getStageEnemies(prevStage),
            boxes: [],
            score,
            mapcp: 0,
          };
        }

        // 画面内クランプ
        px = Math.max(8, Math.min(px, gameScreenWidth - 8));
        py = Math.max(7, Math.min(py, gameScreenHeight - 9));

        // チェックポイント (MAPCP) 更新判定 (原作 GETATR(PX, PY) 準拠: px + 8, py + 8)
        let currentMapcp = prevState.mapcp;
        const mapAttr = getMapAttribute(prevState.stageNumber, px + 8, py + 8);
        if ((mapAttr & 2) !== 0) currentMapcp = 2;
        if ((mapAttr & 4) !== 0) currentMapcp = 4;
        if ((mapAttr & 8) !== 0) currentMapcp = 8;

        // 5. 敵の視界判定（索敵）
        let spotted = false;
        let spottedEnemyPos = { x: 0, y: 0 };

        for (const enemy of updatedEnemies) {
          let inSight = false;

          if (enemy.character === "enemy3") {
            // 原作: ボス敵 (ENEMY3) は上下左右4方向すべてを同時に警戒
            // 1. down
            if (py > enemy.y && Math.abs(enemy.x - px) <= 4) {
              const hidden = updatedBoxes.some((box) =>
                box.y > enemy.y - 11 && py > box.y - 4 &&
                Math.abs(box.x - enemy.x) <= 8
              );
              if (!hidden) inSight = true;
            }
            // 2. up
            if (!inSight && py < enemy.y && Math.abs(enemy.x - px) <= 4) {
              const hidden = updatedBoxes.some((box) =>
                box.y < enemy.y + 2 && py < box.y + 3 &&
                Math.abs(box.x - enemy.x) <= 8
              );
              if (!hidden) inSight = true;
            }
            // 3. left
            if (!inSight && px < enemy.x && Math.abs(enemy.y - py) <= 4) {
              const hidden = updatedBoxes.some((box) =>
                box.x < enemy.x + 6 && px < box.x + 6 &&
                Math.abs(box.y - enemy.y) <= 8
              );
              if (!hidden) inSight = true;
            }
            // 4. right
            if (!inSight && px > enemy.x && Math.abs(enemy.y - py) <= 4) {
              const hidden = updatedBoxes.some((box) =>
                box.x > enemy.x - 6 && px > box.x - 5 &&
                Math.abs(box.y - enemy.y) <= 8
              );
              if (!hidden) inSight = true;
            }
          } else {
            // 通常敵: 向きに応じた直線索敵 (幅 ±4px)
            if (enemy.direction === "down") {
              inSight = py > enemy.y && Math.abs(enemy.x - px) <= 4;
            } else if (enemy.direction === "up") {
              inSight = py < enemy.y && Math.abs(enemy.x - px) <= 4;
            } else if (enemy.direction === "left") {
              inSight = px < enemy.x && Math.abs(enemy.y - py) <= 4;
            } else if (enemy.direction === "right") {
              inSight = px > enemy.x && Math.abs(enemy.y - py) <= 4;
            }

            if (inSight) {
              // 箱による遮蔽チェック
              let hiddenByBox = false;
              for (const box of updatedBoxes) {
                if (enemy.direction === "down") {
                  if (
                    box.y > enemy.y - 11 && py > box.y - 4 &&
                    Math.abs(box.x - enemy.x) <= 8
                  ) {
                    hiddenByBox = true;
                  }
                } else if (enemy.direction === "up") {
                  if (
                    box.y < enemy.y + 2 && py < box.y + 3 &&
                    Math.abs(box.x - enemy.x) <= 8
                  ) {
                    hiddenByBox = true;
                  }
                } else if (enemy.direction === "left") {
                  if (
                    box.x < enemy.x + 6 && px < box.x + 6 &&
                    Math.abs(box.y - enemy.y) <= 8
                  ) {
                    hiddenByBox = true;
                  }
                } else if (enemy.direction === "right") {
                  if (
                    box.x > enemy.x - 6 && px > box.x - 5 &&
                    Math.abs(box.y - enemy.y) <= 8
                  ) {
                    hiddenByBox = true;
                  }
                }
              }

              if (hiddenByBox) {
                inSight = false;
              }
            }
          }

          if (inSight) {
            spotted = true;
            spottedEnemyPos = { x: enemy.x, y: enemy.y };
            break;
          }
        }

        if (spotted) {
          playSe("seFound");
          return {
            ...prevState,
            alert: {
              active: true,
              x: spottedEnemyPos.x,
              y: Math.max(8, spottedEnemyPos.y - 14),
              timer: 0,
            },
            score: {
              ...score,
              foundCount: score.foundCount + 1,
            },
            boxes: updatedBoxes,
            enemies: updatedEnemies,
            mapcp: currentMapcp,
          };
        }

        return {
          ...prevState,
          player: {
            x: px,
            y: py,
            direction: dir,
            dash: isDash,
          },
          boxes: updatedBoxes,
          enemies: updatedEnemies,
          score,
          mapcp: currentMapcp,
        };
      });
    };

    const FIXED_STEP = 1000 / 60; // 60Hz固定ステップ (約16.667ms)

    const gameLoop = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      let deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // タブ非アクティブ時などの急激な時間跳躍を制限 (最大100ms)
      if (deltaTime > 100) {
        deltaTime = 100;
      }
      accumulatorRef.current += deltaTime;

      // 60Hz固定ステップで蓄積時間を消費
      while (accumulatorRef.current >= FIXED_STEP) {
        accumulatorRef.current -= FIXED_STEP;
        stepGame();
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animId);
      lastTimeRef.current = null;
      accumulatorRef.current = 0;
    };
  }, [
    playSe,
    playBgm,
    updateBgmForStage,
    setGameState,
    gameState.type,
    startGame,
    placeBox,
  ]);

  return (
    <>
      <SpeakerIcon isMuted={isMuted} onClick={toggleMute} />
      <div
        className="game-container"
        onClick={() => {
          getAudioContext();
          if (gameState.type === "title") {
            startGame();
          } else if (gameState.type === "stage" && !gameState.alert) {
            placeBox();
          } else if (gameState.type === "ending") {
            placeBox();
          }
        }}
        style={{
          cursor: gameState.type === "title" || gameState.type === "ending"
            ? "pointer"
            : "default",
        }}
      >
        <svg
          viewBox={isPortrait ? "40 0 320 240" : "0 0 400 240"}
          style={{
            imageRendering: "pixelated",
            shapeRendering: "crispEdges",
            objectFit: "contain",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <CharacterSymbolList />
          <GbFrame />
          <GameScreenContent
            gameState={gameState}
            startGame={startGame}
            isDebugMode={isDebugMode}
            isGbGreen={isGbGreen}
            frame={frameCountRef.current}
          />
        </svg>
        <div style={{ display: "none" }}>
          <StageCanvas onCreateBlobUrl={setMapBlobUrl} />
        </div>
      </div>
      <VirtualPad
        onDirectionChange={handleVirtualDirectionChange}
        onActionChange={handleVirtualActionChange}
        onDashChange={handleVirtualDashChange}
        activeInput={keyboardHighlight}
      />
    </>
  );
}
