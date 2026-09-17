import type { JSX } from "preact";
import { Text } from "./text.tsx";
import { StageNumber } from "./StageNumber.ts";
import { BlackBox, PlayerState } from "./state.ts";
import { EnemyData } from "./enemyPositionTable.ts";

export const EXS = 120;
export const EYS = 48;
export const EXE = EXS + 160;
export const EYE = EYS + 144;

/** 原作 @DEBUG の完全再現オーバーレイ */
export function DebugOverlay(props: {
  readonly stageNumber: StageNumber;
  readonly player: PlayerState;
  readonly enemies: ReadonlyArray<EnemyData>;
  readonly boxes: ReadonlyArray<BlackBox>;
}): JSX.Element {
  const { stageNumber, player, enemies, boxes } = props;

  return (
    <g id="debug-overlay" style={{ pointerEvents: "none" }}>
      {/* 1. マップ番号表示: LOCATE 0,0: ?"MAP" + STR$(BGSX) */}
      <rect
        x={EXS}
        y={EYS}
        width={48}
        height={10}
        fill="#000000"
        fillOpacity={0.7}
      />
      <Text x={EXS} y={EYS} text={`MAP${stageNumber}`} color="GBT3" />

      {/* 2. 敵の視線 (索敵赤レーザーライン: &HFFFF0000) */}
      {enemies.map((enemy) => {
        const ex = Math.round(enemy.x);
        const ey = Math.round(enemy.y);
        const screenEx = EXS + ex;
        const screenEy = EYS + ey;

        if (enemy.character === "enemy3") {
          // ボス敵 (enemy3): 上下左右4方向すべてに赤ビーム
          return (
            <g key={`debug-enemy-${enemy.id}`}>
              {/* 下 */}
              <rect
                x={screenEx - 2}
                y={screenEy}
                width={4}
                height={EYE - screenEy}
                fill="#ff0000"
                fillOpacity={0.75}
              />
              {/* 上 */}
              <rect
                x={screenEx - 2}
                y={EYS}
                width={4}
                height={screenEy - EYS}
                fill="#ff0000"
                fillOpacity={0.75}
              />
              {/* 左 */}
              <rect
                x={EXS}
                y={screenEy - 2}
                width={screenEx - EXS}
                height={4}
                fill="#ff0000"
                fillOpacity={0.75}
              />
              {/* 右 */}
              <rect
                x={screenEx}
                y={screenEy - 2}
                width={EXE - screenEx}
                height={4}
                fill="#ff0000"
                fillOpacity={0.75}
              />
            </g>
          );
        }

        switch (enemy.direction) {
          case "down":
            return (
              <rect
                key={`debug-enemy-${enemy.id}`}
                x={screenEx - 2}
                y={screenEy}
                width={4}
                height={Math.max(0, EYE - screenEy)}
                fill="#ff0000"
                fillOpacity={0.75}
              />
            );
          case "up":
            return (
              <rect
                key={`debug-enemy-${enemy.id}`}
                x={screenEx - 2}
                y={EYS}
                width={4}
                height={Math.max(0, screenEy - EYS)}
                fill="#ff0000"
                fillOpacity={0.75}
              />
            );
          case "left":
            return (
              <rect
                key={`debug-enemy-${enemy.id}`}
                x={EXS}
                y={screenEy - 2}
                width={Math.max(0, screenEx - EXS)}
                height={4}
                fill="#ff0000"
                fillOpacity={0.75}
              />
            );
          case "right":
            return (
              <rect
                key={`debug-enemy-${enemy.id}`}
                x={screenEx}
                y={screenEy - 2}
                width={Math.max(0, EXE - screenEx)}
                height={4}
                fill="#ff0000"
                fillOpacity={0.75}
              />
            );
        }
      })}

      {/* 3. 箱の遮蔽判定ライン (緑 & 水色 十字ライン) */}
      {boxes.map((box, idx) => {
        const bx = Math.round(box.x);
        const by = Math.round(box.y);
        const screenBx = EXS + bx;
        const screenBy = EYS + by;
        return (
          <g key={`debug-box-${idx}`}>
            {/* 縦ライン: PBX, PBY-8 〜 PBX, PBY+8 (&HFF00FF00) */}
            <rect
              x={screenBx}
              y={screenBy - 8}
              width={1}
              height={17}
              fill="#00ff00"
            />
            {/* 横ライン: PBX-8, PBY 〜 PBX+7, PBY (&HFF00FFFF) */}
            <rect
              x={screenBx - 8}
              y={screenBy}
              width={16}
              height={1}
              fill="#00ffff"
            />
          </g>
        );
      })}

      {/* 4. プレイヤー当たり判定中心点: PX-1, PY-1 〜 PX+1, PY+1 (&HFF00FFFF) */}
      <rect
        x={EXS + Math.round(player.x) - 1}
        y={EYS + Math.round(player.y) - 1}
        width={3}
        height={3}
        fill="#00ffff"
      />
    </g>
  );
}

/** 原作 F_GBGREEN (スプライト97: SPCOLOR 97, RGB(70, 0, 225, 0)) の完全再現 */
export function GbGreenOverlay(): JSX.Element {
  return (
    <rect
      x={EXS}
      y={EYS}
      width={160}
      height={144}
      fill="rgb(0, 225, 0)"
      fillOpacity={70 / 255}
      style={{
        pointerEvents: "none",
        mixBlendMode: "color-burn",
      }}
    />
  );
}
