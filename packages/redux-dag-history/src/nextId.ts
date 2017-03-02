export default function nextId(id: string) {
  return `${parseInt(id, 10) + 1}`;
}
