/** @jsxImportSource @emotion/react */
import * as React from "react";
import { css } from "@emotion/react";

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
    <text
      css={css({
        fontFamily: "hide like gb",
        fontSize: 8,
        whiteSpace: "pre",
      })}
      fill="white"
      textAnchor="start"
      x={props.x}
      y={props.y}
      alignmentBaseline="hanging"
    >
      {props.text}
    </text>
  );
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
          <React.Fragment key={index}>
            <text
              css={css({
                fontFamily: "hide like gb",
                fontSize: 8,
              })}
              fill="white"
              textAnchor="start"
              x={props.x + index * 8}
              y={props.y}
              alignmentBaseline="hanging"
            >
              {char}
            </text>
            {/* <use
              href={"#" + fontId(char)}
              x={props.x + index * 8}
              y={props.y}
              width={8}
              height={8}
            /> */}
          </React.Fragment>
        );
      })}
    </g>
  );
};
