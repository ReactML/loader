const ELEMENT_NODE = 1;
const CLASSNAME = 'class';
const STYLE = 'style';

export function createElement(type, props) {
  if (typeof type !== 'string') {
    throw new Error('Only support W3C tag.\n' + type + ' is not supported.');
  }

  const el = document.createElement(type);
  for (let prop in props) {
    const value = props[prop];

    switch (prop) {
      case STYLE:
        setStyle(el, value);
        break;
      case CLASSNAME:
        el.className = value;
        break;
      default:
        if (prop in el) {
          el[prop] = value;
        } else {
          el.setAttribute(prop, value);
        }
    }
  }

  if (arguments.length > 2) {
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (child.nodeType !== ELEMENT_NODE) {
        child = document.createTextNode(child);
      }
      el.appendChild(child);
    }
  }

  return el;
}

function setStyle(element, style) {
  Object.assign(element.style, style);
}