const SPACE_REG = /\s/;

export default function getCSSModuleName(moduleMapping, className, reserveLocal) {
  return String(className)
    .split(SPACE_REG)
    .map(local => {
      const module = moduleMapping[local];
      if (module) {
        return reserveLocal ? module + ' ' + local : module;
      } else {
        return local;
      }
    })
    .join(' ');
};
