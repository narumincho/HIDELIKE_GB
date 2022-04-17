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
}): JSX.Element => {
  return (
    <g>
      {[...props.text].map((char, index) => {
        if (char === " ") {
          return <React.Fragment key={index}></React.Fragment>;
        }
        if (!fontTable.includes(char)) {
          console.error("サポートしていない文字を表示しようとしている", char);
        }
        return (
          <use
            href={"#" + fontId(char)}
            key={index}
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

const HideLikeGB = (): React.ReactElement => {
  const [bgmStarted, setBgmStarted] = React.useState<boolean>(false);
  React.useEffect(() => {
    window.addEventListener(
      "pointerdown",
      () => {
        if (!bgmStarted) {
          playSound(new AudioContext(), bgm47);
          setBgmStarted(true);
        }
      },
      { once: true }
    );
  }, [bgmStarted]);
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
      <Text x={EXS} y={EYS + 16 * 8 + 8} text={"   2015     Rwiiug"} />
      <Text x={EXS + 6} y={EYS + 16 * 8 + 8} text={"          @       "} />
    </svg>
  );
};

reactDomClient.createRoot(entryPoint).render(<HideLikeGB />);
