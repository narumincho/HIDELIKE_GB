import * as React from "npm:react";
import {
  CharacterSymbolList,
  CharacterUse,
  Direction,
  GbFrame,
  TitleBgAndAnimation,
} from "./sprite.tsx";
import { frontRectAlpha, FrontRectAlphaPhase } from "./FrontRectAlphaPhase.ts";
import { Layer, StageCanvas, StageSvg } from "./stage.tsx";
import { StageNumberAndPosition, State, useAppState } from "./state.ts";
import { StageNumber } from "./StageNumber.ts";
import { Text } from "./text.tsx";
import { enemyPositionTable } from "./enemyPositionTable.ts";
import { useAnimationFrame } from "./useAnimationFrame.ts";

const gameScreenWidth = 160;
const gameScreenHeight = 144;
/** ゲーム画面の左端のX座標 */
const EXS = 120;
/** ゲーム画面の上端のY座標 */
const EYS = 48;

const numberTo2digitHex = (n: number): string => {
  return n.toString(16).padStart(2, "0");
};

const colorToString = (color: {
  r: number;
  g: number;
  b: number;
  a: number;
}) => {
  return (
    "#" +
    numberTo2digitHex(color.r) +
    numberTo2digitHex(color.g) +
    numberTo2digitHex(color.b) +
    numberTo2digitHex(color.a)
  );
};

const Title = (props: {
  readonly state:
    | { readonly type: "title" }
    | {
      readonly type: "titleStarted";
      readonly animationPhase: FrontRectAlphaPhase;
    };
}): React.ReactElement => {
  return (
    <g>
      <TitleBgAndAnimation x={EXS} y={EYS} />
      <Text x={EXS + 8 * 3} y={EYS + 16 * 8 + 8} text="2015" color="GBT3" />
      <Text x={EXS + 10 * 8 + 6} y={EYS + 16 * 8 + 8} text="@" color="GBT3" />
      <Text x={EXS + 8 * 12} y={EYS + 16 * 8 + 8} text="Rwiiug" color="GBT3" />
      {props.state.type === "titleStarted"
        ? (
          <rect
            x={EXS}
            y={EYS}
            width={16 * 10}
            height={16 * 9}
            fill={colorToString({
              a: frontRectAlpha(props.state.animationPhase),
              r: 255,
              g: 255,
              b: 255,
            })}
          />
        )
        : <></>}
    </g>
  );
};

type PositionAndDirection = {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
};

const updateStageNumberAndPositionWithClamp = (
  stageNumberAndPosition: StageNumberAndPosition,
  command: Direction,
): StageNumberAndPosition => {
  const moved = updateStageNumberAndPosition(stageNumberAndPosition, command);
  return {
    stageNumber: moved.stageNumber,
    direction: moved.direction,
    x: Math.max(8, Math.min(moved.x, gameScreenWidth - 8)),
    y: Math.max(7, Math.min(moved.y, gameScreenHeight - 9)),
  };
};

const updateStageNumberAndPosition = (
  stageNumberAndPosition: StageNumberAndPosition,
  command: Direction,
): StageNumberAndPosition => {
  const newPositionAndDirection = updatePositionAndDirection(
    stageNumberAndPosition,
    command,
  );
  // 右のステージへの移動
  if (gameScreenWidth < newPositionAndDirection.x + 9) {
    return {
      stageNumber: (stageNumberAndPosition.stageNumber + 1) as StageNumber,
      x: 16,
      y: newPositionAndDirection.y,
      direction: "right",
    };
  }
  // 左のステージへの移動
  if (
    stageNumberAndPosition.stageNumber > 0 &&
    newPositionAndDirection.x - 9 < 0
  ) {
    return {
      stageNumber: (stageNumberAndPosition.stageNumber - 1) as StageNumber,
      x: gameScreenWidth - 16,
      y: newPositionAndDirection.y,
      direction: "right",
    };
  }

  return {
    stageNumber: stageNumberAndPosition.stageNumber,
    x: newPositionAndDirection.x,
    y: newPositionAndDirection.y,
    direction: newPositionAndDirection.direction,
  };
};

const updatePositionAndDirection = (
  stageNumberAndPosition: PositionAndDirection,
  command: Direction,
): PositionAndDirection => {
  switch (command) {
    case "up":
      return {
        x: stageNumberAndPosition.x,
        y: stageNumberAndPosition.y - 1,
        direction: "up",
      };
    case "down":
      return {
        x: stageNumberAndPosition.x,
        y: stageNumberAndPosition.y + 1,
        direction: "down",
      };
    case "left":
      return {
        x: stageNumberAndPosition.x - 1,
        y: stageNumberAndPosition.y,
        direction: "left",
      };
    case "right":
      return {
        x: stageNumberAndPosition.x + 1,
        y: stageNumberAndPosition.y,
        direction: "right",
      };
  }
};

