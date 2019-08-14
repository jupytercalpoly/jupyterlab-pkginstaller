import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import PackageTool from './PackageTool';

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
    console.log('ErrorModule1');
  }
};

const codeCellExtension: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
  id: 'addEditorExtension',
  autoStart: true,
  provides: NotebookPanel.IContentFactory,
  activate: (app: JupyterFrontEnd) => {
    console.log('ErrorModule2')
    return new CellFactory();
  }
};

export default [
  extension,
  codeCellExtension
];