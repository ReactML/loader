const loaderUtils = require('loader-utils');
const { getResourcePart } = require('./parts');

/**
 * Babel loader to extract some part of rml module.
 */
module.exports = function partLoader(rawContent) {
  let EMPTY = '';
  const { resourcePath } = this;
  const options = loaderUtils.getOptions(this);

  if (options && options.part) {
    if (process.env.NODE_ENV !== 'production') {
      EMPTY += `console.warn('[RML] Part(${options.part}) not found!');`;
    }
    // { template, script, style }
    const part = getResourcePart(resourcePath, options.part, rawContent);
    if (part != null) {
      this.callback(null, part.content, part.map);
      return;
    }
  }
  this.callback(null, EMPTY);
};
