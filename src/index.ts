import {
  JupyterFrontEnd, JupyterFrontEndPlugin,  ILabShell
} from '@jupyterlab/application';

import {
  INotebookTools, INotebookTracker, 
} from '@jupyterlab/notebook';

import PackageTool from './PackageTool';


import { Widget } from "@phosphor/widgets";

import '../style/index.css';

/**
 * Initialization data for the pkginstaller extension.
 */
// const pkginstaller: JupyterFrontEndPlugin<void> = {
//   id: 'pkginstaller',
//   autoStart: true,
//   requires: [INotebookTools, INotebookTracker],
//   activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {  
//     const packageTool = new PackageTool(app, notebookTracker);
//     cellTools.addItem({ tool: packageTool });
//   }
// };

export default {
  activate,
  id: "@jupyterlab-packageinstaller",
  requires: [ILabShell, INotebookTools, INotebookTracker],
  autoStart: true
} as JupyterFrontEndPlugin<any>;

function activate(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  notebookTracker: INotebookTracker
): any {
  
  const widget : Widget = new PackageTool(app, notebookTracker);
  widget.title.iconClass = "jp-SpreadsheetIcon jp-SideBar-tabIcon";
  widget.title.caption = "Package Installer";
  labShell.add(widget, "left");
}

// export default [
//   pkginstaller
// ];