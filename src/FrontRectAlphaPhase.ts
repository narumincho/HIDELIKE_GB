/** タイトル画面からゲーム画面に移るときの透明度の変化 */
export type FrontRectAlphaPhase = 0 | 1 | 2;

export const frontRectAlpha = (phase: FrontRectAlphaPhase): number => {
  switch (phase) {
    case 0:
      return 8 * 10;
    case 1:
      return 8 * 20;
    case 2:
      return 255;
  }
};
