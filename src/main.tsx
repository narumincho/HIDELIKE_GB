import * as React from "react";
import * as reactDomClient from "react-dom/client";
import { bgm47 } from "./mml/soundData";
import { playSound } from "./mml/audio";

document.documentElement.style.height = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";

const fontTable = [
  0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d,
  0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63,
  0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70,
  0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x5b, 0x5d, 0x2d,
  0xe2b1, 0x21, 0xe214, 0x28, 0x29, 0x3a, 0x40, 0x3f,
] as const;

/** ゲーム画面の左端のX座標 */
const EXS = 120;
/** ゲーム画面の右端のX座標? */
const EXE = EXS + 160;
/** ゲーム画面の上端のY座標 */
const EYS = 48;
/** ゲーム画面の下端のY座標? */
const EYE = EYS + 144;

const spritePngUrl = new URL("../assets/sprite.png", import.meta.url);

const entryPoint = document.createElement("div");
entryPoint.style.height = "100%";

document.body.appendChild(entryPoint);

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
      <OpeningBackground />
      <OpeningFace />
    </svg>
  );
};

reactDomClient.createRoot(entryPoint).render(<HideLikeGB />);
