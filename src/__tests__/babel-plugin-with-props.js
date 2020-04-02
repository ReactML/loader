const { transformSync } = require('@babel/core');
const plugin = require('../babel-plugin-with-props');

function trim(str) {
  return str
    .replace(/^\s+|\s+$/, '')
    .replace(/;?$/, '');
}

// input -> expected
const specs = [
  [
    'console.log(123)',
    'console.log(123)',
  ],
  [
    '<foo style={{ color: color }} />',
    '<foo style={{color:props.color}}/>',
  ],
  [
    '<foo onClick={(foo, bar) => { alert(foo) }} />',
    '<foo onClick={(foo,bar)=>{alert(foo);}}/>',
  ],
  [
    '<foo onClick={function hello(foo, bar) { alert(foo) }} />',
    '<foo onClick={function hello(foo,bar){alert(foo);}}/>',
  ],
];

describe('babel-plugin-with-props', () => {
  specs.forEach((spec, index) => {
    it('should work #' + index, () => {
      const input = spec[0];
      const expected = spec[1];
      const actual = transformSync(input, {
        compact: true,
        configFile: false,
        plugins: [[plugin, {}]],
        parserOpts: {
          plugins: ['jsx']
        },
      }).code;

      expect(trim(actual)).toEqual(trim(expected));
    });
  });
});
