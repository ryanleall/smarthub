import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from 'app/App';

export * as Pages from 'app/pages/ember';

export function mount(
  Component: React.ComponentType<unknown>,
  target: HTMLElement,
  args: Record<string, unknown>
): void {
  ReactDOM.render(
    <BrowserRouter>
      <App>
        <Component {...args} />
      </App>
    </BrowserRouter>,
    target
  );
}

export function unmount(target: HTMLElement): void {
  ReactDOM.unmountComponentAtNode(target);
}
