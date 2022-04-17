import * as React from "react";

const fontTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz[]-■!🕒():@?";
const fontPngUrl = new URL("../assets/font.png", import.meta.url);

const fontId = (char: typeof fontTable[number]): string => "font-" + char;

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
