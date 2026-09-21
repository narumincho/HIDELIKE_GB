import type { JSX } from "preact";
import { Text } from "./text.tsx";
import { EndingIllustration } from "./sprite.tsx";
import { GameScore } from "./state.ts";

/** ゲーム画面の左端のX座標 */
export const EXS = 120;
/** ゲーム画面の上端のY座標 */
export const EYS = 48;
export const EYE = EYS + 144;

/** マップ19 クレジット表示 (Clear Time / Box / Found) */
export function CreditResult(props: {
  readonly timeFrames: number;
  readonly boxCount: number;
  readonly foundCount: number;
}): JSX.Element {
  const totalSec = Math.floor(props.timeFrames / 60);
  const hour = Math.floor(totalSec / 3600);
  const min = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  const timeStr = `${hour.toString().padStart(2, "0")}:${
    min.toString().padStart(2, "0")
  }:${sec.toString().padStart(2, "0")}`;

  return (
    <g>
      <rect
        x={EXS}
        y={EYS}
        width={160}
        height={16 * 3}
        fill="#0f380f"
        opacity={0.8}
      />
      <rect
        x={EXS}
        y={EYE - 16 * 3}
        width={160}
        height={16 * 3}
        fill="#0f380f"
        opacity={0.8}
      />
      {/* プチコン3号Unicode独自文字に対応する標準Unicode文字 (⏱ U+23F1, ■ U+25A0, ! U+0021) */}
      <Text x={EXS + 16} y={EYS + 16 * 1} text="[⏱] Clear Time" color="GBT3" />
      <Text
        x={EXS + 16}
        y={EYS + 16 * 2}
        text={`    ${timeStr}`}
        color="GBT3"
      />
      <Text
        x={EXS + 16}
        y={EYE - 16 * 2}
        text={`[■] Box   : ${props.boxCount}`}
        color="GBT3"
      />
      <Text
        x={EXS + 16}
        y={EYE - 16 * 1}
        text={`[!] Found : ${props.foundCount}`}
        color="GBT3"
      />
    </g>
  );
}

/** マップ20 クレジット表示 (Creator) */
export function CreditCreator(): JSX.Element {
  return (
    <g>
      <rect
        x={EXS}
        y={EYS}
        width={160}
        height={16 * 2}
        fill="#0f380f"
        opacity={0.8}
      />
      <rect
        x={EXS}
        y={EYE - 16 * 2}
        width={160}
        height={16 * 2}
        fill="#0f380f"
        opacity={0.8}
      />
      <Text x={EXS + 8} y={EYS + 14} text="    - Creator -    " color="GBT3" />
      <Text x={EXS + 10} y={EYE - 16} text="Rwiiug(RWIIUG0129)" color="GBT3" />
    </g>
  );
}

/** マップ21 クレジット表示 (Special Thanks) */
export function CreditThanks(): JSX.Element {
  return (
    <g>
      <rect
        x={EXS}
        y={EYS}
        width={160}
        height={16 * 1}
        fill="#0f380f"
        opacity={0.8}
      />
      <rect
        x={EXS}
        y={EYE - 16 * 1}
        width={160}
        height={16 * 1}
        fill="#0f380f"
        opacity={0.8}
      />
      <Text
        x={EXS + 8}
        y={EYS + 5}
        text="- Special Thanks -    "
        color="GBT3"
      />
      <Text x={EXS + 10} y={EYE - 11} text="All PetitCom Users" color="GBT3" />
    </g>
  );
}

/** 原作準拠: マップ19〜21の白フェードオーバーレイ (スプライト96 SPCOLOR) */
export function CreditWhiteOverlay(props: {
  readonly stageNumber: number;
  readonly playerX: number;
}): JSX.Element | null {
  let opacity = 0;
  if (props.stageNumber === 19) {
    opacity = 50 / 255;
  } else if (props.stageNumber === 20) {
    opacity = 70 / 255;
  } else if (props.stageNumber === 21) {
    opacity = 180 / 255;
    if (props.playerX > 16 * 8) {
      opacity = 240 / 255;
    } else if (props.playerX > 16 * 6) {
      opacity = 230 / 255;
    } else if (props.playerX > 16 * 3) {
      opacity = 210 / 255;
    }
  }

  if (opacity <= 0) return null;

  return (
    <rect
      x={EXS}
      y={EYS}
      width={160}
      height={144}
      fill="#ffffff"
      opacity={opacity}
      style={{ pointerEvents: "none" }}
    />
  );
}

