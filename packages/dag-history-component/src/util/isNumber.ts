export default function isNumber(d: any) {
  return d !== null &&
    d !== undefined &&
    typeof d === 'number' &&
    !Number.isNaN(d) &&
    Number.isFinite(d);
}
