import { PanelLayout } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { JupyterFrontEnd } from '@jupyterlab/application';

import { Kernel } from '@jupyterlab/services';

import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';

// import {
//   Toolbar
// } from '@jupyterlab/apputils';


import { ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';

import { PackageSearcher } from './PackageBar';

import { KernelSpyModel } from './Model';

import { MessageLogView } from './Widget';


class PackageTool extends NotebookTools.Tool {
  readonly app: JupyterFrontEnd;
  constructor(app: JupyterFrontEnd, notebookTracker: INotebookTracker) {
    super();
    this.app = app;
    this.notebookTracker = notebookTracker;
    this.layout = new PanelLayout();
  } 
  protected onAfterAttach(msg: Message): void {
    this.notebookTracker.currentWidget.session.ready.then(() => {
      let layout = this.layout as PanelLayout;
      let count = layout.widgets.length;
      for (let i = 0; i < count; i++) {
        layout.widgets[0].dispose();
      }
      let session = this.notebookTracker.currentWidget.session;
      let model = new KernelSpyModel(session.kernel! as Kernel.IKernel);
      const view = new MessageLogView(model, session.kernel.id, session.kernelDisplayName, layout);
      layout.addWidget(view);
      const cellWidget = ReactWidget.create(<PackageSearcher nb={null} kernelId={session.kernel.id} kernelName={session.kernelDisplayName} uninstalledPackage={''} moduleError={false} layouty={layout}/>);
      layout.addWidget(cellWidget);
    });
  }
  protected onActiveCellChanged(msg: Message): void {
    if (this.notebookTracker.currentWidget && this.notebookTracker.currentWidget.session) {
      this.notebookTracker.currentWidget.session.ready.then(() => {
        let layout = this.layout as PanelLayout;
        let count = layout.widgets.length;
        for (let i = 0; i < count; i++) {
          layout.widgets[0].dispose();
        }
        let session = this.notebookTracker.currentWidget.session;
        let model = new KernelSpyModel(session.kernel! as Kernel.IKernel);
        const view = new MessageLogView(model, session.kernel.id, session.kernelDisplayName, layout);
        layout.addWidget(view);
        const cellWidget = ReactWidget.create(<PackageSearcher nb={null} kernelId={session.kernel.id} kernelName={session.kernelDisplayName} uninstalledPackage={''} moduleError={false} layouty={layout}/>);
        layout.addWidget(cellWidget);
      });
    }
  }
  
  private notebookTracker:INotebookTracker;
}

export default PackageTool;