/**
 * Web Audio APIで波形を作るためには
 * 離散フーリエ変換をする必要があるみたいだ
 * 離散フーリエ変換をするアルゴリズムのうち高速フーリエ変換のコードを見つけたので使う
 *
 * 参考
 * https://qiita.com/printf_moriken/items/8ae2f0e4651b38afb0bf
 */

/**
 * 離散フーリエ変換をする関数
 * @param input
 */
export const fft = (
  input: Float32Array
): { real: Float32Array; imag: Float32Array } => {
  const n = input.length;
  const theta = (2 * Math.PI) / n;
  const real = input.slice();
  const imag = new Float32Array(n);

  // scrambler
  let i = 0;
  for (let j = 1; j < n - 1; j += 1) {
    for (let k = n >> 1; k > (i ^= k); k >>= 1) {}
    if (j < i) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }

  let m = 0;
  for (let mh = 1; (m = mh << 1) <= n; mh = m) {
    let irev = 0;
    for (let i = 0; i < n; i += m) {
      const wr = Math.cos(theta * irev);
      const wi = Math.sin(theta * irev);
      for (let k = n >> 2; k > (irev ^= k); k >>= 1) {}
      for (let j = i; j < mh + i; j++) {
        const k = j + mh;
        const xr = real[j] - real[k];
        const xi = imag[j] - imag[k];
        real[j] += real[k];
        imag[j] += imag[k];
        real[k] = wr * xr - wi * xi;
        imag[k] = wr * xi + wi * xr;
      }
    }
  }

  // remove DC offset
  real[0] = 0;
  imag[0] = 0;

  return { real, imag };
};
