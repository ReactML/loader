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



## CSS PreProcessor Support

For example, to compile our `<style>` tag with Scss:

In your webpack config:

```js
module.exports = {
  module: {
    rules: [
      // this will apply to both plain `.scss` files
      // AND `<style lang="scss">` blocks in `.rml` files
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
}
```

Any content inside the style block with `lang="scss"`  will be processed by webpack as if it's inside a `*.scss` file.

```html
<style lang="scss">
/* Write SCSS here */
</style>
```

