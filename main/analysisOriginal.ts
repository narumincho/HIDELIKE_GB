let BGSX = 0;//BG STATUS
/** 隠しコマンドのデバッグモード */
let DEBUG2: boolean;
let EXS = 120, EXE = EXS + 160;//EDGE X
let EYS = 48, EYE = EYS + 144; //EDGE Y
/** プレイヤーの初期位置 Z座標 */
let PX = EXS + 16 * 1;
/** プレイヤーの初期位置 Y座標 */
let PY = EYS + 16 * 7 + 7;
/** プレイヤーの初期位置 Z座標? */
let PZ = 0;

// ここの条件分岐は常に通らない
if (DEBUG) {
 // BGSX=
 if(  BGSX==3  ){
  PX=EXS+16*5+8
  PY=EYS+16*7+7
 }
 if(  BGSX==7  ){
  PX=EXS+16*1+8
  PY=EYS+16*4+7
 }
 if(  BGSX==9  ){
  PX=EXS+16*1+8
  PY=EYS+16*3+7
 }
 if(  BGSX==10  ){
  PX=EXS+16*1+8
  PY=EYS+16*4+7
 }
 if(  BGSX==11  ){
  PX=EXS+16*1+8
  PY=EYS+16*7+7
 }
 if(  BGSX==12  ){
  PX=EXS+16*1+8
  PY=EYS+16*0+7
 }
 if(  BGSX==13  ){
  PX=EXS+16*1+8
  PY=EYS+16*0+7
 }
 if(  BGSX==14  ){
  PX=EXS+16*1+8
  PY=EYS+16*0+7
 }
 if(  BGSX==15  ){
  PX=EXS+16*1+8
  PY=EYS+16*7+7
 }
 if(  BGSX==18  ){
  PX=EXS+16*8+8
  PY=EYS+16*4+7
 }
 if(  18<BGSX  ){
  PX=EXS+16*8+12
  PY=EYS+16*4+7
 }
}


INIT();
/** メインループで1ずつ加算させるカウント */
let MCNT=0
OP();

while (true) { // MAIN LOOP
  VSYNC(1);
  MCNT += 1;
  INPUT_BUTTON_STICK_TOUCH();
  BG();
  PLAYER();
  ENEMY();
    if (DEBUG2 && BGSX < 19) { DEBUG() }
}

