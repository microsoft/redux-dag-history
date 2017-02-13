
import { expect } from 'chai';
import * as SpanCalc from '../../src/util/spans';

function assertSpan(span, start, end, type) {
  expect(span.start).to.equal(start);
  expect(span.end).to.equal(end);
  expect(span.type).to.equal(type);
}

describe('The span calculator', () => {
  it('is exists', () => {
    expect(SpanCalc).to.be.ok;
  });

  it('can create initial span', () => {
    const spans = SpanCalc.initialSpans(0, 10);
    expect(spans.length).to.equal(1, 'expected one span');
    assertSpan(spans[0], 0, 11, 'NONE');
  });

  it('can insert a span in the middle of the initial span', () => {
    let spans = SpanCalc.initialSpans(0, 10);
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 6, 'test'));
    expect(spans.length).to.equal(3, 'expected 3 spans');
    assertSpan(spans[0], 0, 3, 'NONE');
    assertSpan(spans[1], 3, 6, 'test');
    assertSpan(spans[2], 6, 11, 'NONE');
  });


  it('can insert a one-length span in the middle of the initial span', () => {
    let spans = SpanCalc.initialSpans(0, 10);
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 4, 'test'));
    expect(spans.length).to.equal(3, 'expected 3 spans');
    assertSpan(spans[0], 0, 3, 'NONE');
    assertSpan(spans[1], 3, 4, 'test');
    assertSpan(spans[2], 4, 11, 'NONE');
  });

  it('can replace a one-length span', () => {
    let spans = SpanCalc.initialSpans(0, 10);
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 4, 'test'));
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 4, 'derp'));
    expect(spans.length).to.equal(3, 'expected 3 spans');
    assertSpan(spans[0], 0, 3, 'NONE');
    assertSpan(spans[1], 3, 4, 'derp');
    assertSpan(spans[2], 4, 11, 'NONE');
  });

  it('can insert a span at the end of the initial span', () => {
    let spans = SpanCalc.initialSpans(0, 10);
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(8, 11, 'test'));
    expect(spans.length).to.equal(2, `expected 2 spans: ${spans}`);
    assertSpan(spans[0], 0, 8, 'NONE');
    assertSpan(spans[1], 8, 11, 'test');
  });

  it('can insert a span at the beginning of the initial span', () => {
    let spans = SpanCalc.initialSpans(0, 10);
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(0, 2, 'test'));
    expect(spans.length).to.equal(2, `expected 2 spans: ${spans}`);
    assertSpan(spans[0], 0, 2, 'test');
    assertSpan(spans[1], 2, 11, 'NONE');
  });

  it('can insert a span overlapping two spans', () => {
    let spans = SpanCalc.initialSpans(0, 10);
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(0, 6, 'test'));
    spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(3, 7, 'test'));
    expect(spans.length).to.equal(3, 'expected 3 spans');
    assertSpan(spans[0], 0, 3, 'test');
    assertSpan(spans[1], 3, 7, 'test');
    assertSpan(spans[2], 7, 11, 'NONE');
  });
});
