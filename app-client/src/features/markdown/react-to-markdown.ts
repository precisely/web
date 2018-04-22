import { ReactDOM, createElement } from 'react';
import {UserGenotypeSwitch} from 'src/features/report/UserGenotypeSwitch';
import {GenotypeCase} from 'src/features/report/GenotypeCase';
import { StatelessComponent } from 'enzyme';

const {Renderer} = require('markdown-components');

export function reactToMarkdownComponents(reactComponent: StatelessComponent<any>, renderer: Renderer) {
  
  return (props: Object, render: (obj: Object, newContext?: Object) => void) => {
    renderReactComponent(reactComponent, props);
  }
}

export function renderReactComponent(component: StatelessComponent<any>, props: Object) {
  ReactDOM.render(
    createElement(component, props, null),
    document.getElementById('root')
  );
}