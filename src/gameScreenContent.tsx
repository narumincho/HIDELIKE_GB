import type { JSX } from "preact";
import {
  CardboardBox,
  CharacterUse,
  FoundAlert,
  TitleBgAndAnimation,
} from "./sprite.tsx";
import { frontRectAlpha } from "./FrontRectAlphaPhase.ts";
import { StageSvg } from "./stage.tsx";
import { GameState } from "./state.ts";
import { Text } from "./text.tsx";
import {
  CreditCreator,
  CreditResult,
  CreditThanks,
  CreditWhiteOverlay,
  EndingScreen,
  EXS,
  EYS,
} from "./creditScreen.tsx";
import { DebugOverlay, GbGreenOverlay } from "./debugOverlay.tsx";

export const gameScreenWidth = 160;
export const gameScreenHeight = 144;

export function GameScreenContent(props: {
  readonly gameState: GameState;
  readonly startGame: () => void;
  readonly isDebugMode: boolean;
  readonly isGbGreen: boolean;
  readonly frame: number;
}): JSX.Element {
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
          <g style={{ animation: "titleBlink 1.2s infinite ease-in-out" }}>
            <style>
              {`@keyframes titleBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }`}
            </style>
            <Text
              x={EXS + 8}
              y={EYS + 144 + 4}
              text="PUSH SPACE / ENTER"
              color="GBT2"
            />
          </g>
          {gameState.type === "titleStarted" && (
            <rect
              x={EXS}
              y={EYS}
              width={16 * 10}
              height={16 * 9}
              fill="white"
              opacity={frontRectAlpha(gameState.animationPhase)}
              style={{ transition: "opacity 0.4s ease-out" }}
            />
          )}
          {props.isGbGreen && <GbGreenOverlay />}
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

          {/* 箱（ダンボール）: ピクセルパーフェクトに整数丸め */}
          {gameState.boxes.map((box, idx) => (
            <CardboardBox
              key={idx}
              x={EXS + Math.round(box.x) - 8}
              y={EYS + Math.round(box.y) - 8}
              timer={box.timer}
            />
          ))}

          {/* 敵スプライト: ピクセルパーフェクトに整数丸め */}
          {gameState.enemies.map((enemy) => (
            <CharacterUse
              key={enemy.id}
              direction={enemy.direction}
              character={enemy.character}
              x={EXS + Math.round(enemy.x) - 8}
              y={EYS + Math.round(enemy.y) - 8}
              frame={props.frame}
            />
          ))}

          {/* プレイヤースプライト: ピクセルパーフェクトに整数丸め */}
          <CharacterUse
            direction={gameState.player.direction}
            character="player"
            x={EXS + Math.round(gameState.player.x) - 8}
            y={EYS + Math.round(gameState.player.y) - 8}
            frame={props.frame}
          />

          {/* 発見「！」マーク: ピクセルパーフェクトに整数丸め */}
          {gameState.alert && gameState.alert.active && (
            <FoundAlert
              x={EXS + Math.round(gameState.alert.x)}
              y={EYS + Math.round(gameState.alert.y)}
            />
          )}

          {/* クレジット表示（マップ19〜21） */}
          {gameState.stageNumber === 19 && (
            <CreditResult
              timeFrames={gameState.score.clearTimeFrames}
              boxCount={gameState.score.boxUsedCount}
              foundCount={gameState.score.foundCount}
            />
          )}
          {gameState.stageNumber === 20 && <CreditCreator />}
          {gameState.stageNumber === 21 && <CreditThanks />}

          {/* 原作デバッグオーバーレイ (L+R+X / Dキー) */}
          {props.isDebugMode && (
            <DebugOverlay
              stageNumber={gameState.stageNumber}
              player={gameState.player}
              enemies={gameState.enemies}
              boxes={gameState.boxes}
            />
          )}

          {/* 原作GB GREENモードオーバーレイ (L+R+Y / Gキー) */}
          {props.isGbGreen && <GbGreenOverlay />}

          {/* 原作白フェード演出（スプライト96） */}
          <CreditWhiteOverlay
            stageNumber={gameState.stageNumber}
            playerX={gameState.player.x}
          />
        </g>
      );

    case "ending":
      return (
        <>
          <EndingScreen
            score={gameState.score}
            showIllustration={gameState.showIllustration}
          />
          {props.isGbGreen && <GbGreenOverlay />}
        </>
      );
  }
}
