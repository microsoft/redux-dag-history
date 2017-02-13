import {
  Span,
  insertSpan,
  initialSpans,
} from '../../util/spans';

const isNumber = d => !isNaN(d) && d !== null;

export default function calculateSpans(
  depth: number,
  highlight: number,
  leadIn: number,
  active: boolean,
): Span[] {
  if (depth < 0) {
    return [];
  }
  let spans = initialSpans(0, depth, 'empty');
  if (isNumber(leadIn) && leadIn !== 0) {
    spans = insertSpan(spans, new Span(depth - leadIn, depth + 1, 'leadin'));
  }
  if (isNumber(highlight)) {
    const type = active ? 'highlighted' : 'highlightedInactive';
    spans = insertSpan(spans, new Span(highlight, highlight + 1, type));
  }
  return spans;
}
