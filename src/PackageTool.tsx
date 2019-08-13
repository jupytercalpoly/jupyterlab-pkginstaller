import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';

import { PanelLayout } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { JupyterFrontEnd } from '@jupyterlab/application';

import { PackageSearcher } from './PackageBar';

import { ReactWidget } from '@jupyterlab/apputils';

import { Kernel } from '@jupyterlab/services';

import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';

import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';

import * as React from 'react';

async function main(kernel: any) {
  const model = new OutputAreaModel();
          const rendermime = new RenderMimeRegistry({ initialFactories });
          const outputArea = new OutputArea({ model, rendermime });
          console.log(outputArea.node, outputArea.future.msg.header.msg_type);
          await outputArea.future.done;
          console.log('Test complete!');
}
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
      let session = this.notebookTracker.currentWidget.session
      const cellWidget = ReactWidget.create(<PackageSearcher kernelId={session.kernel.id} kernelName={session.kernelDisplayName}/>);
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
        let session = this.notebookTracker.currentWidget.session
        const cellWidget = ReactWidget.create(<PackageSearcher kernelId={session.kernel.id} kernelName={session.kernelDisplayName} kernel={session.kernel}/>);
        layout.addWidget(cellWidget);
        Kernel.listRunning().then(kernelModels => {
          const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === session.kernel.id))[0]);
          main(kernel);
        });
      });
    }
  }
  private notebookTracker:INotebookTracker;
}

export default PackageTool;