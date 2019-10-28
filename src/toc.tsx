import * as React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';

function MyComponent() {
  return <div>My Widget</div>;
}

export default class MyWidget extends ReactWidget {
  render() {
    return <MyComponent />;
  }
}