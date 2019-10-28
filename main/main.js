"use strict";
// GLOBALへんすう
/// BGキャラ アトリビュートよう 32*32
let attributes = new Uint8Array(32 * 32);
/**
 * キャラクター番号から画像の位置を算出tする
 * http://petitcom.net/manual/bgput
 * @param chrAttr キャラクター番号
 */
const chrAttrToImageOffset = (chrAttr) => {
    const num = chrAttr & 0xfff;
    return {
        x: (num % 32) * 16,
        y: Math.floor(num / 32) * 16
    };
};
const drawToCanvas = (context, bgWidth, bgHeight, data) => {
    for (let i = 0; i < bgWidth * bgHeight; i++) {
        const sourcePosition = chrAttrToImageOffset(data[i]);
        context.drawImage(bgImage, sourcePosition.x, sourcePosition.y, 16, 16, (i % bgWidth) * 16, Math.floor(i / bgWidth) * 16, 16, 16);
    }
};
const bgImage = new Image();
bgImage.onload = async () => {
    /// カンイ BGヨミコミ ルーチン(アトリビュート+サイズたいおうばん)
    const loadBg = (arrayBuffer) => {
        const binary = new Uint8Array(arrayBuffer);
        const bgWidth = 230;
        const bgHeight = 18;
        for (let i = 0; i < 32 * 32; i++) {
            attributes[i] = binary[32 + i];
        }
        // マップは横方向のみにスクロール
        // 画面内に表示されるのは10x9
        // レイヤー0版に世界の明るさ(後半は暗い)
        // レイヤー1番に地面
        // レイヤー2番に木、岩など通れない障害物
        // レイヤー3番不明
        // 16bitで1マス
        //
        for (let layer = 0; layer < 4; layer++) {
            let data = new Uint16Array(bgWidth * bgHeight + 1);
            BGSCREEN(layer, bgWidth, bgHeight);
            for (let y = 0; y < bgHeight; y++) {
                for (let x = 0; x < bgWidth; x++) {
                    const offset = bgWidth * y + x;
                    data[offset] =
                        binary[264 + offset * 2 + 0] +
                            (binary[264 + offset * 2 + 1] << 8);
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
            drawToCanvas(context, bgWidth, bgHeight, data);
            document.body.appendChild(canvasElement);
        }
    };
    /**
     * バックグラウンド画面にあるレイヤー（0~3）のそれぞれの大きさを指定します。
     * サイズの単位は、16x16のキャラクターをいくつ並べるかの「キャラクター」単位。
     * 指定できる大きさは最大で、幅×高さが16,383（個）まで。
     * 初期値は、幅25x高さ15（上画面のサイズ）。
     * BGSCREENを実行すると、レイヤーの内容は初期化されます。
     *
     * Ver3.3より、BGキャラクターの単位サイズが指定できるようになりました。
     * 指定できる値は、8,16,32の３種類で、省略時は16（１キャラが16x16ドット）です。
     * @param layer BGレイヤー番号(0~3)
     * @param widthNum 幅,高さ(キャラ単位)
     * @param heightNum １キャラのサイズ(8,16,32)
     */
    const BGSCREEN = (layer, widthNum, heightNum) => { };
    const inputFileElement = document.createElement("input");
    inputFileElement.type = "file";
    inputFileElement.accept = ".dat";
    inputFileElement.oninput = () => {
        const files = inputFileElement.files;
        if (files === null) {
            console.error("ファイルが読み込めない");
            return;
        }
        const file = files.item(0);
        if (file === null) {
            console.error("ファイルが読み込めない!");
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const result = fileReader.result;
            if (result === null || typeof result === "string") {
                console.error("ファイルをバイナリ化失敗");
                return;
            }
            loadBg(result);
        };
        fileReader.readAsArrayBuffer(file);
    };
    document.body.appendChild(inputFileElement);
};
bgImage.src = "./assets/bg.png";
