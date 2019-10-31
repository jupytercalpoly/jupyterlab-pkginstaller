import * as React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';

import StyleClasses from './style';
import { PackageSearcher } from './PackageBar';
const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

export default class MyWidget extends ReactWidget {
  constructor(kernelId: any) {
    super();
    this.kernelId = kernelId;
  }
  render() {
    return (
      <div className={PackageBarStyleClasses.PIComponent}>
        <PackageSearcher kernelId={this.kernelId} kernelName={null} uninstalledPackage={null} moduleError={null} layouty={null}/>
      </div>
    );
  }
  private kernelId: any;
}