//============================================
const INIT = () => {

  INITIALIZE()// 初期化
  EFCOFF()
  XSCREEN(3, 500, 4)
  FONTINIT()// フォント読み込み
  //===========================================
  
  //* BG
  let BGW, BGH    // 読み込んだBGのサイズ
  let ATR = new Array(32 * 32);// BGキャラ アトリビュート用
  let BGX, BGY, BGZ = 100;
  let BG_MAX = 22;

  //* @INPUT_BUTTON_STICK_TOUCH
  let BTN, SX, SY, EXX, EXY;
  let STTM, TX, TY;//TX=5~314,TY=5~234
  let DU = false;
  let DD = false, DL = false, DR = false, BA = false, BB = false, BX = false, BY = false, BL = false, BR = false, ZL = false, ZR = false;
  let PTDU = false, PTDD = false, PTDL = false, PTDR = false, PTBA = false, PTBB = false, PTBX = false, PTBY = false, PTBL = false, PTBR = false, PTZL = false, PTZR = false;
  let MOVEPLAY_L = 0.4;//*スライドパッド      にゅうりょく の あそび
  let MOVEPLAY_R = 0.3;//*かくちょうスライドパッド にゅうりょく の あそび

  //let I,J

  //GB...160*144 (16*10,16*9)
  //SPCLIP   EXS,EYS,EXE,EYE
  //BGCLIP 0,EXS,EYS,EXE,EYE
  BGX = -EXS; BGY = -EYS

  //let SE_MAPCHANGE_L=2
  //let SE_MAPCHANGE_R=3



  const SPNUM_PB = 10
  const SPNUM_ENEMY = 100


  //*PLAYER
  //let PX=16*10,PY=16*10+7,PZ=0//INIT PLACE
  //let PX=EXS+16*2+8,PY=EYS+16*7+7,PZ=0//INIT PLACE
  let SSCL = 1;//SCALE
  let PMV = 2;//MOVE VALUE
  let PMF = 2;//MOVE FREQUENCY
  let PZB = -10;
  /** 影を生成できる最大の数 */
  let PBM = 3;
  let PBF = new Array(PBM);
  let PBX = new Array(PBM);
  let PBY = new Array(PBM);
  let PBDX = new Array(PBM);
  let PBDY = new Array(PBM);


  //*ENEMY
  let ENEMY_MAX = 90 - 1
  let ECHK = new Array(SPNUM_ENEMY + ENEMY_MAX);
  let ENX = new Array(SPNUM_ENEMY + ENEMY_MAX);
  let ENY = new Array(SPNUM_ENEMY + ENEMY_MAX);


  let PDX = 1, PDY = 0;
  let PBNUM = 0;
  let GBNUM = 0;
  let MAPCP = 0;
  let F_ENEMOVE = 0;
  let F_ENECNG = 0;
  let CLEARTIME = 0;
  let SCORE_T;
  let SCORE_B;
  let SCORE_F;

  //

  //BREPEAT 2,0,10
  //BREPEAT 3,0,10

  LOAD("GRP4:HIDEL_GBSP.GRP", false); // スプライト画像の読み込み
  LOAD("GRP5:HIDEL_GBBG.GRP", false); // BG画像の読み込み
  for (let i = 0; i <= 3; i++) {
    BGHIDE(i);
  }
  LOADBG("DAT:HIDEL_GBMAP")
  for (let i = 0; i <= 2; i++) {
    BGOFS(i, BGX, BGY, BGZ)
  }
  for (let i = 0; i <= 2; i++) {
    BGSHOW(i);
  }
  BACKCOLOR(-1)

  //=== SP SET====================

  //GPRIO -256
  //GFILL 0,EYS,EXS,EYE,BK
  //GFILL 0,0,400,EYS,BK
  //GFILL EXE,EYS,400,EYE,BK
  //GFILL 0,EYE,400,240,BK

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
  let GBT0 = RGB(0, 0, 0);
  let GBT1 = RGB(8 * 10, 8 * 10, 8 * 10);
  let GBT2 = RGB(8 * 20, 8 * 20, 8 * 20);
  let GBT3 = RGB(255, 255, 255);
  SPCOLOR(96, GBT0);
  SPOFS(96, EXS, EYS, -255);
  SPHIDE(96);

  //*GB GREEN
  SPDEF(97, 0, 16 * 6, 16, 16);
  SPSET(97, 96);
  SPSCALE(97, 10, 9);
  SPCOLOR(97, RGB(70, 0, 225, 0));
  SPOFS(97, EXS, EYS, -256)
  SPHIDE(97)
  let F_GBGREEN = 0;

  //*GBわく
  SPDEF(99, 512 - 400 - 8, 0, 400, 240);
  SPSET(99, 99);
  SPOFS(99, 0, 0, -250);

  //*PLAYER
  SPDEF(1500 + I, 16 * I, 0, 16, 16, 8, 8);
  SPSET(0, 1500);
  SPHOME(0, 8, 8);
  SPCOL(0, -8, -8, 16, 16, true, 0xFFFFFFF0);
  SPANIM(0, "UV", [
    [16, 00, 0],
    [16, 16, 0],
    [16, 32, 0],
    [16, 48, 0],
    [16, 64, 0],
    [16, 16, 0],
    [16, 32, 0],
    [16, 48, 0]

  ], 0);

  //*PLAYER_BULLET
  for (let i = 0; i < PBM; i++) {
    SPDEF(1600 + I, 16 * I, 16 * 5, 16, 16, 8, 8);
    SPSET(SPNUM_PB + I, 1600);
    SPHOME(SPNUM_PB + I, 8, 8);
    SPCOL(SPNUM_PB + I, -8, -8, 16, 16, true, 0xFFFFFFF0);
    SPHIDE(SPNUM_PB + I);
  }

  //*ENEMY
  for (let i = 0; i < 10; i++) {
    SPDEF(1700 + I, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [90, 00, 192],
      [16, 16, 192],
      [90, 00, 192],
      [16, 16, 192],
      [90, 00, 192],
      [90, 16, 192],
      [16, 32, 192],
      [16, 48, 192],
      [16, 32, 192],
      [16, 48, 192],
      [32, 32, 192]
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let i = 10; i < 20; i++) {
    SPDEF(1700 + I, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [16, 00, 208],
      [16, 16, 208],
      [16, 32, 208],
      [16, 48, 208]
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let i = 20; i < 30; i++) {
    SPDEF(1700 + I, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [16, 00, 128],
      [16, 16, 128],
      [16, 32, 128],
      [16, 48, 128]
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let i = 30; i < 40; i++) {
    SPDEF(1700 + I, 0, 16 * 10, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [16, 00, 160]
      [16, 16, 160]
      [16, 32, 160]
      [16, 48, 160]
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let i = 40; i < 50; i++) {
    SPDEF(1700 + I, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700)
    SPHOME(SPNUM_ENEMY + I, 8, 8)
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF)
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [60, 00, 336],
      [16, 16, 336],
      [16, 32, 336],
      [16, 48, 336]
    ], 0)
    if (44 < I) {
      SPANIM(SPNUM_ENEMY + I, "XY+", -16, 16, 0, 2);
    }
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let I = 50; i < 60; i++) {
    SPDEF(1700 + I, 0, 16 * 20, 16, 16, 8, 8)
    SPSET(SPNUM_ENEMY + I, 1700)
    SPHOME(SPNUM_ENEMY + I, 8, 8)
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [60, 00, 320],
      [16, 16, 320],
      [16, 32, 320],
      [16, 48, 320]
  
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let I = 60; i < 70; i++) {
    SPDEF(1700 + I, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [60, 00, 368],
      [16, 16, 368],
      [16, 32, 368],
      [16, 48, 368]
  
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let i = 70; i < 80; i++) {
    SPDEF(1700 + I, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [60, 00, 352],
      [16, 16, 352],
      [16, 32, 352],
      [16, 48, 352]
  
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }
  for (let i = 80; i < 90; i++) {
    SPDEF(1700 + I, 0, 16 * 20, 16, 16, 8, 8);
    SPSET(SPNUM_ENEMY + I, 1700);
    SPHOME(SPNUM_ENEMY + I, 8, 8);
    SPCOL(SPNUM_ENEMY + I, -1, -1, 2, 2, true, 0xFFFFFFFF);
    SPANIM(SPNUM_ENEMY + I, "UV", [
      [16, 00, 416],
      [16, 16, 416],
      [16, 32, 416],
      [16, 48, 416]
  
    ], 0);
    SPHIDE(SPNUM_ENEMY + I);
  }

  const SPNUM_FOUND = 300;
  //* FOUND!
  SPDEF(2000, 0, 16 * 7, 16, 16);
  SPSET(SPNUM_FOUND, 2000);
  SPHOME(SPNUM_FOUND, 8, 8);
  let FOUNDCNT = 0;


  //
  //*ユーザーていぎ がっきおん(@224~255)
  let WAVE$ = new Array(56);

  //@224_さんこうURL(http://www.blog.nshdot.com/2012/09/blog-post.html)
  //@224~239_さんこうURL(http://wikiwiki.jp/mck/?%C7%C8%B7%C1%C4%EA%B5%C1)
  //@240_さんこうURL(http://dic.nicovideo.jp/p/mml/185074)


  //@ファミコン さんかくは
  //WAVE1$=""
  //FOR I=0 TO 63
  // V=FLOOR(I/2)*2*8
  // if(  V<-127  ){ V=-127
  // if(  127<V  ){ V=127
  // U$=HEX$(V,2)
  // WAVE1$=WAVE1$+U$
  //NEXT
  WAVE$[24] = "000010102020303040405050606070707F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F7F";
  WAVSET(224, 127, 0, 127, 123, WAVE$[24], 69 - 12 * 2);
  //@N106くけいは 12.5%
  WAVE$[25] = "FF00000000000000FF00000000000000";
  WAVSET(225, 127, 0, 127, 123, WAVE$[25], 69 - 12 * 2);
  //@N106くけいは 25.0%
  WAVE$[26] = "FFFF000000000000FFFF000000000000"
  WAVSET(226, 127, 0, 127, 123, WAVE$[26], 69 - 12 * 2);
  //@N106くけいは 50.0%
  WAVE$[27] = "FFFFFFFF00000000FFFFFFFF00000000"
  WAVSET(227, 127, 0, 127, 123, WAVE$[27], 69 - 12 * 2);
  //@N106くけいは 75.0% ( 25.0%と おなじおと )
  WAVE$[28] = "FFFFFFFFFFFF0000FFFFFFFFFFFF0000"
  WAVSET(228, 127, 0, 127, 123, WAVE$[28], 69 - 12 * 2);
  //@N106さんかくは(Cトラック)
  WAVE$[29] = "02468ACEFDB9753102468ACEFDB97531"
  WAVSET(229, 127, 0, 127, 123, WAVE$[29], 69 - 12 * 2);
  //@N106さんかくは(Cトラック) その2
  WAVE$[30] = "0123456789ABCDEFFEDCBA9876543210"
  WAVSET(230, 127, 0, 127, 123, WAVE$[30], 69 - 12 * 3);
  //@N106さんかくは うえスライス
  WAVE$[31] = "0123456789AAAAAAAAAAAA9876543210"
  WAVSET(231, 127, 0, 127, 123, WAVE$[31], 69 - 12 * 3);
  //@N106ノコギリは
  WAVE$[32] = "0123456789ABCDEF0123456789ABCDEF"
  WAVSET(232, 127, 0, 127, 123, WAVE$[32], 69 - 12 * 2);
  //@N106ノコギリは その2
  WAVE$[33] = "00112233445566778899AABBCCDDEEFF"
  WAVSET(233, 127, 0, 127, 123, WAVE$[33], 69 - 12 * 3);
  //@N106ノコギリは はんぶんだけ
  WAVE$[34] = "0123456789ABCDEF0000000000000000"
  WAVSET(234, 127, 0, 127, 123, WAVE$[34], 69 - 12 * 3);
  //@N106ベル
  WAVE$[35] = "0A9A9ABA8FAD478979874EAF8ABA9B9A"
  WAVSET(235, 127, 0, 127, 123, WAVE$[35], 69 - 12 * 2);
  //@N106クワイア
  WAVE$[36] = "001258BDEFFEEDCBAABCDEFFEDB85210"
  WAVSET(236, 127, 0, 127, 123, WAVE$[36], 69 - 12 * 3);
  //@N106フルート
  WAVE$[37] = "0001235AEFEDB9875789BDEFEA532100"
  WAVSET(237, 127, 0, 127, 123, WAVE$[37], 69 - 12 * 3);
  //@N106エセ エレキベース
  WAVE$[38] = "4A27F016FB53D69C4A27F016FB53D69C"
  WAVSET(238, 127, 0, 127, 123, WAVE$[38], 69 - 12 * 2);
  //@N106オルガン
  WAVE$[39] = "BF9D5A98765A2604BF9D5A98765A2604"
  WAVSET(239, 127, 0, 127, 123, WAVE$[39], 69 - 12 * 2);
  //@さんかくは
  WAVE$[40] = "89ABCDEFFEDCBA987654321001234567"
  WAVSET(240, 127, 0, 127, 123, WAVE$[40], 69 - 12 * 3);
  //@こもった ベル
  WAVE$[41] = "0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A0A9A9ABA8FAD478979874EAF8ABA9B9A"
  WAVSET(241, 127, 0, 127, 123, WAVE$[41], 69 - 12 * -2);
  //@われたかんじ/さんかくは(?)
  WAVE$[42] = "AFAFAFAFFFFFFFF7F7FF7F7FDFFFFFDFFDFFFFFFFFFFFDCDEFD05FF78889999F";
  WAVSET(242, 127, 0, 127, 123, WAVE$[42], 69 - 12 * 2);
  //@シンプル/ききやすい
  WAVE$[43] = "00112233445566778899AABBCCDDEEFF";
  WAVSET(242, 127, 0, 127, 123, WAVE$[43], 69 - 12 * 2);
  //@
  //WAVE$[44]="
  //WAVSET 242, 127,0,127,123,WAVE$[44],69-12*2

  //
  let PBGM = -1;
  /** BGMPLAY MAINBGM TRACK */
  let MBGMT = 1;
  /** //BGMPLAY SE TRACK START(N~7) */
  let BGMT = 2;

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
  BGMSET(PLAYER_BULLET_CLEAR, "@310 T220 L8 Q8 @V120 V120 P64 O5 @E20,127,127,107 C");
  BGMSET(PLAYER_BULLET_CANNOT, " @228 @V77 P64 O4 @D-108 @E127,117,0,127 @MP127,5,100,0 B16B16");
  BGMSET(MAPCHANGE_L, " @227 T140 L4 Q2 @V100 V90 P64 O4C32<C32");
  BGMSET(MAPCHANGE_R, " @227 T140 L4 Q2 @V100 V90 P64 O5C32<C32");
  BGMSET(FOUND, " @228 T120 L4 Q8 @V100 V60 P64 O5 @E127,127,127,127 @MA127,112,107,1 F32A#32<D#");
  BGMSET(MAPCHANGE_LAST, " @227 T70 L4 Q2 @V100 V90 P64 O5C32R8<C32");

  BGMSETD(BGM0, "@BGM43");
  BGMSETD(BGM1, "@BGM44");
  BGMSETD(BGM2, "@BGM45");
  BGMSETD(BGM3, "@BGM46");
  BGMSETD(BGM_OP, "@BGM47");
  BGMSETD(BGM_ED, "@BGM48");

}
//============================================





const OP = () => {
  SPSHOW(80);
  SPSHOW(81);
  BGMPLAY(MBGMT, BGM_OP);
  GPRIO(-1);
  GPUTCHR(EXS, EYS + 16 * 8 + 8, "   2015     Rwiiug", 1, 1, GBT3);
  GPUTCHR(EXS + 6, EYS + 16 * 8 + 8, "          @       ", 1, 1, GBT3);
  while (true) {
    VSYNC(1);
    INPUT_BUTTON_STICK_TOUCH();
    if ((BUTTON(0) & 16)) { break } //A
  }
  BGMSTOP(MBGMT, 2);
  SE(MAPCHANGE_R);
  SPSHOW(96)
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
  
  DEF__BGMCHANGE()
  DEF__MAPCHANGE_CLEAR()
  DEF__ENEMY_SET();
}





const DEBUG = () => {
  COLOR(15, 1);
  LOCATE(0, 0, -256);
  GPRIO(-256);
  LOCATE(0, 0, -256);
  PRINT("MAP" + BGSX);
  //LOCATE 0,28:?FORMAT$("%02D",(MCNT/216000))+":"+FORMAT$("%02D",((MCNT/3600)MOD 60))+":"+FORMAT$("%02D",((MCNT/60)MOD 60))
 
  //FOR I=0 TO 100
  //if(  SPHITSP(0,SPNUM_ENEMY+I)  ){ BEEP
  //NEXT
 
  for (let i = SPNUM_ENEMY; i < SPNUM_ENEMY + ENEMY_MAX; i++) {
    if (i - SPNUM_ENEMY < 10) {  //DOWN
      GFILL(ENX[i] - 2, ENY[i], ENX[i] + 2, 400, 0xFFFF0000)
    } else if (I - SPNUM_ENEMY < 20) {//UP
      GFILL(ENX[I] - 2, 0, ENX[I] + 2, ENY[I], 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 30) {//LEFT
      GFILL(0, ENY[I] - 2, ENX[I], ENY[I] + 2, 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 40) {//RIGHT
      GFILL(ENX[I], ENY[I] - 2, 400, ENY[I] + 2, 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 50) {//DOWN
      GFILL(ENX[I] - 2, ENY[I], ENX[I] + 2, 400, 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 60) {//UP
      GFILL(ENX[I] - 2, 0, ENX[I] + 2, ENY[I], 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 70) {//LEFT
      GFILL(0, ENY[I] - 2, ENX[I], ENY[I] + 2, 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 80) {//RIGHT
      GFILL(ENX[I], ENY[I] - 2, 400, ENY[I] + 2, 0xFFFF0000);
    } else if (I - SPNUM_ENEMY < 90) {//4
      GFILL(ENX[I] - 2, ENY[I], ENX[I] + 2, 400, 0xFFFF0000);
      GFILL(ENX[I] - 2, 0, ENX[I] + 2, ENY[I], 0xFFFF0000);
      GFILL(0, ENY[I] - 2, ENX[I], ENY[I] + 2, 0xFFFF0000);
      GFILL(ENX[I], ENY[I] - 2, 400, ENY[I] + 2, 0xFFFF0000);
    }
  }
 
  GFILL(PX - 1, PY - 1, PX + 1, PY + 1, 0xFF00FFFF);
  for (let i = 0; i < PBM; i++) {
    GFILL(PBX[I] - 0, PBY[I] - 8, PBX[I] + 0, PBY[I] + 8, 0xFF00FF00);
    GFILL(PBX[I] - 8, PBY[I] - 0, PBX[I] + 7, PBY[I] + 0, 0xFF00FFFF);
  }
 
 
  for (let i = 0; i < 3; i++) {
    BGOFS(I, BGX + (BGSX * 160), BGY);
  }
 
  if (!(MAINCNT % 2)) {
    GCLS()
  }
}




/** 敵が自分を見ていないか調べ、見ていたらゲームオーバーに飛ぶようにしている */
const ENEMY = () => {
  let F_GAOV = false;
 
  // 敵それぞれに対して 敵がプレイヤーを見ていないか調べている
  for (let i = SPNUM_ENEMY; i < SPNUM_ENEMY + ENEMY_MAX; i++) {
    if (!(ECHK[I])) { continue; }
    if (I - SPNUM_ENEMY < 10) {
      if (PY > ENY[I] && ENX[I] < PX + 2 && PX - 2 < ENX[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; PBM; J++) {
          if (PBF[J] && PBY[J] > ENY[I] - 11 && PY > PBY[J] - 4) {//BOX HIDE
            if (PBX[J] - 8 < ENX[I] && ENX[I] < PBX[J] + 8) {
              F_GAOV = false
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
      
      
    } else if (I - SPNUM_ENEMY < 20) {
      if (PY < ENY[I] && ENX[I] < PX + 2 && PX - 2 < ENX[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] < ENY[I] + 2 && PY < PBY[J] + 3) {//BOX HIDE
            if (PBX[J] - 8 < ENX[I] && ENX[I] < PBX[J] + 8) {
              F_GAOV = false
            }
          }
        }
        if (F_GAOV) {
          GAMEOVER()
        }
      }
      
      
    } else if (I - SPNUM_ENEMY < 30) {
      if (PX < ENX[I] && ENY[I] < PY + 2 && PY - 2 < ENY[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] < ENX[I] + 6 && PX < PBX[J] + 6) {//BOX HIDE
            if (PBY[J] - 8 < ENY[I] && ENY[I] < PBY[J] + 8) {
              F_GAOV = false
            }
          }
             
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
      
    } else if (I - SPNUM_ENEMY < 40) {
      if (ENX[I] < PX && ENY[I] < PY + 2 && PY - 2 < ENY[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] > ENX[I] - 6 && PX > PBX[J] - 5) {//BOX HIDE
            if (PBY[J] - 8 < ENY[I] && ENY[I] < PBY[J] + 8) {
              F_GAOV = false
            }
          }
             
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
     
     
    } else if (I - SPNUM_ENEMY < 50) {
      if (PY > ENY[I] && ENX[I] < PX + 2 && PX - 2 < ENX[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] > ENY[I] - 11 && PY > PBY[J] - 4) {//BOX HIDE
            if (PBX[J] - 8 < ENX[I] && ENX[I] < PBX[J] + 8) {
              F_GAOV = false;
            }
          }
             
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
      
      
    } else if (I - SPNUM_ENEMY < 60) {
      if (PY < ENY[I] && ENX[I] < PX + 2 && PX - 2 < ENX[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] < ENY[I] + 2 && PY < PBY[J] + 3) {//BOX HIDE
            if (PBX[J] - 8 < ENX[I] && ENX[I] < PBX[J] + 8) {
              F_GAOV = false
            }
          }
             
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
      
      
    } else if (I - SPNUM_ENEMY < 70) {
      if (PX < ENX[I] && ENY[I] < PY + 2 && PY - 2 < ENY[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] < ENX[I] + 6 && PX < PBX[J] + 6) {//BOX HIDE
            if (PBY[J] - 8 < ENY[I] && ENY[I] < PBY[J] + 8) {
              F_GAOV = false
            }
          }
   
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
      
      
    } else if (I - SPNUM_ENEMY < 80) {
      if (ENX[I] < PX && ENY[I] < PY + 2 && PY - 2 < ENY[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] > ENX[I] - 6 && PX > PBX[J] - 5) {//BOX HIDE
            if (PBY[J] - 8 < ENY[I] && ENY[I] < PBY[J] + 8) {
              F_GAOV = false
            }
          }
   
        }
        if (F_GAOV) {
          GAMEOVER();
        }
      }
      
      
    } else if (I - SPNUM_ENEMY < 90) {
      if (PY > ENY[I] && ENX[I] < PX + 2 && PX - 2 < ENX[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] > ENY[I] - 11 && PY > PBY[J] - 4) {//BOX HIDE
            if (PBX[J] - 8 < ENX[I] && ENX[I] < PBX[J] + 8) {
              F_GAOV = false
            }
          }
        }
        if (F_GAOV) { GAMEOVER() }
      } else if (PY < ENY[I] && ENX[I] < PX + 2 && PX - 2 < ENX[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBY[J] < ENY[I] + 2 && PY < PBY[J] + 3) {//BOX HIDE
            if (PBX[J] - 8 < ENX[I] && ENX[I] < PBX[J] + 8) {
              F_GAOV = false
            }
          }
   
        }
        if (F_GAOV) { GAMEOVER() }
      } else if (PX < ENX[I] && ENY[I] < PY + 2 && PY - 2 < ENY[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] < ENX[I] + 6 && PX < PBX[J] + 6) {//BOX HIDE
            if (PBY[J] - 8 < ENY[I] && ENY[I] < PBY[J] + 8) {
              F_GAOV = false
            }
          }
        }
        if (F_GAOV) { GAMEOVER() }
      } else if (ENX[I] < PX && ENY[I] < PY + 2 && PY - 2 < ENY[I]) {//ENEMY_SEARCH RANGE
        F_GAOV = true;
        for (let J = 0; J < PBM; J++) {
          if (PBF[J] && PBX[J] > ENX[I] - 6 && PX > PBX[J] - 5) {//BOX HIDE
            if (PBY[J] - 8 < ENY[I] && ENY[I] < PBY[J] + 8) {
              F_GAOV = false
            }
          }
   
        }
        if (F_GAOV) { GAMEOVER() }
      }
      
      
    }
   
  }
  if (F_ENEMOVE) {
    DEF__ENEMY_MOVE (BGSX)
  }
  if (F_ENECNG) {
    DEF__ENEMY_CHANGE(BGSX);
  }
}

/** 敵に見つかったときの処理をしている */
const GAMEOVER = () => {
  SPOFS(SPNUM_FOUND, ENX[I], MAX(EYS, ENY[I] - 14));
  SE(FOUND);
  FOUNDCNT += 1;
  WAIT(30);
 
  DEF__MAPCHANGE_CLEAR();
  DEF__ENEMY_SET();
  SPOFS(SPNUM_FOUND, -99, -99);
 
  /** プレイヤーを各ステージに初期位置に移動させている */
  if (BGSX == 0) {
    PX = EXS + 16 * 2 + 8; PY = EYS + 16 * 7 + 7
  }
  if (BGSX == 1) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 1 + 7
  }
  if (BGSX == 2) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 7 + 7
  }
  if (BGSX == 3) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 4 + 7
  }
  if (BGSX == 4) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 7 + 7
  }
  if (BGSX == 5) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 7 + 7;
  }
  if (BGSX == 6) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 1 + 2
  }
  if (BGSX == 7) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 4 + 7
  }
  if (BGSX == 8) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 4 + 7
  }
  if (BGSX == 9) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 3 + 7
  }
  if (BGSX == 10) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 4 + 7
  }
  if (BGSX == 11) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 7 + 7
  }
  if (BGSX == 12) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 0 + 7
  }
  if (BGSX == 13) {
    if (MAPCP == 2) {
      PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 0 + 7
    }
    if (MAPCP == 4) {
      PX = EXS + 16 * 8 + 8; PY = EYS + 16 * 6 + 7
    }
  }
  if (BGSX == 14) {
    if (MAPCP == 2) {
      PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 0 + 7
    }
    if (MAPCP == 8) {
      PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 8 + 7
    }
  }
  if (BGSX == 15) {
    PX = EXS + 16 * 1 + 8; PY = EYS + 16 * 7 + 7
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
 
  if (BGSX == 6) {
    DEF__ESE(SPNUM_ENEMY + 22, EXS + 16 * 2 + 10, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 21, EXS + 16 * 2 + 10, EYS + 16 * 5 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 23, EXS + 16 * 8 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 00, EXS + 16 * 7 + 8, EYS + 16 * 1 + 8, 0);
  }
 
  //if(  BGSX==7  ){
  
  //}
 
  if (BGSX == 8) {
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 7 + 8, EYS + 16 * 1 + 8, 0);
  }
 
  if (BGSX == 9) {
    F_ENEMOVE = false;
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 5 + 8, EYS + 16 * 0 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 50, EXS + 16 * 8 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 60, EXS + 16 * 8 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 70, EXS + 16 * 0 + 8, EYS + 16 * 7 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 71, EXS + 16 * 3 + 8, EYS + 16 * 4 + 8, 0);
  }
 
  if (BGSX == 10) {
    F_ENEMOVE = true;
    DEF__ESE(SPNUM_ENEMY + 45, EXS + 16 * 6, EYS + 16 * 0 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 55, EXS + 16 * 5, EYS + 16 * 8 + 8, 0);
  }
 
  if (BGSX == 11) {
    F_ENEMOVE = true
    DEF__ESE(SPNUM_ENEMY + 65, EXS + 16 * 9 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 55, EXS + 16 * 5 + 8, EYS + 16 * 8 + 8, 0);
  }
 
  if (BGSX == 12) {
    F_ENEMOVE = false;
    F_ENECNG = false;

    DEF__ESE(SPNUM_ENEMY + 80, EXS + 16 * 5 + 8, EYS + 16 * 4 + 8, 0);
  }
 
  if (BGSX == 13) {
    F_ENEMOVE = false;
    F_ENECNG = true;
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 5 + 8, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 61, EXS + 16 * 3 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 42, EXS + 16 * 2 + 8, EYS + 16 * 6 + 8, 0);
  }
 
  if (BGSX == 14) {
    F_ENEMOVE = true;
    F_ENECNG = false;
    DEF__ESE(SPNUM_ENEMY + 65, EXS + 16 * 8 + 8, EYS + 16 * 3 + 8, 0);
  }
 
  if (BGSX == 15) {
    F_ENEMOVE = false;
    F_ENECNG = true;
    DEF__ESE(SPNUM_ENEMY + 40, EXS + 16 * 2 + 8, EYS + 16 * 1 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 41, EXS + 16 * 4 + 8, EYS + 16 * 3 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 62, EXS + 16 * 6 + 8, EYS + 16 * 4 + 8, 0);
    DEF__ESE(SPNUM_ENEMY + 63, EXS + 16 * 8 + 8, EYS + 16 * 6 + 4, 0);
  }
 
}



