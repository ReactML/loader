const loaderUtils = require('loader-utils');
const { getResourcePart } = require('./parts');

/**
 * Babel loader to extract some part of rml module.
 */
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
