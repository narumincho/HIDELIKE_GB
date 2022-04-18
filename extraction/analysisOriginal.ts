/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/no-use-before-define */
/** BG STATUS ステージ番号? */
let BGSX = 0;
/** 隠しコマンドのデバッグモード */
let DEBUG2 = false;
/** ゲーム画面の左端のX座標 */
const EXS = 120;
/** ゲーム画面の右端のX座標? */
const EXE = EXS + 160;
/** ゲーム画面の上端のY座標 */
const EYS = 48;
/** ゲーム画面の下端のY座標? */
const EYE = EYS + 144;
/** プレイヤーの初期位置 Z座標 */
let PX = EXS + 16 * 1;
/** プレイヤーの初期位置 Y座標 */
let PY = EYS + 16 * 7 + 7;
/** プレイヤーの初期位置 Z座標? */
const PZ = 0;

/*
 * ここの条件分岐は常に通らない
 * if (DEBUG) {
 *  // BGSX=
 *  if(  BGSX===  ){
 *   PX=EXS+16*5+8
 *   PY=EYS+16*7+7
 *  }
 *  if(  BGSX===  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*4+7
 *  }
 *  if(  BGSX===  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*3+7
 *  }
 *  if(  BGSX===0  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*4+7
 *  }
 *  if(  BGSX===1  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*7+7
 *  }
 *  if(  BGSX===2  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*0+7
 *  }
 *  if(  BGSX===3  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*0+7
 *  }
 *  if(  BGSX===4  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*0+7
 *  }
 *  if(  BGSX===5  ){
 *   PX=EXS+16*1+8
 *   PY=EYS+16*7+7
 *  }
 *  if(  BGSX===8  ){
 *   PX=EXS+16*8+8
 *   PY=EYS+16*4+7
 *  }
 *  if(  18<BGSX  ){
 *   PX=EXS+16*8+12
 *   PY=EYS+16*4+7
 *  }
 * }
 */

(() => {
  INIT();
  /** メインループで1ずつ加算させるカウント */
  let MCNT = 0;
  OP();

  while (true) {
    // MAIN LOOP
    VSYNC(1);
    MCNT += 1;
    INPUT_BUTTON_STICK_TOUCH();
    BG();
    PLAYER();
    ENEMY();
    if (DEBUG2 && BGSX < 19) {
      DEBUG();
    }
  }
})();

const SPNUM_PB = 10;
const SPNUM_ENEMY = 100;
const SPNUM_FOUND = 300;

//* BG
let BGH = 0;
/** 読み込んだBGのサイズ */
let BGW = 0;
/** BGキャラ アトリビュート用 */
const ATR = new Array(32 * 32);
const BGX = -EXS;
const BGY = -EYS;
const BGZ = 100;
const BG_MAX = 22;

//* @INPUT_BUTTON_STICK_TOUCH
let BTN;
let EXX = 0;
let EXY = 0;
let SX = 0;
let SY = 0;
let STTM;
/** 5~314 */
let TX;
/** 5~234 */
let TY;
let DU = false;
let DD = false;
let DL = false;
let DR = false;
let BA = false;
let BB = false;
let BX = false;
let BY = false;
let BL = false;
let BR = false;
let ZL = false;
let ZR = false;

//*PLAYER
const SSCL = 1; //SCALE
const PMV = 2; //MOVE VALUE
const PMF = 2; //MOVE FREQUENCY
const PZB = -10;
/** 影を生成できる最大の数 */
const PBM = 3;
const PBF = new Array(PBM);
const PBX = new Array(PBM);
const PBY = new Array(PBM);
const PBDX = new Array(PBM);
const PBDY = new Array(PBM);

//*ENEMY
const ENEMY_MAX = 90 - 1;
const ECHK = new Array(SPNUM_ENEMY + ENEMY_MAX);
const ENX = new Array(SPNUM_ENEMY + ENEMY_MAX);
const ENY = new Array(SPNUM_ENEMY + ENEMY_MAX);

let PDX = 1;
let PDY = 0;
let PBNUM = 0;
let GBNUM = 0;
let MAPCP = 0;
let F_ENEMOVE = 0;
let F_ENECNG = 0;
let CLEARTIME = 0;
let SCORE_T;
let SCORE_B;
let SCORE_F;

