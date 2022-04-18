import * as React from "react";
import {
  CharacterSymbolList,
  CharacterUse,
  Direction,
  GbFrame,
  TitleBgAndAnimation,
} from "./sprite";
import { Layer, StageCanvas, StageSvg } from "./stage";
import { Text, TextSymbolList } from "./text";
import { bgm43, bgm47 } from "./mml/soundData";
import { playSound } from "./mml/audio";

const MAPCHANGE_R_mp3Url = new URL(
  "../assets/MAPCHANGE_R.mp3",
  import.meta.url
);

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
  | { readonly type: "none" }
  | { readonly type: "started"; readonly animationPhase: FrontRectAlphaPhase }
  | { readonly type: "stage"; readonly stageNumber: number };

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
    | { readonly type: "none" }
    | {
        readonly type: "started";
        readonly animationPhase: FrontRectAlphaPhase;
      };
}): React.ReactElement => {
  return (
    <g>
      <TitleBgAndAnimation x={EXS} y={EYS} />
      <Text
        x={EXS}
        y={EYS + 16 * 8 + 8}
        text={"   2015     Rwiiug"}
        color="GBT3"
      />
      <Text
        x={EXS + 6}
        y={EYS + 16 * 8 + 8}
        text={"          @       "}
        color="GBT3"
      />
      {props.state.type === "started" ? (
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
const enemyPositionTable: ReadonlyArray<{
  x: number;
  y: number;
  direction: Direction;
}> = [
  { x: 16 * 2 + 8, y: 16 * 2 + 8, direction: "right" },
  { x: 16 * 7 + 8, y: 16 * 4 + 8, direction: "left" },
  { x: 16 * 6 + 8, y: 16 * 5 + 8, direction: "up" },
];

const Stage = (props: {
  readonly mapBlobUrl: { readonly [key in Layer]: string } | undefined;
  readonly stageNumber: number;
}): JSX.Element => {
  const [playerState, setPlayerState] = React.useState<{
    readonly x: number;
    readonly y: number;
    readonly direction: Direction;
  }>({ x: 16 * 1, y: 16 * 7 + 7, direction: "right" });

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setPlayerState((oldState) => ({
            x: oldState.x,
            y: oldState.y - 1,
            direction: "up",
          }));
          return;

        case "a":
          setPlayerState((oldState) => ({
            x: oldState.x - 1,
            y: oldState.y,
            direction: "left",
          }));
          return;

        case "s":
          setPlayerState((oldState) => ({
            x: oldState.x,
            y: oldState.y + 1,
            direction: "down",
          }));
          return;

        case "d":
          setPlayerState((oldState) => ({
            x: oldState.x + 1,
            y: oldState.y,
            direction: "right",
          }));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (props.mapBlobUrl === undefined) {
    return (
      <g>
        <rect x={0} y={0} fill="orange" width={30} height={30} />
      </g>
    );
  }
  return (
    <g data-name="stage">
      <StageSvg
        mapBlobUrl={props.mapBlobUrl}
        x={EXS}
        y={EYS}
        width={gameScreenWidth}
        height={gameScreenHeight}
        stageNumber={props.stageNumber}
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
        direction={playerState.direction}
        character="player"
        x={EXS + playerState.x - 8}
        y={EYS + playerState.y - 8}
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
  const [state, setState] = React.useState<State>({ type: "none" });
  const [mapBlobUrl, setMapBlobUrl] = React.useState<
    { [key in Layer]: string } | undefined
  >(undefined);

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
      if (state.type === "none" && event.key === " ") {
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
        setState({ type: "started", animationPhase: 0 });
        window.setTimeout(() => {
          setState({ type: "started", animationPhase: 1 });
        }, (30 * 1000) / 60);
        window.setTimeout(() => {
          setState({ type: "started", animationPhase: 2 });
        }, ((30 + 30) * 1000) / 60);
        window.setTimeout(() => {
          setState({ type: "stage", stageNumber: 0 });
          if (bgmAudioBuffer !== undefined) {
            playBgmOrSe(audioContext, bgmAudioBuffer.bgm43, false);
          }
        }, ((30 + 30 + 90) * 1000) / 60);
      }
      if (state.type === "stage" && event.key === "1") {
        console.log("ステージを仮で変更", state.stageNumber + 1);
        setState({ type: "stage", stageNumber: state.stageNumber + 1 });
      }
      if (state.type === "stage" && event.key === "2") {
        console.log("ステージを仮で変更", state.stageNumber - 1);
        setState({ type: "stage", stageNumber: state.stageNumber - 1 });
      }
    };
    window.addEventListener("pointerdown", bgmStart, { once: true });
    window.addEventListener("keydown", onKeyDown, { once: true });
    return () => {
      window.removeEventListener("pointerdown", bgmStart);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [bgmAudioBuffer, audioContext, titleBgmBufferSourceNode, state]);

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
        <TextSymbolList />
        <CharacterSymbolList />
        <GbFrame />
        {state.type === "none" || state.type === "started" ? (
          <Title state={state} />
        ) : (
          <Stage mapBlobUrl={mapBlobUrl} stageNumber={state.stageNumber} />
        )}
      </svg>
      <div style={{ display: "none" }}>
        <StageCanvas onCreateBlobUrl={setMapBlobUrl} />
      </div>
    </div>
  );
};
