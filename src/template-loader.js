const loaderUtils = require('loader-utils');
const babel = require('@babel/core');
const getBabelConfig = require('./babel.config');
const { getResourcePart } = require('./parts');

const STYLE_IDENTIFIER = '__style__';
const GET_CSS_MODULE_NAME = '__get_css_module_name__';

/**
 * Babel loader to parse rml templates.
 * @param templates
 * @return {string}
 */
module.exports = function(templates) {
  const { resourcePath } = this;
  const stringifyRequest = r => loaderUtils.stringifyRequest(this, r);
  const { renderer, inlineStyle } = Object.assign({}, loaderUtils.getOptions(this));
  if (!Array.isArray(templates)) {
    templates = [templates];
  }

  const style = getResourcePart(resourcePath, 'style');
  const enableCSSModules = style && style.attrs && style.attrs.module != null;

  const importLinks = getResourcePart(resourcePath, 'importLinks');
  const { imports, scopeIds } = generateImports(importLinks);
  let extraImports = '';
  if (enableCSSModules) {
    const getCSSModuleNameRuntime = require.resolve('./runtime/get-css-module-name');
    const getCSSModuleNameRuntimeRequest = stringifyRequest(getCSSModuleNameRuntime);
    extraImports += `\nimport ${GET_CSS_MODULE_NAME} from ${getCSSModuleNameRuntimeRequest};`;
  }
  const jsx = generateJSX(templates, scopeIds, enableCSSModules, inlineStyle);

  return `
import { createElement } from '${renderer}';${imports}${extraImports}
export default function __render__(props, ${STYLE_IDENTIFIER}) {
  return ${jsx};
}
  `.trim() + '\n';
};

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

function generateJSX(templates, scopeIds, enableCSSModules, inlineStyle) {
  const whiteList = ['createElement', STYLE_IDENTIFIER].concat(scopeIds);
  if (enableCSSModules) {
    whiteList.push(GET_CSS_MODULE_NAME);
  }

  const babelConfigOverride = { plugins: [] };
  babelConfigOverride.plugins.push([
    require.resolve('./babel-plugin-with-props'),
    {
      key: 'props',
      whiteList,
    }
  ]);
  if (enableCSSModules) {
    babelConfigOverride.plugins.push([
      require.resolve('./babel-plugin-css-modules'),
      {
        styleMappingIdentifier: STYLE_IDENTIFIER,
        getCSSModuleNameIdentifier: GET_CSS_MODULE_NAME,
      }
    ]);
  }
  const babelConfig = getBabelConfig({
    styleSheet: inlineStyle ? STYLE_IDENTIFIER : false,
    override: babelConfigOverride,
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