//============================================
function INIT(): void {
  INITIALIZE(); // 初期化
  EFCOFF();
  XSCREEN(3, 500, 4);
  FONTINIT(); // フォント読み込み
  //===========================================

  //================================================

  LOAD("GRP4:HIDEL_GBSP.GRP", false); // スプライト画像の読み込み
  LOAD("GRP5:HIDEL_GBBG.GRP", false); // BG画像の読み込み
  for (let i = 0; i <= 3; i++) {
    BGHIDE(i as 0 | 1 | 2 | 3);
  }
  LOADBG("DAT:HIDEL_GBMAP");
  for (let i = 0; i <= 2; i++) {
    BGOFS(i as 0 | 1 | 2, BGX, BGY, BGZ);
  }
  for (let i = 0; i <= 2; i++) {
    BGSHOW(i as 0 | 1 | 2);
  }
  BACKCOLOR(-1);

  //====SP SET====================

  /*
   * GPRIO -256
   * GFILL 0,EYS,EXS,EYE,BK
   * GFILL 0,0,400,EYS,BK
   * GFILL EXE,EYS,400,EYE,BK
   * GFILL 0,EYE,400,240,BK
   */

  //*OPENING
  SPDEF(80, 512 - 16 * 21, 512 - 16 * 9, 16 * 10, 16 * 9);
  SPSET(80, 80);
  SPOFS(80, EXS, EYS);
  SPHIDE(80);
  //**FACE ANIME
  SPDEF(81, 512 - 16 * 15, 512 - 32 * 8, 32, 32);
  SPSET(81, 81);
  SPOFS(81, EXS + 16 * 6, EYS + 16 * 5);
  SPANIM(81, "UV+", 200, 0, 0, 8, 0, 32, 8, 0, 64, 0);
  SPHIDE(81);

  //*ENDING
  SPDEF(90, 512 - 16 * 10, 512 - 16 * 9, 16 * 10, 16 * 9);
  SPSET(90, 90);
  SPOFS(90, EXS, EYS);
  SPHIDE(90);

  //*BLACK
  SPDEF(96, 0, 16 * 6, 16, 16);
  SPSET(96, 96);
  SPSCALE(96, 10, 9);
  const GBT0 = RGB(0, 0, 0);
  const GBT1 = RGB(8 * 10, 8 * 10, 8 * 10);
  const GBT2 = RGB(8 * 20, 8 * 20, 8 * 20);
  const GBT3 = RGB(255, 255, 255);
  SPCOLOR(96, GBT0);
  SPOFS(96, EXS, EYS, -255);
  SPHIDE(96);

  //*GB GREEN
  SPDEF(97, 0, 16 * 6, 16, 16);
  SPSET(97, 96);
  SPSCALE(97, 10, 9);
  SPCOLOR(97, RGB(70, 0, 225, 0));
  SPOFS(97, EXS, EYS, -256);
  SPHIDE(97);
  const F_GBGREEN = 0;

  //*GBわく
  SPDEF(99, 512 - 400 - 8, 0, 400, 240);
  SPSET(99, 99);
  SPOFS(99, 0, 0, -250);

  /*
   * *PLAYER
   *   SPDEF(1500 + I, 16 * I, 0, 16, 16, 8, 8);
   *  不明な I が指定されていた おそらく 0
   */
  SPDEF(1500 + 0, 16 * 0, 0, 16, 16, 8, 8);
  SPSET(0, 1500);
  SPHOME(0, 8, 8);
  SPCOL(0, -8, -8, 16, 16, true, 0xfffffff0);
  SPANIM(
    0,
    "UV",
    [
      [16, 0, 0],
      [16, 16, 0],
      [16, 32, 0],
      [16, 48, 0],
      [16, 64, 0],
      [16, 16, 0],
      [16, 32, 0],
      [16, 48, 0],
    ],
    0
  );

  //*PLAYER_BULLET
  for (let i = 0; i < PBM; i++) {
    SPDEF(1600 + i, 16 * i, 16 * 5, 16, 16, 8, 8);
    SPSET(SPNUM_PB + i, 1600);
    SPHOME(SPNUM_PB + i, 8, 8);
    SPCOL(SPNUM_PB + i, -8, -8, 16, 16, true, 0xfffffff0);
    SPHIDE(SPNUM_PB + i);
  }

  /*
   * *ENEMY
   *  下向きの敵
   */
  for (let i = 0; i < 10; i++) {
    SPDEF(1700 + i, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [90, 0, 192],
        [16, 16, 192],
        [90, 0, 192],
        [16, 16, 192],
        [90, 0, 192],
        [90, 16, 192],
        [16, 32, 192],
        [16, 48, 192],
        [16, 32, 192],
        [16, 48, 192],
        [32, 32, 192],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  // 上向きの敵
  for (let i = 10; i < 20; i++) {
    SPDEF(1700 + i, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [16, 0, 208],
        [16, 16, 208],
        [16, 32, 208],
        [16, 48, 208],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 20; i < 30; i++) {
    SPDEF(1700 + i, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [16, 0, 128],
        [16, 16, 128],
        [16, 32, 128],
        [16, 48, 128],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 30; i < 40; i++) {
    SPDEF(1700 + i, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [16, 0, 160],
        [16, 16, 160],
        [16, 32, 160],
        [16, 48, 160],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 40; i < 50; i++) {
    SPDEF(1700 + i, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [60, 0, 336],
        [16, 16, 336],
        [16, 32, 336],
        [16, 48, 336],
      ],
      0
    );
    if (i > 44) {
      SPANIM(SPNUM_ENEMY + i, "XY+", -16, 16, 0, 2);
    }
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 50; i < 60; i++) {
    SPDEF(1700 + i, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [60, 0, 320],
        [16, 16, 320],
        [16, 32, 320],
        [16, 48, 320],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 60; i < 70; i++) {
    SPDEF(1700 + i, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [60, 0, 368],
        [16, 16, 368],
        [16, 32, 368],
        [16, 48, 368],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 70; i < 80; i++) {
    SPDEF(1700 + i, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [60, 0, 352],
        [16, 16, 352],
        [16, 32, 352],
        [16, 48, 352],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }
  for (let i = 80; i < 90; i++) {
    SPDEF(1700 + i, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + i, 1700);
    SPHOME(SPNUM_ENEMY + i, 8, 8);
    SPCOL(SPNUM_ENEMY + i, -1, -1, 2, 2, true, 0xffffffff);
    SPANIM(
      SPNUM_ENEMY + i,
      "UV",
      [
        [16, 0, 416],
        [16, 16, 416],
        [16, 32, 416],
        [16, 48, 416],
      ],
      0
    );
    SPHIDE(SPNUM_ENEMY + i);
  }

  //* FOUND!
  SPDEF(2000, 0, 16 * 7, 16, 16);
  SPSET(SPNUM_FOUND, 2000);
  SPHOME(SPNUM_FOUND, 8, 8);
  const FOUNDCNT = 0;

  /*
   * 
   * *ユーザーていぎ がっきおん(@224~255)
   */

  /*
   * @224_さんこうURL(http://www.blog.nshdot.com/2012/09/blog-post.html)
   * @224~239_さんこうURL(http://wikiwiki.jp/mck/?%C7%C8%B7%C1%C4%EA%B5%C1)
   * @240_さんこうURL(http://dic.nicovideo.jp/p/mml/185074)
   */

  /*
   * @ファミコン さんかくは
   * WAVE1$=""
   * FOR I=0 TO 63
   *  V=FLOOR(I/2)*2*8
   *  if(  V<-127  ){ V=-127
   *  if(  127<V  ){ V=127
   *  U$=HEX$(V,2)
   *  WAVE1$=WAVE1$+U$
   * NEXT
   */
  WAVSET(
    224,
    127,
    0,
    127,
    123,
    "000010102020303040405050606070707F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F",
    69 - 12 * 2
  );
  //@N106くけいは 12.5%
  WAVSET(
    225,
    127,
    0,
    127,
    123,
    "FF00000000000000FF00000000000000",
    69 - 12 * 2
  );
  //@N106くけいは 25.0%
  WAVSET(
    226,
    127,
    0,
    127,
    123,
    "FFFF000000000000FFFF000000000000",
    69 - 12 * 2
  );
  //@N106くけいは 50.0%
  WAVSET(
    227,
    127,
    0,
    127,
    123,
    "FFFFFFFF00000000FFFFFFFF00000000",
    69 - 12 * 2
  );
  //@N106くけいは 75.0% ( 25.0%と おなじおと )
  WAVSET(
    228,
    127,
    0,
    127,
    123,
    "FFFFFFFFFFFF0000FFFFFFFFFFFF0000",
    69 - 12 * 2
  );
  //@N106さんかくは(Cトラック)
  WAVSET(
    229,
    127,
    0,
    127,
    123,
    "02468ACEFDB9753102468ACEFDB97531",
    69 - 12 * 2
  );
  //@N106さんかくは(Cトラック) その2
  WAVSET(
    230,
    127,
    0,
    127,
    123,
    "0123456789ABCDEFFEDCBA9876543210",
    69 - 12 * 3
  );
  //@N106さんかくは うえスライス
  WAVSET(
    231,
    127,
    0,
    127,
    123,
    "0123456789AAAAAAAAAAAA9876543210",
    69 - 12 * 3
  );
  //@N106ノコギリは
  WAVSET(
    232,
    127,
    0,
    127,
    123,
    "0123456789ABCDEF0123456789ABCDEF",
    69 - 12 * 2
  );
  //@N106ノコギリは その2
  WAVSET(
    233,
    127,
    0,
    127,
    123,
    "00112233445566778899AABBCCDDEEFF",
    69 - 12 * 3
  );
  //@N106ノコギリは はんぶんだけ
  WAVSET(
    234,
    127,
    0,
    127,
    123,
    "0123456789ABCDEF0000000000000000",
    69 - 12 * 3
  );
  //@N106ベル
  WAVSET(
    235,
    127,
    0,
    127,
    123,
    "0A9A9ABA8FAD478979874EAF8ABA9B9A",
    69 - 12 * 2
  );
  //@N106クワイア
  WAVSET(
    236,
    127,
    0,
    127,
    123,
    "001258BDEFFEEDCBAABCDEFFEDB85210",
    69 - 12 * 3
  );
  //@N106フルート
  WAVSET(
    237,
    127,
    0,
    127,
    123,
    "0001235AEFEDB9875789BDEFEA532100",
    69 - 12 * 3
  );
  //@N106エセ エレキベース
  WAVSET(
    238,
    127,
    0,
    127,
    123,
    "4A27F016FB53D69C4A27F016FB53D69C",
    69 - 12 * 2
  );
  //@N106オルガン
  WAVSET(
    239,
    127,
    0,
    127,
    123,
    "BF9D5A98765A2604BF9D5A98765A2604",
    69 - 12 * 2
  );
  //@さんかくは
  WAVSET(
    240,
    127,
    0,
    127,
    123,
    "89ABCDEFFEDCBA987654321001234567",
    69 - 12 * 3
  );
  //@こもった ベル
  WAVSET(
    241,
    127,
    0,
    127,
    123,
    "0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A",
    69 - 12 * -2
  );
  //@われたかんじ/さんかくは(?)
  WAVSET(
    242,
    127,
    0,
    127,
    123,
    "AFAFAFAFFFFFFFF7F7FF7F7FDFFFFFDFFDFFFFFFFFFFFDCDEFD05FF78889999F",
    69 - 12 * 2
  );
  //@シンプル/ききやすい
  WAVSET(
    242,
    127,
    0,
    127,
    123,
    "00112233445566778899AABBCCDDEEFF",
    69 - 12 * 2
  );
  /*
   * @
   * WAVE$[44]="
   * WAVSET 242, 127,0,127,123,WAVE$[44],69-12*2
   */

  //
  const PBGM = -1;
  /** BGMPLAY MAINBGM TRACK */
  const MBGMT = 1;
  /** //BGMPLAY SE TRACK START(N~7) */
  const BGMT = 2;

  //*BGM
  const BGM0 = 128;
  const BGM1 = 129;
  const BGM2 = 130;
  const BGM3 = 131;
  const BGM_OP = 140;
  const BGM_ED = 150;

  //*SE
  const PLAYER_BULLET = 200;
  const PLAYER_BULLET_CLEAR = 201;
  const PLAYER_BULLET_CANNOT = 202;
  const MAPCHANGE_L = 203;
  const MAPCHANGE_R = 204;
  const FOUND = 205;
  const MAPCHANGE_LAST = 206;

  BGMSET(PLAYER_BULLET, "@310 T120 L4 Q8 @V100 V100 P64 O5 B32D");
  BGMSET(
    PLAYER_BULLET_CLEAR,
    "@310 T220 L8 Q8 @V120 V120 P64 O5 @E20,127,127,107 C"
  );
  BGMSET(
    PLAYER_BULLET_CANNOT,
    " @228 @V77 P64 O4 @D-108 @E127,117,0,127 @MP127,5,100,0 B16B16"
  );
  BGMSET(MAPCHANGE_L, " @227 T140 L4 Q2 @V100 V90 P64 O4C32<C32");
  BGMSET(MAPCHANGE_R, " @227 T140 L4 Q2 @V100 V90 P64 O5C32<C32");
  BGMSET(
    FOUND,
    " @228 T120 L4 Q8 @V100 V60 P64 O5 @E127,127,127,127 @MA127,112,107,1 F32A#32<D#"
  );
  BGMSET(MAPCHANGE_LAST, " @227 T70 L4 Q2 @V100 V90 P64 O5C32R8<C32");

  BGMSETD(BGM0, "@BGM43");
  BGMSETD(BGM1, "@BGM44");
  BGMSETD(BGM2, "@BGM45");
  BGMSETD(BGM3, "@BGM46");
  BGMSETD(BGM_OP, "@BGM47");
  BGMSETD(BGM_ED, "@BGM48");
}
//============================================

function OP() {
  SPSHOW(80);
  SPSHOW(81);
  BGMPLAY(MBGMT, BGM_OP);
  GPRIO(-1);
  GPUTCHR(EXS, EYS + 16 * 8 + 8, "   2015     Rwiiug", 1, 1, GBT3);
  GPUTCHR(EXS + 6, EYS + 16 * 8 + 8, "          @       ", 1, 1, GBT3);
  while (true) {
    VSYNC(1);
    INPUT_BUTTON_STICK_TOUCH();
    if (BUTTON(0) & 16) {
      break;
    } //A
  }
  BGMSTOP(MBGMT, 2);
  SE(MAPCHANGE_R);
  SPSHOW(96);
  SPCOLOR(96, RGB(8 * 10, 255, 255, 255));
  WAIT(30);
  SPCOLOR(96, RGB(8 * 20, 255, 255, 255));
  WAIT(30);
  SPCOLOR(96, RGB(255, 255, 255, 255));
  WAIT(90);
  SPHIDE(96);
  SPHIDE(80);
  SPHIDE(81);
  GCLS();

  DEF__BGMCHANGE();
  DEF__MAPCHANGE_CLEAR();
  DEF__ENEMY_SET();
}

function DEBUG() {
  COLOR(15, 1);
  LOCATE(0, 0, -256);
  GPRIO(-256);
  LOCATE(0, 0, -256);
  PRINT("MAP" + BGSX);
  //LOCATE 0,28:?FORMAT$("%02D",(MCNT/216000))+":"+FORMAT$("%02D",((MCNT/3600)MOD 60))+":"+FORMAT$("%02D",((MCNT/60)MOD 60))

  /*
   * FOR I=0 TO 100
   * if(  SPHITSP(0,SPNUM_ENEMY+I)  ){ BEEP
   * NEXT
   */

  for (let i = SPNUM_ENEMY; i < SPNUM_ENEMY + ENEMY_MAX; i++) {
    if (i - SPNUM_ENEMY < 10) {
      //DOWN
      GFILL(ENX[i] - 2, ENY[i], ENX[i] + 2, 400, 0xffff0000);
    } else if (I - SPNUM_ENEMY < 20) {
      //UP
      GFILL(ENX[I] - 2, 0, ENX[I] + 2, ENY[I], 0xffff0000);
    } else if (I - SPNUM_ENEMY < 30) {
      //LEFT
      GFILL(0, ENY[I] - 2, ENX[I], ENY[I] + 2, 0xffff0000);
    } else if (I - SPNUM_ENEMY < 40) {
      //RIGHT
      GFILL(ENX[I], ENY[I] - 2, 400, ENY[I] + 2, 0xffff0000);
    } else if (I - SPNUM_ENEMY < 50) {
      //DOWN
      GFILL(ENX[I] - 2, ENY[I], ENX[I] + 2, 400, 0xffff0000);
    } else if (I - SPNUM_ENEMY < 60) {
      //UP
      GFILL(ENX[I] - 2, 0, ENX[I] + 2, ENY[I], 0xffff0000);
    } else if (I - SPNUM_ENEMY < 70) {
      //LEFT
      GFILL(0, ENY[I] - 2, ENX[I], ENY[I] + 2, 0xffff0000);
    } else if (I - SPNUM_ENEMY < 80) {
      //RIGHT
      GFILL(ENX[I], ENY[I] - 2, 400, ENY[I] + 2, 0xffff0000);
    } else if (I - SPNUM_ENEMY < 90) {
      //4
      GFILL(ENX[I] - 2, ENY[I], ENX[I] + 2, 400, 0xffff0000);
      GFILL(ENX[I] - 2, 0, ENX[I] + 2, ENY[I], 0xffff0000);
      GFILL(0, ENY[I] - 2, ENX[I], ENY[I] + 2, 0xffff0000);
      GFILL(ENX[I], ENY[I] - 2, 400, ENY[I] + 2, 0xffff0000);
    }
  }

  GFILL(PX - 1, PY - 1, PX + 1, PY + 1, 0xff00ffff);
  for (let i = 0; i < PBM; i++) {
    GFILL(PBX[I] - 0, PBY[I] - 8, PBX[I] + 0, PBY[I] + 8, 0xff00ff00);
    GFILL(PBX[I] - 8, PBY[I] - 0, PBX[I] + 7, PBY[I] + 0, 0xff00ffff);
  }

  for (let i = 0; i < 3; i++) {
    BGOFS(I, BGX + BGSX * 160, BGY);
  }

  if (!(MAINCNT % 2)) {
    GCLS();
  }
}

/** 敵が自分を見ていないか調べ、見ていたらゲームオーバーに飛ぶようにしている */
function ENEMY() {
  let F_GAOV = false;

  // 敵それぞれに対して 敵がプレイヤーを見ていないか調べている
  for (let i = SPNUM_ENEMY; i < SPNUM_ENEMY + ENEMY_MAX; i++) {
    if (!ECHK[i]) {
      continue;
    }
    if (i - SPNUM_ENEMY < 10) {
      if (PY > ENY[i] && ENX[i] < PX + 2 && PX - 2 < ENX[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; PBM; j++) {
          if (PBF[j] && PBY[j] > ENY[i] - 11 && PY > PBY[j] - 4) {
            //BOX HIDE
            if (PBX[j] - 8 < ENX[i] && ENX[i] < PBX[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 20) {
      if (PY < ENY[i] && ENX[i] < PX + 2 && PX - 2 < ENX[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; j < PBM; j++) {
          if (PBF[j] && PBY[j] < ENY[i] + 2 && PY < PBY[j] + 3) {
            //BOX HIDE
            if (PBX[j] - 8 < ENX[i] && ENX[i] < PBX[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 30) {
      if (PX < ENX[i] && ENY[i] < PY + 2 && PY - 2 < ENY[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; j < PBM; j++) {
          if (PBF[j] && PBX[j] < ENX[i] + 6 && PX < PBX[j] + 6) {
            //BOX HIDE
            if (PBY[j] - 8 < ENY[i] && ENY[i] < PBY[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 40) {
      if (ENX[i] < PX && ENY[i] < PY + 2 && PY - 2 < ENY[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; j < PBM; j++) {
          if (PBF[j] && PBX[j] > ENX[i] - 6 && PX > PBX[j] - 5) {
            //BOX HIDE
            if (PBY[j] - 8 < ENY[i] && ENY[i] < PBY[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 50) {
      if (PY > ENY[i] && ENX[i] < PX + 2 && PX - 2 < ENX[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; j < PBM; j++) {
          if (PBF[j] && PBY[j] > ENY[i] - 11 && PY > PBY[j] - 4) {
            //BOX HIDE
            if (PBX[j] - 8 < ENX[i] && ENX[i] < PBX[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 60) {
      if (PY < ENY[i] && ENX[i] < PX + 2 && PX - 2 < ENX[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; j < PBM; j++) {
          if (PBF[j] && PBY[j] < ENY[i] + 2 && PY < PBY[j] + 3) {
            //BOX HIDE
            if (PBX[j] - 8 < ENX[i] && ENX[i] < PBX[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 70) {
      if (PX < ENX[i] && ENY[i] < PY + 2 && PY - 2 < ENY[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] < ENX[i] + 6 && PX < PBX[J] + 6) {
            //BOX HIDE
            if (PBY[J] - 8 < ENY[i] && ENY[i] < PBY[J] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 80) {
      if (ENX[i] < PX && ENY[i] < PY + 2 && PY - 2 < ENY[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let j = 0; j < PBM; j++) {
          if (PBF[j] && PBX[j] > ENX[i] - 6 && PX > PBX[j] - 5) {
            //BOX HIDE
            if (PBY[j] - 8 < ENY[i] && ENY[i] < PBY[j] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    } else if (i - SPNUM_ENEMY < 90) {
      if (PY > ENY[i] && ENX[i] < PX + 2 && PX - 2 < ENX[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] > ENY[i] - 11 && PY > PBY[J] - 4) {
            //BOX HIDE
            if (PBX[J] - 8 < ENX[i] && ENX[i] < PBX[J] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      } else if (PY < ENY[i] && ENX[i] < PX + 2 && PX - 2 < ENX[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] < ENY[i] + 2 && PY < PBY[J] + 3) {
            //BOX HIDE
            if (PBX[J] - 8 < ENX[i] && ENX[i] < PBX[J] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      } else if (PX < ENX[i] && ENY[i] < PY + 2 && PY - 2 < ENY[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] < ENX[i] + 6 && PX < PBX[J] + 6) {
            //BOX HIDE
            if (PBY[J] - 8 < ENY[i] && ENY[i] < PBY[J] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      } else if (ENX[i] < PX && ENY[i] < PY + 2 && PY - 2 < ENY[i]) {
        //ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] > ENX[i] - 6 && PX > PBX[J] - 5) {
            //BOX HIDE
            if (PBY[J] - 8 < ENY[i] && ENY[i] < PBY[J] + 8) {
              F_GAOV = false;
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
    }
  }
  if (F_ENEMOVE) {
    DEF__ENEMY_MOVE(BGSX);
  }
  if (F_ENECNG) {
    DEF__ENEMY_CHANGE(BGSX);
  }
}

/** 敵に見つかったときの処理をしている */
function GAMEOVER(enemyId: number) {
  SPOFS(SPNUM_FOUND, ENX[enemyId], Math.max(EYS, ENY[enemyId] - 14));
  SE(FOUND);
  FOUNDCNT += 1;
  WAIT(30);

  DEF__MAPCHANGE_CLEAR();
  DEF__ENEMY_SET();
  SPOFS(SPNUM_FOUND, -99, -99);

  /** プレイヤーを各ステージに初期位置に移動させている */
  if (BGSX === 0) {
    PX = EXS + 16 * 2 + 8;
    PY = EYS + 16 * 7 + 7;
  }
  if (BGSX === 1) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 1 + 7;
  }
  if (BGSX === 2) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 7 + 7;
  }
  if (BGSX === 3) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 4 + 7;
  }
  if (BGSX === 4) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 7 + 7;
  }
  if (BGSX === 5) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 7 + 7;
  }
  if (BGSX === 6) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 1 + 2;
  }
  if (BGSX === 7) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 4 + 7;
  }
  if (BGSX === 8) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 4 + 7;
  }
  if (BGSX === 9) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 3 + 7;
  }
  if (BGSX === 10) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 4 + 7;
  }
  if (BGSX === 11) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 7 + 7;
  }
  if (BGSX === 12) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 0 + 7;
  }
  if (BGSX === 13) {
    if (MAPCP === 2) {
      PX = EXS + 16 * 1 + 8;
      PY = EYS + 16 * 0 + 7;
    }
    if (MAPCP === 4) {
      PX = EXS + 16 * 8 + 8;
      PY = EYS + 16 * 6 + 7;
    }
  }
  if (BGSX === 14) {
    if (MAPCP === 2) {
      PX = EXS + 16 * 1 + 8;
      PY = EYS + 16 * 0 + 7;
    }
    if (MAPCP === 8) {
      PX = EXS + 16 * 1 + 8;
      PY = EYS + 16 * 8 + 7;
    }
  }
  if (BGSX === 15) {
    PX = EXS + 16 * 1 + 8;
    PY = EYS + 16 * 7 + 7;
  }
}

const DEF__ENEMY_SET = () => {
  if (BGSX === 0) {
    DEF__ESE(SPNUM_ENEMY + 30, EXS + 16 * 2 + 8, EYS + 16 * 2 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 20, EXS + 16 * 7 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 10, EXS + 16 * 6 + 8, EYS + 16 * 5 + 8, 0);
  }

  if (BGSX === 1) {
    DEF__ESE(SPNUM_ENEMY + 20, EXS + 16 * 5 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 30, EXS + 16 * 2 + 8, EYS + 16 * 5 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 00, EXS + 16 * 8 + 8, EYS + 16 * 1 + 8, 0);
  }

  if (BGSX === 2) {
    DEF__ESE(SPNUM_ENEMY + 01, EXS + 16 * 5 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 10, EXS + 16 * 5 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 20, EXS + 16 * 7 + 8, EYS + 16 * 4 + 8, 0);
  }

  if (BGSX === 3) {
    DEF__ESE(SPNUM_ENEMY + 30, EXS + 16 * 5 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 31, EXS + 16 * 4 + 8, EYS + 16 * 5 + 7, 0);
    DEF__ESE(SPNUM_ENEMY + 32, EXS + 16 * 3 + 8, EYS + 16 * 6 + 6, 0);
  }

  if (BGSX === 4) {
    DEF__ESE(SPNUM_ENEMY + 20, EXS + 16 * 2 + 8, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 31, EXS + 16 * 3 + 8, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 00, EXS + 16 * 8 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 10, EXS + 16 * 8 + 8, EYS + 16 * 5 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 01, EXS + 16 * 6 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 30, EXS + 16 * 3 + 8, EYS + 16 * 6 + 8, 0);
  }

  if (BGSX === 5) {
    DEF__ESE(SPNUM_ENEMY + 30, EXS + 16 * 1 + 8, EYS + 16 * 2 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 31, EXS + 16 * 1 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 00, EXS + 16 * 4 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 10, EXS + 16 * 7 + 8, EYS + 16 * 4 + 8, 0);
  }

  if (BGSX === 6) {
    DEF__ESE(SPNUM_ENEMY + 22, EXS + 16 * 2 + 10, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 21, EXS + 16 * 2 + 10, EYS + 16 * 5 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 23, EXS + 16 * 8 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 00, EXS + 16 * 7 + 8, EYS + 16 * 1 + 8, 0);
  }

  //if(  BGSX===  ){

  //}

  if (BGSX === 8) {
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 7 + 8, EYS + 16 * 1 + 8, 0);
  }

  if (BGSX === 9) {
    F_ENEMOVE = false;
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 5 + 8, EYS + 16 * 0 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 50, EXS + 16 * 8 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 60, EXS + 16 * 8 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 70, EXS + 16 * 0 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 71, EXS + 16 * 3 + 8, EYS + 16 * 4 + 8, 0);
  }

  if (BGSX === 10) {
    F_ENEMOVE = true;
    DEF__ESE(SPNUM_ENEMY + 45, EXS + 16 * 6, EYS + 16 * 0 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 55, EXS + 16 * 5, EYS + 16 * 8 + 8, 0);
  }

  if (BGSX === 11) {
    F_ENEMOVE = true;
    DEF__ESE(SPNUM_ENEMY + 65, EXS + 16 * 9 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 55, EXS + 16 * 5 + 8, EYS + 16 * 8 + 8, 0);
  }

  if (BGSX === 12) {
    F_ENEMOVE = false;
    F_ENECNG = false;

    DEF__ESE(SPNUM_ENEMY + 80, EXS + 16 * 5 + 8, EYS + 16 * 4 + 8, 0);
  }

  if (BGSX === 13) {
    F_ENEMOVE = false;
    F_ENECNG = true;
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 5 + 8, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 61, EXS + 16 * 3 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 42, EXS + 16 * 2 + 8, EYS + 16 * 6 + 8, 0);
  }

  if (BGSX === 14) {
    F_ENEMOVE = true;
    F_ENECNG = false;
    DEF__ESE(SPNUM_ENEMY + 65, EXS + 16 * 8 + 8, EYS + 16 * 3 + 8, 0);
  }

  if (BGSX === 15) {
    F_ENEMOVE = false;
    F_ENECNG = true;
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 2 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 41, EXS + 16 * 4 + 8, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 62, EXS + 16 * 6 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 63, EXS + 16 * 8 + 8, EYS + 16 * 6 + 4, 0);
  }
};

const DEF__ENEMY_MOVE = (BGSX: number): void => {
  if (BGSX === 10) {
    ENX[SPNUM_ENEMY + 45] = EXS + 16 * 6 + SIN(RAD(MCNT)) * (16 * 3 - 8);
    ENX[SPNUM_ENEMY + 55] = EXS + 16 * 5 + COS(RAD(MCNT)) * (16 * 3 - 8);
    SPOFS(SPNUM_ENEMY + 45, ENX[SPNUM_ENEMY + 45], ENY[SPNUM_ENEMY + 45]);
    SPOFS(SPNUM_ENEMY + 55, ENX[SPNUM_ENEMY + 55], ENY[SPNUM_ENEMY + 55]);
  }

  if (BGSX === 11) {
    ENY[SPNUM_ENEMY + 65] = EYS + 16 * 4 + 6 + SIN(RAD(MCNT / 2)) * (16 * 2);
    ENX[SPNUM_ENEMY + 55] = EXS + 16 * 5 + 8 + COS(RAD(MCNT)) * (16 * 3);
    SPOFS(SPNUM_ENEMY + 65, ENX[SPNUM_ENEMY + 65], ENY[SPNUM_ENEMY + 65]);
    SPOFS(SPNUM_ENEMY + 55, ENX[SPNUM_ENEMY + 55], ENY[SPNUM_ENEMY + 55]);
  }

  if (BGSX === 14) {
    ENY[SPNUM_ENEMY + 65] =
      EYS + 16 * 3 + 8 + SIN(RAD(MCNT * 1.5)) * (16 * 3 - 12);
    SPOFS(SPNUM_ENEMY + 65, ENX[SPNUM_ENEMY + 65], ENY[SPNUM_ENEMY + 65]);
  }
};

const DEF__ENEMY_CHANGE = (BGSX: number): void => {
  let R = 0;

  if (BGSX === 13) {
    if (!(MCNT % 60)) {
      DEF__MAPCHANGE_CLEAR;
      R = RND(4);
      R = SPNUM_ENEMY + 40 + R * 10;
      DEF__ESE(R, EXS + 16 * 5 + 8, EYS + 16 * 3 + 8, 0);
    }

    if (!(MCNT % 60)) {
      //DEF__MAPCHANGE_CLEAR
      R = 0;
      while (R === 0 || R === 3) {
        R = RND(4);
      }
      R = SPNUM_ENEMY + 41 + R * 10;
      DEF__ESE(R, EXS + 16 * 3 + 8, EYS + 16 * 4 + 8, 0);
    }

    if (!(MCNT % 60)) {
      // DEF__MAPCHANGE_CLEAR
      R = 1;
      while (R === 1 || R === 3) {
        R = RND(4);
      }
      R = SPNUM_ENEMY + 42 + R * 10;
      DEF__ESE(R, EXS + 16 * 2 + 8, EYS + 16 * 6 + 8, 0);
      R = 0;
    }

    R = SPNUM_ENEMY + 43 + 3 * 10;
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 - 8, 0);
    R = SPNUM_ENEMY + 44 + 3 * 10;
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 - 4, 0);
    R = SPNUM_ENEMY + 45 + 3 * 10;
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 + 0, 0);
    R = SPNUM_ENEMY + 46 + 3 * 10;
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 + 4, 0);
    R = SPNUM_ENEMY + 47 + 3 * 10;
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 + 8, 0);
  }

  let N = 0;
  if (BGSX === 15) {
    R = 1;
    if (!(MCNT % 45)) {
      DEF__MAPCHANGE_CLEAR;
      while (R === 1) {
        R = RND(4);
      }
      R = SPNUM_ENEMY + 40 + N + R * 10;
      DEF__ESE(R, EXS + 16 * 2 + 8, EYS + 16 * 1 + 8, 0);
      N += 1;
    }

    R = 0;
    if (!(MCNT % 45)) {
      R = RND(4);
      R = SPNUM_ENEMY + 40 + N + R * 10;
      DEF__ESE(R, EXS + 16 * 4 + 8, EYS + 16 * 3 + 8, 0);
      N += 1;
    }

    R = 0;
    if (!(MCNT % 45)) {
      R = RND(4);
      R = SPNUM_ENEMY + 40 + N + R * 10;
      DEF__ESE(R, EXS + 16 * 6 + 8, EYS + 16 * 4 + 8, 0);
      N += 1;
    }

    R = 3;
    if (!(MCNT % 45)) {
      while (R === 3) {
        R = RND(4);
      }
      R = SPNUM_ENEMY + 40 + N + R * 10;
      DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 6 + 4, 0);
      N += 1;
    }
  }
};

/**
 * スプライトを表示して移動して、各種データの配列を更新する
 * @param num 管理番号
 * @param x X座標
 * @param y Y座標
 * @param z Z座標
 */
const DEF__ESE = (num: number, x: number, y: number, z: number) => {
  SPSHOW(num);
  ECHK[num] = true;
  SPOFS(num, x, y, z);
  ENX[num] = x;
  ENY[num] = y;
};

const CREDIT = () => {
  let F_END;
  if (F_END === 0) {
    GCLS();
    LOCATE(0, 0);
    PRINT("     ");
    GPRIO(-256);
    CLEARTIME = MCNT;
  }

  if (BGSX === 19) {
    if (F_END === 0) {
      F_END = 1;
    }
    if (F_END === 1) {
      GCLS();
      SPSHOW(96);
      SPCOLOR(96, RGB(50, 255, 255, 255));
      GFILL(EXS, EYS, EXE - 1, EYS + 16 * 3, GBT0);
      GFILL(EXS, EYE, EXE - 1, EYE - 16 * 3, GBT0);
      GPUTCHR(
        EXS + 16,
        EYS + 16 * 1,
        "[] Clear Time  ",
        1,
        1,
        RGB(255, 255, 255)
      );
      GPUTCHR(
        EXS + 16,
        EYS + 16 * 2,
        "    " +
          FORMAT$("%02D", MCNT / 216000) +
          ":" +
          FORMAT$("%02D", (MCNT / 3600) % 60) +
          ":" +
          FORMAT$("%02D", (MCNT / 60) % 60),
        1,
        1,
        RGB(255, 255, 255)
      );
      GPUTCHR(
        EXS + 16,
        EYE - 16 * 2,
        "[] Box   : " + STR$(GBNUM),
        1,
        1,
        RGB(255, 255, 255)
      );
      GPUTCHR(
        EXS + 16,
        EYE - 16 * 1,
        "[!] Found : " + STR$(FOUNDCNT),
        1,
        1,
        RGB(255, 255, 255)
      );
      F_END += 1;
    }
  }

  if (BGSX === 20) {
    if (F_END === 1) {
      F_END = 2;
    }
    if (F_END === 2) {
      GCLS();
      SPSHOW(96);
      SPCOLOR(96, RGB(70, 255, 255, 255));
      GFILL(EXS, EYS, EXE - 1, EYS + 16 * 2, GBT1);
      GFILL(EXS, EYE, EXE - 1, EYE - 16 * 2, GBT1);
      GPUTCHR(
        EXS + 8,
        EYS + 14,
        "    - Creator -    ",
        1,
        1,
        RGB(255, 255, 255)
      );
      GPUTCHR(
        EXS + 10,
        EYE - 16,
        "Rwiiug(RWIIUG0129)",
        1,
        1,
        RGB(255, 255, 255)
      );
      F_END += 1;
    }
  }

  if (BGSX === 21) {
    if (F_END === 2) {
      F_END = 3;
    }
    if (F_END === 3) {
      GCLS();
      SPSHOW(96);
      SPCOLOR(96, RGB(180, 255, 255, 255));
      GFILL(EXS, EYS, EXE - 1, EYS + 16 * 1, GBT1);
      GFILL(EXS, EYE, EXE - 1, EYE - 16 * 1, GBT1);
      GPUTCHR(
        EXS + 8,
        EYS + 5,
        "- Special Thanks -    ",
        1,
        1,
        RGB(255, 255, 255)
      );
      GPUTCHR(
        EXS + 10,
        EYE - 11,
        "All PetitCom Users",
        1,
        1,
        RGB(255, 255, 255)
      );
      F_END += 1;
    }
    if (EXS + 16 * 3 < PX) {
      SPCOLOR(96, RGB(210, 255, 255, 255));
    }
    if (EXS + 16 * 6 < PX) {
      SPCOLOR(96, RGB(230, 255, 255, 255));
    }
    if (EXS + 16 * 8 < PX) {
      SPCOLOR(96, RGB(240, 255, 255, 255));
    }
  }
};

const ENDING = () => {
  SE(MAPCHANGE_LAST);
  GCLS();
  GPRIO(-256);
  SPHIDE(0);
  SPSHOW(96);
  SPCOLOR(96, RGB(255, 255, 255, 255));

  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT2);
  WAIT(20);
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT1);
  WAIT(20);
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT0);
  WAIT(120);
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }

  WAIT(20);
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT2);
  WAIT(20);
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT1);
  WAIT(20);
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT0);
  WAIT(220);
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }
  if (BGMCHK(MBGMT)) {
    WAIT(60);
  }

  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT1);
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT1);
  WAIT(60);
  if (BGMCHK(MBGMT)) {
    WAIT(30);
  }

  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT2);
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT2);
  WAIT(60);
  if (BGMCHK(MBGMT)) {
    WAIT(30);
  }

  GCLS();
  WAIT(60);

  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT3);
  WAIT(30);
  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT2);
  WAIT(30);
  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT1);
  WAIT(30);
  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT0);

  WAIT(120);

  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT2);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT3);
  WAIT(30);
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT1);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT2);
  WAIT(30);
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT0);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT1);
  WAIT(30);
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT0);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT0);

  while (true) {
    if (BUTTON() === 16) {
      SE(PLAYER_BULLET);
      SPCOLOR(96, RGB(0, 0, 0));
      GCLS();
      // クリアタイムや見つかった数、生成した影の条件を満たせば隠された画像が表示される
      if (CLEARTIME < 60 * 60 * 5 || FOUNDCNT < 10 || GBNUM < 100) {
        SPHIDE(96);
        SPSHOW(90);
        WAIT(90);
        SPSHOW(96);
        WAIT(30);
      } else {
        WAIT(120);
      }
    }
  }
};

function BG() {
  //?MAPCP
  if (GETATR(PX, PY) === 2) {
    MAPCP = 2;
  }
  if (GETATR(PX, PY) === 4) {
    MAPCP = 4;
  }
  if (GETATR(PX, PY) === 8) {
    MAPCP = 8;
  }

  if (BGSX < BG_MAX && EXE < PX + 9) {
    //MOVE RIGHT
    BGSX += 1;
    if (BGSX === 22) {
      GOTO(ENDING());
    }
    PX = EXS + 16;
    DEF__MAPCHANGE_CLEAR();
    DEF__ENEMY_SET();
    DEF__BGMCHANGE();
    SE(MAPCHANGE_R);
    for (let i = 0; i < 3; i++) {
      BGOFS(i, BGX + BGSX * 16 * 10, BGY);
    }
  }

  if (BGSX > 0 && BGSX < 19 && PX - 9 < EXS) {
    //MOVE LEFT
    BGSX += -1;
    PX = EXE - 16;
    DEF__MAPCHANGE_CLEAR();
    DEF__ENEMY_SET();
    DEF__BGMCHANGE();
    SE(MAPCHANGE_L);
    for (let i = 0; i < 3; i++) {
      BGOFS(i, BGX + BGSX * 16 * 10, BGY);
    }
  }

  if (BGSX > 18) {
    CREDIT();
  }
}

/** ステージによってBGMを変更している */
const DEF__BGMCHANGE = () => {
  if (BGSX < 3) {
    if (PBGM != 0) {
      BGMPLAY(MBGMT, BGM0);
    }
    PBGM = 0;
  } else if (BGSX < 7) {
    if (PBGM != 1) {
      BGMPLAY(MBGMT, BGM1);
    }
    PBGM = 1;
  } else if (BGSX < 8) {
    if (PBGM != 99) {
      BGMSTOP(MBGMT, 3);
    }
    PBGM = 99;
  } else if (BGSX < 12) {
    if (PBGM != 2) {
      BGMPLAY(MBGMT, BGM2);
    }
    PBGM = 2;
  } else if (BGSX < 16) {
    if (PBGM != 3) {
      BGMPLAY(MBGMT, BGM3);
    }
    PBGM = 3;
  } else if (BGSX < 18) {
    EFCOFF();
    if (PBGM != 99) {
      BGMSTOP(MBGMT, 5);
    }
    PBGM = 99;
  } else if (BGSX === 19) {
    EFCON;
    EFCSET(1);
    EFCWET(80, 80, 80);
    if (PBGM != 20) {
      BGMPLAY(MBGMT, BGM_ED);
    }
    PBGM = 20;
  } else if (BGSX === 19) {
    EFCWET(100, 100, 100);
  } else if (BGSX === 20) {
    EFCWET(127, 127, 127);
  }
};

const DEF__MAPCHANGE_CLEAR = () => {
  for (let i = SPNUM_PB; i < SPNUM_PB + PBM; i++) {
    SPHIDE(i);
  }
  for (let i = SPNUM_ENEMY; i < SPNUM_ENEMY + ENEMY_MAX; i++) {
    SPHIDE(i);
    ECHK[i] = false;
    ENX[i] = -99; //0
    ENY[i] = -99; //0
  }
  for (let i = 0; i < PBM; i++) {
    //SPHIDE I+SPNUM_PB
    PBF[i] = false;
    PBX[i] = -99; //0
    PBY[i] = -99; //0
    PBDX[i] = false;
    PBDY[i] = false;
  }
};

function PLAYER() {
  //*ANIME CHANGE
  if (BUTTON(2) === 1 && !BB) {
    // 上のアニメーション
    SPANIM(
      0,
      "UV",
      [[16, 00, 32][(16, 16, 32)][(16, 32, 32)][(16, 48, 32)]],
      0
    );
    PDX = 0;
    PDY = -1;
  }
  if (BUTTON(2) === 2 && !BB) {
    SPANIM(
      0,
      "UV",
      [
        [16, 00, 48],
        [16, 16, 48],
        [16, 32, 48],
        [16, 48, 48],
        [16, 64, 48],
        [16, 16, 48],
        [16, 32, 48],
        [16, 48, 48],
      ],
      0
    );
    PDX = 0;
    PDY = 1;
  }
  if (BUTTON(2) === 4 && !BB) {
    SPANIM(
      0,
      "UV",
      [
        [16, 0, 16],
        [16, 16, 16],
        [16, 32, 16],
        [16, 48, 16],
        [16, 64, 16],
        [16, 16, 16],
        [16, 32, 16],
        [16, 48, 16],
      ],
      0
    );
    PDX = -1;
    PDY = 0;
  }
  if (BUTTON(2) === 8 && !BB) {
    SPANIM(
      0,
      "UV",
      [
        [16, 0, 0],
        [16, 16, 0],
        [16, 32, 0],
        [16, 48, 0],
        [16, 64, 0],
        [16, 16, 0],
        [16, 32, 0],
        [16, 48, 0],
      ],
      0
    );
    PDX = 1;
    PDY = 0;
  }

  //*MOVE
  let PVX = 0;
  let PVY = 0;
  let PDMX = 0;
  let PDMY = 0;
  let PSPD = 0.7;
  //let PSPD=(BB+1)/1.4
  if (BB && BGSX < 19) {
    PSPD = 1.1;
  }
  //PVX=0:PVY=0
  if (BGSX === 16) {
    PSPD /= 1.3;
  }
  if (BGSX === 17) {
    PSPD /= 1.5;
  }
  if (BGSX === 18) {
    PSPD /= 1.7;
  }
  if (BGSX === 19) {
    PSPD /= 2;
  }
  if (BGSX === 20) {
    PSPD /= 3;
  }
  if (BGSX === 21) {
    if (EXS + 16 * 6 < PX) {
      PSPD /= 5;
    } else if (EXS + 16 * 4 < PX) {
      PSPD /= 4.5;
    } else {
      PSPD /= 4;
    }
  }
  if (PTDU % PMF === PMF - 1) {
    PVY -= PMV * PSPD;
    PDMX = 0;
    PDMY = -1;
  }
  if (PTDD % PMF === PMF - 1) {
    PVY += PMV * PSPD;
    PDMX = 0;
    PDMY = 1;
  }
  if (PTDL % PMF === PMF - 1) {
    PVX -= PMV * PSPD;
    PDMX = -1;
    PDMY = 0;
  }
  if (PTDR % PMF === PMF - 1) {
    PVX += PMV * PSPD;
    PDMX = 1;
    PDMY = 0;
  }

  if (PVX && PVY) {
    PVX /= 1.41; //SQR(PVX)
    PVY /= 1.41; //SQR(PVY)
  }

  PX += PVX;
  PY += PVY;
  if (GETATR(PX - 8, PY) === 1) {
    PX -= PVX;
    PY -= PVY;
  }

  PX = Math.max(EXS + 8 * SSCL, Math.min(PX, EXE - 8));
  PY = Math.max(EYS + 7 * SSCL, Math.min(PY, EYE - 9));

  SPOFS(0, PX, PY, PZ);

  //*ATTACK
  if (BUTTON(2) === 16) {
    if (BGSX < 13) {
      PBX[PBNUM] = PX;
      PBY[PBNUM] = PY;
      PBDX[PBNUM] = PDX;
      PBDY[PBNUM] = PDY;
      PBF[PBNUM] = true;
      PBNUM += 1;
      GBNUM += 1;
      PBNUM %= PBM;
      SE(PLAYER_BULLET);
    } else if (BGSX < 17) {
      SE(PLAYER_BULLET_CANNOT);
    }
  }

  for (let i = 0; i < PBM; i++) {
    if (PBF[i]) {
      SPSHOW(i + SPNUM_PB);
      SPOFS(i + SPNUM_PB, PBX[i], PBY[i], PZB - i);
      PBF[i] += 1;
      if (PBF[i] === 2) {
        SPANIM(i + SPNUM_PB, "UV", -1, 16 * 0, 16 * 5);
        PBX[i] = PBX[i] + 16 * PBDX[i];
        PBY[i] = PBY[i] + 16 * PBDY[i];
      } else if (PBF[i] === 3) {
        PBX[i] = PBX[i] + 16 * PBDX[i];
        PBY[i] = PBY[i] + 16 * PBDY[i];
      } else if (PBF[i] === 4) {
        PBX[i] = PBX[i] + 9 * PBDX[i];
        PBY[i] = PBY[i] + 9 * PBDY[i];
      } else if (PBF[i] === 260) {
        SPANIM(i + SPNUM_PB, "UV", -1, 16 * 1, 16 * 5);
      } else if (PBF[i] === 340) {
        SPANIM(i + SPNUM_PB, "UV", -1, 16 * 1, 16 * 5);
      } else if (PBF[i] === 350) {
        SPANIM(i + SPNUM_PB, "UV", -1, 16 * 1, 16 * 5);
      } else if (PBF[i] === 360) {
        PBF[i] = false;
        PBX[i] = -99;
        PBY[i] = -99;
        SPHIDE(i + SPNUM_PB);
        SE(PLAYER_BULLET_CLEAR);
      }
    }
  }
}

/** Sound Effect 効果音を鳴らす */
const SE = (num: number) => {
  //SOUND EFFECT
  BGMT += 1;
  BGMT = MAX(2, BGMT % 8);
  BGMPLAY(BGMT, num);
};

function INPUT_BUTTON_STICK_TOUCH() {
  DU = false;
  DD = false;
  DL = false;
  DR = false;
  BA = false;
  BB = false;
  BX = false;
  BY = false;
  BL = false;
  BR = false;
  ZL = false;
  ZR = false;
  //TOUCH OUT STTM,TX,TY

  BTN = BUTTON(0);
  /*
   * STICK   OUT SX ,SY
   * STICKEX OUT EXX,EXY
   */

  if (BTN) {
    if (BTN & 1) {
      DU = true;
    }
    if (BTN & 2) {
      DD = true;
    }
    if (BTN & 4) {
      DL = true;
    }
    if (BTN & 8) {
      DR = true;
    }
    if (BTN & 16) {
      BA = true;
    }
    if (BTN & 32) {
      BB = true;
    }
    if (BTN & 64) {
      BX = true;
    }
    if (BTN & 128) {
      BY = true;
    }
    if (BTN & 256) {
      BL = true;
    }
    if (BTN & 512) {
      BR = true;
    }
    if (BTN & 2048) {
      ZR = true;
    }
    if (BTN & 4096) {
      ZL = true;
    }
  } else if (SX || SY) {
    if (ABS(SX) < MOVEPLAY_L) {
      SX = 0;
    }
    if (ABS(SY) < MOVEPLAY_L) {
      SY = 0;
    }
    if (SY > 0) {
      DU = true;
    }
    if (SY < 0) {
      DD = true;
    }
    if (SX < 0) {
      DL = true;
    }
    if (SX > 0) {
      DR = true;
    }
  }

  if (EXX || EXY) {
    if (ABS(EXX) < MOVEPLAY_R) {
      EXX = 0;
    }
    if (ABS(EXY) < MOVEPLAY_R) {
      EXY = 0;
    }
    if (EXY > 0) {
      BX = true;
    }
    if (EXY < 0) {
      BB = true;
    }
    if (EXX < 0) {
      BY = true;
    }
    if (EXX > 0) {
      BA = true;
    }
  }

  if (DU) {
    PTDU += 1;
  } else {
    PTDU = 0;
  }
  if (DD) {
    PTDD += 1;
  } else {
    PTDD = 0;
  }
  if (DL) {
    PTDL += 1;
  } else {
    PTDL = 0;
  }
  if (DR) {
    PTDR += 1;
  } else {
    PTDR = 0;
  }

  if (BUTTON(2) & 128 && BUTTON() & 256 && BUTTON() & 512) {
    if (!F_GBGREEN) {
      SPSHOW(97);
      F_GBGREEN = 1;
      SE(MAPCHANGE_R);
    } else {
      SPHIDE(97);
      F_GBGREEN = 0;
      SE(MAPCHANGE_L);
    }
  }
  if (BUTTON(2) & 64 && BUTTON() & 256 && BUTTON() & 512) {
    if (!DEBUG2) {
      DEBUG2 = 1;
      SE(MAPCHANGE_R);
    } else {
      DEBUG2 = 0;
      GCLS();
      COLOR(0, 0);
      LOCATE(0, 0);
      print("      ");
      SE(MAPCHANGE_L);
    }
  }
}

//=============================================================

/*
 * =============================================================
 * 初期化処理
 * =============================================================
 */

const INITIALIZE = () => {
  let D$;
  let R$;
  let I; //OPTION STRICT ように かってに つけたし
  ACLS();
  SYSBEEP = 1;
  XSCREEN(2, 512, 4);
  DISPLAY(1);
  COLOR(15, 0);
  XSCREEN(0, 512, 4);
  for (let i = 0; i < 8; i++) {
    BGMSTOP(i);
  }
  for (let i = 0; i < 10; i++) {
    BREPEAT(i);
  }
  DISPLAY(0);
  VISIBLE(1, 1, 1, 1);
  for (let i = 5; i >= 0; i--) {
    GPAGE(i, i);
    if (i != 4 && i != 5) {
      GCLS();
    }
  }
};

/*
 * GLOBAL変数
 * let BGW,BGH     //よみこんだBGのサイズ
 * let ATR%[32*32] //BGキャラ アトリビュートよう
 */

// カンイ BGヨミコミ ルーチン(アトリビュート+サイズたいおうばん) 
/**
 * マップデータの読み込み
 * @param fileName
 */
const LOADBG = (fileName) => {
  const B = [];
  let BGL;
  let I;
  let X;
  let Y;
  let O;
  let P = 8;

  LOAD(fileName, B, false);
  BGL = B[3];
  BGW = B[4] * B[6];
  BGH = B[5] * B[7];

  for (let i = 0; i < 32 * 32; i += 4) {
    ATR[I + 0] = B % [P] & 0xff;
    ATR[I + 1] = (B % [P] >> 8) & 0xff;
    ATR[I + 2] = (B % [P] >> 16) & 0xff;
    ATR[I + 3] = (B % [P] >> 24) & 0xff;
    P += 1;
  }

  const M = new Array(BGW * BGH + 1);
  for (let i = 0; i < BGL; i++) {
    BGSCREEN(I, BGW, BGH);
    for (let y = 0; y < BGH; y++) {
      for (let x = 0; x < BGW; x++) {
        O = X + BGW * Y;
        M[O] = B % [P] & 0xffff;
        M[O + 1] = (B % [P] >> 16) & 0xffff;
        P += 1;
      }
    }
    BGLOAD(I, M);
  }
};

//アトリビュートをしらべる
const GETATR = (X: number, Y: number): number => {
  let A = 0;

  for (let i = 0; i < 4; i++) {
    const C = BGGET(i, X + 8, Y + 8, 1) & 0x0fff;
    A |= ATR[C]; //アトリビュートはごうせい
  }

  return A;
};

/*
 * 
 *  ほしけん(NNID:Hosiken)さん さくせい  フォント しょり
 * フォントのさくせいには プチフォントエディタ[QDKE34N3] を しようしました。
 * 
 */

// フォント しょきか
const FONTINIT = () => {
  let CHRCODE;
  let PAT$;
  const fontData = [
    [0x0041, "00183C24667E6600"],
    [0x0042, "007C62627C627C00"],
    [0x0043, "003C726060723C00"],
    [0x0044, "0078646666647800"],
    [0x0045, "007E60607C607E00"],
    [0x0046, "007E7E6078606000"],
    [0x0047, "003C62606E663E00"],
    [0x0048, "006666667E666600"],
    [0x0049, "003C3C1818183C00"],
    [0x004a, "003E3E0C4C4C3800"],
    [0x004b, "00666C78786C6600"],
    [0x004c, "00606060607C7C00"],
    [0x004d, "0042667E5A424200"],
    [0x004e, "0062727A6E666200"],
    [0x004f, "003C666666663C00"],
    [0x0050, "007C62627C606000"],
    [0x0051, "003C66666A643A00"],
    [0x0052, "007C62627C686600"],
    [0x0053, "003C66603C463C00"],
    [0x0054, "007E7E1818181800"],
    [0x0055, "0066666666663C00"],
    [0x0056, "00666624243C1800"],
    [0x0057, "0042425A7E664200"],
    [0x0058, "0066241838644600"],
    [0x0059, "0066663C18181800"],
    [0x005a, "007E7E0C18307E00"],
    [0x0030, "003C666E76663C00"],
    [0x0031, "0018385818187E00"],
    [0x0032, "003C62021C307E00"],
    [0x0033, "003C46061C463C00"],
    [0x0034, "001C2C4C7E0C0C00"],
    [0x0035, "007E607C06463C00"],
    [0x0036, "003C607C62623C00"],
    [0x0037, "007E66040C081800"],
    [0x0038, "003C66663C663C00"],
    [0x0039, "003C46463E463C00"],
    [0x0061, "00003A6664643A00"],
    [0x0062, "0060607C66667C00"],
    [0x0063, "00003C6260623C00"],
    [0x0064, "0006063E66663E00"],
    [0x0065, "000038647C603800"],
    [0x0066, "000C1A183C181800"],
    [0x0067, "00003E643C4C3800"],
    [0x0068, "0060607C66666600"],
    [0x0069, "0018001818181800"],
    [0x006a, "000C000C0C4C3800"],
    [0x006b, "0060666E706C6600"],
    [0x006c, "0038381818181800"],
    [0x006d, "00003C7E6A6A6A00"],
    [0x006e, "00007C6666666600"],
    [0x006f, "00003C6666663C00"],
    [0x0070, "00007C66667C6000"],
    [0x0071, "00003E66663E0600"],
    [0x0072, "0000666E70606000"],
    [0x0073, "00003C703C063C00"],
    [0x0074, "0018183C181A0C00"],
    [0x0075, "0000666666663A00"],
    [0x0076, "00006666663C1800"],
    [0x0077, "0000626A6A7E3C00"],
    [0x0078, "0000663C183C6600"],
    [0x0079, "000066663E063C00"],
    [0x007a, "00007E6C18367E00"],
    [0x005b, "0078606060607800"],
    [0x005d, "001E060606061E00"],
    [0x002d, "0000007E7E000000"],
    [0xe2b1, "007E7E7E7E7E7E00"],
    [0x0021, "0018181818001800"],
    [0xe214, "00182C6E623C1800"],
    [0x0028, "0018302020301800"],
    [0x0029, "00180C04040C1800"],
    [0x003a, "0000180000180000"],
    [0x0040, "003C625A54683C00"],
    [0x003f, "003C464618001800"],
  ];
  for (const [CHRCODE, PAT$] of fontData) {
    // 16 もじの はずなので どくじかんすうに わたす
    SETFONT(CHRCODE, PAT$);
  }
};
/**
 * 短いデータ文字列(4ドットあたり 1文字)を
 * 指定文字コード(CHRCODE%)に FONTDEF する
 * @param CHRCODE 文字コード
 * @param FONTPAT$ データ文字列
 */
const SETFONT = (CHRCODE: number, FONTPAT$: string) => {
  let FONTI;
  let FONTJ; //OPTION STRICT ように かってに つけたし
  const FONTPAT: Array<Array<number>> = new Array(8).fill(new Array(8));
  for (let i = 0; i < 8; i++) {
    const FONTBYTE = VAL("0x" + MID$(FONTPAT$, i * 2, 2));
    let BMASK = 128;
    for (let j = 0; j < 8; j++) {
      if (FONTBYTE & BMASK) {
        FONTPAT[(FONTJ, i)] = 1;
        //FONTPAT$=FONTPAT$+RGBA2HEX16(15,15,15,0)
      }
      BMASK /= 2;
    }
  }
  SETFONTPAT(CHRCODE, FONTPAT);
};

/**
 * 8X8はいれつ(FONTPAT)に 0か1をいれた パターンを
 * していもじコード(CHRCODE%)に FONTDEF する
 * @param CHRCODE
 * @param FONTPAT
 */
const SETFONTPAT = (CHRCODE, FONTPAT) => {
  let FONTI;
  let FONTJ;
  let FONTPAT$;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (FONTPAT[(FONTJ, FONTI)]) {
        const FONTGRAD = 31;
        FONTPAT$ += FONTRGBA2PAT(FONTGRAD, FONTGRAD, FONTGRAD, 1);
      } else {
        // かげを つける
        const FONTSHADOW = 0;
        FONTPAT$ += FONTRGBA2PAT(7, 7, 7, FONTSHADOW);
      }
    }
  }
  FONTDEF(CHRCODE, FONTPAT$);
};

