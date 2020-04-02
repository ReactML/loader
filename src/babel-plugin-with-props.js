const builtInWhiteList = (
  'true,false,null,undefined,' +
  'Object,Array,String,Number,Symbol,Function,RegExp,' +
  'Proxy,Promise,Reflect,Set,Map,ArrayBuffer,' +
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,' +
  'Math,Date,JSON,console,global,globalThis,' +
  'window,parent,opener,top,length,frames,closed,location,self,window,document,name,customElements,history,navigator,screen,devicePixelRatio,styleMedia,performance,stop,open,alert,confirm,prompt,print,queueMicrotask,requestAnimationFrame,cancelAnimationFrame,captureEvents,releaseEvents,requestIdleCallback,cancelIdleCallback,getComputedStyle,matchMedia,moveTo,moveBy,resizeTo,resizeBy,scroll,scrollTo,scrollBy,getSelection,find,fetch,btoa,atob,setTimeout,clearTimeout,setInterval,clearInterval,createImageBitmap,close,focus,blur,postMessage,crypto,indexedDB,sessionStorage,localStorage,chrome,onpointerrawupdate,speechSynthesis,openDatabase,applicationCache,caches'
).split(',');

/**
 * Babel plugins to add prefix for identifiers.
 *
 * eg: var a = foo; -> var a = props.foo;
 * @param t BabelTypes
 * @param options.key {string} Prefixed identifier.
 * @param options.whiteList {Array<string>} Identifiers that not to transform.
 * @return {visitor}
 */
module.exports = function({ types: t }, options) {
  const { key = 'props', whiteList = [] } = options;
  const prefix = t.identifier(key);

  function replace(path) {
    if (path.isIdentifier()) {
      // Ignore prefiexed key.
      if (path.node.name === key) return;

      // Ignore white list.
      if (whiteList.indexOf(path.node.name) > -1) return;
      if (builtInWhiteList.indexOf(path.node.name) > -1) return;

      // Eg: The `color` should not be replaced.
      // <foo style={{ color: 'yellow' }} />
      if (
        path.parentPath.isObjectProperty()
        && path.parentPath.node.key === path.node
      ) return;

      // Skip function declaration cases.
      if (path.parentPath.isFunction()) {
        // Eg. The params should not be replaced.
        // <foo onClick={(foo, bar) => { alert(foo) }} />
        if (path.parentPath.node.params.indexOf(path.node) > -1) return;
        // Eg. The id(theFnName) should not be replaced.
        // <foo onClick={functioo theFnName(foo, bar) { alert(foo) }} />
        if (path.parentPath.node.id === path.node) return;
      }

      // Eg: The function arguments decleared identifier should not be replaced.
      // <foo onClick={(foo) => { alert(foo) }} />
      if (path.scope.getBinding(path.node.name)) return;

      // Error do not break compiling.
      try {
        path.replaceWith(
          t.memberExpression(prefix, path.node)
        );
      } catch (err) {
        console.error('[WARNING] Failed to convert in babel-plugin-with-props.');
        console.error();
        console.error(err);
      }
    } else if (path.isMemberExpression()) {
      let leftest = path;
      while (leftest.node.object) {
        leftest = leftest.get('object');
      }
      replace(leftest);
    }
  }
  return {
    visitor: {
      MemberExpression(path) {
        replace(path.get('object'));
        path.skip();
      },
      Identifier(path) {
        replace(path);
      },
    },
  };
};
