// A small utility function for determining the selected item in a div based on a percentage
export default function calculateIndex(length: number, percent: number) {
  const result = Math.floor(percent * length);
  return Math.max(0, Math.min(length - 1, result));
}