/**
 * R,G,B(0~31) と A(0か1) を FONTDEF の 1ドットに へんかん
 */
const FONTRGBA2PAT = (R: number, G: number, B: number, A: number) =>
  RIGHT$("000" + HEX$(R * 0x800 + B * 0x40 + G * 0x2 + A), 4);

const bgm43Macro = `
T140
{A0= V100 L8
R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4
A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4
}

{B0= V100 L16
D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR
D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR A#RRR A#RRR
D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR
D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR
}
{C0= V100
 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
 D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8
}

{A1= V100
D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>
A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8
A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8
}
{B1= V100 L16
D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRRCRRRCRRR>A#RRRA#RRR
<D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRR>BRRRBRRR<DRRRDRRR
}
{C1= V100
<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8
<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8
<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8
 
}

{A2= V100
D#2A#2F#2F2 D#2<D#2C#6>B6A#6F#6F6D#6
D#2A#2F#2F2 D#2<D#2C#2D#4D#4>
}
{B2= V100 L16
D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRARRRARRR
D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRR
<D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR
<D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR
}
{C2= V100
D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8
D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8
}
`;

//********** BGM 43 *********************

const bgm43Main = `
:1[@V085
 @230 P84 O5
 @D10 @E127,127,100,127
 {A0}
 {A1}
 {A2}
]

:2[@V050
 @225 P44 O2
 @D10 @E127,127,120,117 @MA127,70,10,0
 {B0}
 {B1}
 {B2}
]

:3[@V55
 @226 P64 O4
 @D10 @E127,85,0,127
 {C0}
 {C1}
 {C2}
]
`;

