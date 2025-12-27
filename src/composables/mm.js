export default function calculateMM(totalWorkTime) {
  // 소수점 2자리 반올림
  return Number(totalWorkTime / 8 / 20.6).toFixed(2);
}
