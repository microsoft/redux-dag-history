export default function nextId(id?: string) {
  const isDefined = id !== undefined;
  return isDefined ? `${parseInt(id, 10) + 1}` : '1';
}