const DEF__ENEMY_MOVE = (BGSX:number):void => {
 
  if (BGSX == 10) {
    ENX[SPNUM_ENEMY + 45] = EXS + 16 * 6 + (SIN(RAD(MCNT)) * ((16 * 3) - 8))
    ENX[SPNUM_ENEMY + 55] = EXS + 16 * 5 + (COS(RAD(MCNT)) * ((16 * 3) - 8))
    SPOFS(SPNUM_ENEMY + 45, ENX[SPNUM_ENEMY + 45], ENY[SPNUM_ENEMY + 45]);
    SPOFS(SPNUM_ENEMY + 55, ENX[SPNUM_ENEMY + 55], ENY[SPNUM_ENEMY + 55]);
  }
 
  if (BGSX == 11) {
    ENY[SPNUM_ENEMY + 65] = EYS + 16 * 4 + 6 + (SIN(RAD(MCNT / 2)) * ((16 * 2)))
    ENX[SPNUM_ENEMY + 55] = EXS + 16 * 5 + 8 + (COS(RAD(MCNT)) * ((16 * 3)))
    SPOFS(SPNUM_ENEMY + 65, ENX[SPNUM_ENEMY + 65], ENY[SPNUM_ENEMY + 65]);
    SPOFS(SPNUM_ENEMY + 55, ENX[SPNUM_ENEMY + 55], ENY[SPNUM_ENEMY + 55]);
  }
 
  if (BGSX == 14) {
    ENY[SPNUM_ENEMY + 65] = EYS + 16 * 3 + 8 + (SIN(RAD(MCNT * 1.5)) * ((16 * 3) - 12))
    SPOFS(SPNUM_ENEMY + 65, ENX[SPNUM_ENEMY + 65], ENY[SPNUM_ENEMY + 65]);
  }
}



