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

  // キーボードイベントハンドラ
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      keysPressed.current[e.code] = true;

      // 原作デバッグモードトグル (Dキー または Shift+X)
      if (
        e.key === "d" || e.key === "D" ||
        (e.shiftKey && (e.key === "x" || e.key === "X"))
      ) {
        setIsDebugMode((prev) => {
          const next = !prev;
          playSe(next ? "seMapChangeR" : "seMapChangeL");
          return next;
        });
      }

      // 原作GB GREENモードトグル (Gキー または Shift+Y)
      if (
        e.key === "g" || e.key === "G" ||
        (e.shiftKey && (e.key === "y" || e.key === "Y"))
      ) {
        setIsGbGreen((prev) => {
          const next = !prev;
          playSe(next ? "seMapChangeR" : "seMapChangeL");
          return next;
        });
      }

      // タイトルでのスタート
      if (gameState.type === "title") {
        if (
          e.key === " " || e.key === "Enter" || e.key === "z" || e.key === "Z"
        ) {
          startGame();
        }
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

      if (gameState.type === "ending") {
        if (
          e.key === " " || e.key === "Enter" || e.key === "z" || e.key === "Z"
        ) {
          placeBox();
        }
      }

      // 箱の設置 (Aボタン)
      if (gameState.type === "stage" && !gameState.alert) {
        if (
          e.key === " " || e.key === "z" || e.key === "Z" || e.key === "j" ||
          e.key === "J"
        ) {
          placeBox();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
      keysPressed.current[e.code] = false;
    };

    globalThis.addEventListener("keydown", onKeyDown);
    globalThis.addEventListener("keyup", onKeyUp);
    return () => {
      globalThis.removeEventListener("keydown", onKeyDown);
      globalThis.removeEventListener("keyup", onKeyUp);
    };
  }, [gameState, startGame, playSe, setGameState]);

  // メインゲームループ (60fps requestAnimationFrame)
  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
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

        if (
          (pad.buttons[0]?.pressed ?? false) || // A
          (pad.buttons[1]?.pressed ?? false) || // B
          (pad.buttons[9]?.pressed ?? false) // Start
        ) {
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
          btnX || btnY || lb || rb ||
          (pad.buttons[6]?.pressed ?? false) || // LT
          (pad.buttons[7]?.pressed ?? false) || // RT
          (pad.buttons[10]?.pressed ?? false) // L3
        ) {
          padDash = true;
        }
      }

      const padActionTriggered = padAction && !gamepadActionPrevRef.current;
      gamepadActionPrevRef.current = padAction;

      if (padActionTriggered) {
        if (gameState.type === "title") {
          startGame();
        } else if (gameState.type === "stage" && !gameState.alert) {
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
            if (!isWall(prevState.stageNumber, nx, ny)) {
              bx = nx;
              by = ny;
            }
            step = 1;
          } else if (step === 1) {
            // 2フレーム目: +16
            const nx = bx + 16 * box.dx;
            const ny = by + 16 * box.dy;
            if (!isWall(prevState.stageNumber, nx, ny)) {
              bx = nx;
              by = ny;
            }
            step = 2;
          } else if (step === 2) {
            // 3フレーム目: +9 (合計 41px スライド)
            const nx = bx + 9 * box.dx;
            const ny = by + 9 * box.dy;
            if (!isWall(prevState.stageNumber, nx, ny)) {
              bx = nx;
              by = ny;
            }
            step = 3;
          }
          bx = Math.max(8, Math.min(bx, gameScreenWidth - 8));
          by = Math.max(7, Math.min(by, gameScreenHeight - 9));

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
              const dirs: Direction[] = ["up", "down", "left", "right"];
              e.direction = dirs[Math.floor(Math.random() * dirs.length)]!;
            }
          } else if (e.moveType === "map15") {
            if (frame % 45 === 0) {
              const dirs: Direction[] = ["up", "down", "left", "right"];
              e.direction = dirs[Math.floor(Math.random() * dirs.length)]!;
            }
          }
          return e;
        });

        // 3. プレイヤー移動入力
        let vx = 0;
        let vy = 0;
        let dir = prevState.player.direction;

        const isUp = keysPressed.current["ArrowUp"] ||
          keysPressed.current["w"] || keysPressed.current["W"] || padUp;
        const isDown = keysPressed.current["ArrowDown"] ||
          keysPressed.current["s"] || keysPressed.current["S"] || padDown;
        const isLeft = keysPressed.current["ArrowLeft"] ||
          keysPressed.current["a"] || keysPressed.current["A"] || padLeft;
        const isRight = keysPressed.current["ArrowRight"] ||
          keysPressed.current["d"] || keysPressed.current["D"] || padRight;
        const isDash: boolean = Boolean(
          keysPressed.current["Shift"] || keysPressed.current["ShiftLeft"] ||
            keysPressed.current["ShiftRight"] ||
            keysPressed.current["k"] || keysPressed.current["K"] ||
            keysPressed.current["x"] || keysPressed.current["X"] || padDash,
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
          speed /= prevState.player.x > 16 * 6 ? 5.0 : 4.0;
        }

        let px = prevState.player.x;
        let py = prevState.player.y;

        // 壁当たり判定 (X方向・Y方向の独立チェックによる壁ずり移動)
        if (vx !== 0) {
          const targetPx = px + vx * speed;
          // マップ境界の遷移エリア、または壁でない場合は移動可能
          if (
            targetPx <= 8 || targetPx >= gameScreenWidth - 8 ||
            !isWall(prevState.stageNumber, targetPx, py)
          ) {
            px = targetPx;
          }
        }

        if (vy !== 0) {
          const targetPy = py + vy * speed;
          if (!isWall(prevState.stageNumber, px, targetPy)) {
            py = targetPy;
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
            score,
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

        // チェックポイント (MAPCP) 更新判定
        let currentMapcp = prevState.mapcp;
        const mapAttr = getMapAttribute(prevState.stageNumber, px, py);
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

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animId);
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
          />
        </svg>
        <div style={{ display: "none" }}>
          <StageCanvas onCreateBlobUrl={setMapBlobUrl} />
        </div>
      </div>
    </>
  );
}
