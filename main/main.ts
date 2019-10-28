// GLOBALへんすう
/// BGキャラ アトリビュートよう 32*32
let attributes = new Uint8Array(32 * 32);

/**
 * キャラクター番号から画像の位置を算出tする
 * http://petitcom.net/manual/bgput
 * @param chrAttr キャラクター番号
 */
const chrAttrToImageOffset = (chrAttr: number): { x: number; y: number } => {
    const num = chrAttr & 0xfff;
    return {
        x: (num % 32) * 16,
        y: Math.floor(num / 32) * 16
    };
};

const drawToCanvas = (
    context: CanvasRenderingContext2D,
    bgWidth: number,
    bgHeight: number,
    data: Uint16Array
) => {
    for (let i = 0; i < bgWidth * bgHeight; i++) {
        const sourcePosition = chrAttrToImageOffset(data[i]);
        context.drawImage(
            bgImage,
            sourcePosition.x,
            sourcePosition.y,
            16,
            16,
            (i % bgWidth) * 16,
            Math.floor(i / bgWidth) * 16,
            16,
            16
        );
    }
};

const bgImage = new Image();

bgImage.onload = async () => {
    const loadBg = (arrayBuffer: ArrayBuffer) => {
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
            for (let y = 0; y < bgHeight; y++) {
                for (let x = 0; x < bgWidth; x++) {
                    const offsetInLayer = bgWidth * y + x;
                    const offset = bgWidth * bgHeight * layer + offsetInLayer;
                    data[offsetInLayer] =
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

{
    onclick = () => {
        const context = new AudioContext();
        console.log("currentTime", context.currentTime);
        // 227, // 番号
        // 127, // アタック0~127
        // 0, // ディケイ 0～127
        // 127, // サスティン 0～127
        // 123, // リリース 0～127
        // "FFFFFFFF00000000FFFFFFFF00000000", // 波形00～FF
        // 69 - 12 * 2 // 基本音程(69はオクターブ4のラ +1で半音下がり、-1で半音上がる)
        const wave = context.createPeriodicWave(new Array(16).fill(0), [
            0,
            255,
            255,
            255,
            255,
            0,
            0,
            0,
            0,
            255,
            255,
            255,
            255,
            0,
            0,
            0
        ]);
        for (let i = 0; i < 30; i++) {
            const osc = new OscillatorNode(context);
            osc.connect(context.destination);
            osc.frequency.value = 261.63 * Math.pow(2 ** (1 / 12), i);
            osc.setPeriodicWave(wave);
            osc.start(i * 0.5 + 0.5);
            osc.stop(i * 0.5 + 1);
        }
    };

    const opBgm = `T90
{A0= V100 [R1]4
}
{B0= V100 L4
[ CGFA# ]4
}
{C0= V100
 [R1]4
}

{A1= V100 L4
G2.A#4  A2.D#4 F1&F1
A#2.<D4 C2.>F4 G1&G2.C8D8
D#2G4 F2A#8F8 G2.&G2C8D8
D#2G4 F2D4 C2.&C2.

 
}
{B1= V100 L4
 [ CGFA# ]4
 [ CGFA# ]4
 [ CGF ]4
 [ CGF ]3 C2.
}
{C1= V100
 [R1]4
 [R1]4
 [R2.]4
 [C2.]4
}

{REST=
 [R1]4
}`;
    /*

T90 // テンポ90
{A0= V100 // マクロの定義 A0= 音量100
[R1]4 // 4回繰り返す(1分休符)
}
{B0= V100 L4
[ CGFA# ]4
}
{C0= V100
 [R1]4
}

{A1= V100 L4
G2.A#4  A2.D#4 F1&F1
A#2.<D4 C2.>F4 G1&G2.C8D8
D#2G4 F2A#8F8 G2.&G2C8D8
D#2G4 F2D4 C2.&C2.
}

{B1= V100 L4
 [ CGFA# ]4
 [ CGFA# ]4
 [ CGF ]4
 [ CGF ]3 C2.
}
{C1= V100
 [R1]4
 [R1]4
 [R2.]4
 [C2.]4
}

{REST=
 [R1]4
}    */
}
