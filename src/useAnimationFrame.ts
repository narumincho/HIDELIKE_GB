import { useCallback, useEffect, useRef } from "react";

/** 毎フレーム呼び出す関数を登録する */
export const useAnimationFrame = (callback = () => {}): void => {
  const requestRef = useRef<number>();
  const loop = useCallback(() => {
    requestRef.current = window.requestAnimationFrame(loop);
    callback();
  }, [callback]);

  useEffect(() => {
    console.log("毎フレーム呼び出す関数を登録する");
    requestRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (typeof requestRef.current === "number") {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [loop]);
};
