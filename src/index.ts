import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import PackageTool from './PackageTool';

import {
  INotebookTools, INotebookTracker, NotebookPanel
} from '@jupyterlab/notebook';

import codeCellFactory from './codeCellFactory';
/**
 * Initialization data for the pkgmanager extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pkginstaller',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {
    const packageTool = new PackageTool(app, notebookTracker);
    cellTools.addItem({ tool: packageTool });
  }
};

const addEditorExtension: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
  id: 'addEditorExtension',
  autoStart: true,
  provides: NotebookPanel.IContentFactory,
  activate: (app: JupyterFrontEnd) => {
    console.log('pls work')
    return new codeCellFactory();
  }
};

export default [
  extension, 
  addEditorExtension];