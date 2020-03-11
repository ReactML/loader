const babel = require('@babel/core');
const getBabelConfig = require('./babel.config');
const { getResourcePart } = require('./parts');

module.exports = function (templates) {
  const { resourcePath } = this;
  if (!Array.isArray(templates)) {
    templates = [templates];
  }

  const importLinks = getResourcePart(resourcePath, 'importLinks');
  const { imports, scopeIds } = generateImports(importLinks);
  const jsx = generateJSX(templates, scopeIds);

  return `
import { createElement } from 'react';${imports}
export default function __render__(props, __styles__) {
  return ${jsx};
}
  `.trim();
}

function generateImports(importLinks) {
  const scopeIds = [];
  let imports = '';

  // [ { default: 'View', from: 'rax-view' } ]
  if (Array.isArray(importLinks)) {
    importLinks.forEach((link) => {
      const { from, ...others } = link;
      if (from) {
        const ids = [];
        // ${} as ${}
        Object.keys(others).forEach((key) => {
          const identifier = others[key];
          scopeIds.push(identifier);
          ids.push(`${key} as ${identifier}`);
        });
        if (ids.length > 0) {
          imports += `import { ${ids.join(', ')} } from '${from}';\n`;
        }
      }
    });
  }

  return {
    imports: imports ? '\n' + imports : imports,
    scopeIds,
  };
}

const compilerOptions = {
  sourceType: 'script',
  minified: true,
};

function compile(template, compileOptions, babelConfig) {
  const finalTransformOptions = Object.assign({}, babelConfig, compileOptions);
  return babel.transformSync(template, finalTransformOptions);
}

function generateJSX(templates, scopeIds) {
  const whiteList = ['createElement'].concat(scopeIds);
  const babelConfig = getBabelConfig({
    styleSheet: true,
    override: {
      plugins: [
        [require.resolve('./babel-plugin-with-props'), {
          key: 'props',
          whiteList,
        }],
      ],
    },
  });

  const jsxTpls = templates.map(template => {
    const compiled = compile(template, compilerOptions, babelConfig);
    // Remove tailing semi.
    return compiled.code.replace(/;$/, '');
  });

  let templateCode = '';
  if (jsxTpls.length === 0) {
    templateCode = '""';
  } else if (jsxTpls.length === 1) {
    templateCode = jsxTpls[0];
  } else if (jsxTpls.length > 1) {
    templateCode = '[' + jsxTpls.join(', ') + ']';
  }
  return templateCode;
}
