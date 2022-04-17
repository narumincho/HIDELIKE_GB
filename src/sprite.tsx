import * as React from "react";
import { EXS, EYS } from "./position";

const spritePngUrl = new URL("../assets/sprite.png", import.meta.url);

const directionAll = ["up", "down", "left", "right"] as const;
export type Direction = typeof directionAll[number];

type CharacterDirectionAndAnimationFrame = {
  readonly character: "enemy";
  readonly direction: Direction;
  readonly animation: number;
};

const characterDirectionAndAnimationFrameToId = (
  data: CharacterDirectionAndAnimationFrame
) => {
  return (
    data.character + "-" + data.direction + "-" + data.animation.toString()
  );
};

const characterTable: {
  enemy: {
    [key in Direction]: ReadonlyArray<{ x: number; y: number }>;
  };
} = {
  enemy: {
    left: [
      { x: 0, y: 128 },
      { x: 16, y: 128 },
      { x: 32, y: 128 },
      { x: 48, y: 128 },
    ],
    right: [
      { x: 0, y: 160 },
      { x: 16, y: 160 },
      { x: 32, y: 160 },
      { x: 48, y: 160 },
    ],
    down: [
      { x: 0, y: 192 },
      { x: 16, y: 192 },
      { x: 32, y: 192 },
      { x: 48, y: 192 },
    ],
    up: [
      { x: 0, y: 208 },
      { x: 16, y: 208 },
      { x: 32, y: 208 },
      { x: 48, y: 208 },
    ],
  },
};

const EnemySymbolInDirection = (props: {
  readonly direction: Direction;
  readonly uvList: ReadonlyArray<{ readonly x: number; readonly y: number }>;
}) => {
  return (
    <g data-name={"c-" + props.direction}>
      {props.uvList.map((e, index) => {
        const id = characterDirectionAndAnimationFrameToId({
          character: "enemy",
          direction: props.direction,
          animation: index,
        });
        return (
          <symbol id={id} viewBox={[e.x, e.y, 16, 16].join(" ")} key={id}>
            <image
              href={spritePngUrl.toString()}
              x={0}
              y={0}
              width={512}
              height={512}
            />
          </symbol>
        );
      })}
    </g>
  );
};

export const EnemySymbolList = (): JSX.Element => {
  return (
    <g data-name="EnemySymbolList">
      <EnemySymbolInDirection
        direction="left"
        uvList={characterTable.enemy.left}
      />
      <EnemySymbolInDirection
        direction="right"
        uvList={characterTable.enemy.right}
      />
      <EnemySymbolInDirection
        direction="down"
        uvList={characterTable.enemy.down}
      />
      <EnemySymbolInDirection direction="up" uvList={characterTable.enemy.up} />
    </g>
  );
};

export const GbFrame = (): JSX.Element => {
  const id = "gb-frame";
  return (
    <>
      <symbol id={id} viewBox={[512 - 400 - 8, 0, 400, 240].join(" ")}>
        <image href={spritePngUrl.toString()} width={512} height={512} />
      </symbol>
      <use href={"#" + id} x={0} y={0} width={400} height={240} />
    </>
  );
};

export const OpeningBackground = (): JSX.Element => {
  const openingId = "opening";
  return (
    <>
      <symbol
        id={openingId}
        viewBox={[512 - 16 * 21, 512 - 16 * 9, 16 * 10, 16 * 9].join(" ")}
      >
        <image href={spritePngUrl.toString()} width={512} height={512} />
      </symbol>
      <use
        href={"#" + openingId}
        x={EXS}
        y={EYS}
        width={16 * 10}
        height={16 * 9}
      />
    </>
  );
};

const timeToOffset = (time: number): number => {
  if (time < 200) {
    return 0;
  }
  if (time < 208) {
    return 32;
  }
  return 64;
};

export const OpeningFace = (): JSX.Element => {
  const faceAnimeId = "faceAnime";
  const ref = React.createRef<SVGSymbolElement>();
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    const loop = () => {
      setTime((oldTime) => (oldTime + 1) % 216);
      window.requestAnimationFrame(loop);
    };
    loop();
  }, []);
  return (
    <>
      <symbol
        ref={ref}
        id={faceAnimeId}
        viewBox={[
          512 - 16 * 15,
          512 - 32 * 8 + timeToOffset(time),
          32,
          32,
        ].join(" ")}
      >
        <image href={spritePngUrl.toString()} width={512} height={512} />
      </symbol>
      <use
        href={"#" + faceAnimeId}
        x={EXS + 16 * 6}
        y={EYS + 16 * 5}
        width={32}
        height={32}
      />
    </>
  );
};
