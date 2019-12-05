import {
  JupyterFrontEnd, JupyterFrontEndPlugin,  ILabShell, ILayoutRestorer
} from '@jupyterlab/application';

import { Widget } from '@phosphor/widgets';

import {
  INotebookTracker, INotebookTools
} from '@jupyterlab/notebook';

import PackageTool from './PackageTool';

import PInstallerWidget from './PackageInstaller';

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
  requires: [ILabShell, ILayoutRestorer, INotebookTracker],
  autoStart: true
} as JupyterFrontEndPlugin<void>;

function activate(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  restorer: ILayoutRestorer,
  notebookTracker: INotebookTracker
): void {

  let widget: Widget = new PInstallerWidget(notebookTracker);
  widget.id = "@jupyterlab-pkginstaller";
  widget.title.iconClass = "jp-PackageInstaller-icon jp-SideBar-tabIcon";
  widget.title.caption = "Package Installer";
  restorer.add(widget, widget.id);
  labShell.add(widget, "left");
  notebookTracker.currentChanged.connect(() => {
    widget.update();
  });

}

export default [
  panelly, pkginstaller //kernelStatus, //pkginstaller
];