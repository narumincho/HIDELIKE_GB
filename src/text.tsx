import * as React from "react";

const fontTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz[]-■!🕒():@?";
const fontPngUrl = new URL("../assets/font.png", import.meta.url);

const fontId = (char: typeof fontTable[number]): string => "font-" + char;

export const getFontData = (): Promise<Uint8ClampedArray> =>
  new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = [...fontTable].length * 8;
    canvas.height = 8;
    document.body.append(canvas);
    const canvasContext = canvas.getContext("2d");
    if (canvasContext === null) {
      throw new Error("canvas の context が取得できなかった");
    }
    const image = new Image([...fontTable].length * 8, 8);
    image.src = fontPngUrl.toString();
    image.onload = () => {
      canvasContext.drawImage(image, 0, 0);
      resolve(
        canvasContext.getImageData(0, 0, [...fontTable].length * 8, 8).data
      );
    };
  });

const binaryToPixel = (
  x: number,
  y: number,
  fontData: Uint8ClampedArray
):
  | {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    }
  | undefined => {
  const offset = (y * ([...fontTable].length * 8) + x) * 4;
  const r = fontData[offset];
  const g = fontData[offset + 1];
  const b = fontData[offset + 2];
  const a = fontData[offset + 3];
  if (
    r !== undefined &&
    g !== undefined &&
    b !== undefined &&
    a !== undefined
  ) {
    return { r, g, b, a };
  }
  return undefined;
};

type Dot = { readonly x: number; readonly y: number };

const fontDataToDotList = (
  fontData: Uint8ClampedArray
): ReadonlyArray<{
  readonly char: typeof fontTable[number];
  readonly dotList: ReadonlyArray<Dot>;
}> => {
  return [...[...fontTable].entries()].map(([index, char]) => ({
    char,
    dotList: new Array(8 * 8).fill(0).flatMap((_, i) => {
      const x = i % 8;
      const y = Math.floor(i / 8);
      const pixel = binaryToPixel(index * 8 + x, y, fontData);
      if (pixel === undefined) {
        return [];
      }
      if (pixel.a > 0.5) {
        return [{ x, y }];
      }
      return [];
    }),
  }));
};

export const logFontData = async () => {
  const fontData = await getFontData();
  const result = fontDataToDotList(fontData);
  console.log(
    result.map(({ char, dotList }) => ({
      char,
      dotList: `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
<path fill="#000" d="${dotList
        .map((dot) => `M${dot.x - 1} ${dot.y} h1v1h-1z`)
        .join("")}"/>
</svg>`,
    }))
  );
};

export const TextSymbolList = (): JSX.Element => {
  return (
    <g data-name="TextSymbolList">
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

export const Text = (props: {
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
