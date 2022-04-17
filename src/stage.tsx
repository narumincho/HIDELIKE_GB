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

const layerAll = ["layer0", "layer1", "layer2", "layer3"] as const;

export type Layer = typeof layerAll[number];

export const StageCanvas = (props: {
  onCreateBlobUrl: (url: {
    readonly [key in Layer]: string;
  }) => void;
}): JSX.Element => {
  const [state, setState] = React.useState<State>({ type: "loading" });
  const [, setBlobUrlMap] = React.useState<{
    [key in Layer]: string | undefined;
  }>({
    layer0: undefined,
    layer1: undefined,
    layer2: undefined,
    layer3: undefined,
  });
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

  const setBlobUrlMapAndEmit = React.useCallback(
    (layer: Layer, blobUrl: string) => {
      setBlobUrlMap((old) => {
        const newMap: { readonly [key in Layer]: string | undefined } = {
          ...old,
          [layer]: blobUrl,
        };
        if (
          newMap.layer0 !== undefined &&
          newMap.layer1 !== undefined &&
          newMap.layer2 !== undefined &&
          newMap.layer3 !== undefined
        ) {
          const onCreateBlobUrl = props.onCreateBlobUrl;
          onCreateBlobUrl({
            layer0: newMap.layer0,
            layer1: newMap.layer1,
            layer2: newMap.layer2,
            layer3: newMap.layer3,
          });
        }
        return newMap;
      });
    },
    [props.onCreateBlobUrl]
  );

  const onCreateBlobUrlLayer0 = React.useCallback(
    (url: string) => {
      setBlobUrlMapAndEmit("layer0", url);
    },
    [setBlobUrlMapAndEmit]
  );
  const onCreateBlobUrlLayer1 = React.useCallback(
    (url: string) => {
      setBlobUrlMapAndEmit("layer1", url);
    },
    [setBlobUrlMapAndEmit]
  );
  const onCreateBlobUrlLayer2 = React.useCallback(
    (url: string) => {
      setBlobUrlMapAndEmit("layer2", url);
    },
    [setBlobUrlMapAndEmit]
  );
  const onCreateBlobUrlLayer3 = React.useCallback(
    (url: string) => {
      setBlobUrlMapAndEmit("layer3", url);
    },
    [setBlobUrlMapAndEmit]
  );

  return (
    <div data-name="stage-canvas">
      {state.type === "loading" ? (
        "loading..."
      ) : (
        <>
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={0}
            onCreateBlobUrl={onCreateBlobUrlLayer0}
          />
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={1}
            onCreateBlobUrl={onCreateBlobUrlLayer1}
          />
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={2}
            onCreateBlobUrl={onCreateBlobUrlLayer2}
          />
          <StageCanvasOneLayer
            bgImage={state.bgImage}
            mapData={state.mapData}
            layer={3}
            onCreateBlobUrl={onCreateBlobUrlLayer3}
          />
        </>
      )}
    </div>
  );
};

const stageMapId = (layer: 0 | 1 | 2 | 3): string =>
  "stage-map-" + layer.toString();

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
  readonly onCreateBlobUrl: (url: string) => void;
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
      console.log(
        ref.current.toBlob((blob) => {
          if (blob === null) {
            throw new Error("うまく画像化できなかった");
          }
          const onCreateBlobUrl = props.onCreateBlobUrl;
          onCreateBlobUrl(URL.createObjectURL(blob));
        }, "image/png")
      );
    }
  }, [props.onCreateBlobUrl, props.bgImage, props.layer, props.mapData]);
  return (
    <canvas
      id={stageMapId(props.layer)}
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

const stageSymbolId = (layer: Layer): string => "stage-symbol-" + layer;

export const StageSvg = (props: {
  readonly mapBlobUrl: { readonly [key in Layer]: string };
  readonly stageNumber: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}) => {
  const viewBox = [props.stageNumber * 10 * 16, 0, 10 * 16, 9 * 16].join(" ");
  return (
    <g data-name="stage">
      {layerAll.map((layer) => (
        <g key={layer} data-name={"stage-" + layer}>
          <symbol id={stageSymbolId(layer)} viewBox={viewBox}>
            <image
              href={props.mapBlobUrl[layer]}
              x={0}
              y={0}
              width={bgWidth * 16}
              height={bgHeight * 16}
            />
          </symbol>
          <use
            href={"#" + stageSymbolId(layer)}
            x={props.x}
            y={props.y}
            width={props.width}
            height={props.height}
          />
        </g>
      ))}
    </g>
  );
};
