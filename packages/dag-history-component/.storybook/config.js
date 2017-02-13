const { configure } = require('@kadira/storybook');

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
