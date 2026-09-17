import Game from "../islands/Game.tsx";

export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      padding: "16px",
    }}>
      <Game />
      <div style={{
        marginTop: "12px",
        fontSize: "14px",
        color: "#9bbc0f",
        textAlign: "center",
        lineHeight: "1.6",
      }}>
        <div><strong>操作方法</strong>: [矢印キー / WASD]: 移動 | [Shift / K]: ダッシュ | [Space / Z / J]: 箱(ダンボール)を置く | [Enter / A]: スタート</div>
        <div style={{ fontSize: "12px", color: "#8bac0f", marginTop: "4px" }}>
          ※ 画面クリックで音声が有効化されます。敵の視線（直線）に入らないように箱で隠れながら奥へ進もう！
        </div>
      </div>
    </main>
  );
}
