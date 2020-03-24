# @reactml/loader

The `@reactml/loader` impl the webpack loader for [React Markup Language(RML)](https://github.com/ReactML/ReactML).

## Usage

To begin, you'll need to install `@reactml/loader`:

```console
npm install --save-dev @reactml/loader
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
        loader: '@reactml/loader',
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

> Tips: Default lang is`css`.

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

## CSS Modules

First, CSS Modules must be enabled by passing `modules: true` to `css-loader`:

```js
// webpack.config.js
{
  module: {
    rules: [
      // ... other rules omitted
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // enable CSS Modules
              modules: true,
            }
          }
        ]
      }
    ]
  }
}
```

Then, add the module attribute to your `<style>`，and use `className` as is:

```html
<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>

<div className="red bold">Hello RML</div>
```

### Use global scope in CSS Modules:

> Only works when CSS Moudles is enabled.

You can add suffix `:` to your class declaration to tag which to be gloabl,

For example:

```html
<style lang="scss" module>
  .container {
    color: green;
  }

  :global {
    .global-container {
      background: grey;
    }
  }
</style>
<div className="container :global-container" />
```

After compiled, global scope className will not be invoved:

```html
<style>
  ._2zQP9LGGLck7rMhc9zNHw_ {
    color: green;
  }

  .global-container {
     background: grey;
   }
</style>
<div class="_2zQP9LGGLck7rMhc9zNHw_ global-container" />
```