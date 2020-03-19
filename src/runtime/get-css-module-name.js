const CLASS_NAME_SPLITER = /\s/;

/**
 * Support syntax of `:module`, which means global css scope.
 * @param moduleMapping {object} K-V: local -> module class name.
 * @param className {string} User input class name.
 * @return {string} Transformed class name.
 */
export default function getCSSModuleName(moduleMapping, className) {
  return String(className)
    .split(CLASS_NAME_SPLITER)
    .map(local => {
      if (local[0] === ':') {
        const module = moduleMapping[local.slice(1)];
        return module ? module : local;
      } else {
        return local;
      }
    })
    .join(' ');
};
