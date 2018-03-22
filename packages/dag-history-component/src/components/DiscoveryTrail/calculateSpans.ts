import { initialSpans, insertSpan, Span } from '../../util/spans'

const isNumber = (d: number | null | undefined) => !isNaN(d) && d !== null

export default function calculateSpans(
	depth: number,
	highlight: number,
	leadIn: number,
	active: boolean,
): Span[] {
	if (depth < 0) {
		return []
	}
	let spans = initialSpans(0, depth, 'empty')
	if (isNumber(leadIn) && leadIn !== 0) {
		spans = insertSpan(spans, new Span(depth - leadIn, depth + 1, 'leadin'))
	}
	if (active && depth > 1) {
		const type = active ? 'highlighted' : 'highlightedInactive'
		const highlightDepth = highlight || depth
		spans = insertSpan(
			spans,
			new Span(highlightDepth, highlightDepth + 1, type),
		)
	}
	return spans
}
