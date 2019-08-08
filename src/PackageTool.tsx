import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';

import { PanelLayout } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { JupyterFrontEnd } from '@jupyterlab/application';

import { PackageSearcher } from './PackageBar';

import { ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';

class PackageTool extends NotebookTools.Tool {
  readonly app: JupyterFrontEnd;
  constructor(app: JupyterFrontEnd, notebookTracker: INotebookTracker) {
    super();
    this.app = app;
    this.notebookTracker = notebookTracker;
    this.layout = new PanelLayout();
  } 
  protected onAfterAttach(msg: Message): void {
    this.notebookTracker.currentWidget.context.ready.then(() => {
      let layout = this.layout as PanelLayout;
      let count = layout.widgets.length;
      for (let i = 0; i < count; i++) {
        layout.widgets[0].dispose();
      }
      const cellWidget = ReactWidget.create(<PackageSearcher kernelId={this.notebookTracker.currentWidget.session.kernel.id}/>);
      layout.addWidget(cellWidget);
    });
  }
  protected onActiveNotebookPanelChanged(msg: Message): void {
    this.notebookTracker.currentWidget.context.ready.then(() => {
      let layout = this.layout as PanelLayout;
      let count = layout.widgets.length;
      for (let i = 0; i < count; i++) {
        layout.widgets[0].dispose();
      }
      const cellWidget = ReactWidget.create(<PackageSearcher kernelId={this.notebookTracker.currentWidget.session.kernel.id}/>);
      layout.addWidget(cellWidget);
    });
  }
  private notebookTracker:INotebookTracker;
}

export default PackageTool;