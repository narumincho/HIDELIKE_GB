import * as React from "react";
import * as reactDomClient from "react-dom/client";
import { bgm47 } from "./mml/soundData";
import { playSound } from "./mml/audio";

document.documentElement.style.height = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";

const fontTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz[]-■!🕒():@?";

/** ゲーム画面の左端のX座標 */
const EXS = 120;
/** ゲーム画面の右端のX座標? */
const EXE = EXS + 160;
/** ゲーム画面の上端のY座標 */
const EYS = 48;
/** ゲーム画面の下端のY座標? */
const EYE = EYS + 144;

const spritePngUrl = new URL("../assets/sprite.png", import.meta.url);
const fontPngUrl = new URL("../assets/font.png", import.meta.url);
const MAPCHANGE_R_mp3Url = new URL(
  "../assets/MAPCHANGE_R.mp3",
  import.meta.url
);

const entryPoint = document.createElement("div");
entryPoint.style.height = "100%";

document.body.appendChild(entryPoint);

const fontId = (char: typeof fontTable[number]): string => "font-" + char;

const TextSymbolList = (): JSX.Element => {
  return (
    <g>
      {[...fontTable].map((e, index) => (
        <symbol id={fontId(e)} viewBox={[index * 8, 0, 8, 8].join(" ")} key={e}>
          <image
            href={fontPngUrl.toString()}
            x={0}
            y={0}
            width={[...fontTable].length * 8}
            height={8}
          />
        </symbol>
      ))}
    </g>
  );
};

const Text = (props: {
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly color: "GBT3";
}): JSX.Element => {
  return (
    <g style={{ filter: "brightness(0) invert(1)" }}>
      {[...props.text].map((char, index) => {
        if (char === " ") {
          return <React.Fragment key={index}></React.Fragment>;
        }
        if (!fontTable.includes(char)) {
          console.error("サポートしていない文字を表示しようとしている", char);
        }
        return (
          <use
            key={index}
            href={"#" + fontId(char)}
            x={props.x + index * 8}
            y={props.y}
            width={8}
            height={8}
          />
        );
      })}
    </g>
  );
};

const GbFrame = (): JSX.Element => {
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

const OpeningBackground = (): JSX.Element => {
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

const OpeningFace = (): JSX.Element => {
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

const HideLikeGB = (): React.ReactElement => {
  const [bgmStarted, setBgmStarted] = React.useState<boolean>(false);
  const [audioContext] = React.useState(() => new AudioContext());
  const [audioSourceBufferNode, setAudioSourceBufferNode] = React.useState<
    AudioBufferSourceNode | undefined
  >(undefined);
  const [seSourceBufferNode, setSeSourceBufferNode] = React.useState<
    AudioBufferSourceNode | undefined
  >(undefined);
  const [state, setState] = React.useState<
    | { readonly type: "none" }
    | { readonly type: "started"; readonly animationPhase: FrontRectAlphaPhase }
  >({ type: "none" });

  React.useEffect(() => {
    playSound(bgm47).then((audioBuffer) => {
      console.log("bgm loaded", audioBuffer);
      const audioSourceBuffer = audioContext.createBufferSource();
      audioSourceBuffer.buffer = audioBuffer;
      audioSourceBuffer.loop = true;
      setAudioSourceBufferNode(audioSourceBuffer);
    });
  }, [audioContext]);

  React.useEffect(() => {
    getSe(audioContext).then((audioBuffer) => {
      console.log("se loaded", audioBuffer);
      const audioSourceBuffer = audioContext.createBufferSource();
      audioSourceBuffer.buffer = audioBuffer;
      audioSourceBuffer.loop = false;
      setSeSourceBufferNode(audioSourceBuffer);
    });
  }, [audioContext]);

  React.useEffect(() => {
    console.log("イベント再登録!");
    const bgmStart = () => {
      if (!bgmStarted && audioSourceBufferNode !== undefined) {
        audioSourceBufferNode.connect(audioContext.destination);
        audioSourceBufferNode.start();
        console.log("bgm再生", audioSourceBufferNode);
        setBgmStarted(true);
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
        if (audioSourceBufferNode !== undefined) {
          audioSourceBufferNode.disconnect();
          audioSourceBufferNode.connect(gainNode);
          gainNode.connect(audioContext.destination);
        }
        if (seSourceBufferNode !== undefined) {
          console.log("効果音再生!");
          // gainNode.disconnect();
          seSourceBufferNode.connect(audioContext.destination);
          seSourceBufferNode.start();
        }
        setState({ type: "started", animationPhase: 0 });
        window.setTimeout(() => {
          setState({ type: "started", animationPhase: 1 });
        }, (30 * 1000) / 60);
        window.setTimeout(() => {
          setState({ type: "started", animationPhase: 2 });
        }, ((30 + 30) * 1000) / 60);
        window.setTimeout(() => {
          // 次の画面へ
        }, ((30 + 30 + 90) * 1000) / 60);
      }
    };
    window.addEventListener("pointerdown", bgmStart, { once: true });
    window.addEventListener("keydown", onKeyDown, { once: true });
    return () => {
      window.removeEventListener("pointerdown", bgmStart);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    audioSourceBufferNode,
    audioContext,
    bgmStarted,
    seSourceBufferNode,
    state,
  ]);

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
      <GbFrame />
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
