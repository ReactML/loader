import render from './component.rml';

const root = document.createElement('div');
document.body.appendChild(root);
root.appendChild(render());
// document
//   .body
//   .appendChild(document.createElement('div'))
//   .appendChild(render());