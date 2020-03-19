const loaderUtils = require('loader-utils');
const { preCompileParts } = require('./parts');
const paths = require('./paths');

const defaultOptions = {
  renderer: 'react', // Can be replaced with preact/rax/...
};

/**
 * RML Loader
 * @return {string}
 */
module.exports = function RMLLoader(rawContent) {
  const context = this;
  const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(context));
  const stringifyRequest = r => loaderUtils.stringifyRequest(context, r);
  const { resourcePath } = context;
  const { renderer } = options;

  preCompileParts(rawContent, resourcePath);

  const loadScriptRequest = stringifyRequest(`${paths.partLoader}?part=script!${resourcePath}`);
  const loadTemplateRequest = stringifyRequest(`${paths.templateLoader}?renderer=${renderer}!${paths.partLoader}?part=template!${resourcePath}`);
  const loadStyleRequest = stringifyRequest(`${paths.styleLoader}!${resourcePath}`);

  const code = `
import createData from ${loadScriptRequest};
import render from ${loadTemplateRequest};
import * as style from ${loadStyleRequest};

export default function AnonymousRMLModule(props) {
  return render(createData(props), style);
}
  `;

  return code.trim() + '\n';
};
