import { Character, Direction } from "./sprite.tsx";

export type EnemyData = {
  readonly id: number;
  x: number;
  y: number;
  direction: Direction;
  readonly character: Character;
  readonly moveType?: "none" | "map10" | "map11" | "map14" | "map13" | "map15";
  readonly initialX: number;
  readonly initialY: number;
};

export const getStageEnemies = (
  stageNumber: number,
): ReadonlyArray<EnemyData> => {
  switch (stageNumber) {
    case 0:
      return [
        {
          id: 1,
          x: 16 * 2 + 8,
          y: 16 * 2 + 8,
          initialX: 16 * 2 + 8,
          initialY: 16 * 2 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 7 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 7 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 6 + 8,
          y: 16 * 5 + 8,
          initialX: 16 * 6 + 8,
          initialY: 16 * 5 + 8,
          direction: "up",
          character: "enemy",
        },
      ];
    case 1:
      return [
        {
          id: 1,
          x: 16 * 5 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 2 + 8,
          y: 16 * 5 + 8,
          initialX: 16 * 2 + 8,
          initialY: 16 * 5 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 8 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 1 + 8,
          direction: "down",
          character: "enemy",
        },
      ];
    case 2:
      return [
        {
          id: 1,
          x: 16 * 5 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 1 + 8,
          direction: "down",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 5 + 8,
          y: 16 * 7 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 7 + 8,
          direction: "up",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 7 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 7 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy",
        },
      ];
    case 3:
      return [
        {
          id: 1,
          x: 16 * 5 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 4 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 4 + 8,
          y: 16 * 5 + 7,
          initialX: 16 * 4 + 8,
          initialY: 16 * 5 + 7,
          direction: "right",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 3 + 8,
          y: 16 * 6 + 6,
          initialX: 16 * 3 + 8,
          initialY: 16 * 6 + 6,
          direction: "right",
          character: "enemy",
        },
      ];
    case 4:
      return [
        {
          id: 1,
          x: 16 * 2 + 8,
          y: 16 * 3 + 8,
          initialX: 16 * 2 + 8,
          initialY: 16 * 3 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 3 + 8,
          y: 16 * 3 + 8,
          initialX: 16 * 3 + 8,
          initialY: 16 * 3 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 8 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 4 + 8,
          direction: "down",
          character: "enemy",
        },
        {
          id: 4,
          x: 16 * 8 + 8,
          y: 16 * 5 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 5 + 8,
          direction: "up",
          character: "enemy",
        },
        {
          id: 5,
          x: 16 * 6 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 6 + 8,
          initialY: 16 * 1 + 8,
          direction: "down",
          character: "enemy",
        },
        {
          id: 6,
          x: 16 * 3 + 8,
          y: 16 * 6 + 8,
          initialX: 16 * 3 + 8,
          initialY: 16 * 6 + 8,
          direction: "right",
          character: "enemy",
        },
      ];
    case 5:
      return [
        {
          id: 1,
          x: 16 * 1 + 8,
          y: 16 * 2 + 8,
          initialX: 16 * 1 + 8,
          initialY: 16 * 2 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 1 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 1 + 8,
          initialY: 16 * 4 + 8,
          direction: "right",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 4 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 4 + 8,
          initialY: 16 * 1 + 8,
          direction: "down",
          character: "enemy",
        },
        {
          id: 4,
          x: 16 * 7 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 7 + 8,
          initialY: 16 * 4 + 8,
          direction: "up",
          character: "enemy",
        },
      ];
    case 6:
      return [
        {
          id: 1,
          x: 16 * 2 + 10,
          y: 16 * 3 + 8,
          initialX: 16 * 2 + 10,
          initialY: 16 * 3 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          id: 2,
          x: 16 * 2 + 10,
          y: 16 * 5 + 8,
          initialX: 16 * 2 + 10,
          initialY: 16 * 5 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          id: 3,
          x: 16 * 8 + 8,
          y: 16 * 7 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 7 + 8,
          direction: "left",
          character: "enemy",
        },
        {
          id: 4,
          x: 16 * 7 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 7 + 8,
          initialY: 16 * 1 + 8,
          direction: "down",
          character: "enemy",
        },
      ];
    case 7:
      return [];
    case 8:
      return [
        {
          id: 1,
          x: 16 * 7 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 7 + 8,
          initialY: 16 * 1 + 8,
          direction: "down",
          character: "enemy2",
        },
      ];
    case 9:
      return [
        {
          id: 1,
          x: 16 * 5 + 8,
          y: 16 * 0 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 0 + 8,
          direction: "down",
          character: "enemy2",
        },
        {
          id: 2,
          x: 16 * 8 + 8,
          y: 16 * 7 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 7 + 8,
          direction: "up",
          character: "enemy2",
        },
        {
          id: 3,
          x: 16 * 8 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 1 + 8,
          direction: "left",
          character: "enemy2",
        },
        {
          id: 4,
          x: 16 * 0 + 8,
          y: 16 * 7 + 8,
          initialX: 16 * 0 + 8,
          initialY: 16 * 7 + 8,
          direction: "right",
          character: "enemy2",
        },
        {
          id: 5,
          x: 16 * 3 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 3 + 8,
          initialY: 16 * 4 + 8,
          direction: "right",
          character: "enemy2",
        },
      ];
    case 10:
      return [
        {
          id: 1,
          x: 16 * 6,
          y: 16 * 0 + 8,
          initialX: 16 * 6,
          initialY: 16 * 0 + 8,
          direction: "down",
          character: "enemy2",
          moveType: "map10",
        },
        {
          id: 2,
          x: 16 * 5,
          y: 16 * 8 + 8,
          initialX: 16 * 5,
          initialY: 16 * 8 + 8,
          direction: "up",
          character: "enemy2",
          moveType: "map10",
        },
      ];
    case 11:
      return [
        {
          id: 1,
          x: 16 * 9 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 9 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy2",
          moveType: "map11",
        },
        {
          id: 2,
          x: 16 * 5 + 8,
          y: 16 * 8 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 8 + 8,
          direction: "up",
          character: "enemy2",
          moveType: "map11",
        },
      ];
    case 12:
      return [
        {
          id: 1,
          x: 16 * 5 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 4 + 8,
          direction: "down",
          character: "enemy3",
        },
      ];
    case 13:
      return [
        {
          id: 1,
          x: 16 * 5 + 8,
          y: 16 * 3 + 8,
          initialX: 16 * 5 + 8,
          initialY: 16 * 3 + 8,
          direction: "down",
          character: "enemy2",
          moveType: "map13",
        },
        {
          id: 2,
          x: 16 * 3 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 3 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy2",
          moveType: "map13",
        },
        {
          id: 3,
          x: 16 * 2 + 8,
          y: 16 * 6 + 8,
          initialX: 16 * 2 + 8,
          initialY: 16 * 6 + 8,
          direction: "right",
          character: "enemy2",
          moveType: "map13",
        },
        // 門番5体
        {
          id: 4,
          x: 16 * 8 + 8,
          y: 16 * 4 - 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 4 - 8,
          direction: "left",
          character: "enemy2",
        },
        {
          id: 5,
          x: 16 * 8 + 8,
          y: 16 * 4 - 4,
          initialX: 16 * 8 + 8,
          initialY: 16 * 4 - 4,
          direction: "left",
          character: "enemy2",
        },
        {
          id: 6,
          x: 16 * 8 + 8,
          y: 16 * 4 + 0,
          initialX: 16 * 8 + 8,
          initialY: 16 * 4 + 0,
          direction: "left",
          character: "enemy2",
        },
        {
          id: 7,
          x: 16 * 8 + 8,
          y: 16 * 4 + 4,
          initialX: 16 * 8 + 8,
          initialY: 16 * 4 + 4,
          direction: "left",
          character: "enemy2",
        },
        {
          id: 8,
          x: 16 * 8 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy2",
        },
      ];
    case 14:
      return [
        {
          id: 1,
          x: 16 * 8 + 8,
          y: 16 * 3 + 8,
          initialX: 16 * 8 + 8,
          initialY: 16 * 3 + 8,
          direction: "left",
          character: "enemy2",
          moveType: "map14",
        },
      ];
    case 15:
      return [
        {
          id: 1,
          x: 16 * 2 + 8,
          y: 16 * 1 + 8,
          initialX: 16 * 2 + 8,
          initialY: 16 * 1 + 8,
          direction: "right",
          character: "enemy2",
          moveType: "map15",
        },
        {
          id: 2,
          x: 16 * 4 + 8,
          y: 16 * 3 + 8,
          initialX: 16 * 4 + 8,
          initialY: 16 * 3 + 8,
          direction: "down",
          character: "enemy2",
          moveType: "map15",
        },
        {
          id: 3,
          x: 16 * 6 + 8,
          y: 16 * 4 + 8,
          initialX: 16 * 6 + 8,
          initialY: 16 * 4 + 8,
          direction: "left",
          character: "enemy2",
          moveType: "map15",
        },
        {
          id: 4,
          x: 16 * 8 + 8,
          y: 16 * 6 + 4,
          initialX: 16 * 8 + 8,
          initialY: 16 * 6 + 4,
          direction: "up",
          character: "enemy2",
          moveType: "map15",
        },
      ];
    default:
      return [];
  }
};
