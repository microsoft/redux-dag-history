const wallabyWebpack = require('wallaby-webpack')

module.exports = function configureWallaby(wallaby) {
	const webpackPostprocessor = wallabyWebpack({
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
				sinon: 'sinon/pkg/sinon',
			},
		},
		module: {
			rules: [
				{ test: /\.html$/, use: 'file-loader?name=[name].[ext]' },
				{ test: /\.css$/, use: 'style-loader!css-loader' },
				{ test: /\.json$/, use: 'json-loader' },
			],
		},
	})

	return {
		files: [
			{ pattern: 'src/**/*.ts*', load: false },
			{ pattern: 'src/**/*.scss*', load: false },
		],
		tests: [{ pattern: 'test/**/*.spec.ts*', load: false }],
		compilers: {
			'**/*.js*': wallaby.compilers.typeScript({
				jsx: 'react',
			}),
		},
		postprocessor: webpackPostprocessor,
		bootstrap() {
			window.__moduleBundler.loadTests()
		},
		env: {
			kind: 'electron',
			runner: '../../node_modules/.bin/electron',
		},
	}
}
