import * as React from "react";
import {
  CharacterSymbolList,
  CharacterUse,
  GbFrame,
  TitleBgAndAnimation,
} from "./sprite";
import { FrontRectAlphaPhase, frontRectAlpha } from "./FrontRectAlphaPhase";
import { Layer, StageCanvas, StageSvg } from "./stage";
import {
  StageNumberAndPosition,
  State,
  gameScreenHeight,
  gameScreenWidth,
  useAppState,
} from "./state";
import { Global } from "@emotion/react";
import { Text } from "./text";
import { enemyPositionTable } from "./enemyPositionTable";

const fontUrl = new URL("../assets/font.woff2", import.meta.url);

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
      {props.state.type === "titleStarted" ? (
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
      ) : (
        <></>
      )}
    </g>
  );
};

const Stage = (props: {
  readonly mapBlobUrl: { readonly [key in Layer]: string };
  readonly stageNumberAndPosition: StageNumberAndPosition;
}): JSX.Element => {
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
          )
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
  const { state, setMapBlobUrl } = useAppState();

  return (
    <div>
      <Global
        styles={`
@font-face {
  font-family: "hide like gb";
  src: url("${fontUrl.toString()}") format("woff2")
}
`}
      />
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
        <LoadingOrStageOrTitle state={state} />
      </svg>
      <div style={{ display: "none" }}>
        <StageCanvas onCreateBlobUrl={setMapBlobUrl} />
      </div>
    </div>
  );
};

const LoadingOrStageOrTitle = (props: {
  readonly state: State;
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
        />
      );
  }
};
