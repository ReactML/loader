const loaderUtils = require('loader-utils');
const { preCompileParts } = require('./parts');
const paths = require('./paths');

/**
 * RML Loader
 * @return {string}
 */
module.exports = function RMLLoader(rawContent) {
  const context = this;
  const stringifyRequest = r => loaderUtils.stringifyRequest(context, r);
  const { resourcePath } = context;

  preCompileParts(rawContent, resourcePath);

  const loadScriptRequest = stringifyRequest(`${paths.scriptLoader}!${paths.partLoader}?part=script!${resourcePath}`);
  const loadTemplateRequest = stringifyRequest(`${paths.templateLoader}!${paths.partLoader}?part=template!${resourcePath}`);
  const loadStyleRequest = stringifyRequest(`${paths.styleLoader}?disableLog=true&transformDescendantCombinator=true!${paths.partLoader}?part=style!${resourcePath}`);

  const code = `
import createData from ${loadScriptRequest};
import render from ${loadTemplateRequest};
import styles from ${loadStyleRequest};
export default function AnonymousRMLModule(props) {
  return render(createData(props), styles);
}
  `;

  return code.trim();
}
