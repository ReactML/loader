const {
  selectPart,
  parseSFCParts,
} = require('../parts');
const { readFileSync } = require('fs');
const { join } = require('path');

describe('parts', () => {
  it('should parse rml', () => {
    const rml = readFileSync(join(__dirname, './parts.rml'), 'utf-8');
    const parts = parseSFCParts(rml);
    const script = selectPart(parts, 'script');
    expect(script).toMatchSnapshot();

    const template = selectPart(parts, 'template');
    expect(template).toMatchSnapshot();

    const style = selectPart(parts, 'style');
    expect(style).toMatchSnapshot();

    const importLinks = selectPart(parts, 'importLinks');
    expect(importLinks).toMatchSnapshot();
  });
});
