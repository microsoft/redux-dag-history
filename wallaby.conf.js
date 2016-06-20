module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      { pattern: 'src/**/__test__/*', ignore: true }
    ],
    tests: [
      'src/__test__/**/*.spec.ts'
    ],
    env: {
      type: 'node',
    },
    testFramework: 'mocha',
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({module: "commonjs"})
    }
  };
};
