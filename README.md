# rml-loader

The `rml-loader` impl the webpack loader for react markup language(RML).

## Usage

To begin, you'll need to install `rml-loader`:

```console
npm install --save-dev rml-loader
```

Then add the plugin to your `webpack` config. 

For example:

**file.js**

```js
import Module from './module.rml';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.rml$/i,
        loader: rmlLoader,
        options: {
          renderer: 'react',
        },
      },
    ],
  },
};
```

### Options

- renderer {String} Determin react replacement renderer. (default to 'react')

And run `webpack` via your preferred method.