import { createElement } from 'react';
import { render } from 'react-dom';
import App from './component.rml';

const container = document.body.appendChild(
  document.createElement('div')
);
render(createElement(App), container);
