const inputElement = document.createElement("input");
inputElement.type = "file";

inputElement.oninput = () => {
  const files = inputElement.files;
  if (files === null) {
    throw new Error("ファイルが入力されなかった");
  }
  const file = files.item(0);
  if (file === null) {
    throw new Error("ファイルが空だった");
  }
  const sampleRate = 44100;
  const offlineAudioContext = new OfflineAudioContext({
    length: sampleRate * 5,
    sampleRate,
    numberOfChannels: 1,
  });
  const fileReader = new FileReader();
  fileReader.onload = async () => {
    const result = fileReader.result;
    if (result === null || typeof result === "string") {
      throw new Error("ファイルの読み込みに失敗");
    }
    const buffer = (
      await offlineAudioContext.decodeAudioData(result)
    ).getChannelData(0);
    console.log(buffer);
    const canvas = document.createElement("canvas");
    canvas.onmousemove = (e) => {
      console.log(e.x, e.y);
    };
    canvas.width = buffer.length / 10;
    const height = 100;
    canvas.height = height;
    canvas.style.imageRendering = "pixelated";
    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error("このブラウザはCanvasAPIに未対応!?");
    }
    context.fillStyle = "rgb(255, 0, 0)";
    const offset = 3000;
    for (let i = 0; i < buffer.length / 10; i += 1) {
      context.fillRect(i, height / 2 + (buffer[i] * height) / 2, 1, height);
      if (offset < i && i < offset + 64) {
        context.fillStyle = "rgb(0,255,0)";
      } else {
        context.fillStyle = "rgb(255,0,0)";
      }
    }
    document.body.appendChild(canvas);
    let text = "";
    for (let i = 0; i < 64; i += 1) {
      console.log(buffer[i + offset]);
      text += Math.floor((buffer[i + offset] + 1) * 128)
        .toString(16)
        .padStart(2, "0");
    }
    console.log(text);
  };
  fileReader.readAsArrayBuffer(file);
};

document.body.appendChild(inputElement);