// ===================================================

const bgm44Macro = `
T120

{A0= V100
F8<D#8C8>F8 A#8.F8.A#8
F8<D#8C8>F8 A#8.F8.D8
F8<D#8C8>F8 A#8.F8.A#8
F8<D#8C8>F8 A#8.F8.<D8> 

F8<D#8C8>F8 A#8.F8.A#8
F8<D#8C8>F8 A#8.F8.D8
F8<D#8C8>F8 A#8.F8.A#8
F8<D#8C8>F8 A#8.F8.<D8> 
}
{B0= V100
R1
R1
R1
R1
 
R1
R1
D#8<D#8C8>A#8 A#8.A#8.A#8
D#8<D#8C8>A#8 A#8.A#8.<C8>
}

{A1= V100
D#8<C8D#8>A#8 A#8.A#8.A#8
G#8A#8A#8F8   A#8.A#8.F8
D#8<C8D8>A#8 A#8.A#8.A#8
G#8A#8A#8F8   A#8.F8.A#8
 
D#8<C8D#8>A#8 A#8.A#8.A#8
G#8A#8A#8F8   A#8.A#8.F8
D#8<C8F8>A#8 A#8.A#8.A#8
G#8A#8A#8F8   A#8.F8.A#8
}
{B1= V100
R1
R1
R1
R1
 
R1
R1
D#8<C8F8>A#8 A#8.A#8.A#8
G#8A#8A#8F8   A#8.F8.A#8
}

{A2= V100 Q4
 [D#8D#16D#16]4
 [D#8D#16D#16]4
 [D#8D#16D#16]4
 [D#8D#16D#16]4
}

{D00= V100
R8D#8D#8D#8
}
`;

