import { define } from "../utils.ts";
import Game from "@/islands/Game.tsx";

export default define.page(function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        padding: "16px",
      }}
    >
      <Game />
      <div
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: "#9bbc0f",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        <div>
          [↑←↓→ / WASD]: 移動 | [Shift / K]: ダッシュ | [Space / Z / J]:
          アクション
        </div>
      </div>
    </main>
  );
});
