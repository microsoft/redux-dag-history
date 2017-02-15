import * as React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import State from '../../../src/components/State';

storiesOf('State', module)
.add('Current, Active', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={4}
    active
  />
))
.add('Current, Inactive', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={2}
  />
))
.add('Legacy, Active', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={1}
    active
  />
))
.add('Legacy, Inactive', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={12}
  />
))
.add('Current, Unbookmarked', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={2}
    renderBookmarks
  />
))
.add('Legacy, Unbookmarked', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={2}
    renderBookmarks
  />
))
.add('Current, Bookmarked', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={2}
    renderBookmarks
    bookmarked
  />
))
.add('Legacy, Bookmarked', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={2}
    renderBookmarks
    bookmarked
  />
))
.add('Pinned', () => (
  <State
    id={1}
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    numChildren={12}
    pinned
  />
));
