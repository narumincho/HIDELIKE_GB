import * as React from "react";
import * as reactDomClient from "react-dom/client";
import { EXS, EYS } from "./position";
import {
  EnemySymbolList,
  GbFrame,
  OpeningBackground,
  OpeningFace,
} from "./sprite";
import { Text, TextSymbolList } from "./text";
import { bgm43, bgm47 } from "./mml/soundData";
import { playSound } from "./mml/audio";

document.documentElement.style.height = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";

const MAPCHANGE_R_mp3Url = new URL(
  "../assets/MAPCHANGE_R.mp3",
  import.meta.url
);

const entryPoint = document.createElement("div");
entryPoint.style.height = "100%";

document.body.appendChild(entryPoint);

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
  | { readonly type: "map" };

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

const HideLikeGB = (): React.ReactElement => {
  const [titleBgmBufferSourceNode, setTitleBgmBufferSourceNode] =
    React.useState<AudioBufferSourceNode | undefined>(undefined);
  const [audioContext] = React.useState(() => new AudioContext());
  const [bgmAudioBuffer, setBgmAudioBuffer] = React.useState<
    BgmAudioBuffer | undefined
  >(undefined);
  const [state, setState] = React.useState<State>({ type: "none" });

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
        console.log(endTime);
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
          setState({ type: "map" });
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

  return (
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
      <EnemySymbolList />
      <GbFrame />
      {state.type === "none" || state.type === "started" ? (
        <>
          <OpeningBackground />
          <OpeningFace />
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
        </>
      ) : (
        <></>
      )}
      {state.type === "started" ? (
        <rect
          x={EXS}
          y={EYS}
          width={16 * 10}
          height={16 * 9}
          fill={colorToString({
            a: FrontRectAlpha(state.animationPhase),
            r: 255,
            g: 255,
            b: 255,
          })}
        />
      ) : (
        <></>
      )}
    </svg>
  );
};

reactDomClient.createRoot(entryPoint).render(<HideLikeGB />);