//********** BGM 44 *********************
const bmg44 = `
:1[
 @228 T120 L4 Q8 @V80 P64 O2
 @E127,127,127,127 @ML16,2,10,7
 {A0}
 {A1}
 {A2}
]

:10[@V80 P064
 @266 T120 L4 Q0 @V95 P94 O4
 @E127,127,127,124
 {D00}
]
`;

//=======================================

@BGM45
const bgm45Macro = `
T30

{A0= V100 Q6
 RF#<C#>F#  G#.A.B
 R<C#DE     F#.E.D>
 RF#<C#>F#  G#.A.B
 RBAG#      G#.F#.A
}
{B0= V100 Q4
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
}
{C0= V100
 R1R1
 R1R1
 R1R1
 R1R1
}

{A1= V100
 RF#<C#>F#  G#.A.B
 R<C#DE     F#.E.D>
 RF#<C#>F#  G#.A.B
 RBAG#      G#.F#.R
}
{B1= V100 Q4
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16>
}
{C1= V100
 RF#<C#>F# G#.A.B
 R<C#DE    F#.E.D>
 RF#<C#>F# G#.A.B
 RBAG#
}

{A2= V100
 R1R1
 R1R1
 R1R1
 R1R1
}
{B2= V100 
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16
}
{C2= V100
 R1R1
 R1R1
 R1R1
 R1R1
}

{A3= V100
 R1
}
{B3= V100
 R1
}
{C3= V100
 R1
}

{A4= V100
 R1
}
{B4= V100
 R1
}
{C4= V100
 R1
}

{D00= V127
 [F#8F#16F#16]32
 [F#8F#16F#16]32
 [F#8F#16F#16]31
 [F#16F#16F#16F#16]1
}
{D10= V100
 RF#
}
{D20= V100
 R1
}
{D30= V100
 R1
}
`;

