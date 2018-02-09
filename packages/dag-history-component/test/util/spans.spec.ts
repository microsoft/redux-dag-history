import * as SpanCalc from '../../src/util/spans'

function assertSpan(span: any, start: number, end: number, type: string) {
	expect(span.start).toEqual(start)
	expect(span.end).toEqual(end)
	expect(span.type).toEqual(type)
}

describe('The span calculator', () => {
	it('is exists', () => {
		expect(SpanCalc).toBeDefined()
	})

	it('can create initial span', () => {
		const spans = SpanCalc.initialSpans(0, 10)
		// 'expected one span'
		expect(spans.length).toEqual(1)
		assertSpan(spans[0], 0, 11, 'NONE')
	})

	it('can insert a span in the middle of the initial span', () => {
		let spans = SpanCalc.initialSpans(0, 10)
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 6, 'test'))
		// 'expected 3 spans'
		expect(spans.length).toEqual(3)
		assertSpan(spans[0], 0, 3, 'NONE')
		assertSpan(spans[1], 3, 6, 'test')
		assertSpan(spans[2], 6, 11, 'NONE')
	})

	it('can insert a one-length span in the middle of the initial span', () => {
		let spans = SpanCalc.initialSpans(0, 10)
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 4, 'test'))
		// 'expected 3 spans'
		expect(spans.length).toEqual(3)
		assertSpan(spans[0], 0, 3, 'NONE')
		assertSpan(spans[1], 3, 4, 'test')
		assertSpan(spans[2], 4, 11, 'NONE')
	})

	it('can replace a one-length span', () => {
		let spans = SpanCalc.initialSpans(0, 10)
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 4, 'test'))
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 4, 'derp'))
		// 'expected 3 spans'
		expect(spans.length).toEqual(3)
		assertSpan(spans[0], 0, 3, 'NONE')
		assertSpan(spans[1], 3, 4, 'derp')
		assertSpan(spans[2], 4, 11, 'NONE')
	})

	it('can insert a span at the end of the initial span', () => {
		let spans = SpanCalc.initialSpans(0, 10)
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(8, 11, 'test'))
		// , `expected 2 spans: ${spans}`
		expect(spans.length).toEqual(2)
		assertSpan(spans[0], 0, 8, 'NONE')
		assertSpan(spans[1], 8, 11, 'test')
	})

	it('can insert a span at the beginning of the initial span', () => {
		let spans = SpanCalc.initialSpans(0, 10)
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(0, 2, 'test'))
		// , `expected 2 spans: ${spans}`
		expect(spans.length).toEqual(2)
		assertSpan(spans[0], 0, 2, 'test')
		assertSpan(spans[1], 2, 11, 'NONE')
	})

	it('can insert a span overlapping two spans', () => {
		let spans = SpanCalc.initialSpans(0, 10)
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(0, 6, 'test'))
		spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 7, 'test'))
		// , 'expected 3 spans'
		expect(spans.length).toEqual(3)
		assertSpan(spans[0], 0, 3, 'test')
		assertSpan(spans[1], 3, 7, 'test')
		assertSpan(spans[2], 7, 11, 'NONE')
	})
})
