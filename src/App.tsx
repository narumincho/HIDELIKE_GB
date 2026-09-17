import { useEffect, useRef } from "preact/hooks";
import type { JSX } from "preact";
import {
  CardboardBox,
  CharacterSymbolList,
  CharacterUse,
  Direction,
  FoundAlert,
  GbFrame,
  TitleBgAndAnimation,
} from "./sprite.tsx";
import { frontRectAlpha } from "./FrontRectAlphaPhase.ts";
import { StageCanvas, StageSvg } from "./stage.tsx";
import {
  BlackBox,
  GameState,
  getStagePlayerInitialPosition,
  useGameState,
} from "./state.ts";
import { Text } from "./text.tsx";
import { getStageEnemies } from "./enemyPositionTable.ts";
import { StageNumber } from "./StageNumber.ts";

const gameScreenWidth = 160;
const gameScreenHeight = 144;

/** ゲーム画面の左端のX座標 */
const EXS = 120;
/** ゲーム画面の上端のY座標 */
const EYS = 48;

export const App = (): JSX.Element => {
  const {
    gameState,
    setGameState,
    setMapBlobUrl,
    playBgm,
    playSe,
    updateBgmForStage,
    startGame,
    getAudioContext,
  } = useGameState();

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const frameCountRef = useRef(0);

  // キーボードイベントハンドラ
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      keysPressed.current[e.code] = true;

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
            });
          }
        }
      }

      // 箱の設置 (Aボタン)
      if (gameState.type === "stage" && !gameState.alert) {
        if (
          e.key === " " || e.key === "z" || e.key === "Z" || e.key === "j" ||
          e.key === "J"
        ) {
          const stg = gameState.stageNumber;
          if (stg < 13) {
            let bx = gameState.player.x;
            let by = gameState.player.y;
            switch (gameState.player.direction) {
              case "up":
                by -= 16;
                break;
              case "down":
                by += 16;
                break;
              case "left":
                bx -= 16;
                break;
              case "right":
                bx += 16;
                break;
            }
            bx = Math.max(8, Math.min(bx, gameScreenWidth - 8));
            by = Math.max(7, Math.min(by, gameScreenHeight - 9));

            const newBox: BlackBox = { x: bx, y: by, timer: 0 };
            const currentBoxes = [...gameState.boxes];
            if (currentBoxes.length >= 3) {
              currentBoxes.shift(); // 最大3個
            }
            currentBoxes.push(newBox);
            playSe("seBullet");

            setGameState({
              ...gameState,
              boxes: currentBoxes,
              score: {
                ...gameState.score,
                boxUsedCount: gameState.score.boxUsedCount + 1,
              },
            });
          }
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

      setGameState((prevState) => {
        if (prevState.type !== "stage") {
          return prevState;
        }

        const score = {
          ...prevState.score,
          clearTimeFrames: prevState.score.clearTimeFrames + 1,
        };

        // 発見アラート中の処理 (30フレーム後に初期位置へリスポーン)
        if (prevState.alert && prevState.alert.active) {
          const newAlertTimer = prevState.alert.timer + 1;
          if (newAlertTimer >= 30) {
            const initPos = getStagePlayerInitialPosition(
              prevState.stageNumber,
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

        // 1. 箱のタイマー更新 & 消滅判定
        const updatedBoxes: BlackBox[] = [];
        for (const box of prevState.boxes) {
          const nextTimer = box.timer + 1;
          if (nextTimer >= 360) {
            playSe("seBulletClear");
          } else {
            updatedBoxes.push({ ...box, timer: nextTimer });
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
          keysPressed.current["w"] || keysPressed.current["W"];
        const isDown = keysPressed.current["ArrowDown"] ||
          keysPressed.current["s"] || keysPressed.current["S"];
        const isLeft = keysPressed.current["ArrowLeft"] ||
          keysPressed.current["a"] || keysPressed.current["A"];
        const isRight = keysPressed.current["ArrowRight"] ||
          keysPressed.current["d"] || keysPressed.current["D"];
        const isDash: boolean = Boolean(
          keysPressed.current["Shift"] || keysPressed.current["ShiftLeft"] ||
            keysPressed.current["ShiftRight"] ||
            keysPressed.current["k"] || keysPressed.current["K"] ||
            keysPressed.current["x"] || keysPressed.current["X"],
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

        let px = prevState.player.x + vx * speed;
        let py = prevState.player.y + vy * speed;

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
          };
        }

        // 画面内クランプ
        px = Math.max(8, Math.min(px, gameScreenWidth - 8));
        py = Math.max(7, Math.min(py, gameScreenHeight - 9));

        // 5. 敵の視界判定（索敵）
        let spotted = false;
        let spottedEnemyPos = { x: 0, y: 0 };

        for (const enemy of updatedEnemies) {
          let inSight = false;
          // 4方向の直線索敵
          if (enemy.direction === "down") {
            inSight = py > enemy.y && Math.abs(enemy.x - px) <= 6;
          } else if (enemy.direction === "up") {
            inSight = py < enemy.y && Math.abs(enemy.x - px) <= 6;
          } else if (enemy.direction === "left") {
            inSight = px < enemy.x && Math.abs(enemy.y - py) <= 6;
          } else if (enemy.direction === "right") {
            inSight = px > enemy.x && Math.abs(enemy.y - py) <= 6;
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

            if (!hiddenByBox) {
              spotted = true;
              spottedEnemyPos = { x: enemy.x, y: enemy.y };
              break;
            }
          }
        }

        if (spotted) {
          playSe("seFound");
          return {
            ...prevState,
            alert: {
              active: true,
              x: spottedEnemyPos.x,
              y: Math.max(EYS, spottedEnemyPos.y - 14),
              timer: 0,
            },
            score: {
              ...score,
              foundCount: score.foundCount + 1,
            },
            boxes: updatedBoxes,
            enemies: updatedEnemies,
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
        };
      });

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [playSe, playBgm, updateBgmForStage, setGameState]);

  return (
    <div
      onClick={() => {
        getAudioContext();
      }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        aspectRatio: "400 / 240",
      }}
    >
      <svg
        viewBox="0 0 400 240"
        style={{
          imageRendering: "pixelated",
          objectFit: "contain",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <CharacterSymbolList />
        <GbFrame />
        <GameScreenContent gameState={gameState} startGame={startGame} />
      </svg>
      <div style={{ display: "none" }}>
        <StageCanvas onCreateBlobUrl={setMapBlobUrl} />
      </div>
    </div>
  );
};

const GameScreenContent = (props: {
  readonly gameState: GameState;
  readonly startGame: () => void;
}): JSX.Element => {
  const { gameState } = props;

  switch (gameState.type) {
    case "loading":
      return (
        <Text
          x={EXS + 40}
          y={EYS + 60}
          text="Loading..."
          color="GBT3"
        />
      );

    case "title":
    case "titleStarted":
      return (
        <g>
          <TitleBgAndAnimation x={EXS} y={EYS} />
          <Text x={EXS + 8 * 3} y={EYS + 16 * 8 + 8} text="2015" color="GBT3" />
          <Text
            x={EXS + 10 * 8 + 6}
            y={EYS + 16 * 8 + 8}
            text="@"
            color="GBT3"
          />
          <Text
            x={EXS + 8 * 12}
            y={EYS + 16 * 8 + 8}
            text="Rwiiug"
            color="GBT3"
          />
          <Text
            x={EXS + 24}
            y={EYS + 70}
            text="PUSH SPACE / ENTER"
            color="GBT2"
          />
          {gameState.type === "titleStarted" && (
            <rect
              x={EXS}
              y={EYS}
              width={16 * 10}
              height={16 * 9}
              fill={`rgba(255, 255, 255, ${
                frontRectAlpha(gameState.animationPhase)
              })`}
            />
          )}
        </g>
      );

    case "stage":
      return (
        <g data-name="stage">
          {/* 背景マップ */}
          <StageSvg
            mapBlobUrl={gameState.mapBlobUrl}
            x={EXS}
            y={EYS}
            width={gameScreenWidth}
            height={gameScreenHeight}
            stageNumber={gameState.stageNumber}
          />

          {/* 箱（ダンボール） */}
          {gameState.boxes.map((box, idx) => (
            <CardboardBox
              key={idx}
              x={EXS + box.x - 8}
              y={EYS + box.y - 8}
              timer={box.timer}
            />
          ))}

          {/* 敵スプライト */}
          {gameState.enemies.map((enemy) => (
            <CharacterUse
              key={enemy.id}
              direction={enemy.direction}
              character={enemy.character}
              x={EXS + enemy.x - 8}
              y={EYS + enemy.y - 8}
            />
          ))}

          {/* プレイヤースプライト */}
          <CharacterUse
            direction={gameState.player.direction}
            character="player"
            x={EXS + gameState.player.x - 8}
            y={EYS + gameState.player.y - 8}
          />

          {/* 発見「！」マーク */}
          {gameState.alert && gameState.alert.active && (
            <FoundAlert
              x={EXS + gameState.alert.x}
              y={EYS + gameState.alert.y}
            />
          )}

          {/* クレジット表示（マップ19〜21） */}
          {gameState.stageNumber === 19 && (
            <CreditDisplay
              timeFrames={gameState.score.clearTimeFrames}
              boxCount={gameState.score.boxUsedCount}
              foundCount={gameState.score.foundCount}
            />
          )}
          {gameState.stageNumber === 20 && <CreditCreator />}
          {gameState.stageNumber === 21 && <CreditThanks />}
        </g>
      );

    case "ending":
      return <EndingScreen score={gameState.score} />;
  }
};

/** マップ19 クレジット表示 */
const CreditDisplay = (props: {
  timeFrames: number;
  boxCount: number;
  foundCount: number;
}) => {
  const totalSec = Math.floor(props.timeFrames / 60);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const timeStr = `${min.toString().padStart(2, "0")}:${
    sec.toString().padStart(2, "0")
  }`;

  return (
    <g>
      <rect
        x={EXS}
        y={EYS}
        width={160}
        height={48}
        fill="#0f380f"
        opacity={0.8}
      />
      <rect
        x={EXS}
        y={EYS + 144 - 48}
        width={160}
        height={48}
        fill="#0f380f"
        opacity={0.8}
      />
      <Text x={EXS + 16} y={EYS + 16} text="Clear Time" color="GBT3" />
      <Text x={EXS + 32} y={EYS + 28} text={timeStr} color="GBT3" />
      <Text
        x={EXS + 16}
        y={EYS + 144 - 40}
        text={`Box   : ${props.boxCount}`}
        color="GBT3"
      />
      <Text
        x={EXS + 16}
        y={EYS + 144 - 24}
        text={`Found : ${props.foundCount}`}
        color="GBT3"
      />
    </g>
  );
};

const CreditCreator = () => (
  <g>
    <rect
      x={EXS}
      y={EYS}
      width={160}
      height={32}
      fill="#0f380f"
      opacity={0.8}
    />
    <rect
      x={EXS}
      y={EYE - 32}
      width={160}
      height={32}
      fill="#0f380f"
      opacity={0.8}
    />
    <Text x={EXS + 24} y={EYS + 14} text="- Creator -" color="GBT3" />
    <Text x={EXS + 12} y={EYE - 20} text="Rwiiug(RWIIUG0129)" color="GBT3" />
  </g>
);

const EYE = EYS + 144;

const CreditThanks = () => (
  <g>
    <rect
      x={EXS}
      y={EYS}
      width={160}
      height={24}
      fill="#0f380f"
      opacity={0.8}
    />
    <rect
      x={EXS}
      y={EYE - 24}
      width={160}
      height={24}
      fill="#0f380f"
      opacity={0.8}
    />
    <Text x={EXS + 12} y={EYS + 8} text="- Special Thanks -" color="GBT3" />
    <Text x={EXS + 12} y={EYE - 16} text="All PetitCom Users" color="GBT3" />
  </g>
);

/** エンディング画面 */
const EndingScreen = (props: {
  score: { clearTimeFrames: number; boxUsedCount: number; foundCount: number };
}) => {
  const totalSec = Math.floor(props.score.clearTimeFrames / 60);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const timeStr = `${min.toString().padStart(2, "0")}:${
    sec.toString().padStart(2, "0")
  }`;

  return (
    <g>
      <rect x={EXS} y={EYS} width={160} height={144} fill="#0f380f" />
      <Text x={EXS + 48} y={EYS + 16} text="HIDELIKE" color="GBT3" />
      <Text x={EXS + 4} y={EYS + 28} text="~Generate_Blackbox~" color="GBT2" />

      <Text x={EXS + 40} y={EYS + 50} text="- The End -" color="GBT3" />

      <Text
        x={EXS + 16}
        y={EYS + 72}
        text={`Clear Time: ${timeStr}`}
        color="GBT2"
      />
      <Text
        x={EXS + 16}
        y={EYS + 84}
        text={`Box Used  : ${props.score.boxUsedCount}`}
        color="GBT2"
      />
      <Text
        x={EXS + 16}
        y={EYS + 96}
        text={`Spotted   : ${props.score.foundCount}`}
        color="GBT2"
      />

      <Text x={EXS + 28} y={EYS + 116} text="Thank you" color="GBT3" />
      <Text x={EXS + 20} y={EYS + 126} text="for playing!" color="GBT3" />
    </g>
  );
};
