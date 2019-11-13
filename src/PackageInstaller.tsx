import * as React from 'react';
import { ReactWidget, UseSignal } from '@jupyterlab/apputils'; 
import StyleClasses from './style';
import { PackageSearcher } from './PackageBar';
const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

export default class PInstallerWidget extends ReactWidget {
  constructor(notebookTracker: any) {
    super();
    this.notebookTracker = notebookTracker;
    console.log(this.notebookTracker);
  }
  
  some_method() {
    return this.notebookTracker.currentWidget.session.kernelId;
  }
  render() {
    return (
      <UseSignal signal={this.notebookTracker.currentWidget.session.kernelChanged}>
        {() => (
          <div className={PackageBarStyleClasses.PIComponent}>
            <p>{this.some_method()}</p>
            <PackageSearcher kernelId={this.notebookTracker.currentWidget.session.kernelId} nb = {this.notebookTracker} kernelName={this.notebookTracker.currentWidget.session.kernelName} uninstalledPackage={null} moduleError={null} layouty={null}/>
          </div>
          )
        }
      </UseSignal>
   
    );
  }
  private notebookTracker: any;
  // private word: any;
}