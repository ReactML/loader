const loaderUtils = require('loader-utils');
const { getResourcePart } = require('./parts');

module.exports = function partLoader(rawContent) {
  const { resourcePath } = this;
  const options = loaderUtils.getOptions(this) || {};
  if (options.part) {
    // { template, script, style }
    const part = getResourcePart(resourcePath, options.part, rawContent);
    return part;
  } else {
    return rawContent;
  }
};
