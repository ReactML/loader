const babel = require('@babel/core');
const getBabelConfig = require('./babel.config');

const babelConfig = getBabelConfig({
  styleSheet: true,
  custom: {
    plugins: [
      [require.resolve('./babel-plugin-with-props'), {
        key: 'props',
        whiteList: ['createElement'],
      }],
    ],
  },
});
const compilerOptions = {
  sourceType: 'script',
  minified: true,
};

module.exports = function (templates) {
  if (!Array.isArray(templates)) {
    templates = [templates];
  }

  const jsxTpls = templates.map(template => {
    const compiled = compile(template, compilerOptions);
    const tailingSemiRemoved = compiled.code.replace(/;$/, '');
    return tailingSemiRemoved;
  });

  let templateCode = '';
  if (jsxTpls.length === 0) {
    templateCode = '""';
  } else if (jsxTpls.length === 1) {
    templateCode = jsxTpls[0];
  } else if (jsxTpls.length > 1) {
    templateCode = '[' + jsxTpls.join(', ') + ']';
  }
  return `
import { createElement } from 'rax';
export default function __render__(props, __styles__) {
  return ${templateCode};
}
  `.trim();
}

function compile(template, compileOptions) {
  const finalTransformOptions = Object.assign({}, babelConfig, compileOptions);
  return babel.transformSync(template, finalTransformOptions);
}