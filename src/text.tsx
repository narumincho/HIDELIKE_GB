/** @jsxImportSource @emotion/react */
import * as React from "react";
import { css } from "@emotion/react";

type GBT = "GBT1" | "GBT2" | "GBT3";

/**
 * 文字を描画する
 *
 * サポートしている文字
 * `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz[]-■!🕒():@?`
 * @param props
 * @returns
 */

export const Text = (props: {
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly color: GBT;
}): JSX.Element => {
  return (
    <text
      css={css({
        fontFamily: "hide like gb",
        fontSize: 8,
        whiteSpace: "pre",
      })}
      fill={GBTTextToColor(props.color)}
      textAnchor="start"
      x={props.x}
      y={props.y}
      alignmentBaseline="hanging"
    >
      {props.text}
    </text>
  );
};

const GBTTextToColor = (bBT: GBT): string => {
  switch (bBT) {
    case "GBT1":
      return `RGB(${8 * 10},${8 * 10},${8 * 10})`;
    case "GBT2":
      return `RGB(${8 * 20},${8 * 20},${8 * 20})`;
    case "GBT3":
      return "RGB(255,255,255)";
  }
};
