import type { JSX } from "preact";
import { useCallback, useRef, useState } from "preact/hooks";

export type PadDirection = {
  readonly up: boolean;
  readonly down: boolean;
  readonly left: boolean;
  readonly right: boolean;
};

export function VirtualPad(props: {
  readonly onDirectionChange: (dir: PadDirection) => void;
  readonly onActionChange: (pressed: boolean) => void;
  readonly onDashChange: (dash: boolean) => void;
}): JSX.Element {
  const dpadPointerIdRef = useRef<number | null>(null);
  const dpadCenterRef = useRef<{ x: number; y: number } | null>(null);
  const [activeDir, setActiveDir] = useState<PadDirection>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const [isBPressed, setIsBPressed] = useState(false);
  const [isAPressed, setIsAPressed] = useState(false);

  const updateDirectionFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!dpadCenterRef.current) return;
      const dx = clientX - dpadCenterRef.current.x;
      const dy = clientY - dpadCenterRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // デッドゾーン (10px以内はニュートラル)
      if (dist < 10) {
        const neutral = { up: false, down: false, left: false, right: false };
        setActiveDir(neutral);
        props.onDirectionChange(neutral);
        return;
      }

      // 角度判定 (8方向対応)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 ~ +180
      const right = angle >= -67.5 && angle <= 67.5;
      const left = angle >= 112.5 || angle <= -112.5;
      const down = angle >= 22.5 && angle <= 157.5;
      const up = angle <= -22.5 && angle >= -157.5;

      const newDir = { up, down, left, right };
      setActiveDir(newDir);
      props.onDirectionChange(newDir);
    },
    [props],
  );

  const handleDpadPointerDown = useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      dpadPointerIdRef.current = e.pointerId;
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      const rect = target.getBoundingClientRect();
      dpadCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      updateDirectionFromPointer(e.clientX, e.clientY);
    },
    [updateDirectionFromPointer],
  );

  const handleDpadPointerMove = useCallback(
    (e: PointerEvent) => {
      if (dpadPointerIdRef.current === e.pointerId) {
        e.preventDefault();
        updateDirectionFromPointer(e.clientX, e.clientY);
      }
    },
    [updateDirectionFromPointer],
  );

  const handleDpadPointerUp = useCallback(
    (e: PointerEvent) => {
      if (dpadPointerIdRef.current === e.pointerId) {
        e.preventDefault();
        dpadPointerIdRef.current = null;
        dpadCenterRef.current = null;
        const neutral = { up: false, down: false, left: false, right: false };
        setActiveDir(neutral);
        props.onDirectionChange(neutral);
      }
    },
    [props],
  );

  return (
    <div
      className="virtual-pad-container"
      style={{
        width: "100%",
        maxWidth: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 24px 16px 24px",
        boxSizing: "border-box",
        userSelect: "none",
        touchAction: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* 十字キー (D-Pad) */}
      <div
        style={{
          position: "relative",
          width: "128px",
          height: "128px",
          touchAction: "none",
        }}
        onPointerDown={handleDpadPointerDown}
        onPointerMove={handleDpadPointerMove}
        onPointerUp={handleDpadPointerUp}
        onPointerCancel={handleDpadPointerUp}
      >
        {/* 十字キー背景クロス */}
        {/* 横バー */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "0px",
            width: "128px",
            height: "48px",
            backgroundColor: "#2a2d32",
            borderRadius: "6px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            border: "1px solid #1a1c20",
          }}
        />
        {/* 縦バー */}
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "40px",
            width: "48px",
            height: "128px",
            backgroundColor: "#2a2d32",
            borderRadius: "6px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            border: "1px solid #1a1c20",
          }}
        />
        {/* 中央の窪み */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "48px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#1f2226",
          }}
        />

        {/* 各方向インジケーター / ボタン視覚 */}
        {/* 上 */}
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: "48px",
            width: "32px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: activeDir.up ? "#9bbc0f" : "#666",
            fontSize: "16px",
            transform: activeDir.up ? "scale(1.15)" : "scale(1)",
            transition: "all 0.08s",
          }}
        >
          ▲
        </div>
        {/* 下 */}
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            left: "48px",
            width: "32px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: activeDir.down ? "#9bbc0f" : "#666",
            fontSize: "16px",
            transform: activeDir.down ? "scale(1.15)" : "scale(1)",
            transition: "all 0.08s",
          }}
        >
          ▼
        </div>
        {/* 左 */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "4px",
            width: "36px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: activeDir.left ? "#9bbc0f" : "#666",
            fontSize: "16px",
            transform: activeDir.left ? "scale(1.15)" : "scale(1)",
            transition: "all 0.08s",
          }}
        >
          ◀
        </div>
        {/* 右 */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "4px",
            width: "36px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: activeDir.right ? "#9bbc0f" : "#666",
            fontSize: "16px",
            transform: activeDir.right ? "scale(1.15)" : "scale(1)",
            transition: "all 0.08s",
          }}
        >
          ▶
        </div>
      </div>

      {/* 右側: ゲームボーイ風 A/B ボタンエリア */}
      <div
        style={{
          position: "relative",
          transform: "rotate(-25deg)",
          transformOrigin: "center",
          marginRight: "8px",
        }}
      >
        {/* 実機風のピル形状の窪み (ベゼル) */}
        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
            backgroundColor: "#181a1e",
            padding: "8px 10px",
            borderRadius: "40px",
            boxShadow:
              "inset 0 3px 6px rgba(0, 0, 0, 0.8), 0 1px 1px rgba(255, 255, 255, 0.05)",
            border: "1px solid #121417",
          }}
        >
          {/* Bボタン (ダッシュ) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              tabIndex={-1}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: isBPressed ? "#600f30" : "#8b1538",
                border: "2px solid #a82046",
                boxShadow: isBPressed
                  ? "inset 0 2px 5px rgba(0,0,0,0.7)"
                  : "0 4px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.25)",
                cursor: "pointer",
                outline: "none",
                touchAction: "none",
                transform: isBPressed ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.05s",
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                setIsBPressed(true);
                props.onDashChange(true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                setIsBPressed(false);
                props.onDashChange(false);
              }}
              onPointerCancel={(e) => {
                e.preventDefault();
                setIsBPressed(false);
                props.onDashChange(false);
              }}
            />
            {/* B ラベル (実機風: ボタンの右下に斜体で配置) */}
            <span
              style={{
                position: "absolute",
                bottom: "-24px",
                right: "4px",
                fontSize: "13px",
                fontWeight: "900",
                fontStyle: "italic",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: "#6e8cee",
                letterSpacing: "0.5px",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              B
            </span>
          </div>

          {/* Aボタン (アクション/箱) */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              tabIndex={-1}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: isAPressed ? "#600f30" : "#8b1538",
                border: "2px solid #a82046",
                boxShadow: isAPressed
                  ? "inset 0 2px 5px rgba(0,0,0,0.7)"
                  : "0 4px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.25)",
                cursor: "pointer",
                outline: "none",
                touchAction: "none",
                transform: isAPressed ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.05s",
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                setIsAPressed(true);
                props.onActionChange(true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                setIsAPressed(false);
                props.onActionChange(false);
              }}
              onPointerCancel={(e) => {
                e.preventDefault();
                setIsAPressed(false);
                props.onActionChange(false);
              }}
            />
            {/* A ラベル (実機風: ボタンの右下に斜体で配置) */}
            <span
              style={{
                position: "absolute",
                bottom: "-24px",
                right: "4px",
                fontSize: "13px",
                fontWeight: "900",
                fontStyle: "italic",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                color: "#6e8cee",
                letterSpacing: "0.5px",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              A
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