const DEF__ENEMY_CHANGE = (BGSX:number):void => {
  let R = 0;
 
  if (BGSX == 13) {
    if (!(MCNT % 60)  ) {
      DEF__MAPCHANGE_CLEAR
      R = (RND(4))
      R = SPNUM_ENEMY + 40 + (R * 10)
      DEF__ESE(R, EXS + 16 * 5 + 8, EYS + 16 * 3 + 8, 0);
    }
  
    if (!(MCNT % 60)  ) {
      //DEF__MAPCHANGE_CLEAR
      R = 0
      while (R == 0 || R == 3) {
        R = (RND(4));
      }
      R = SPNUM_ENEMY + 41 + (R * 10);
      DEF__ESE(R, EXS + 16 * 3 + 8, EYS + 16 * 4 + 8, 0);
    }
   
    if (!(MCNT % 60)  ) {
      // DEF__MAPCHANGE_CLEAR
      R = 1
      while (R == 1 || R == 3) {
        R = (RND(4));
      }
      R = SPNUM_ENEMY + 42 + (R * 10)
      DEF__ESE(R, EXS + 16 * 2 + 8, EYS + 16 * 6 + 8, 0);
      R = 0;
    }
  
    R = SPNUM_ENEMY + 43 + (3 * 10)
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 - 8, 0);
    R = SPNUM_ENEMY + 44 + (3 * 10)
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 - 4, 0);
    R = SPNUM_ENEMY + 45 + (3 * 10)
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 + 0, 0);
    R = SPNUM_ENEMY + 46 + (3 * 10)
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 + 4, 0);
    R = SPNUM_ENEMY + 47 + (3 * 10)
    DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 4 + 8, 0);
  }
 
 
 
  let N = 0;
  if (BGSX == 15) {
  
    R = 1;
    if (!(MCNT % 45)  ) {
      DEF__MAPCHANGE_CLEAR
      while (R == 1) {
        R = (RND(4));
      }
      R = SPNUM_ENEMY + 40 + N + (R * 10)
      DEF__ESE(R, EXS + 16 * 2 + 8, EYS + 16 * 1 + 8, 0);
      N += 1;
    }
  
    R = 0;
    if (!(MCNT % 45)  ) {
      R = (RND(4))
      R = SPNUM_ENEMY + 40 + N + (R * 10)
      DEF__ESE(R, EXS + 16 * 4 + 8, EYS + 16 * 3 + 8, 0);
      N += 1;
    }
  
    R = 0;
    if (!(MCNT % 45)  ) {
      R = (RND(4))
      R = SPNUM_ENEMY + 40 + N + (R * 10)
      DEF__ESE (R, EXS + 16 * 6 + 8, EYS + 16 * 4 + 8, 0)
      N += 1;
    }

    R = 3;
    if (!(MCNT % 45)  ) {
      while (R == 3) {
        R = (RND(4));
      }
      R = SPNUM_ENEMY + 40 + N + (R * 10)
      DEF__ESE(R, EXS + 16 * 8 + 8, EYS + 16 * 6 + 4, 0);
      N += 1;
    }
  }
}


/**
 * スプライトを表示して移動して、各種データの配列を更新する
 * @param num 管理番号
 * @param x X座標
 * @param y Y座標
 * @param z Z座標
 */
const DEF__ESE = (num:number, x:number, y:number, z:number) => {
  SPSHOW(num);
  ECHK[num] = true;
  SPOFS (num, x, y, z)
  ENX[num] = x;
  ENY[num] = y;
}





const CREDIT = ()=> {
 
 
 let F_END
 if(  F_END==0  ){
  GCLS()
    LOCATE (0, 0);
   PRINT("     ");
  GPRIO (-256)
   CLEARTIME = MCNT;
 }
 
 if(  BGSX==19  ){ 
   if (F_END == 0) {
     F_END = 1;
   }
   if (F_END == 1) {
     GCLS();
     SPSHOW(96);
     SPCOLOR(96, RGB(50, 255, 255, 255));
     GFILL(EXS, EYS, EXE - 1, EYS + 16 * 3, GBT0);
     GFILL(EXS, EYE, EXE - 1, EYE - 16 * 3, GBT0);
     GPUTCHR(EXS + 16, EYS + 16 * 1, "[] Clear Time  ", 1, 1, RGB(255, 255, 255));
     GPUTCHR(EXS + 16, EYS + 16 * 2, "    " + FORMAT$("%02D", (MCNT / 216000)) + ":" + FORMAT$("%02D", ((MCNT / 3600) % 60)) + ":" + FORMAT$("%02D", ((MCNT / 60) % 60)), 1, 1, RGB(255, 255, 255));
     GPUTCHR(EXS + 16, EYE - 16 * 2, "[] Box   : " + STR$(GBNUM), 1, 1, RGB(255, 255, 255));
     GPUTCHR(EXS + 16, EYE - 16 * 1, "[!] Found : " + STR$(FOUNDCNT), 1, 1, RGB(255, 255, 255));
     F_END += 1;
   }
 }
 
 if(  BGSX==20  ){ 
  if (F_END == 1) { F_END = 2 }
  if(  F_END==2  ){
   GCLS()
   SPSHOW(96)
    SPCOLOR(96, RGB(70, 255, 255, 255));
    GFILL(EXS, EYS, EXE - 1, EYS + 16 * 2, GBT1);
    GFILL(EXS, EYE, EXE - 1, EYE - 16 * 2, GBT1);
    GPUTCHR(EXS + 8, EYS + 14, "    - Creator -    ", 1, 1, RGB(255, 255, 255));
    GPUTCHR(EXS + 10, EYE - 16, "Rwiiug(RWIIUG0129)", 1, 1, RGB(255, 255, 255));
    F_END += 1;
  }
 }
 
 if(  BGSX==21  ){ 
   if (F_END == 2) { F_END = 3 }
  if(  F_END==3  ){
   GCLS()
   SPSHOW(96)
    SPCOLOR(96, RGB(180, 255, 255, 255));
    GFILL(EXS, EYS, EXE - 1, EYS + 16 * 1, GBT1);
    GFILL(EXS, EYE, EXE - 1, EYE - 16 * 1, GBT1);
    GPUTCHR(EXS + 8, EYS + 5, "- Special Thanks -    ", 1, 1, RGB(255, 255, 255));
    GPUTCHR(EXS + 10, EYE - 11, "All PetitCom Users", 1, 1, RGB(255, 255, 255));
    F_END += 1;
  }
    if (EXS + 16 * 3 < PX) { SPCOLOR (96, RGB(210, 255, 255, 255)) }
    if (EXS + 16 * 6 < PX) { SPCOLOR (96, RGB(230, 255, 255, 255)) }
    if (EXS + 16 * 8 < PX) { SPCOLOR (96, RGB(240, 255, 255, 255)) }
 }
 
 
  }