//********** BGM 45 *********************

const bgm45Main = `
:1[
 @228 @V60P44 O4
 @E87,27,127,127
 {A0}
 {A1}
 {A2}
]

:2[
 @225 @V70 P64 O2
 @E117,27,117,117
 {B0}
 {B1}
 {B2}
]

:3[
 @227 @V35 P84 O5
 @E127,127,127,110 @MA37,2,8,0
 {C0}
 {C1}
 {C2}
]


:10[
 @266 @V90 P34 O4
 @E127,124,0,127 @MA127,127,0,0
 {D00}
]
:11[
 @310 @V55 P94 O5
 @E127,107,60,127 @MA10,52,3,0
 {D10}
]
:12[
 {D20}
]
:13[
 {D30}
]
`;

//================================================

const bgm46Macro = `
T150
{A0= V100 Q6
 RF#<C#>F#  G#.A.B
 R<C#DE     F#.E.D
 RF#<C#>F#  G#.A.B
 RBAG#      G#.F#.A
}
{B0= V100 Q4
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#9<E16E16  >F#8<D16D16 >F#8<D8>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
}
{C0= V100
 R1R1
 R1R1
 R1R1
 R1R1
}

{A1= V100
 RF#<C#>F#  G#.A.B
 R<C#DE     F#.E.D>
 RF#<C#>F#  G#.A.B
 RBAG#      G#.F#.R
}
{B1= V100 Q4
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
 F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16
   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>
}
{C1= V100
 RF#<C#>F#  G#.A.B
 R<C#DE     F#.E.D>
 RF#<C#>F#  G#.A.B
 RBAG       G#.F#.R
}

{A2= V100
 R1R1
 R1R1
 R1R1
 R1R1
}
{B2= V100 
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>
 F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16
   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16
}
{C2= V100
 R1R1
 R1R1
 R1R1
 R1R1
}

{A3= V100
 R1
}
{B3= V100
 R1
}
{C3= V100
 R1
}

{A4= V100
 R1
}
{B4= V100
 R1
}
{C4= V100
 R1
}


{D0I= V100 L4 
 [F#16]16
}
{D1I= V90 L4
 F#8R8 F#8R8 F#8R8 F#16F#16F#16F#16
}

{D00= V127
 [F#8F#16F#16]32
 [F#8F#16F#16]32
 [F#8F#16F#16]31
 [F#16F#16F#16F#16]1
}
{D10= V100
 RF#
}
{D20= V100
 R1
}
{D30= V100
 R1
}
`;

