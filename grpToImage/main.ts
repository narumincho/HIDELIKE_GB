{
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.display = "grid";
    document.body.style.gridTemplateColumns = "1fr";
    document.body.style.gridTemplateRows = "1fr";

    const inputFileElement = document.createElement("input");
    inputFileElement.type = "file";
    inputFileElement.accept = ".grp";
    inputFileElement.addEventListener("input", e => {
        console.log(inputFileElement.value);
        const files = inputFileElement.files;
        if (files === null) {
            console.error("ファイルを受け取れなかった");
            return;
        }
        const file = files.item(0);
        if (file === null) {
            console.error("ファイルを受け取れなかった");
            return;
        }
        console.log(file);
        const fileReader = new FileReader();
        fileReader.onload = e => {
            const result = fileReader.result;
            if (result === null || typeof result === "string") {
                console.log("バイナリの読み込んだ結果が想定外だった");
                return;
            }
            const canvasElement = document.createElement("canvas");
            const width = 512;
            const height = 512;
            canvasElement.width = width;
            canvasElement.height = height;
            canvasElement.style.gridRow = "1 / 2";
            canvasElement.style.gridColumn = "1 / 2";
            canvasElement.style.placeSelf = "stretch";
            canvasElement.style.objectFit = "contain";
            canvasElement.style.backgroundColor = "block";
            canvasElement.style.minWidth = "0";
            canvasElement.style.minHeight = "0";
            document.body.appendChild(canvasElement);
            const context = canvasElement.getContext("2d");
            if (context === null) {
                console.error(
                    "このブラウザでCanvas APIの使用ができませんでした"
                );
                return;
            }
            const imageData = context.createImageData(width, height);
            grpArrayBufferToImageData(imageData, result);
            context.putImageData(imageData, 0, 0);
        };
        fileReader.readAsArrayBuffer(file);
    });

    inputFileElement.style.display = "block";

    document.body.appendChild(inputFileElement);
}

/**
 * GRPファイルをImageDataに書き込む
 * @param imageData 書き込む画像データ
 * @param arrayBuffer 読み込むGRPファイル
 */
const grpArrayBufferToImageData = (
    imageData: ImageData,
    arrayBuffer: ArrayBuffer
): void => {
    const binary = new Uint8Array(arrayBuffer);
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const offset = y * imageData.width + x;
            const pixel0 = binary[offset * 2 + 0];
            const pixel1 = binary[offset * 2 + 1];
            // R
            imageData.data[offset * 4 + 0] = ((pixel1 >> 3) & 31) * 8;
            // G
            imageData.data[offset * 4 + 1] =
                (((pixel1 & 7) << 2) + (pixel0 >> 6)) * 8;
            // B
            imageData.data[offset * 4 + 2] = ((pixel0 >> 1) & 31) * 8;
            // A
            imageData.data[offset * 4 + 3] = (pixel0 & 1) * 255;
        }
    }
};
