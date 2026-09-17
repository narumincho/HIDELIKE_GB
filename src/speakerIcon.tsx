import type { JSX } from "preact";

export function SpeakerIcon(props: {
  readonly isMuted: boolean;
  readonly onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={props.isMuted ? "音声をオンにする" : "音声をミュートにする"}
      title={props.isMuted ? "音声をオンにする" : "音声をミュートにする"}
      style={{
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: 9999,
        background: "rgba(15, 56, 15, 0.85)",
        border: "2px solid #8bac0f",
        borderRadius: "4px",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        userSelect: "none",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 16 16"
        style={{
          display: "block",
          imageRendering: "pixelated",
          shapeRendering: "crispEdges",
        }}
      >
        {/* スピーカー本体 */}
        {/* マグネット部 */}
        <rect x="2" y="5" width="3" height="6" fill="#9bbc0f" />
        {/* コーン部 */}
        <rect x="5" y="4" width="1" height="8" fill="#9bbc0f" />
        <rect x="6" y="3" width="1" height="10" fill="#9bbc0f" />
        <rect x="7" y="2" width="2" height="12" fill="#9bbc0f" />

        {props.isMuted
          ? (
            /* ミュート時の「✕」マーク (赤寄りではなくゲームボーイ調の濃い明暗) */
            <g fill="#e0f8d0">
              <rect x="11" y="5" width="1" height="1" />
              <rect x="15" y="5" width="1" height="1" />
              <rect x="12" y="6" width="1" height="1" />
              <rect x="14" y="6" width="1" height="1" />
              <rect x="13" y="7" width="1" height="2" />
              <rect x="12" y="9" width="1" height="1" />
              <rect x="14" y="9" width="1" height="1" />
              <rect x="11" y="10" width="1" height="1" />
              <rect x="15" y="10" width="1" height="1" />
            </g>
          )
          : (
            /* 音声ON時の音波マーク */
            <g fill="#e0f8d0">
              {/* 内側の音波 */}
              <rect x="11" y="5" width="1" height="1" />
              <rect x="12" y="6" width="1" height="4" />
              <rect x="11" y="10" width="1" height="1" />
              {/* 外側の音波 */}
              <rect x="14" y="3" width="1" height="2" />
              <rect x="15" y="5" width="1" height="6" />
              <rect x="14" y="11" width="1" height="2" />
            </g>
          )}
      </svg>
    </button>
  );
}
