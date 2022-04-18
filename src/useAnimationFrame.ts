import { useCallback, useEffect, useState } from "react";

/** 毎フレーム呼び出す関数を登録する */
export const useAnimationFrame = (callback = () => {}): void => {
  const [id, setId] = useState<number | undefined>(undefined);
  const loop = useCallback(() => {
    setId(window.requestAnimationFrame(loop));
    callback();
  }, [callback]);

  useEffect(() => {
    console.log("毎フレーム呼び出す関数を登録する");
    setId(window.requestAnimationFrame(loop));
    return () => {
      if (typeof id === "number") {
        window.cancelAnimationFrame(id);
      }
    };
  }, [loop, id]);
};
