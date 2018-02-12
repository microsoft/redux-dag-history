module.exports = {
	debug: true,
	files: ['tsconfig.json', 'packages/*/src/**/*.ts*'],
	tests: ['packages/*/test/**/*.spec.ts*'],
	env: {
		type: 'node',
		runner: 'node',
	},
	testFramework: 'jest',
}