//********** BGM 46 *********************

const bgm46Main = `
:1R1[
 @228 @V65 P44 O4
 @E87,27,127,127
 {A0}
 {A1}
 {A2}
]

:2R1[
 @225 @V75 P64 O2
 @E117,27,117,117
 {B0}
 {B1}
 {B2}
]

:3R1[
 @227 @V40 P84 O5
 @E127,127,127,110 @MA37,2,8,0
 {C0}
 {C1}
 {C2}
]


:10
 @266 @V90 P34 O4
 @E127,124,0,127 @MA127,127,0,0
 {D0I}
[
 {D00}
]
:11
 @310 @V70 P94 O5
 @E127,107,60,127 @MA10,52,3,0
 {D1I}
[
 {D10}
]
:12[
 {D20}
]
:13[
 {D30}
]
`;

// ======================================================

const bgm47Macro = `
T90
//==================================
{A0= V100
 [R1]4
}
{B0= V100 L4
 [ CGFA# ]4
}
{C0= V100
 [R1]4
}

{A1= V100 L4
G2.A#4  A2.D#4 F1&F1
A#2.<D4 C2.>F4 G1&G2.C8D8
D#2G4 F2A#8F8 G2.&G2C8D8
D#2G4 F2D4 C2.&C2.

 
}
{B1= V100 L4
 [ CGFA# ]4
 [ CGFA# ]4
 [ CGF ]4
// [ CGF ]3 
 [ CGF ]3 C2.
}
{C1= V100
 [R1]4
 [R1]4
 [R2.]4
 [C2.]4
}

{REST=
 [R1]4
}
`;
//********** BGM 47 *********************

