import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import PackageTool from './PackageTool';

import {
  INotebookTools, INotebookTracker
} from '@jupyterlab/notebook';

/**
 * Initialization data for the pkgmanager extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pkgmanager',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab extension pkgmanager is activated!');
    const packageTool = new PackageTool(app, notebookTracker);
    cellTools.addItem({ tool: packageTool });
    console.log(13);
  }
};

export default extension;
