const gbMap = new URL("../original/HIDEL_GBMAP.dat", import.meta.url);
const bgImageUrl = new URL("../assets/BG.png", import.meta.url);

export const logGbMapData = async (): Promise<void> => {
  const bgImageResponse = await fetch(bgImageUrl.toString());
  const bgImageArrayBuffer = new Uint8Array(
    await bgImageResponse.arrayBuffer()
  );
  const response = await fetch(gbMap.toString());
  const arrayBuffer = await response.arrayBuffer();
  const binary = new Uint8Array(arrayBuffer);
  const bgWidth = 230;
  const bgHeight = 18;

  /**
   * 各BGチップに対しての属性情報. 使用用途不明
   */
  const attributesLength = 32 * 32;
  const attributes = new Uint8Array(attributesLength);

  for (let i = 0; i < attributesLength; i += 1) {
    attributes[i] = binary[32 + i] ?? 99;
  }
  const mainOffset = 32 + attributesLength;

  /*
   * マップは横方向のみにスクロール
   * 画面内に表示されるのは10x9
   * レイヤー0版に世界の明るさ(後半は暗い)
   * レイヤー1番に地面
   * レイヤー2番に木、岩など通れない障害物
   * レイヤー3番不明 敵が動く範囲?
   * 16bitで1マス
   *
   */
  for (let layer = 0; layer < 4; layer += 1) {
    const data = new Uint16Array(bgWidth * bgHeight + 1);
    for (let y = 0; y < bgHeight; y += 1) {
      for (let x = 0; x < bgWidth; x += 1) {
        const offsetInLayer = bgWidth * y + x;
        const offset = bgWidth * bgHeight * layer + offsetInLayer;
        data[offsetInLayer] =
          (binary[mainOffset + offset * 2 + 0] as number) +
          ((binary[mainOffset + offset * 2 + 1] as number) << 8);
      }
    }
    console.log("layer=", layer);
    console.log(data);
    const canvasElement = document.createElement("canvas");
    canvasElement.width = 16 * bgWidth;
    canvasElement.height = 16 * bgHeight;
    const context = canvasElement.getContext("2d");
    if (context === null) {
      throw new Error("このブラウザはCanvasAPIに対応していない!");
    }
    console.log("長さチェック", data.length, bgWidth * bgHeight);
    await drawToCanvas(context, bgWidth, bgHeight, data, bgImageArrayBuffer);
    document.body.appendChild(canvasElement);
  }
};

const drawToCanvas = (
  context: CanvasRenderingContext2D,
  bgWidth: number,
  bgHeight: number,
  data: Uint16Array,
  bgImageArrayBuffer: Uint8Array
): Promise<void> =>
  new Promise((resolve) => {
    const bgBlobUrl = URL.createObjectURL(
      new Blob([bgImageArrayBuffer.buffer], { type: "image/png" })
    );
    const bgImage = new Image();
    bgImage.src = bgBlobUrl;
    bgImage.onload = () => {
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
      resolve();
    };
  });

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
