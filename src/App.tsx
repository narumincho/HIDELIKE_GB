import * as React from "react";
import {
  CharacterSymbolList,
  CharacterUse,
  Direction,
  GbFrame,
  TitleBgAndAnimation,
} from "./sprite";
import { Layer, StageCanvas, StageSvg } from "./stage";
import { bgm43, bgm47 } from "./mml/soundData";
import { Global } from "@emotion/react";
import { Text } from "./text";
import { playSound } from "./mml/audio";
import { useAnimationFrame } from "./useAnimationFrame";

const MAPCHANGE_R_mp3Url = new URL(
  "../assets/MAPCHANGE_R.mp3",
  import.meta.url
);

const fontUrl = new URL("../assets/font.woff2", import.meta.url);

const gameScreenWidth = 160;
const gameScreenHeight = 144;
/** ゲーム画面の左端のX座標 */
const EXS = 120;
/** ゲーム画面の上端のY座標 */
const EYS = 48;

type FrontRectAlphaPhase = 0 | 1 | 2;

const FrontRectAlpha = (phase: FrontRectAlphaPhase): number => {
  switch (phase) {
    case 0:
      return 8 * 10;
    case 1:
      return 8 * 20;
    case 2:
      return 255;
  }
};

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

const getSe = (audioContext: AudioContext): Promise<AudioBuffer> =>
  new Promise((resolve, reject) => {
    fetch(MAPCHANGE_R_mp3Url.toString())
      .then((v) => v.arrayBuffer())
      .then((v) =>
        audioContext.decodeAudioData(
          v,
          (ok) => {
            resolve(ok);
          },
          (e) => {
            reject(e);
          }
        )
      );
  });

type State =
  | { readonly type: "loading" }
  | {
      readonly type: "title";
      readonly mapBlobUrl: { readonly [key in Layer]: string };
    }
  | {
      readonly type: "titleStarted";
      readonly animationPhase: FrontRectAlphaPhase;
      readonly mapBlobUrl: { readonly [key in Layer]: string };
    }
  | {
      readonly type: "stage";
      readonly stageNumberAndPosition: StageNumberAndPosition;
      readonly mapBlobUrl: { readonly [key in Layer]: string };
    };

type BgmAudioBuffer = {
  /** タイトル曲 */
  readonly bgm47: AudioBuffer;
  /** ステージ最初 */
  readonly bgm43: AudioBuffer;
  /** マップ変更効果音 */
  readonly MAPCHANGE_R: AudioBuffer;
};

