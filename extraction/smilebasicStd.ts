/** エフェクター設定をOFFにする */
const EFCOFF = () => {};

/**
 * 画面モードの設定
 * @param mode 画面モード
 * @param spriteCount SPRITE割当数
 * @param bgCount
 */
const XSCREEN = (
  mode: 0 | 1 | 2 | 3 | 4,
  spriteCount?: number,
  bgCount?: 0 | 1 | 2 | 3 | 4
) => {};

/**
 * ファイルの読み込み
 * @param fileName [リソース名:]ファイル名
 * @param flag ダイアログ表示フラグ
 */
const LOAD = (fileName: string, flag: boolean): void => {};

/**
 * BGスクリーンを非表示
 * @param layer レイヤー
 */
const BGHIDE = (layer: 0 | 1 | 2 | 3): void => {};

/**
 * BGスクリーンの表示オフセットを変更
 * @param layer レイヤー
 * @param x
 * @param y
 * @param Z
 */
const BGOFS = (
  layer: 0 | 1 | 2 | 3,
  x: number,
  y: number,
  Z?: number
): void => {};

/** BGスクリーンを表示 */
const BGSHOW = (layer: 0 | 1 | 2 | 3) => {};

/** 背景色を指定 */
const BACKCOLOR = (color: number): void => {};

/**SPRITEのキャラクタ定義用テンプレートを作成 */
const SPDEF = (
  ...param:
    | []
    | [
        定義番号: number,
        U: number,
        V: number,
        ...r0:
          | [W: number, H: number, ...r1: [原点X: number, 原点Y: number] | []]
          | [],
        ...r2: [アトリビュート: number] | []
      ]
) => {};

/** SPRITE作成 */
const SPSET = (
  管理番号: number,
  定義番号: number,
  ...p:
    | [
        U: number,
        V: number,
        ...r: [...r1: [W: number, H: number] | [], アトリビュート: number]
      ]
    | []
) => {};

const VSYNC = (frame: number): void => {};

/** SPRITE座標の変更(移動) */
const SPOFS = (管理番号: number, X: number, Y: number, Z?: number) => {};

/** SPRITEの表示を隠す */
const SPHIDE = (管理番号: number) => {};

/** SPRITEの表示を開始 */
const SPSHOW = (管理番号: number) => {};

type PlusOrNot = "+" | "";

const SPANIM = (
  管理番号: number,
  アニメ対象: `XY${PlusOrNot}` | `Z${PlusOrNot}` | `UV${PlusOrNot}`,
  データ配列: ReadonlyArray<[number, number, number]>,
  ループ?: number
) => {};

/** SPRITEのスケール(表示倍率)の変更 */
const SPSCALE = (管理番号: number, 倍率X: number, 倍率Y: number) => {};

const RGB = (
  ...a:
    | [r: number, g: number, b: number]
    | [a: number, r: number, g: number, b: number]
): number => {
  return 222;
};

/** SPRITEの表示色を設定 */
const SPCOLOR = (管理番号: number, 色コード: number) => {};

/** SPRITEの座標基準点(ホーム位置)指定 */
const SPHOME = (管理番号: number, 位置X: number, 位置Y: number) => {};

/** SPRITE衝突判定情報の設定 */
const SPCOL = (管理番号: number, スケール対応 = false) => {};

/** MMLのユーザー定義楽器音を定義 */
const WAVSET = (
  定義番号: number,
  A: number,
  D: number,
  S: number,
  R: number,
  波形文字列: string,
  基準音程 = 69
) => {};

/** ユーザー定義音楽の事前定義 */
const BGMSET = (ユーザー定義曲番号: number, MML文字列: string) => {};

const BGMSETD = (ユーザー定義曲番号: number, ラベル文字列: string) => {};

/** 音楽演奏 */
const BGMPLAY = (トラック番号: number, 曲番号: number) => {};

/** グラフィック画面の表示順位変更 */
const GPRIO = (z: number) => {};

/** グラフィック画面に文字を描く */
const GPUTCHR = (
  x: number,
  y: number,
  text: string,
  scaleX: number,
  scaleY: number,
  color: number
) => {};

/** ハードウェアボタンの状態取得 */
const BUTTON = (type: 0 | 1 | 2 | 3): number => {
  return 0;
};

/** 音楽演奏停止 */
const BGMSTOP = (track: number, fade: number) => {};

/** 指定回数分の垂直同期が来るまでプログラム停止 */
const WAIT = (frame: number) => {};

/** グラフィック画面の消去 */
const GCLS = () => {};

/** コンソール画面の表示色を指定 */
const COLOR = (描画色: number, 背景色?: number) => {};

/** コンソール画面への文字表示位置を指定 */
const LOCATE = (x: number, y: number, z: number): void => {};

/** コンソール画面への文字表示 */
const PRINT = (text: string) => {};

/** グラフィック画面に四角形を描いて塗りつぶす */
const GFILL = (
  始点X: number,
  始点Y: number,
  終点X: number,
  終点Y: number,
  color?: number
) => {};
