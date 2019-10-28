import {
  JupyterFrontEnd, JupyterFrontEndPlugin,  ILabShell, ILayoutRestorer
} from '@jupyterlab/application';

// import { ReactWidget } from "@jupyterlab/apputils";
import { Widget } from '@phosphor/widgets';

import {
  INotebookTools, INotebookTracker, 
} from '@jupyterlab/notebook';

import PackageTool from './PackageTool';
import MyWidget from './toc';

// import { Widget } from "@phosphor/widgets";


import '../style/index.css';

/**
 * Initialization data for the pkginstaller extension.
 */
const pkginstaller: JupyterFrontEndPlugin<void> = {
  id: 'pkginstaller',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {  
    const packageTool = new PackageTool(app, notebookTracker);
    cellTools.addItem({ tool: packageTool });
  }
};

const id = "@jupyterlab/dataregistry-extension:data-explorer";
/**
 * Adds a visual data explorer to the sidebar.
 */
const panelly: JupyterFrontEndPlugin<void> = {
  activate,
  id,
  requires: [ILabShell, ILayoutRestorer],
  autoStart: true
} as JupyterFrontEndPlugin<void>;

function activate(
  lab: JupyterFrontEnd,
  labShell: ILabShell,
  restorer: ILayoutRestorer
): void {

  // Create a dataset with this URL
  const widget: Widget = new MyWidget();
  widget.id = "@jupyterlab-dataRegistry/explorer";
  widget.title.iconClass = "jp-SpreadsheetIcon jp-SideBar-tabIcon";
  widget.title.caption = "Data Explorer";

  restorer.add(widget, widget.id);
  labShell.add(widget, "left");
}

export default [
  pkginstaller, panelly
];