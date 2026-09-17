import type { JSX } from "preact";
import { fontPathMap } from "./fontData.ts";

export type GBT = "GBT0" | "GBT1" | "GBT2" | "GBT3";

/**
 * 8x8 ドット絵フォント（hide like gb）で文字列を描画する
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
  const size = props.fontSize ?? 8;
  const scale = size / 8;

  const chars = Array.from(props.text);

  return (
    <g data-name="pixel-text">
      {chars.map((char, index) => {
        const path = fontPathMap.get(char);
        const charX = props.x + index * 8 * scale;
        const charY = props.y;
        if (!path) {
          return null;
        }
        return (
          <path
            key={index}
            d={path}
            fill={fill}
            transform={scale === 1
              ? `translate(${charX}, ${charY})`
              : `translate(${charX}, ${charY}) scale(${scale})`}
          />
        );
      })}
    </g>
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
