import getCSSModuleName from '../runtime/get-css-module-name';

describe('GetCSSModuleName', () => {
  const MAPPING = {
    container: 'foo',
    strong: 'bar',
  };

  it('should transform local name', () => {
    const actual = getCSSModuleName(MAPPING, 'strong');

    expect(actual).toEqual('bar');
  });

  it('should transform multi', () => {
    const actual = getCSSModuleName(MAPPING, 'strong container');

    expect(actual).toEqual('bar foo');
  });

  it('should transform global', () => {
    const actual = getCSSModuleName(MAPPING, ':strong :container');

    expect(actual).toEqual('strong container');
  });

  it('should not transform not match', () => {
    const actual = getCSSModuleName(MAPPING, 'sss ddd');

    expect(actual).toEqual('sss ddd');
  });
});
