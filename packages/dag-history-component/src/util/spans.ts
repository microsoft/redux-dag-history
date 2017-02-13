const log = require('debug')('dag-history-component:SpanCalculator');

export class Span {
  constructor(
    public start: number,
    public end: number,
    public type: string, // eslint-disable-line no-unused-vars
  ) {
  }

  toString() {
    return `Span::${this.type}[${this.start} => ${this.end}]`;
  }

  get length() {
    return this.end - this.start;
  }

  areBoundsEqual(other: Span) {
    return other.start === this.start && other.end === this.end;
  }

  contains(index) {
    return index >= this.start && index <= this.end;
  }
}

/**
 * Gets the initial set of common spans for a branch profile
 */
export function initialSpans(start: number, max: number, type = 'NONE') {
  return [new Span(start, max + 1, type)];
}

/**
 * Replaces a span at at index with the given span
 */
function replaceSpan(spans: Span[], newSpan: Span, i: number) {
  return spans.slice(0, i)
    .concat([newSpan])
    .concat(spans.slice(i + 1));
}

/**
 * Inserts a span at the tail of an existing span
 * [=============] <-- existing
 *          [++++] <-- new
 * becomes
 *
 * [=======][++++] <-- pruned existing + new
 */
function insertSpanAtTail(spans: Span[], newSpan: Span, i: number) {
  const span = spans[i];
  return spans.slice(0, i)
    .concat([
      new Span(span.start, newSpan.start, span.type),
      newSpan,
    ])
    .concat(spans.slice(i + 1))
    .filter(t => t.end > t.start);
}

/**
 * Inserts a span at the bridge-point between two spans
 * [aaaaaaaaaaaaaaa][bbbbbbbbbbbbbb] <-- existing
 *              [cccccc]             <-- new
 *  becomes
 *
 * [aaaaaaaaaaaa[cccccc][bbbbbbbbbb]
 */
function insertBridgingSpan(spans: Span[], newSpan: Span, i: number) {
  const left = spans[i];
  const right = spans[i + 1];

  return spans.slice(0, i)
    .concat([
      new Span(left.start, newSpan.start, left.type),
      newSpan,
      new Span(newSpan.end, right.end, right.type),
    ])
    .concat(spans.slice(i + 2))
    .filter(t => t.end > t.start);
}

/**
 * Inserts a span interior to an existing span
 * [aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa] <-- existing
 *              [cccccc]              <-- new
 *  becomes
 *
 * [aaaaaaaaaaaa[cccccc][aaaaaaaaaaa]
 */
function insertSplittingSpan(spans: Span[], newSpan: Span, i: number) {
  const span = spans[i];
  return spans.slice(0, i)
    .concat([
      new Span(span.start, newSpan.start, span.type),
      newSpan,
      new Span(newSpan.end, span.end, span.type),
    ])
    .concat(spans.slice(i + 1))
    .filter(t => t.end > t.start);
}

export function insertSpan(spans: Span[], newSpan: Span) {
  if (!newSpan) {
    throw new Error('could not insert span that is undefined/null');
  }

  for (let i = 0; i < spans.length; i += 1) {
    const span = spans[i];
    if (span.areBoundsEqual(newSpan)) {
      return replaceSpan(spans, newSpan, i);
    }
    if (span.contains(newSpan.start)) {
      if (newSpan.end === span.end) {
        return insertSpanAtTail(spans, newSpan, i);
      } else if (newSpan.end > span.end) {
        return insertBridgingSpan(spans, newSpan, i);
      }
      return insertSplittingSpan(spans, newSpan, i);
    }
  }
  log(`Could not insert span ${newSpan} into spanset ${spans}`);
  return spans;
}
