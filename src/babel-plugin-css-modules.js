/**
 * Babel plugins to add prefix for identifiers.
 *
 * eg: var a = foo; -> var a = props.foo;
 * @param t BabelTypes
 * @param options.styleMappingIdentifier {string} Style mapping identifier.
 * @param options.getCSSModuleNameIdentifier {string} Style transformer identifier.
 * @return {visitor}
 */
module.exports = function({ types: t }, options) {
  const {
    styleMappingIdentifier = 'styles',
    getCSSModuleNameIdentifier = 'getCSSModuleName',
  } = options;
  const mappingId = t.identifier(styleMappingIdentifier);
  const modularizeId = t.identifier(getCSSModuleNameIdentifier);
  return {
    visitor: {
      JSXAttribute(path) {
        const name = path.get('name');
        if (name.isJSXIdentifier({ name: 'className' })) {
          const valuePath = path.get('value');
          const classNameArg = t.isJSXExpressionContainer(valuePath.node)
            ? valuePath.node.expression
            : valuePath.node;
          const callArguments = [mappingId, classNameArg];

          valuePath.replaceWith(
            t.jsxExpressionContainer(
              t.callExpression(
                modularizeId,
                callArguments
              )
            )
          );
        }
      }
    },
  };
};