const bgm47Main = `
:1[
 @227 @V70 P94 O5
 @E127,64,64,127 @MA20,2,11,10
 {A0}
 {A1}
 {REST}
]

:2[
 @226 @V80 P64 O3
 @E127,64,64,127
 {B0}
 {B1}
 {REST}
]

:3[
 @228 @V75 P34 O2
 @E127,64,64,127
 {C0}
 {C1}
 {REST}
]
`;

// ======================================================

const bgm48Macro = ` 
T70
//==================================
{A0= V100 T70
 [R1]4
}
{B0= V100 L4
 [ CGFA# CGFD ]2
}
{C0= V100 
 [C4R4C4R4]4
}

{A1= V100 L4
 G2.A#4  A2.D#4 F1&F1
 A#2.<D4 C2.>F4 G1&G2.C8D8
 D#2G4 F2A#8F8 G2.&G2C8D8
 T65 D#2G4  T60 F2D4  T55C2 
 T50 C12  T45 F12  T40 G12  T30 <C2.
}
{B1= V100 L4
 CGFA# CGFD CGFA# CGFA#
 [ CGFA# ]4
 [ CGF ]4
 >[ CGF ]3 <C2.&C2.
}
{C1= V100
 [C4R4C4R4]4
 [C4R4C4R4]3 C4R4R4C8D8
 D#2G4 F2A#8F8 G2.&G2C8D8
 D#2G4 F2D4 C2C12F12G12 <C2.
}
`;

//********** BGM 48 *********************

const bgm48Main = `
:1
 @227 @V70 P94 O4 Q4
 @E127,94,4,90
 {A0}
 {A1}

:2
 @226 @V60 P64 O5 Q1
 @E127,64,4,90
 {B0}
 {B1}

:3
 @228 @V70 P34 O2 Q2
 @E127,64,4,90
 {C0}
 {C1}
`;
