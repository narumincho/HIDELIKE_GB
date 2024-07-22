import * as React from "npm:react";
import { assetHashValue } from "../distForClient.json" with { type: "json" };
import { assetHashValueToToUrl } from "./url.ts";

const spritePngUrl = assetHashValueToToUrl(assetHashValue["sprite.png"]);
const titleApngUrl = assetHashValueToToUrl(assetHashValue["title.apng"]);

const characterAll = ["player", "enemy", "enemy2"] as const;
const directionAll = ["up", "down", "left", "right"] as const;

export type Character = typeof characterAll[number];

export type Direction = typeof directionAll[number];

type CharacterDirectionAndAnimationFrame = {
  readonly character: Character;
  readonly direction: Direction;
  readonly animation: number;
};

const characterDirectionAndAnimationFrameToId = (
  data: CharacterDirectionAndAnimationFrame,
) => {
  return (
    data.character + "-" + data.direction + "-" + data.animation.toString()
  );
};

type UVAndTime = {
  readonly u: number;
  readonly v: number;
  readonly deltaTime: number;
};

const characterTable: {
  [k in Character]: {
    [key in Direction]: ReadonlyArray<UVAndTime>;
  };
} = {
  enemy: {
    // @ENEMY_ANIM2
    left: [
      { deltaTime: 16, u: 0, v: 128 },
      { deltaTime: 16, u: 16, v: 128 },
      { deltaTime: 16, u: 32, v: 128 },
      { deltaTime: 16, u: 48, v: 128 },
    ],
    // @ENEMY_ANIM3
    right: [
      { deltaTime: 16, u: 0, v: 160 },
      { deltaTime: 16, u: 16, v: 160 },
      { deltaTime: 16, u: 32, v: 160 },
      { deltaTime: 16, u: 48, v: 160 },
    ],
    // @ENEMY_ANIM0
    down: [
      { deltaTime: 90, u: 0, v: 192 },
      { deltaTime: 16, u: 16, v: 192 },
      { deltaTime: 90, u: 0, v: 192 },
      { deltaTime: 16, u: 16, v: 192 },
      { deltaTime: 90, u: 0, v: 192 },
      { deltaTime: 90, u: 16, v: 192 },
      { deltaTime: 16, u: 32, v: 192 },
      { deltaTime: 16, u: 48, v: 192 },
      { deltaTime: 16, u: 32, v: 192 },
      { deltaTime: 16, u: 48, v: 192 },
      { deltaTime: 32, u: 32, v: 192 },
    ],
    // @ENEMY_ANIM1
    up: [
      { deltaTime: 16, u: 0, v: 208 },
      { deltaTime: 16, u: 16, v: 208 },
      { deltaTime: 16, u: 32, v: 208 },
      { deltaTime: 16, u: 48, v: 208 },
    ],
  },
  enemy2: {
    // @ENEMY2_ANIM2
    left: [
      { deltaTime: 60, u: 0, v: 368 },
      { deltaTime: 16, u: 16, v: 368 },
      { deltaTime: 16, u: 32, v: 368 },
      { deltaTime: 16, u: 48, v: 368 },
    ],
    // @ENEMY2_ANIM3
    right: [
      { deltaTime: 60, u: 0, v: 352 },
      { deltaTime: 16, u: 16, v: 352 },
      { deltaTime: 16, u: 32, v: 352 },
      { deltaTime: 16, u: 48, v: 352 },
    ],
    // @ENEMY2_ANIM0
    down: [
      { deltaTime: 60, u: 0, v: 336 },
      { deltaTime: 16, u: 16, v: 336 },
      { deltaTime: 16, u: 32, v: 336 },
      { deltaTime: 16, u: 48, v: 336 },
    ],
    // @ENEMY2_ANIM1
    up: [
      { deltaTime: 60, u: 0, v: 320 },
      { deltaTime: 16, u: 16, v: 320 },
      { deltaTime: 16, u: 32, v: 320 },
      { deltaTime: 16, u: 48, v: 320 },
    ],
  },
  player: {
    left: [
      { deltaTime: 16, u: 0, v: 16 },
      { deltaTime: 16, u: 16, v: 16 },
      { deltaTime: 16, u: 32, v: 16 },
      { deltaTime: 16, u: 48, v: 16 },
      { deltaTime: 16, u: 64, v: 16 },
      { deltaTime: 16, u: 16, v: 16 },
      { deltaTime: 16, u: 32, v: 16 },
      { deltaTime: 16, u: 48, v: 16 },
    ],
    right: [
      { deltaTime: 16, u: 0, v: 0 },
      { deltaTime: 16, u: 16, v: 0 },
      { deltaTime: 16, u: 32, v: 0 },
      { deltaTime: 16, u: 48, v: 0 },
      { deltaTime: 16, u: 64, v: 0 },
      { deltaTime: 16, u: 16, v: 0 },
      { deltaTime: 16, u: 32, v: 0 },
      { deltaTime: 16, u: 48, v: 0 },
    ],
    down: [
      { deltaTime: 16, u: 0, v: 48 },
      { deltaTime: 16, u: 16, v: 48 },
      { deltaTime: 16, u: 32, v: 48 },
      { deltaTime: 16, u: 48, v: 48 },
      { deltaTime: 16, u: 64, v: 48 },
      { deltaTime: 16, u: 16, v: 48 },
      { deltaTime: 16, u: 32, v: 48 },
      { deltaTime: 16, u: 48, v: 48 },
    ],
    up: [
      { deltaTime: 16, u: 0, v: 32 },
      { deltaTime: 16, u: 16, v: 32 },
      { deltaTime: 16, u: 32, v: 32 },
      { deltaTime: 16, u: 48, v: 32 },
    ],
  },
};

