import * as React from 'react';

import { ReactWidget, UseSignal } from '@jupyterlab/apputils'; 

import StyleClasses from './style';

import { PackageInstaller } from './PackageInstaller';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

export default class PInstallerWidget extends ReactWidget {
  constructor(notebookTracker: any) {
    super();
    this.notebookTracker = notebookTracker;
  }
  render() {
    let { currentWidget } = this.notebookTracker;
    let { session } = currentWidget;
    return (
      <UseSignal signal={session.kernelChanged}>
        {() => 
          <div className={PackageBarStyleClasses.PIComponent}>
            <PackageInstaller
              kernelId={session.kernelId} 
              nb = {this.notebookTracker}
              kernelName={session.kernelDisplayName} 
              uninstalledPackage={null}
              moduleError={null}
            />
          </div>
        }
      </UseSignal>
    );
  }
  private notebookTracker: any;
}