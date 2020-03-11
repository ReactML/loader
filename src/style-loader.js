const RuleSet = require('webpack/lib/RuleSet');
const loaderUtils = require('loader-utils');
const paths = require('./paths');
const { getResourcePart } = require('./parts');

module.exports = function styleLoader(styleContent) {
  const { resourcePath, resourceQuery } = this;
  const stringifyRequest = r => loaderUtils.stringifyRequest(this, r);
  const style = getResourcePart(resourcePath, 'style');

  // Use webpack's RuleSet utility to normalize user rules
  const compiler = this._compiler;
  const rawRules = compiler.options.module.rules;
  const { rules } = new RuleSet(rawRules);

  // Find the rule that applies to rml files
  const lang = style.attrs.lang || 'css';
  const styleRuleIndex = rawRules.findIndex(createMatcher(`foo.${lang}`));
  const styleRule = rules[styleRuleIndex];

  if (styleRule.oneOf) {
    throw new Error(
      '[RML Loader Error] Currently does not support style rules with oneOf.'
    );
  }

  const genRequest = uses => {
    const loaderStrings = uses.map(use => {
      const query = typeof use.options === 'string'
        ? use.options
        : use.options ? JSON.stringify(use.options) : '';
      const loader = typeof use.loader === 'string' ? use.loader : use.loader.request;
      return loader + (query ? '?' + query : '');
    });

    return stringifyRequest('-!' + [
      ...loaderStrings,
      `${paths.partLoader}?part=style`,
      resourcePath + resourceQuery
    ].join('!'));
  };
  // Get the normlized "use" for style files
  const request = genRequest(styleRule.use.concat());
  return `import mod from ${request}; export default mod; export * from ${request};`;
};

function createMatcher(fakeFile) {
  return (rule, i) => {
    // Skip the `include` check when locating the rml rule
    const clone = Object.assign({}, rule);
    delete clone.include;
    const normalized = RuleSet.normalizeRule(clone, {}, '');
    return (
      !rule.enforce &&
      normalized.resource &&
      normalized.resource(fakeFile)
    );
  };
}
