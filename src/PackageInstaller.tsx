import * as React from 'react';

import { ReactWidget, UseSignal } from '@jupyterlab/apputils'; 

import StyleClasses from './style';

import { PackageSearcher } from './PackageBar';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

export default class PInstallerWidget extends ReactWidget {
  constructor(notebookTracker: any) {
    super();
    this.notebookTracker = notebookTracker;
    
  }
  render() {
    return (
      <UseSignal signal={this.notebookTracker.currentWidget.session.kernelChanged}>
        {() => (
          <div className={PackageBarStyleClasses.PIComponent}>
            <PackageSearcher kernelId={this.notebookTracker.currentWidget.session.kernelId} nb = {this.notebookTracker} kernelName={this.notebookTracker.currentWidget.session.kernelName} uninstalledPackage={null} moduleError={null} />//layouty={null}/>
          </div>
          )
        }
      </UseSignal>
   
    );
  }
  private notebookTracker: any;
}