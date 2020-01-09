const loaderUtils = require('loader-utils');
const { parseSFCParts, selectPart } = require('./sfc/parts');

const rmlLoader = require.resolve('.');
const templateLoader = require.resolve('./template-loader');
const stylesheetLoader = require.resolve('stylesheet-loader');

module.exports = function RMLLoader(rawContent) {
  const context = this;
  const stringifyRequest = r => loaderUtils.stringifyRequest(context, r);
  const options = loaderUtils.getOptions(context) || {};
  const {
    target,
    request,
    minimize,
    sourceMap,
    rootContext,
    resourcePath,
    resourceQuery
  } = context;

  if (options.part) {
    // { template, script, style }
    const parts = parseSFCParts(rawContent);
    return selectPart(parts, options.part)
  }

  const loadDataRequest = stringifyRequest(`${rmlLoader}?part=script!${resourcePath}`);
  const loadTemplateRequest = stringifyRequest(`${templateLoader}!${rmlLoader}?part=template!${resourcePath}`);
  const loadStyleRequest = stringifyRequest(`${stylesheetLoader}?disableLog=true&transformDescendantCombinator=true!${rmlLoader}?part=style!${resourcePath}`);

  let code = `
import createData from ${loadDataRequest};
import render from ${loadTemplateRequest};
import styles from ${loadStyleRequest};

export default function AnonymousRMLModule(props) {
  return render(createData(props), styles);
}
  `;
  return code.trim();
}