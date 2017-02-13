import * as React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Bookmark from '../../../src/components/Bookmark/Bookmark';

storiesOf('Bookmark', module)
.add('Inactive', () => (
  <Bookmark
    name="Some Bookmark Name"
    annotation="Some Bookmark Annotation Text. Derp Depr Derp Derp"
    onClick={action('click')}
  />
))
.add('Active', () => (
  <Bookmark
    name="Some Bookmark Name"
    annotation="Some Bookmark Annotation Text. Derp Depr Derp Derp"
    onClick={action('click')}
    active
  />
));
