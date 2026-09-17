import * as React from "preact/compat";
import type { JSX } from "preact";

export type GBT = "GBT0" | "GBT1" | "GBT2" | "GBT3";

/**
 * 文字を描画する
 */
export const Text = (props: {
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly color?: GBT | string;
  readonly fontSize?: number;
}): JSX.Element => {
  const color = props.color ?? "GBT3";
  const fill = GBTTextToColor(color);
  return (
    <text
      style={{
        fontFamily: "'hide like gb', monospace",
        fontSize: props.fontSize ?? 8,
        whiteSpace: "pre",
      }}
      fill={fill}
      textAnchor="start"
      x={props.x}
      y={props.y}
      dominantBaseline="hanging"
    >
      {props.text}
    </text>
  );
};

export const GBTTextToColor = (gbt: GBT | string): string => {
  switch (gbt) {
    case "GBT0":
      return "#0f380f";
    case "GBT1":
      return `rgb(${8 * 10}, ${8 * 10}, ${8 * 10})`;
    case "GBT2":
      return `rgb(${8 * 20}, ${8 * 20}, ${8 * 20})`;
    case "GBT3":
      return "#ffffff";
    default:
      return gbt;
  }
};
