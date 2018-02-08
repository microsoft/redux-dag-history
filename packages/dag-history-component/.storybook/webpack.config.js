const path = require('path')
const lodash = require('lodash')
const get = lodash.get

const tsxRule = {
	test: /\.ts(x|)/,
	loaders: ['ts-loader'],
}
const cssRule = {
	test: /\.css/,
	loaders: ['style-loader', 'css-loader'],
}

module.exports = (baseConfig, env) => {
	const rules = get(baseConfig, 'module.rules', [])
	const extensions = get(baseConfig, 'resolve.extensions', ['.js'])

	const config = Object.assign({}, baseConfig, {
		resolve: Object.assign({}, get(baseConfig, 'resolve', {}), {
			extensions: extensions.concat('.ts', '.tsx'),
		}),
		module: Object.assign({}, get(baseConfig, 'module', {}), {
			rules: rules.concat(tsxRule, cssRule),
		}),
	})
	return config
}
