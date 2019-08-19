import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import PackageTool from './PackageTool';

//import ErrorTool from './ErrorTool';

import {
  INotebookTools, INotebookTracker, NotebookPanel
} from '@jupyterlab/notebook';

import CellFactory from './CellFactory';


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
    console.log('+');
  }
};

const codeCellExtension: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
  id: 'addEditorExtension',
  autoStart: true,
  provides: NotebookPanel.IContentFactory,
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools) => {
    console.log(17)
    // const errorTool = new ErrorTool();
    // cellTools.addItem({ tool: errorTool });
    return new CellFactory();
  }
};

export default [
  extension,
  codeCellExtension
];