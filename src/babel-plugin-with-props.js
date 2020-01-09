
module.exports = function ({ types: t }, options) {
  const { key = 'props', whiteList = [] } = options;
  const prefix = t.identifier(key);

  function replace(path) {
    if (path.isIdentifier()) {
      if (path.node.name === key) return;
      if (whiteList.indexOf(path.node.name) > -1) return;
      if (path.parentPath.isObjectProperty()) return;

      path.replaceWith(
        t.memberExpression(prefix, path.node)
      );
    } else if (path.isMemberExpression()) {
      let leftest = path;
      while (leftest.node.object) {
        leftest = leftest.get('object');
      }
      replace(leftest);
    }
  }
  return {
    visitor: {
      MemberExpression(path) {
        replace(path.get('object'));
        path.skip();
      },
      Identifier(path) {
        replace(path);
      },
    },
  };
}