const playBgmOrSe = (
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  loop: boolean
): AudioBufferSourceNode => {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = loop;
  source.connect(audioContext.destination);
  source.start();
  console.log("bgm再生", source);
  return source;
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
      <Text x={EXS + 8 * 3} y={EYS + 16 * 8 + 8} text={"2015"} color="GBT3" />
      <Text x={EXS + 10 * 8 + 6} y={EYS + 16 * 8 + 8} text={"@"} color="GBT3" />
      <Text
        x={EXS + 8 * 12}
        y={EYS + 16 * 8 + 8}
        text={"Rwiiug"}
        color="GBT3"
      />
      {props.state.type === "titleStarted" ? (
        <rect
          x={EXS}
          y={EYS}
          width={16 * 10}
          height={16 * 9}
          fill={colorToString({
            a: FrontRectAlpha(props.state.animationPhase),
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

/**
 * 敵の初期位置データ
 *
 * 元のプログラム 30+ right
 */
const enemyPositionTable: ReadonlyArray<PositionAndDirection> = [
  { x: 16 * 2 + 8, y: 16 * 2 + 8, direction: "right" },
  { x: 16 * 7 + 8, y: 16 * 4 + 8, direction: "left" },
  { x: 16 * 6 + 8, y: 16 * 5 + 8, direction: "up" },
];

type StageNumberAndPosition = {
  readonly stageNumber: number;
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
};

type PositionAndDirection = {
  readonly x: number;
  readonly y: number;
  readonly direction: Direction;
};

const updateStageNumberAndPosition = (
  stageNumberAndPosition: StageNumberAndPosition,
  command: Direction
): StageNumberAndPosition => {
  const newPositionAndDirection = updatePositionAndDirection(
    stageNumberAndPosition,
    command
  );
  if (gameScreenWidth < newPositionAndDirection.x + 9) {
    return {
      stageNumber: stageNumberAndPosition.stageNumber + 1,
      x: 16,
      y: newPositionAndDirection.y,
      direction: "right",
    };
  }
  if (
    stageNumberAndPosition.stageNumber > 0 &&
    newPositionAndDirection.x - 9 < 0
  ) {
    return {
      stageNumber: stageNumberAndPosition.stageNumber - 1,
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
  command: Direction
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
    f: (n: StageNumberAndPosition) => StageNumberAndPosition
  ) => void;
}): JSX.Element => {
  const [inputState, setInputState] = React.useState<{
    [key in Direction]: boolean;
  }>({ up: false, left: false, down: false, right: false });

  const loop = React.useCallback(() => {
    const onChangeStageNumberAndPosition = props.onChangeStageNumberAndPosition;
    console.log("ステージの無限ループ");
    if (inputState.up) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPosition(old, "up")
      );
    }
    if (inputState.down) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPosition(old, "down")
      );
    }
    if (inputState.left) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPosition(old, "left")
      );
    }
    if (inputState.right) {
      onChangeStageNumberAndPosition((old) =>
        updateStageNumberAndPosition(old, "right")
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
        {enemyPositionTable.map((item, index) => (
          <CharacterUse
            key={index}
            direction={item.direction}
            character="enemy"
            x={EXS + item.x - 8}
            y={EYS + item.y - 8}
          />
        ))}
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
  const [titleBgmBufferSourceNode, setTitleBgmBufferSourceNode] =
    React.useState<AudioBufferSourceNode | undefined>(undefined);
  const [audioContext] = React.useState(() => new AudioContext());
  const [bgmAudioBuffer, setBgmAudioBuffer] = React.useState<
    BgmAudioBuffer | undefined
  >(undefined);
  const [state, setState] = React.useState<State>({ type: "loading" });

  React.useEffect(() => {
    Promise.all([playSound(bgm43), playSound(bgm47), getSe(audioContext)]).then(
      ([bgm43Buffer, bgm47Buffer, seBuffer]) => {
        console.log("bgm loaded");
        setBgmAudioBuffer({
          bgm43: bgm43Buffer,
          bgm47: bgm47Buffer,
          MAPCHANGE_R: seBuffer,
        });
      }
    );
  }, [audioContext]);

  React.useEffect(() => {
    console.log("イベント再登録!");
    const bgmStart = () => {
      if (
        titleBgmBufferSourceNode === undefined &&
        bgmAudioBuffer !== undefined
      ) {
        console.log("bgm再生", bgmAudioBuffer);
        setTitleBgmBufferSourceNode(
          playBgmOrSe(audioContext, bgmAudioBuffer.bgm47, true)
        );
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      bgmStart();
      console.log("キー入力を受け取った", event.key);
      if (state.type === "title" && event.key === " ") {
        const endTime = audioContext.currentTime + 2;
        const gainNode = audioContext.createGain();
        gainNode.gain.linearRampToValueAtTime(0, endTime);
        if (titleBgmBufferSourceNode !== undefined) {
          titleBgmBufferSourceNode.disconnect();
          titleBgmBufferSourceNode.connect(gainNode);
          gainNode.connect(audioContext.destination);
        }
        if (bgmAudioBuffer !== undefined) {
          console.log("効果音再生!");
          playBgmOrSe(audioContext, bgmAudioBuffer.MAPCHANGE_R, false);
        }
        setState({
          type: "titleStarted",
          animationPhase: 0,
          mapBlobUrl: state.mapBlobUrl,
        });
        window.setTimeout(() => {
          setState({
            type: "titleStarted",
            animationPhase: 1,
            mapBlobUrl: state.mapBlobUrl,
          });
        }, (30 * 1000) / 60);
        window.setTimeout(() => {
          setState({
            type: "titleStarted",
            animationPhase: 2,
            mapBlobUrl: state.mapBlobUrl,
          });
        }, ((30 + 30) * 1000) / 60);
        window.setTimeout(() => {
          setState({
            type: "stage",
            stageNumberAndPosition: {
              stageNumber: 0,
              x: 16 * 1,
              y: 16 * 7 + 7,
              direction: "right",
            },
            mapBlobUrl: state.mapBlobUrl,
          });
          if (bgmAudioBuffer !== undefined) {
            playBgmOrSe(audioContext, bgmAudioBuffer.bgm43, false);
          }
        }, ((30 + 30 + 90) * 1000) / 60);
      }
    };
    window.addEventListener("pointerdown", bgmStart, { once: true });
    window.addEventListener("keydown", onKeyDown, { once: true });
    return () => {
      window.removeEventListener("pointerdown", bgmStart);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [bgmAudioBuffer, audioContext, titleBgmBufferSourceNode, state]);

  const onChangeStageNumberAndPosition = React.useCallback(
    (func: (old: StageNumberAndPosition) => StageNumberAndPosition) => {
      setState((oldState) => {
        if (oldState.type !== "stage") {
          return oldState;
        }
        return {
          type: "stage",
          stageNumberAndPosition: func(oldState.stageNumberAndPosition),
          mapBlobUrl: oldState.mapBlobUrl,
        };
      });
    },
    []
  );

  const setMapBlobUrl = React.useCallback(
    (mapBlobUrl: { readonly [key in Layer]: string }) => {
      setState({ type: "title", mapBlobUrl });
    },
    []
  );

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
    func: (old: StageNumberAndPosition) => StageNumberAndPosition
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