const Stage = (props: {
  readonly mapBlobUrl: { readonly [key in Layer]: string };
  readonly stageNumberAndPosition: StageNumberAndPosition;
  readonly onChangeStageNumberAndPosition: (
    f: (n: StageNumberAndPosition) => StageNumberAndPosition,
  ) => void;
}): JSX.Element => {
  const [inputState, setInputState] = React.useState<
    {
      [key in Direction]: boolean;
    }
  >({ up: false, left: false, down: false, right: false });

  const loop = React.useCallback(() => {
    const onChangeStageNumberAndPosition = props.onChangeStageNumberAndPosition;
    console.log("ステージの無限ループ");
    if (inputState.up) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPositionWithClamp(old, "up")
      );
    }
    if (inputState.down) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPositionWithClamp(old, "down")
      );
    }
    if (inputState.left) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPositionWithClamp(old, "left")
      );
    }
    if (inputState.right) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPositionWithClamp(old, "right")
      );
    }
  }, [
    inputState.down,
    inputState.left,
    inputState.right,
    inputState.up,
    props.onChangeStageNumberAndPosition,
  ]);
  useAnimationFrame(loop);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      console.log("onKeyDown", event.key);
      switch (event.key) {
        case "w":
        case "ArrowUp":
          setInputState((o) => ({ ...o, up: true }));
          return;

        case "a":
        case "ArrowLeft":
          setInputState((o) => ({ ...o, left: true }));
          return;

        case "s":
        case "ArrowDown":
          setInputState((o) => ({ ...o, down: true }));
          return;

        case "d":
        case "ArrowRight":
          setInputState((o) => ({ ...o, right: true }));
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      console.log("onKeyUp", event.key);
      switch (event.key) {
        case "w":
        case "ArrowUp":
          setInputState((o) => ({ ...o, up: false }));
          return;

        case "a":
        case "ArrowLeft":
          setInputState((o) => ({ ...o, left: false }));
          return;

        case "s":
        case "ArrowDown":
          setInputState((o) => ({ ...o, down: false }));
          return;

        case "d":
        case "ArrowRight":
          setInputState((o) => ({ ...o, right: false }));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <g data-name="stage">
      <StageSvg
        mapBlobUrl={props.mapBlobUrl}
        x={EXS}
        y={EYS}
        width={gameScreenWidth}
        height={gameScreenHeight}
        stageNumber={props.stageNumberAndPosition.stageNumber}
      />
      <g data-name="enemy-sprite">
        {enemyPositionTable(props.stageNumberAndPosition.stageNumber).map(
          (item, index) => (
            <CharacterUse
              key={index}
              direction={item.direction}
              character={item.character}
              x={EXS + item.x - 8}
              y={EYS + item.y - 8}
            />
          ),
        )}
      </g>
      <CharacterUse
        direction={props.stageNumberAndPosition.direction}
        character="player"
        x={EXS + props.stageNumberAndPosition.x - 8}
        y={EYS + props.stageNumberAndPosition.y - 8}
      />
    </g>
  );
};

export const App = (): React.ReactElement => {
  const { state, setMapBlobUrl, onChangeStageNumberAndPosition } =
    useAppState();

  return (
    <div>
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
        <LoadingOrStageOrTitle
          state={state}
          onChangeStageNumberAndPosition={onChangeStageNumberAndPosition}
        />
      </svg>
      <div style={{ display: "none" }}>
        <StageCanvas onCreateBlobUrl={setMapBlobUrl} />
      </div>
    </div>
  );
};

const LoadingOrStageOrTitle = (props: {
  readonly state: State;
  readonly onChangeStageNumberAndPosition: (
    func: (old: StageNumberAndPosition) => StageNumberAndPosition,
  ) => void;
}): JSX.Element => {
  switch (props.state.type) {
    case "loading":
      return <text>Loading...</text>;
    case "title":
    case "titleStarted":
      return <Title state={props.state} />;
    case "stage":
      return (
        <Stage
          mapBlobUrl={props.state.mapBlobUrl}
          stageNumberAndPosition={props.state.stageNumberAndPosition}
          onChangeStageNumberAndPosition={props.onChangeStageNumberAndPosition}
        />
      );
  }
};
