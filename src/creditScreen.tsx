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

/** エンディング画面 */
export function EndingScreen(props: {
  readonly score: GameScore;
  readonly showIllustration: boolean;
}): JSX.Element {
  const clearTimeFrames = props.score.clearTimeAtCredits ??
    props.score.clearTimeFrames;
  const totalSec = Math.floor(clearTimeFrames / 60);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const timeStr = `${min.toString().padStart(2, "0")}:${
    sec.toString().padStart(2, "0")
  }`;

  // 原作クリア特典条件: クリアタイム5分以内 OR 発見10回未満 OR 箱100個未満
  const isSpecialClear = clearTimeFrames < 60 * 60 * 5 ||
    props.score.foundCount < 10 ||
    props.score.boxUsedCount < 100;

  if (props.showIllustration && isSpecialClear) {
    return <EndingIllustration x={EXS} y={EYS} />;
  }

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
}
