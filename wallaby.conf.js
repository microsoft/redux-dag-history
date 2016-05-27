module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts'
    ],
    tests: [
      'test/**/*.spec.ts'
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
