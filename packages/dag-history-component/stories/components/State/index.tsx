import * as React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import State from '../../../src/components/State';

storiesOf('State', module)
.add('Current, Active', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 4 }}
    active
  />
))
.add('Current, Inactive', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 2 }}
  />
))
.add('Legacy, Active', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 1 }}
    active
  />
))
.add('Legacy, Inactive', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 12 }}
  />
))
.add('Current, Unbookmarked', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 2 }}
    renderBookmarks
  />
))
.add('Legacy, Unbookmarked', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 2 }}
    renderBookmarks
  />
))
.add('Current, Bookmarked', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 2 }}
    renderBookmarks
    bookmarked
  />
))
.add('Legacy, Bookmarked', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="legacy"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 2 }}
    renderBookmarks
    bookmarked
  />
))
.add('Pinned', () => (
  <State
    source="Search Widget"
    label="Added Search Criteria"
    branchType="current"
    onClick={action('click')}
    onContinuationClick={action('continuationClick')}
    continuation={{ count: 12 }}
    pinned
  />
));
