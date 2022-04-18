import * as React from "react";

const spritePngUrl = new URL("../assets/sprite.png", import.meta.url);

const characterAll = ["player", "enemy"] as const;
const directionAll = ["up", "down", "left", "right"] as const;

export type Character = typeof characterAll[number];

export type Direction = typeof directionAll[number];

type CharacterDirectionAndAnimationFrame = {
  readonly character: Character;
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
    left: [
      { deltaTime: 16, u: 0, v: 128 },
      { deltaTime: 16, u: 16, v: 128 },
      { deltaTime: 16, u: 32, v: 128 },
      { deltaTime: 16, u: 48, v: 128 },
    ],
    right: [
      { deltaTime: 16, u: 0, v: 160 },
      { deltaTime: 16, u: 16, v: 160 },
      { deltaTime: 16, u: 32, v: 160 },
      { deltaTime: 16, u: 48, v: 160 },
    ],
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
    up: [
      { deltaTime: 16, u: 0, v: 208 },
      { deltaTime: 16, u: 16, v: 208 },
      { deltaTime: 16, u: 32, v: 208 },
      { deltaTime: 16, u: 48, v: 208 },
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
          loopTime(characterTable[props.character][props.direction])
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
      href={
        "#" +
        characterDirectionAndAnimationFrameToId({
          character: props.character,
          direction: props.direction,
          animation: findIndex(
            characterTable[props.character][props.direction],
            time
          ),
        })
      }
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

const OpeningBackground = (props: {
  readonly x: number;
  readonly y: number;
}): JSX.Element => {
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
        x={props.x}
        y={props.y}
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

const OpeningFace = (props: {
  readonly x: number;
  readonly y: number;
}): JSX.Element => {
  const faceAnimeId = "faceAnime";
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
        x={props.x + 16 * 6}
        y={props.y + 16 * 5}
        width={32}
        height={32}
      />
    </>
  );
};

export const TitleBgAndAnimation = (props: {
  readonly x: number;
  readonly y: number;
}): JSX.Element => {
  return (
    <g>
      <OpeningBackground x={props.x} y={props.y} />
      <OpeningFace x={props.x} y={props.y} />
    </g>
  );
};
