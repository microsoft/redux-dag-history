export default function nextId(id?: string) {
	return id !== undefined ? `${parseInt(id as string, 10) + 1}` : '1'
}
