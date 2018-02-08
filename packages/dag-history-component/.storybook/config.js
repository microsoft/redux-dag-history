const { configure } = require('@storybook/react')

function loadStories() {
	require('../stories')
}

configure(loadStories, module)