const ENDING = () => {
  SE(MAPCHANGE_LAST);
  GCLS();
  GPRIO(-256);
  SPHIDE(0);
  SPSHOW(96);
  SPCOLOR(96, RGB(255, 255, 255, 255));
 
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT2)
  WAIT(20);
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT1);
  WAIT(20);
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT0);
  WAIT(120)
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
 
  WAIT(20)
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT2);
  WAIT(20)
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT1);
  WAIT(20);
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT0);
  WAIT(220)
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
  if (BGMCHK(MBGMT)) { WAIT(60) }
 
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT1)
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT1)
  WAIT(60)
  if (BGMCHK(MBGMT)) { WAIT(30) }
 
  GPUTCHR(EXS + 16 * 3, EYS + 8 * 7, "HIDELIKE", 1, 1, GBT2)
  GPUTCHR(EXS + 4, EYS + 8 * 9, "~Generate_Blackbox~", 1, 1, GBT2)
  WAIT(60)
  if (BGMCHK(MBGMT)) {
    WAIT(30);
  }

  GCLS();
  WAIT(60);

  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT3);
  WAIT(30)
  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT2);
  WAIT(30)
  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT1);
  WAIT(30)
  GPUTCHR(EXS + 8 * 5, EYS + 8 * 8, "- The End -", 1, 1, GBT0);
 
  WAIT(120);
 
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT2);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT3);
  WAIT(30)
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT1);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT2)
  WAIT(30)
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT0);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT1);
  WAIT(30);
  GPUTCHR(EXS + 8 * 2, EYS + 11 * 8, "Thank you", 1, 1, GBT0);
  GPUTCHR(EXS + 8 * 5, EYS + 12 * 8, "  for playing!", 1, 1, GBT0);

  while (true) {
    if (BUTTON() === 16) {
      SE (PLAYER_BULLET)
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
}




const BG = () => {
 
  //?MAPCP
  if (GETATR(PX, PY) == 2) { MAPCP = 2 }
  if (GETATR(PX, PY) == 4) { MAPCP = 4 }
  if (GETATR(PX, PY) == 8) { MAPCP = 8 }


  if (BGSX < BG_MAX && EXE < PX + 9) {//MOVE RIGHT
    BGSX += 1;
    if (BGSX == 22) { GOTO @ENDING }
    PX = EXS + 16;
    DEF__MAPCHANGE_CLEAR();
    DEF__ENEMY_SET();
    DEF__BGMCHANGE();
    SE(MAPCHANGE_R);
    for (let i = 0; i < 3; i++) {
      BGOFS(i, BGX + (BGSX * 16 * 10), BGY)
    }
  }
 
  if (0 < BGSX && BGSX < 19 && PX - 9 < EXS) { //MOVE LEFT
    BGSX += -1;
    PX = EXE - 16;
    DEF__MAPCHANGE_CLEAR();
    DEF__ENEMY_SET();
    DEF__BGMCHANGE();
    SE(MAPCHANGE_L);
    for (let i = 0; i < 3; i++) {
      BGOFS(i, BGX + (BGSX * 16 * 10), BGY)
    }
  }
 
  if (BGSX > 18) { CREDIT() }
 
}


/** ステージによってBGMを変更している */
const DEF__BGMCHANGE = () => {
  if (BGSX < 3) {
    if (PBGM != 0) { BGMPLAY(MBGMT, BGM0) }
    PBGM = 0;
  } else if (BGSX < 7) {
    if (PBGM != 1) { BGMPLAY(MBGMT, BGM1) }
    PBGM = 1;
  } else if (BGSX < 8) {
    if (PBGM != 99) { BGMSTOP(MBGMT, 3) }
    PBGM = 99;
  } else if (BGSX < 12) {
    if (PBGM != 2) { BGMPLAY(MBGMT, BGM2) }
    PBGM = 2;
  } else if (BGSX < 16) {
    if (PBGM != 3) { BGMPLAY(MBGMT, BGM3) }
    PBGM = 3;
  } else if (BGSX < 18) {
    EFCOFF();
    if (PBGM != 99) { BGMSTOP(MBGMT, 5) }
    PBGM = 99;
  } else if (BGSX == 19) {
    EFCON;
    EFCSET(1);
    EFCWET(80, 80, 80);
    if (PBGM != 20) { BGMPLAY(MBGMT, BGM_ED) }
    PBGM = 20;
  } else if (BGSX == 19) {
    EFCWET(100, 100, 100);
  } else if (BGSX == 20) {
    EFCWET(127, 127, 127);
  }
}



const DEF__MAPCHANGE_CLEAR = () => {
  for (let i = SPNUM_PB; i < SPNUM_PB + PBM; i++) {
    SPHIDE(i);
  }
  for (let i = SPNUM_ENEMY; i < SPNUM_ENEMY + ENEMY_MAX; i++) {
    SPHIDE(i)
    ECHK[i] = false;
    ENX[i] = -99;//0
    ENY[i] = -99;//0
  }
  for (let i = 0; i < PBM; i++){
    //SPHIDE I+SPNUM_PB
    PBF[i] = false;
    PBX[i] = -99;//0
    PBY[i] = -99;//0
    PBDX[i] = false;
    PBDY[i] = false;
  }  
}



const PLAYER = () => {
 
 
 //*ANIME CHANGE
  if (BUTTON(2) == 1 && !BB) {
        // 上のアニメーション
    SPANIM (0, "UV", [
      [16, 00, 32]
      [16, 16, 32]
      [16, 32, 32]
      [16, 48, 32]
    ], 0);
    PDX = 0;
    PDY = -1;
  }
  if (BUTTON(2) == 2 && !BB) {
    SPANIM (0, "UV", [
      [16, 00, 48],
      [16, 16, 48],
      [16, 32, 48],
      [16, 48, 48],
      [16, 64, 48],
      [16, 16, 48],
      [16, 32, 48],
      [16, 48, 48]
  
    ], 0); PDX = 0; PDY = 1
  }
  if (BUTTON(2) == 4 && !BB) {
    SPANIM(0, "UV", [
      [16, 00, 16],
      [16, 16, 16],
      [16, 32, 16]
      [16, 48, 16],
      [16, 64, 16],
      [16, 16, 16],
      [16, 32, 16],
      [16, 48, 16]
    ], 0); PDX = -1; PDY = 0
  }
  if (BUTTON(2) == 8 && !BB) {
    SPANIM(0, "UV", [
      [16, 00, 0],
      [16, 16, 0],
      [16, 32, 0],
      [16, 48, 0],
      [16, 64, 0],
      [16, 16, 0],
      [16, 32, 0],
      [16, 48, 0]
  
    ], 0); PDX = 1; PDY = 0 }
 
 
 //*MOVE
  let PVX = 0, PVY = 0;
  let PDMX = 0, PDMY = 0;
  let PSPD = 0.7;
 //let PSPD=(BB+1)/1.4
  if (BB && BGSX < 19) { PSPD = 1.1; }
 //PVX=0:PVY=0
  if (BGSX == 16) { PSPD = PSPD / 1.3 }
  if (BGSX == 17) { PSPD = PSPD / 1.5 }
  if (BGSX == 18) { PSPD = PSPD / 1.7 }
  if (BGSX == 19) { PSPD = PSPD / 2 }
  if (BGSX == 20) { PSPD = PSPD / 3 }
 if(  BGSX==21  ){
   if (EXS + 16 * 6 < PX) {
     PSPD = PSPD / 5
   } else if (EXS + 16 * 4 < PX) {
     PSPD = PSPD / 4.5
   } else {
   PSPD=PSPD/4
  }
 }
  if ((PTDU % PMF) == PMF - 1) { PVY -= PMV * PSPD; PDMX = 0; PDMY = -1 }
  if ((PTDD % PMF) == PMF - 1) { PVY += PMV * PSPD; PDMX = 0; PDMY = 1 }
  if ((PTDL % PMF) == PMF - 1) { PVX -= PMV * PSPD; PDMX = -1; PDMY = 0 }
  if ((PTDR % PMF) == PMF - 1) { PVX += PMV * PSPD; PDMX = 1; PDMY = 0 }

 if(  PVX && PVY  ){ 
   PVX = (PVX / 1.41);//SQR(PVX)
   PVY = (PVY / 1.41);//SQR(PVY)
 }
 
 PX+=PVX
 PY+=PVY
 if(  GETATR(PX-8,PY)===1  ){
   PX -= PVX;
   PY -= PVY;
 }
 
  PX = MAX((EXS + (8) * SSCL), MIN(PX, EXE - (8)));
  PY = MAX((EYS + (7) * SSCL), MIN(PY, EYE - (9)));
 
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
      PBNUM = (PBNUM % PBM);
      SE(PLAYER_BULLET);
    } else {
      if (BGSX < 17) {
        SE(PLAYER_BULLET_CANNOT);
      }
    }
  }
 
 FOR I=0 TO PBM-1
  if(  PBF[I]  ){
   SPSHOW I+SPNUM_PB
   SPOFS  I+SPNUM_PB,PBX[I],PBY[I],PZB-I
   INC PBF[I]
   if(  PBF[I]==2  ){
    SPANIM I+SPNUM_PB,"UV",-1,16*0,16*5
    PBX[I]=PBX[I]+16*PBDX[I]
    PBY[I]=PBY[I]+16*PBDY[I]
   ELSEif(  PBF[I]==3  ){
    PBX[I]=PBX[I]+16*PBDX[I]
    PBY[I]=PBY[I]+16*PBDY[I]
   ELSEif(  PBF[I]==4  ){
    PBX[I]=PBX[I]+9*PBDX[I]
    PBY[I]=PBY[I]+9*PBDY[I]
   ELSEif(  PBF[I]==260  ){
    SPANIM I+SPNUM_PB,"UV",-1,16*1,16*5
           ELSEif(PBF[I] == 340){
             SPANIM I + SPNUM_PB, "UV", -1, 16 * 1, 16 * 5
             ELSEif(PBF[I] == 350){
               SPANIM I + SPNUM_PB, "UV", -1, 16 * 1, 16 * 5
               ELSEif(PBF[I] == 360){
                 PBF[I] = false
                 PBX[I] = -99
                 PBY[I] = -99
                 SPHIDE I + SPNUM_PB
                 SE PLAYER_BULLET_CLEAR
               }
             }
             NEXT
 
 
           }

DEF SE N//SOUND EFFECT
 INC BGMT
 BGMT=MAX( 2,(BGMT MOD 8) )
 BGMPLAY BGMT,N
END


@INPUT_BUTTON_STICK_TOUCH
 DU=false:DD=false:DL=false:DR=false
 BA=false:BB=false:BX=false:BY=false
 BL=false:BR=false:ZL=false:ZR=false
 //TOUCH OUT STTM,TX,TY
 
 BTN=BUTTON(0)
 //STICK   OUT SX ,SY
 //STICKEX OUT EXX,EXY
 
 if(  BTN  ){
  if(  BTN AND 1  ){ DU = true
  if(  BTN AND 2  ){ DD = true
  if(  BTN AND 4  ){ DL = true
  if(  BTN AND 8  ){ DR = true
  if(  BTN AND 16   ){ BA = true
  if(  BTN AND 32   ){ BB = true
  if(  BTN AND 64   ){ BX = true
  if(  BTN AND 128  ){ BY = true
  if(  BTN AND 256   ){ BL = true
  if(  BTN AND 512   ){ BR = true
  if(  BTN AND 2048  ){ ZR = true
  if(  BTN AND 4096  ){ ZL = true
 ELSEif(  SX || SY  ){
   if(  ABS(SX)<MOVEPLAY_L  ){ SX=0
   if(  ABS(SY)<MOVEPLAY_L  ){ SY=0
   if(  SY>0  ){ DU = true
   if(  SY<0  ){ DD = true
   if(  SX<0  ){ DL = true
   if(  SX>0  ){ DR = true
 }
 
 if(  EXX || EXY  ){
  if(  ABS(EXX)<MOVEPLAY_R  ){ EXX=0
  if(  ABS(EXY)<MOVEPLAY_R  ){ EXY=0
  if(  EXY>0  ){ BX = true
  if(  EXY<0  ){ BB = true
  if(  EXX<0  ){ BY = true
  if(  EXX>0  ){ BA = true
 }
 
 if(  DU  ){ INC PTDU :ELSE: PTDU=0
 if(  DD  ){ INC PTDD :ELSE: PTDD=0
 if(  DL  ){ INC PTDL :ELSE: PTDL=0
 if(  DR  ){ INC PTDR :ELSE: PTDR=0
 
 if(  (BUTTON(2) AND 128)&&(BUTTON()AND 256)&&(BUTTON()AND 512)  ){
  if(  !F_GBGREEN  ){
   SPSHOW 97
   F_GBGREEN=1
   SE MAPCHANGE_R
  ELSE 
   SPHIDE 97
   F_GBGREEN=0
   SE MAPCHANGE_L
  }
 }
 if(  (BUTTON(2) AND 64)&&(BUTTON()AND 256)&&(BUTTON()AND 512)  ){
  if(  !DEBUG2  ){
   DEBUG2=1
   SE MAPCHANGE_R
  ELSE 
   DEBUG2=0
   GCLS
   COLOR 0,0:LOCATE 0,0:?"      
   SE MAPCHANGE_L
  }
 }
 
RETURN//@INPUT_BUTTON_STICK_TOUCH






//














//
// MOT(NNID:motmark3)さん げんさく  しょきかしょり
//

DEF INITIALIZE
 let D$,R$
 let I//OPTION STRICT ように かってに つけたし
 ACLS:SYSBEEP=1
 XSCREEN 2,512,4:DISPLAY 1:COLOR 15,0
 XSCREEN 0,512,4
 FOR I=0TO 7:BGMSTOP I:NEXT
 FOR I=0TO 9:BREPEAT I:NEXT
 DISPLAY 0:VISIBLE 1,1,1,1
 FOR I=5TO 0 STEP -1
  GPAGE I,I
  if(  I!=4 AND I!=5  ){ GCLS
 NEXT
 //D$=CHR$(34):R$=CHR$(13)
 //KEY 1,"ACLS:FOR I=0TO 7:BGMSTOP I:NEXT"+R$
 //KEY 2,"LOAD"+D$+"PRG0:"
 //KEY 3,"SAVE"+D$+"PRG0:"
 //KEY 4,"LIST ERR"+R$
 //KEY 5,"RUN "
END



//
// でんぺん(NNID:DENPEN)さん さくせい  BG かんすう
//

// GLOBALへんすう
//let BGW,BGH     //よみこんだBGのサイズ
//let ATR%[32*32] //BGキャラ アトリビュートよう

// カンイ BGヨミコミ ルーチン(アトリビュート+サイズたいおうばん) 
DEF LOADBG FN$
 let B%[0],BGL,I,X,Y,O,P=8
 
 LOAD FN$,B%,false
 BGL=B%[3]:BGW=B%[4]*B%[6]:BGH=B%[5]*B%[7]
 
 FOR I=0 TO 32*32-1 STEP 4
  ATR%[I+0]= B%[P]      AND 0xFF
  ATR%[I+1]=(B%[P]>>8)  AND 0xFF
  ATR%[I+2]=(B%[P]>>16) AND 0xFF
  ATR%[I+3]=(B%[P]>>24) AND 0xFF:INC P
 NEXT
 
 let M[BGW*BGH+1]
 FOR I=0 TO BGL-1
  BGSCREEN I,BGW,BGH
  FOR Y=0 TO BGH-1
   FOR X=0 TO BGW-1 STEP 2
    O=X+BGW*Y
    M[O  ]= B%[P]     AND 0xFFFF
    M[O+1]=(B%[P]>>16)AND 0xFFFF:INC P
   NEXT
  NEXT
  BGLOAD I,M
 NEXT
END


//アトリビュートをしらべる
DEF GETATR(X,Y)
 let I,A=0
 
 FOR I=0 TO 3
  let C=BGGET(I,X+8,Y+8,1) AND 0x0FFF
  A=A OR ATR%[C] //アトリビュートはごうせい
 NEXT
 
 RETURN A
END



//
// ほしけん(NNID:Hosiken)さん さくせい  フォント しょり
//フォントのさくせいには プチフォントエディタ[QDKE34N3] を しようしました。
//

// フォント しょきか
@FONTINIT
  let CHRCODE%,PAT$//OPTION STRICTように かってにつけたし
  RESTORE @FONTDATA
  WHILE 1
    READ CHRCODE%,PAT$
    if(  CHRCODE%<0  ){ RETURN
    if(  LEN(PAT$)==256  ){
      // 256 もじなら そのまま FONTDEF に わたす
      FONTDEF CHRCODE%,PAT$
    ELSE
      // 16 もじの はずなので どくじかんすうに わたす
      SETFONT CHRCODE%,PAT$
    }
  WEND
  RETURN
// -------------------------------------------
// このまま つかえる フォントライブラリ

// みじかいデータもじれつ(4ドットあたり 1もじ)を
// していもじコード(CHRCODE%)に FONTDEF する
DEF SETFONT CHRCODE%,FONTPAT$
  let FONTI%
  let FONTJ%//OPTION STRICT ように かってに つけたし
  let FONTPAT%[8,8]
  FOR FONTI%=0 TO 7
    let FONTBYTE%=VAL("0x"+MID$(FONTPAT$,FONTI%*2,2))
    let BMASK%=128
    FOR FONTJ%=0 TO 7
      if(  FONTBYTE% AND BMASK%  ){
        FONTPAT%[FONTJ%,FONTI%]=1
        //FONTPAT$=FONTPAT$+RGBA2HEX16(15,15,15,0)
      }
      BMASK%=BMASK%/2
    NEXT
  NEXT
  SETFONTPAT CHRCODE%,FONTPAT%
END

// 8X8はいれつ(FONTPAT%)に 0か1をいれた パターンを
// していもじコード(CHRCODE%)に FONTDEF する
DEF SETFONTPAT CHRCODE%,FONTPAT%
  let FONTI%,FONTJ%,FONTPAT$
  FOR FONTI%=0 TO 7
    FOR FONTJ%=0 TO 7
      if(  FONTPAT%[FONTJ%,FONTI%]  ){
        // コメントアウトを かえると バリエーションが かわります
        // たて グラデーション
        //let FONTGRAD%=31-FONTI%*3
        //let FONTGRAD%=31-VAL("0x"+MID$("FC828CF",FONTI%,1))
        // ななめ グラデーション
        //let FONTGRAD%=31-ABS(FONTI%-FONTJ%)*3
        //let FONTGRAD%=31-VAL("0x"+MID$("048BFB9",ABS((7-FONTI%)-FONTJ%),1))
        // フラット
        let FONTGRAD%=31
        FONTPAT$=FONTPAT$+FONTRGBA2PAT(FONTGRAD%,FONTGRAD%,FONTGRAD%,1)
      ELSE
        // かげを つける
        let FONTSHADOW%=0
        //if(  FONTI%>0 AND FONTJ%>0  ){ FONTSHADOW%=FONTSHADOW% OR (FONTPAT%[FONTJ%-1,FONTI%-1]>0)
        //if(  FONTI%>0  ){ FONTSHADOW%=FONTSHADOW% OR (FONTPAT%[FONTJ%,FONTI%-1]>0)
        //if(  FONTJ%>0  ){ FONTSHADOW%=FONTSHADOW% OR (FONTPAT%[FONTJ%-1,FONTI%]>0)
        FONTPAT$=FONTPAT$+FONTRGBA2PAT(7,7,7,FONTSHADOW%)
      }
    NEXT
  NEXT
  FONTDEF CHRCODE%,FONTPAT$
END

// R,G,B(0~31) と A(0か1) を FONTDEF の 1ドットに へんかん
COMMON DEF FONTRGBA2PAT(R,G,B,A)
  RETURN RIGHT$("000"+HEX$(R*0x800+B*0x40+G*0x2+A),4)
END


// -------------------------------------------
// フォント データ
@FONTDATA//
DATA 0x0041,"00183C24667E6600"
DATA 0x0042,"007C62627C627C00"
DATA 0x0043,"003C726060723C00"
DATA 0x0044,"0078646666647800"
DATA 0x0045,"007E60607C607E00"
DATA 0x0046,"007E7E6078606000"
DATA 0x0047,"003C62606E663E00"
DATA 0x0048,"006666667E666600"
DATA 0x0049,"003C3C1818183C00"
DATA 0x004A,"003E3E0C4C4C3800"
DATA 0x004B,"00666C78786C6600"
DATA 0x004C,"00606060607C7C00"
DATA 0x004D,"0042667E5A424200"
DATA 0x004E,"0062727A6E666200"
DATA 0x004F,"003C666666663C00"
DATA 0x0050,"007C62627C606000"
DATA 0x0051,"003C66666A643A00"
DATA 0x0052,"007C62627C686600"
DATA 0x0053,"003C66603C463C00"
DATA 0x0054,"007E7E1818181800"
DATA 0x0055,"0066666666663C00"
DATA 0x0056,"00666624243C1800"
DATA 0x0057,"0042425A7E664200"
DATA 0x0058,"0066241838644600"
DATA 0x0059,"0066663C18181800"
DATA 0x005A,"007E7E0C18307E00"
DATA 0x0030,"003C666E76663C00"
DATA 0x0031,"0018385818187E00"
DATA 0x0032,"003C62021C307E00"
DATA 0x0033,"003C46061C463C00"
DATA 0x0034,"001C2C4C7E0C0C00"
DATA 0x0035,"007E607C06463C00"
DATA 0x0036,"003C607C62623C00"
DATA 0x0037,"007E66040C081800"
DATA 0x0038,"003C66663C663C00"
DATA 0x0039,"003C46463E463C00"
DATA 0x0061,"00003A6664643A00"
DATA 0x0062,"0060607C66667C00"
DATA 0x0063,"00003C6260623C00"
DATA 0x0064,"0006063E66663E00"
DATA 0x0065,"000038647C603800"
DATA 0x0066,"000C1A183C181800"
DATA 0x0067,"00003E643C4C3800"
DATA 0x0068,"0060607C66666600"
DATA 0x0069,"0018001818181800"
DATA 0x006A,"000C000C0C4C3800"
DATA 0x006B,"0060666E706C6600"
DATA 0x006C,"0038381818181800"
DATA 0x006D,"00003C7E6A6A6A00"
DATA 0x006E,"00007C6666666600"
DATA 0x006F,"00003C6666663C00"
DATA 0x0070,"00007C66667C6000"
DATA 0x0071,"00003E66663E0600"
DATA 0x0072,"0000666E70606000"
DATA 0x0073,"00003C703C063C00"
DATA 0x0074,"0018183C181A0C00"
DATA 0x0075,"0000666666663A00"
DATA 0x0076,"00006666663C1800"
DATA 0x0077,"0000626A6A7E3C00"
DATA 0x0078,"0000663C183C6600"
DATA 0x0079,"000066663E063C00"
DATA 0x007A,"00007E6C18367E00"
DATA 0x005B,"0078606060607800"
DATA 0x005D,"001E060606061E00"
DATA 0x002D,"0000007E7E000000"
DATA 0xE2B1,"007E7E7E7E7E7E00"
DATA 0x0021,"0018181818001800"
DATA 0xE214,"00182C6E623C1800"
DATA 0x0028,"0018302020301800"
DATA 0x0029,"00180C04040C1800"
DATA 0x003A,"0000180000180000"
DATA 0x0040,"003C625A54683C00"
DATA 0x003F,"003C464618001800"
// データの おわりを おしえてあげる ぎょうです さいごに たしてください
DATA -1,""













//*BGM
@BGM43//
DATA("T140")
//==================================
DATA("{A0= V100 L8")
DATA("R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4")
DATA("A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4")
//DATA("R4D#4A#2G#4F#4F4F#4R4D#4A#2<D#4C#4>B4A#4R4D#4")
//DATA("A#2G#4F#4F4F#4R4D#4A#2G#4F#4F4F4")
DATA(" ")
DATA(" ")
DATA("}")
DATA("{B0= V100 L16")
DATA("D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR")
DATA("D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR A#RRR A#RRR")
DATA("D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR")
DATA("D#RRR D#RRR E#RRR E#RRR F#RRR F#RRR G#RRR G#RRR")
DATA("}")
DATA("{C0= V100")
DATA(" D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8")
DATA(" D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8")
DATA(" D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8")
DATA(" D#8A#8D#8A#8F8A#8F8A#8F#8A#8F#8A#8G#8A#8G#8A#8")
DATA("}")

DATA("{A1= V100")
DATA("D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>")
DATA("D#8A#8<C#8>A#8 G#8A#8<C#8>A#8 F#8A#8<C#8>A#8 F8A#8<C#4>")
DATA("A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8")
DATA("A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8 A#8<C#8>A#8F#8")
DATA("}")
DATA("{B1= V100 L16")
DATA("D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRRCRRRCRRR>A#RRRA#RRR")
DATA("<D#RRRD#RRRC#RRRC#RRR>BRRRBRRRA#RRRA#RRR<D#RRRD#RRRC#RRRC#RRR>BRRRBRRR<DRRRDRRR")
DATA("}")
DATA("{C1= V100")
DATA("<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8")
DATA("<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8")
DATA("<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8G#8A#8")
DATA("<D#8>A#8<C#8>A#8B8A#8G#8A#8F#8A#8F8A#8F#8A#8E#8A#8")
DATA(" ")
DATA("}")

DATA("{A2= V100")
DATA("D#2A#2F#2F2 D#2<D#2C#6>B6A#6F#6F6D#6")
DATA("D#2A#2F#2F2 D#2<D#2C#2D#4D#4>")
DATA("}")
DATA("{B2= V100 L16")
DATA("D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRARRRARRR")
DATA("D#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRRD#RRRD#RRRFRRRFRRRGRRRGRRRG#RRRG#RRR")
DATA("<D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR")
DATA("<D#RRRD#RRRDRRRDRRRCRRRCRRR>A#RRRA#RRRG#RRRG#RRRGRRRGRRRFRRRFRRRD#RRRD#RRR")
DATA("}")
DATA("{C2= V100")
DATA("D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8")
DATA("D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8")
DATA("D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D8>A#8G8")
DATA("D#8A#8D#8A#8F8A#8F8A#8G8A#8G8A#8G#8<D#8C8>A#8")
DATA("}")



//********** BGM 43 *********************


DATA(":1[@V085")
DATA(" @230 P84 O5")
DATA(" @D10 @E127,127,100,127")
DATA(" {A0}")
DATA(" {A1}")
DATA(" {A2}")
DATA("]")

DATA(":2[@V050")
DATA(" @225 P44 O2")
DATA(" @D10 @E127,127,120,117 @MA127,70,10,0")
DATA(" {B0}")
DATA(" {B1}")
DATA(" {B2}")
DATA("]")

DATA(":3[@V55")
DATA(" @226 P64 O4")
DATA(" @D10 @E127,85,0,127")
DATA(" {C0}")
DATA(" {C1}")
DATA(" {C2}")
DATA("]")


DATA 0
//





@BGM44//
DATA("T120")
//==================================
DATA("{A0= V100")
DATA("F8<D#8C8>F8 A#8.F8.A#8")
DATA("F8<D#8C8>F8 A#8.F8.D8")
DATA("F8<D#8C8>F8 A#8.F8.A#8")
DATA("F8<D#8C8>F8 A#8.F8.<D8> ")
DATA("")
DATA("F8<D#8C8>F8 A#8.F8.A#8")
DATA("F8<D#8C8>F8 A#8.F8.D8")
DATA("F8<D#8C8>F8 A#8.F8.A#8")
DATA("F8<D#8C8>F8 A#8.F8.<D8> ")
DATA("}")
DATA("{B0= V100")
DATA("R1")
DATA("R1")
DATA("R1")
DATA("R1")
DATA(" ")
DATA("R1")
DATA("R1")
DATA("D#8<D#8C8>A#8 A#8.A#8.A#8")
DATA("D#8<D#8C8>A#8 A#8.A#8.<C8>")
DATA("}")

DATA("{A1= V100")
DATA("D#8<C8D#8>A#8 A#8.A#8.A#8")
DATA("G#8A#8A#8F8   A#8.A#8.F8")
DATA("D#8<C8D8>A#8 A#8.A#8.A#8")
DATA("G#8A#8A#8F8   A#8.F8.A#8")
DATA(" ")
DATA("D#8<C8D#8>A#8 A#8.A#8.A#8")
DATA("G#8A#8A#8F8   A#8.A#8.F8")
DATA("D#8<C8F8>A#8 A#8.A#8.A#8")
DATA("G#8A#8A#8F8   A#8.F8.A#8")
DATA("}")
DATA("{B1= V100")
DATA("R1")
DATA("R1")
DATA("R1")
DATA("R1")
DATA(" ")
DATA("R1")
DATA("R1")
DATA("D#8<C8F8>A#8 A#8.A#8.A#8")
DATA("G#8A#8A#8F8   A#8.F8.A#8")
DATA("}")

DATA("{A2= V100 Q4")
DATA(" [D#8D#16D#16]4")
DATA(" [D#8D#16D#16]4")
DATA(" [D#8D#16D#16]4")
DATA(" [D#8D#16D#16]4")
DATA("}")

DATA("{D00= V100")
DATA("R8D#8D#8D#8")
DATA("}")


//********** BGM 44 *********************

DATA(":1[")
DATA(" @228 T120 L4 Q8 @V80 P64 O2")
DATA(" @E127,127,127,127 @ML16,2,10,7")
DATA(" {A0}")
DATA(" {A1}")
DATA(" {A2}")
DATA("]")

DATA(":10[@V80 P064")
DATA(" @266 T120 L4 Q0 @V95 P94 O4")
DATA(" @E127,127,127,124")
DATA(" {D00}")
DATA("]")

DATA 0
//




@BGM45 //�����
DATA("T30")
//=====================================
DATA("{A0= V100 Q6")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" R<C#DE     F#.E.D>")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" RBAG#      G#.F#.A")
DATA("}")
DATA("{B0= V100 Q4")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA("}")
DATA("{C0= V100")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA("}")

DATA("{A1= V100")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" R<C#DE     F#.E.D>")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" RBAG#      G#.F#.R")
DATA("}")
DATA("{B1= V100 Q4")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16>")
DATA("}")
DATA("{C1= V100")
DATA(" RF#<C#>F# G#.A.B")
DATA(" R<C#DE    F#.E.D>")
DATA(" RF#<C#>F# G#.A.B")
DATA(" RBAG#")
DATA("}")

DATA("{A2= V100")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA("}")
DATA("{B2= V100 ")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16")
//DATA(" [ [F#16R8.]4 ]4")
//DATA(" [ [F#16R8.]4 ]4")
DATA("}")
DATA("{C2= V100")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA("}")

DATA("{A3= V100")
DATA(" R1")
DATA("}")
DATA("{B3= V100")
DATA(" R1")
DATA("}")
DATA("{C3= V100")
DATA(" R1")
DATA("}")

DATA("{A4= V100")
DATA(" R1")
DATA("}")
DATA("{B4= V100")
DATA(" R1")
DATA("}")
DATA("{C4= V100")
DATA(" R1")
DATA("}")

DATA("{D00= V127")
DATA(" [F#8F#16F#16]32")
DATA(" [F#8F#16F#16]32")
DATA(" [F#8F#16F#16]31")
DATA(" [F#16F#16F#16F#16]1")
DATA("}")
DATA("{D10= V100")
DATA(" RF#")
DATA("}")
DATA("{D20= V100")
DATA(" R1")
DATA("}")
DATA("{D30= V100")
DATA(" R1")
DATA("}")


//********** BGM 45 *********************


DATA(":1[")
DATA(" @228 @V60P44 O4")
DATA(" @E87,27,127,127")
DATA(" {A0}")
DATA(" {A1}")
DATA(" {A2}")
//DATA(" {A3}")
//DATA(" {A4}")
DATA("]")

DATA(":2[")
DATA(" @225 @V70 P64 O2")
DATA(" @E117,27,117,117")
DATA(" {B0}")
DATA(" {B1}")
DATA(" {B2}")
//DATA(" {B3}")
//DATA(" {B4}")
DATA("]")

DATA(":3[")
DATA(" @227 @V35 P84 O5")
DATA(" @E127,127,127,110 @MA37,2,8,0")
DATA(" {C0}")
DATA(" {C1}")
DATA(" {C2}")
//DATA(" {C3}")
//DATA(" {C4}")
DATA("]")


DATA(":10[")
DATA(" @266 @V90 P34 O4")
DATA(" @E127,124,0,127 @MA127,127,0,0")
DATA(" {D00}")
//DATA(" {D01}")
//DATA(" {D02}")
//DATA(" {D03}")
//DATA(" {D04}")
DATA("]")
DATA(":11[")
//DATA(" @310 @V80 P64 O5")
//DATA(" @E127,107,60,127 @MA127,102,3,0")
DATA(" @310 @V55 P94 O5")
DATA(" @E127,107,60,127 @MA10,52,3,0")
DATA(" {D10}")
//DATA(" {D11}")
//DATA(" {D12}")
//DATA(" {D13}")
//DATA(" {D14}")
DATA("]")
DATA(":12[")
DATA(" {D20}")
//DATA(" {D21}")
//DATA(" {D22}")
//DATA(" {D23}")
//DATA(" {D24}")
DATA("]")
DATA(":13[")
DATA(" {D30}")
//DATA(" {D31}")
//DATA(" {D32}")
//DATA(" {D33}")
//DATA(" {D34}")
DATA("]")

DATA 0
//





@BGM46 //
DATA("T150")
//==================================
DATA("{A0= V100 Q6")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" R<C#DE     F#.E.D")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" RBAG#      G#.F#.A")
DATA("}")
DATA("{B0= V100 Q4")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#9<E16E16  >F#8<D16D16 >F#8<D8>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA("}")
DATA("{C0= V100")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA("}")

DATA("{A1= V100")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" R<C#DE     F#.E.D>")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" RBAG#      G#.F#.R")
DATA("}")
DATA("{B1= V100 Q4")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D8>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16R16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16 ")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8<C#16C#16 >F#8<D16D16 >F#8<D16D16")
DATA("   >F#8<E16E16  >F#8<E16E16   >F#8<D16D16 >F#8<D16D16>")
DATA("}")
DATA("{C1= V100")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" R<C#DE     F#.E.D>")
DATA(" RF#<C#>F#  G#.A.B")
DATA(" RBAG       G#.F#.R")
DATA("}")

DATA("{A2= V100")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA("}")
DATA("{B2= V100 ")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8A16A16")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8<D16D16>")
DATA(" F#8<C#16C#16 >F#8B16B16 F#8A16A16    F#8G#16G#16")
DATA("   F#8A16A16     F#8B16B16 F#8<C#16C#16 >F#8G#16G#16")
//DATA(" [ [F#16R8.]4 ]4")
//DATA(" [ [F#16R8.]4 ]4")
DATA("}")
DATA("{C2= V100")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA(" R1R1")
DATA("}")

DATA("{A3= V100")
DATA(" R1")
DATA("}")
DATA("{B3= V100")
DATA(" R1")
DATA("}")
DATA("{C3= V100")
DATA(" R1")
DATA("}")

DATA("{A4= V100")
DATA(" R1")
DATA("}")
DATA("{B4= V100")
DATA(" R1")
DATA("}")
DATA("{C4= V100")
DATA(" R1")
DATA("}")


DATA("{D0I= V100 L4 ")
DATA(" [F#16]16")
DATA("}")
DATA("{D1I= V90 L4")
DATA(" F#8R8 F#8R8 F#8R8 F#16F#16F#16F#16")
DATA("}")

DATA("{D00= V127")
DATA(" [F#8F#16F#16]32")
DATA(" [F#8F#16F#16]32")
DATA(" [F#8F#16F#16]31")
DATA(" [F#16F#16F#16F#16]1")
DATA("}")
DATA("{D10= V100")
DATA(" RF#")
DATA("}")
DATA("{D20= V100")
DATA(" R1")
DATA("}")
DATA("{D30= V100")
DATA(" R1")
DATA("}")


//********** BGM 46 *********************


DATA(":1R1[")
DATA(" @228 @V65 P44 O4")
DATA(" @E87,27,127,127")
DATA(" {A0}")
DATA(" {A1}")
DATA(" {A2}")
//DATA(" {A3}")
//DATA(" {A4}")
DATA("]")

DATA(":2R1[")
DATA(" @225 @V75 P64 O2")
DATA(" @E117,27,117,117")
DATA(" {B0}")
DATA(" {B1}")
DATA(" {B2}")
//DATA(" {B3}")
//DATA(" {B4}")
DATA("]")

DATA(":3R1[")
DATA(" @227 @V40 P84 O5")
DATA(" @E127,127,127,110 @MA37,2,8,0")
DATA(" {C0}")
DATA(" {C1}")
DATA(" {C2}")
//DATA(" {C3}")
//DATA(" {C4}")
DATA("]")


DATA(":10")
DATA(" @266 @V90 P34 O4")
DATA(" @E127,124,0,127 @MA127,127,0,0")
DATA(" {D0I}")
DATA("[")
DATA(" {D00}")
//DATA(" {D01}")
//DATA(" {D02}")
//DATA(" {D03}")
//DATA(" {D04}")
DATA("]")
DATA(":11")
DATA(" @310 @V70 P94 O5")
DATA(" @E127,107,60,127 @MA10,52,3,0")
DATA(" {D1I}")
DATA("[")
DATA(" {D10}")
//DATA(" {D11}")
//DATA(" {D12}")
//DATA(" {D13}")
//DATA(" {D14}")
DATA("]")
DATA(":12[")
DATA(" {D20}")
//DATA(" {D21}")
//DATA(" {D22}")
//DATA(" {D23}")
//DATA(" {D24}")
DATA("]")
DATA(":13[")
DATA(" {D30}")
//DATA(" {D31}")
//DATA(" {D32}")
//DATA(" {D33}")
//DATA(" {D34}")
DATA("]")

DATA 0
//





@BGM47 //
DATA("T90")
//==================================
DATA("{A0= V100")
DATA(" [R1]4")
DATA("}")
DATA("{B0= V100 L4")
DATA(" [ CGFA# ]4")
DATA("}")
DATA("{C0= V100")
DATA(" [R1]4")
DATA("}")

DATA("{A1= V100 L4")
DATA("G2.A#4  A2.D#4 F1&F1")
DATA("A#2.<D4 C2.>F4 G1&G2.C8D8")
DATA("D#2G4 F2A#8F8 G2.&G2C8D8")
DATA("D#2G4 F2D4 C2.&C2.")
DATA("")
DATA(" ")
DATA("}")
DATA("{B1= V100 L4")
DATA(" [ CGFA# ]4")
DATA(" [ CGFA# ]4")
DATA(" [ CGF ]4")
//DATA(" [ CGF ]3 ")
DATA(" [ CGF ]3 C2.")
DATA("}")
DATA("{C1= V100")
DATA(" [R1]4")
DATA(" [R1]4")
DATA(" [R2.]4")
DATA(" [C2.]4")
DATA("}")

DATA("{REST=")
DATA(" [R1]4")
DATA("}")
//********** BGM 47 *********************


DATA(":1[")
DATA(" @227 @V70 P94 O5")
DATA(" @E127,64,64,127 @MA20,2,11,10")
DATA(" {A0}")
DATA(" {A1}")
DATA(" {REST}")
DATA("]")

DATA(":2[")
DATA(" @226 @V80 P64 O3")
DATA(" @E127,64,64,127")
DATA(" {B0}")
DATA(" {B1}")
DATA(" {REST}")
DATA("]")

DATA(":3[")
DATA(" @228 @V75 P34 O2")
DATA(" @E127,64,64,127")
DATA(" {C0}")
DATA(" {C1}")
DATA(" {REST}")
DATA("]")


DATA 0
//









@BGM48 //
DATA("T70")
//==================================
DATA("{A0= V100 T70")
DATA(" [R1]4")
DATA("}")
DATA("{B0= V100 L4")
DATA(" [ CGFA# CGFD ]2")
DATA("}")
DATA("{C0= V100 ")
DATA(" [C4R4C4R4]4")
DATA("}")

DATA("{A1= V100 L4")
DATA(" G2.A#4  A2.D#4 F1&F1")
DATA(" A#2.<D4 C2.>F4 G1&G2.C8D8")
DATA(" D#2G4 F2A#8F8 G2.&G2C8D8")
DATA(" T65 D#2G4  T60 F2D4  T55C2 ")
DATA(" T50 C12  T45 F12  T40 G12  T30 <C2.")
DATA("}")
DATA("{B1= V100 L4")
DATA(" CGFA# CGFD CGFA# CGFA#")
DATA(" [ CGFA# ]4")
DATA(" [ CGF ]4")
DATA(" >[ CGF ]3 <C2.&C2.")
DATA("}")
DATA("{C1= V100")
DATA(" [C4R4C4R4]4")
DATA(" [C4R4C4R4]3 C4R4R4C8D8")
DATA(" D#2G4 F2A#8F8 G2.&G2C8D8")
DATA(" D#2G4 F2D4 C2C12F12G12 <C2.")
DATA("}")


//********** BGM 48 *********************


DATA(":1")
DATA(" @227 @V70 P94 O4 Q4")
DATA(" @E127,94,4,90")
DATA(" {A0}")
DATA(" {A1}")

DATA(":2")
DATA(" @226 @V60 P64 O5 Q1")
DATA(" @E127,64,4,90")
DATA(" {B0}")
DATA(" {B1}")

DATA(":3")
DATA(" @228 @V70 P34 O2 Q2")
DATA(" @E127,64,4,90")
DATA(" {C0}")
DATA(" {C1}")


DATA 0