const findIndex = (uvList: ReadonlyArray<UVAndTime>, time: number): number => {
  let offset = 0;
  for (const [index, uv] of uvList.entries()) {
    const end = offset + uv.deltaTime;
    if (time < end) {
      return index;
    }
    offset = end;
  }
  return 0;
};

const loopTime = (uvList: ReadonlyArray<UVAndTime>): number => {
  return uvList.reduce((offset, uv) => uv.deltaTime + offset, 0);
};

const CharacterSymbolInDirection = (props: {
  readonly character: Character;
  readonly direction: Direction;
  readonly uvList: ReadonlyArray<UVAndTime>;
}) => {
  return (
    <g data-name={"c-" + props.character + "-" + props.direction}>
      {props.uvList.map((e, index) => {
        const id = characterDirectionAndAnimationFrameToId({
          character: props.character,
          direction: props.direction,
          animation: index,
        });
        return (
          <symbol id={id} viewBox={[e.u, e.v, 16, 16].join(" ")} key={id}>
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

export const CharacterSymbolList = (): JSX.Element => {
  return (
    <g data-name="CharacterSymbolList">
      {characterAll.map((character) =>
        directionAll.map((direction) => (
          <CharacterSymbolInDirection
            key={character + "-" + direction}
            character={character}
            direction={direction}
            uvList={characterTable[character][direction]}
          />
        ))
      )}
    </g>
  );
};

export const CharacterUse = (props: {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
  readonly character: Character;
}) => {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    // eslint-disable-next-line init-declarations
    let id: number | undefined;
    const loop = () => {
      setTime(
        (oldTime) =>
          (oldTime + 1) %
          loopTime(characterTable[props.character][props.direction]),
      );
      id = window.requestAnimationFrame(loop);
    };
    loop();
    return () => {
      if (typeof id === "number") {
        window.cancelAnimationFrame(id);
      }
    };
  }, [props.direction, props.character]);
  return (
    <use
      href={"#" +
        characterDirectionAndAnimationFrameToId({
          character: props.character,
          direction: props.direction,
          animation: findIndex(
            characterTable[props.character][props.direction],
            time,
          ),
        })}
      x={props.x}
      y={props.y}
      width={16}
      height={16}
    />
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

export const TitleBgAndAnimation = (props: {
  readonly x: number;
  readonly y: number;
}): JSX.Element => {
  return (
    <image
      href={titleApngUrl.toString()}
      x={props.x}
      y={props.y}
      width={16 * 10}
      height={16 * 9}
    />
  );
};
