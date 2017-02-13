import * as React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import StateList from '../../../src/components/StateList';

storiesOf('StateList', module)
.add('Basic', () => (
  <StateList
    activeStateId={0}
    onStateClick={action('state click')}
    onStateContinuationClick={action('state continuation click')}
    onStateBookmarkClick={action('state bookmark click')}
    states={[
      {
        id: 0,
        source: 'Search Widget',
        label: 'Added Search Criteria',
        branchType: 'current',
        active: true,
        continuation: { },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
      {
        id: 1,
        source: 'Search Widget',
        label: 'Added Time Filter',
        branchType: 'current',
        continuation: {
          count: 2,
        },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
      {
        id: 2,
        source: 'Search Widget',
        label: 'Set Probox to 2',
        branchType: 'legacy',
        continuation: {
          count: 12,
        },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
      {
        id: 3,
        source: 'Search Widget',
        label: 'Enable Hydrospanner',
        branchType: 'legacy',
        continuation: {
          count: 12,
        },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
    ]}
  />
))
.add('With Bookmarks', () => (
  <StateList
    activeStateId={0}
    renderBookmarks
    onStateClick={action('state click')}
    onStateContinuationClick={action('state continuation click')}
    onStateBookmarkClick={action('state bookmark click')}
    states={[
      {
        id: 0,
        source: 'Search Widget',
        label: 'Added Search Criteria',
        branchType: 'current',
        active: true,
        continuation: {},
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
      {
        id: 1,
        source: 'Search Widget',
        label: 'Added Time Filter',
        branchType: 'current',
        continuation: {
          count: 2,
        },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
      {
        id: 2,
        source: 'Search Widget',
        label: 'Set Probox to 2',
        branchType: 'legacy',
        continuation: {
          count: 12,
        },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
      {
        id: 3,
        source: 'Search Widget',
        label: 'Enable Hydrospanner',
        branchType: 'legacy',
        continuation: {
          count: 12,
        },
        onClick: action('click state'),
        onContinuationClick: action('click state continuation'),
      },
    ]}
  />
));
