// tslint:disable no-bitwise

export default function hashString(input: string) {
	const { length } = input
	let hash = 0
	for (let i = 0; i < length; i += 1) {
		const chr = input.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0
	}
	return hash
}
