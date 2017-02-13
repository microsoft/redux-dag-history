import * as React from 'react';
import { storiesOf } from '@kadira/storybook';
import Continuation from '../../../src/components/Continuation';

storiesOf('Continuation', module)
.add('Huge Number', () => (
  <Continuation count={980709870987} />
))
.add('Selected Empty', () => (
  <Continuation color="orange" count={undefined} />
))
.add('Selected with Number', () => (
  <Continuation count={12} color="orange" />
))
.add('Single Digit', () => (
  <Continuation count={3} color="orange" />
))
.add('Triple Digit', () => (
  <Continuation count={555} color="orange" />
))
.add('Unselected and Empty', () => (
  <Continuation />
))
.add('Unselected with Number', () => (
  <Continuation count={12} />
));
