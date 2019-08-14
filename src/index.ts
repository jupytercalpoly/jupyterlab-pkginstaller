import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import PackageTool from './PackageTool';

import {
  INotebookTools, INotebookTracker,
} from '@jupyterlab/notebook';

/**
 * Initialization data for the pkginstaller extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pkginstaller',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {
    const packageTool = new PackageTool(app, notebookTracker);
    cellTools.addItem({ tool: packageTool });
    console.log(5);
  }
};

export default [
  extension
];