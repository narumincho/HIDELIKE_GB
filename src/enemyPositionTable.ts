import { Character, Direction } from "./sprite";
import { StageNumber } from "./StageNumber";

type PositionAndDirectionAndCharacter = {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
  readonly character: Character;
};

/**
 * 敵の初期位置データ
 *
 * 元のプログラム `DEF__ENEMY_SET`
 *
 * SPNUM_ENEMY+ 0～ 9 down
 * SPNUM_ENEMY+10～19 up
 * SPNUM_ENEMY+20～29 left
 * SPNUM_ENEMY+30～39 right
 *
 */
export const enemyPositionTable = (
  stageNumber: StageNumber
): ReadonlyArray<PositionAndDirectionAndCharacter> => {
  switch (stageNumber) {
    case 0:
      return [
        {
          x: 16 * 2 + 8,
          y: 16 * 2 + 8,
          direction: "right",
          character: "enemy",
        },
        { x: 16 * 7 + 8, y: 16 * 4 + 8, direction: "left", character: "enemy" },
        { x: 16 * 6 + 8, y: 16 * 5 + 8, direction: "up", character: "enemy" },
      ];
    case 1:
      return [
        { x: 16 * 5 + 8, y: 16 * 4 + 8, direction: "left", character: "enemy" },
        {
          x: 16 * 2 + 8,
          y: 16 * 5 + 8,
          direction: "right",
          character: "enemy",
        },
        { x: 16 * 8 + 8, y: 16 * 1 + 8, direction: "down", character: "enemy" },
      ];
    case 2:
      return [
        { x: 16 * 5 + 8, y: 16 * 1 + 8, direction: "down", character: "enemy" },
        { x: 16 * 5 + 8, y: 16 * 7 + 8, direction: "up", character: "enemy" },
        { x: 16 * 7 + 8, y: 16 * 4 + 8, direction: "left", character: "enemy" },
      ];
    case 3:
      return [
        {
          x: 16 * 5 + 8,
          y: 16 * 4 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          x: 16 * 4 + 8,
          y: 16 * 5 + 7,
          direction: "right",
          character: "enemy",
        },
        {
          x: 16 * 3 + 8,
          y: 16 * 6 + 6,
          direction: "right",
          character: "enemy",
        },
      ];
    case 4:
      return [
        { x: 16 * 2 + 8, y: 16 * 3 + 8, direction: "left", character: "enemy" },
        {
          x: 16 * 3 + 8,
          y: 16 * 3 + 8,
          direction: "right",
          character: "enemy",
        },
        { x: 16 * 8 + 8, y: 16 * 4 + 8, direction: "down", character: "enemy" },
        { x: 16 * 8 + 8, y: 16 * 5 + 8, direction: "up", character: "enemy" },
        { x: 16 * 6 + 8, y: 16 * 1 + 8, direction: "down", character: "enemy" },
        {
          x: 16 * 3 + 8,
          y: 16 * 6 + 8,
          direction: "right",
          character: "enemy",
        },
      ];
    case 5:
      return [
        {
          x: 16 * 1 + 8,
          y: 16 * 2 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          x: 16 * 1 + 8,
          y: 16 * 4 + 8,
          direction: "right",
          character: "enemy",
        },
        { x: 16 * 4 + 8, y: 16 * 1 + 8, direction: "down", character: "enemy" },
        { x: 16 * 7 + 8, y: 16 * 4 + 8, direction: "up", character: "enemy" },
      ];
    case 6:
      return [
        {
          x: 16 * 2 + 10,
          y: 16 * 3 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          x: 16 * 2 + 10,
          y: 16 * 5 + 8,
          direction: "left",
          character: "enemy",
        },
        { x: 16 * 8 + 8, y: 16 * 7 + 8, direction: "left", character: "enemy" },
        { x: 16 * 7 + 8, y: 16 * 1 + 8, direction: "down", character: "enemy" },
      ];
    case 7:
      return [];
    case 8:
      return [
        {
          x: 16 * 7 + 8,
          y: 16 * 1 + 8,
          direction: "down",
          character: "enemy2",
        },
      ];
    case 9:
      return [
        {
          x: 16 * 5 + 8,
          y: 16 * 0 + 8,
          direction: "down",
          character: "enemy2",
        },
        { x: 16 * 8 + 8, y: 16 * 7 + 8, direction: "up", character: "enemy2" },
        {
          x: 16 * 8 + 8,
          y: 16 * 1 + 8,
          direction: "left",
          character: "enemy2",
        },
        {
          x: 16 * 0 + 8,
          y: 16 * 7 + 8,
          direction: "right",
          character: "enemy2",
        },
        {
          x: 16 * 3 + 8,
          y: 16 * 4 + 8,
          direction: "right",
          character: "enemy2",
        },
      ];
  }
  return [];
};
