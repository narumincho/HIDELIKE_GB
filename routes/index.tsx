import { define } from "../utils.ts";
import Game from "@/islands/Game.tsx";

export default define.page(function Home() {
  return (
    <main className="game-wrapper">
      <Game />
      <div className="control-guide">
        [↑←↓→ / WASD / パッド]: 移動 | [Shift / K / RB]: ダッシュ | [Space / Z /
        J / Aボタン]: アクション | [D / パッドLB+RB+X]: デバッグ | [G /
        パッドLB+RB+Y]: GB GREEN
      </div>
    </main>
  );
});
