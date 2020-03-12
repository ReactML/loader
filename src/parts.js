const { DomHandler, Parser } = require('htmlparser2');

const partsStorage = new Map();

function getDomObject(html) {
  const handler = new DomHandler(() => { }, {
    withStartIndices: true,
    withEndIndices: true,
  });
  const parser = new Parser(handler, {
    xmlMode: true
  });
  parser.parseComplete(html);
  return handler.dom;
}

function innerHTML(dom, html) {
  const { children } = dom;
  if (children.length > 0) {
    const firstChildStartIndex = children[0].startIndex;
    const lastChildEndIndex = children[children.length - 1].endIndex;
    return html.substring(firstChildStartIndex, lastChildEndIndex + 1).trim();
  } else {
    return '';
  }
}

function outerHTML(dom, html) {
  const { startIndex, endIndex } = dom;
  return html.substring(startIndex, endIndex + 1).trim();
}

function getResourcePart(key, part, rawContent) {
  let parts;
  if (partsStorage.has(key)) {
    parts = partsStorage.get(key);
  } else {
    parts = parseSFCParts(rawContent);
    partsStorage.set(key, parts);
  }

  return selectPart(parts, part);
}

/**
 * enum Part {
 *   template,
 *   script,
 *   style,
 *   importLinks,
 * }
 */
function selectPart(parts, part) {
  return parts[part] || null;
}

function parseSFCParts(html) {
  const result = {};
  const dom = getDomObject(html);
  const importLinks = [];
  const templates = [];
  let script = '',
    style = '';

  dom.forEach(node => {
    const { type, name, children, attribs } = node;
    switch (name) {
      case 'import':
        const from = attribs.from;
        if (from !== undefined) {
          importLinks.push(attribs);
        } else {
          let tag = '<import';
          for (let attr in attribs) tag += ` ${attr}="${attribs[attr]}"`;
          tag += ' />';
          console.warn('[RML] import tag should have it\'s from attribute: ' + tag);
        }
        result.importLinks = importLinks;
        break;

      case 'style':
      case 'script':
        if (result[name]) {
          throw new Error(`RML can only have 1 ${name} tag exists.`);
        } else {
          result[name] = {
            type: name,
            content: innerHTML(node, html),
            attrs: attribs,
          };
        }
        break;

      default:
        let template;
        // pure text node.
        if (type === 'text' && !attribs) {
          template = node.data.trim();
          if (template) template = JSON.stringify(template);
        } else {
          template = outerHTML(node, html);
        }

        if (template) templates.push(template);
        break;
    }
  });

  if (templates.length > 0) {
    result.template = {
      type: 'template',
      content: templates,
      attrs: {},
    };
  }

  return result;
}

function preCompileParts(html, key) {
  const parts = parseSFCParts(html);
  partsStorage.set(key, parts);
}

exports.getResourcePart = getResourcePart;
exports.selectPart = selectPart;
exports.parseSFCParts = parseSFCParts;
exports.preCompileParts = preCompileParts;