/** エンディング画面 (原作のフレーム単位待機・フェードシーケンス再現) */
export function EndingScreen(props: {
  readonly score: GameScore;
  readonly endingStep: number;
  readonly showIllustration: boolean;
}): JSX.Element {
  const clearTimeFrames = props.score.clearTimeAtCredits ??
    props.score.clearTimeFrames;

  // 原作クリア特典条件: クリアタイム5分以内 OR 発見10回未満 OR 箱100個未満
  const isSpecialClear = clearTimeFrames < 60 * 60 * 5 ||
    props.score.foundCount < 10 ||
    props.score.boxUsedCount < 100;

  if (props.showIllustration && isSpecialClear) {
    return <EndingIllustration x={EXS} y={EYS} />;
  }

  const step = props.endingStep;

  // タイトルロゴ "HIDELIKE" の色
  let titleColor: "GBT0" | "GBT1" | "GBT2" | null = null;
  if (step >= 120 && step < 140) titleColor = "GBT2";
  else if (step >= 140 && step < 160) titleColor = "GBT1";
  else if (step >= 160 && step < 700) titleColor = "GBT0";
  else if (step >= 700 && step < 760) titleColor = "GBT1";
  else if (step >= 760 && step < 820) titleColor = "GBT2";

  // サブタイトル "~Generate_Blackbox~" の色
  let subColor: "GBT0" | "GBT1" | "GBT2" | null = null;
  if (step >= 300 && step < 320) subColor = "GBT2";
  else if (step >= 320 && step < 340) subColor = "GBT1";
  else if (step >= 340 && step < 700) subColor = "GBT0";
  else if (step >= 700 && step < 760) subColor = "GBT1";
  else if (step >= 760 && step < 820) subColor = "GBT2";

  // "- The End -" の色
  let endColor: "GBT0" | "GBT1" | "GBT2" | "GBT3" | null = null;
  if (step >= 880 && step < 910) endColor = "GBT3";
  else if (step >= 910 && step < 940) endColor = "GBT2";
  else if (step >= 940 && step < 970) endColor = "GBT1";
  else if (step >= 970) endColor = "GBT0";

  // "Thank you" の色
  let tyColor: "GBT0" | "GBT1" | "GBT2" | null = null;
  if (step >= 1090 && step < 1120) tyColor = "GBT2";
  else if (step >= 1120 && step < 1150) tyColor = "GBT1";
  else if (step >= 1150) tyColor = "GBT0";

  // "  for playing!" の色
  let fpColor: "GBT0" | "GBT1" | "GBT2" | "GBT3" | null = null;
  if (step >= 1090 && step < 1120) fpColor = "GBT3";
  else if (step >= 1120 && step < 1150) fpColor = "GBT2";
  else if (step >= 1150 && step < 1180) fpColor = "GBT1";
  else if (step >= 1180) fpColor = "GBT0";

  return (
    <g>
      {/* 原作準拠: 白背景 */}
      <rect x={EXS} y={EYS} width={160} height={144} fill="#e0f8d0" />

      {titleColor && (
        <Text
          x={EXS + 16 * 3}
          y={EYS + 8 * 7}
          text="HIDELIKE"
          color={titleColor}
        />
      )}
      {subColor && (
        <Text
          x={EXS + 4}
          y={EYS + 8 * 9}
          text="~Generate_Blackbox~"
          color={subColor}
        />
      )}

      {endColor && (
        <Text
          x={EXS + 8 * 5}
          y={EYS + 8 * 8}
          text="- The End -"
          color={endColor}
        />
      )}

      {tyColor && (
        <Text
          x={EXS + 8 * 2}
          y={EYS + 11 * 8}
          text="Thank you"
          color={tyColor}
        />
      )}
      {fpColor && (
        <Text
          x={EXS + 8 * 5}
          y={EYS + 12 * 8}
          text="  for playing!"
          color={fpColor}
        />
      )}
    </g>
  );
}
