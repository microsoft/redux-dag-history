import * as React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import DiscoveryTrail from '../../../src/components/DiscoveryTrail';

storiesOf('DiscoveryTrail', module)
.add('Horizontal', () => (
  <DiscoveryTrail depth={10} highlight={8} />
))
.add('Horizontal, Full-Width', () => (
  <DiscoveryTrail depth={0} highlight={0} />
))
.add('Vertical', () => (
  <div style={{height: 300, display: 'flex'}}>
    <DiscoveryTrail vertical depth={10} highlight={8} />
    <div style={{flex: 2}} />
  </div>
));
