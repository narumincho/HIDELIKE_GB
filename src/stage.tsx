import * as React from "react";

const gbMap = new URL("../assets/HIDEL_GBMAP.dat", import.meta.url);
const bgImageUrl = new URL("../assets/BG.png", import.meta.url);

/** マップ全体の幅 (チップ単位) */
const bgWidth = 230;
/** マップ全体の高さ (チップ単位) */
const bgHeight = 18;

/** マップデータのバイナリの用途不明な不明なヘッダー */
const mainOffset = 32 + 32 * 32;

type State =
  | {
      readonly type: "loading";
    }
  | {
      readonly type: "loaded";
      readonly bgImage: HTMLImageElement;
      readonly mapData: Uint8Array;
    };

export const StageCanvas = (): JSX.Element => {
  const [state, setState] = React.useState<State>({ type: "loading" });
  React.useEffect(() => {
    if (state.type === "loading") {
      const bgImage = new Image();
      bgImage.src = bgImageUrl.toString();
      bgImage.onload = () => {
        fetch(gbMap.toString())
          .then((e) => e.arrayBuffer())
          .then((mapArraybuffer) => {
            setState({
              type: "loaded",
              bgImage,
              mapData: new Uint8Array(mapArraybuffer),
            });
          });
      };
    }
  }, [state]);
  return (
    <div>
      {state.type === "loading" ? (
        "loading..."
      ) : (
        <>
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={0}
          />
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={1}
          />
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={2}
          />
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={3}
          />
        </>
      )}
    </div>
  );
};

/**
 * マップは横方向のみにスクロール
 * 画面内に表示されるのは10x9
 * - レイヤー0版に世界の明るさ(後半は暗い)
 * - レイヤー1番に地面
 * - レイヤー2番に木、岩など通れない障害物
 * - レイヤー3番不明 敵が動く範囲?
 *
 * 16bitで1マス
 *
 */
export const StageCanvasOneLayer = (props: {
  readonly bgImage: HTMLImageElement;
  readonly mapData: Uint8Array;
  readonly layer: 0 | 1 | 2 | 3;
}): JSX.Element => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (ref.current !== null) {
      const data = new Uint16Array(bgWidth * bgHeight + 1);
      for (let y = 0; y < bgHeight; y += 1) {
        for (let x = 0; x < bgWidth; x += 1) {
          const offsetInLayer = bgWidth * y + x;
          const offset = bgWidth * bgHeight * props.layer + offsetInLayer;
          data[offsetInLayer] =
            (props.mapData[mainOffset + offset * 2 + 0] as number) +
            ((props.mapData[mainOffset + offset * 2 + 1] as number) << 8);
        }
      }
      const context = ref.current.getContext("2d");
      if (context === null) {
        throw new Error("このブラウザはCanvasAPIに対応していない!");
      }
      drawToCanvas(context, data, props.bgImage);
    }
  }, [props.bgImage, props.layer, props.mapData]);
  return (
    <canvas
      data-name={"stage-map-" + props.layer.toString()}
      ref={ref}
      width={bgWidth * 16}
      height={bgHeight * 16}
    />
  );
};

const drawToCanvas = (
  context: CanvasRenderingContext2D,
  data: Uint16Array,
  bgImage: HTMLImageElement
): void => {
  for (let i = 0; i < bgWidth * bgHeight; i += 1) {
    const sourcePosition = chrAttrToImageOffset(data[i] as number);
    const x = i % bgWidth;
    const y = Math.floor(i / bgWidth);
    context.drawImage(
      bgImage,
      sourcePosition.x,
      sourcePosition.y,
      16,
      16,
      x * 16,
      y * 16,
      16,
      16
    );
  }
};

/**
 * キャラクター番号から画像の位置を算出tする
 * http://petitcom.net/manual/bgput
 * @param chrAttr キャラクター番号
 */
const chrAttrToImageOffset = (
  chrAttr: number
): { readonly x: number; readonly y: number } => {
  const num = chrAttr & 0xfff;
  return {
    x: (num % 32) * 16,
    y: Math.floor(num / 32) * 16,
  };
};
