const SPACE_REG = /\s/;

export default function getCSSModuleName(moduleMapping, className) {
  return String(className).split(SPACE_REG).map(key => moduleMapping[key] ? moduleMapping[key] : key).join(' ');
};
