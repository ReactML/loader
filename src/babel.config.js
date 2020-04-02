/**
 * Provide basic babel config.
 */
const babelMerge = require('babel-merge');

const defaultOptions = {
  styleSheet: false,
};

module.exports = (userOptions) => {
  const options = Object.assign({}, defaultOptions, userOptions);
  const { styleSheet, override } = options;

  const baseConfig = {
    presets: [
      require.resolve('@babel/preset-flow'),
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            chrome: '49',
            ios: '8',
          },
          loose: true,
          modules: 'auto',
          include: [
            'transform-computed-properties',
          ],
        },
      ],
      [
        require.resolve('@babel/preset-react'), {
          'pragma': 'createElement',
          'pragmaFrag': 'Fragment',
          'throwIfNamespace': false,
        },
      ],
    ],
    plugins: [
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          'corejs': false,
          'helpers': false,
          'regenerator': true,
          'useESModules': false,
        },
      ],
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      // Stage 0
      require.resolve('@babel/plugin-proposal-function-bind'),
      // Stage 1
      require.resolve('@babel/plugin-proposal-export-default-from'),
      [
        require.resolve('@babel/plugin-proposal-optional-chaining'),
        { loose: true },
      ],
      [
        require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
        { loose: true },
      ],
      // Stage 2
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      // Stage 3
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        { loose: true },
      ],
      require.resolve('babel-plugin-minify-dead-code-elimination'),
    ],
  };

  const babelConfigList = [baseConfig];

  // Enable jsx plus default.
  babelConfigList.push({
    plugins: [
      require.resolve('babel-plugin-transform-jsx-list'),
      require.resolve('babel-plugin-transform-jsx-condition'),
      require.resolve('babel-plugin-transform-jsx-memo'),
      require.resolve('babel-plugin-transform-jsx-slot'),
      [require.resolve('babel-plugin-transform-jsx-fragment'), { moduleName: 'rax' }],
      require.resolve('babel-plugin-transform-jsx-class'),
    ],
  });

  if (styleSheet) {
    babelConfigList.push({
      plugins: [
        [
          require.resolve('babel-plugin-transform-jsx-stylesheet'),
          {
            retainClassName: true,
            injectedStyleName: styleSheet,
            convertImport: false,
          }
        ],
      ],
    });
  }

  // Overrides default configs.
  if (override) {
    babelConfigList.push(override);
  }

  return babelMerge.all(babelConfigList);
};
