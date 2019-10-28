"use strict";
// GLOBALへんすう
/// よみこんだBGのサイズ
let bgWidth, gbHeight;
/// BGキャラ アトリビュートよう 32*32
let attributes = new Uint8Array(32 * 32);
/// カンイ BGヨミコミ ルーチン(アトリビュート+サイズたいおうばん)
const loadBg = (arrayBuffer) => {
    const binary = new Uint8Array(arrayBuffer);
    const bgWidth = 230;
    const gbHeight = 18;
    for (let i = 0; i < 32 * 32; i++) {
        attributes[i] = binary[32 + i];
    }
    for (let layer = 0; layer < 4; layer++) {
        let data = new Uint16Array(bgWidth * gbHeight + 1);
        BGSCREEN(layer, bgWidth, gbHeight);
        for (let y = 0; y < gbHeight; y++) {
            for (let x = 0; x < bgWidth; x++) {
                const offset = bgWidth * y + x;
                data[offset] =
                    binary[264 + offset * 2 + 0] +
                        (binary[264 + offset * 2 + 1] << 8);
            }
        }
        console.log("layer=", layer);
        console.log(data);
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
