/**
 * 音を作ってOfflineAudioContextに流す
 * @param offlineAudioContext
 * @param wave 波形データ
 * @param frequency 周波数
 * @param length 何分音符か
 * @param tempo 4分音符が1分間に流れる数
 * @param offset 開始時間
 * @returns 次の音符の開始時間
 */
export const createOscillator = (
    offlineAudioContext: OfflineAudioContext,
    wave: PeriodicWave,
    frequency: number,
    length: number,
    tempo: number,
    offset: number
): number => {
    const o = offlineAudioContext.createOscillator();
    o.frequency.value = frequency;
    o.setPeriodicWave(wave);
    o.connect(offlineAudioContext.destination);
    o.start(offset);
    const stopTime = offset + ((4 / length) * 60) / tempo;
    o.stop(stopTime);
    return stopTime;
};
