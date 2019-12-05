import { Widget } from '@phosphor/widgets';

import {
  JupyterFrontEnd, JupyterFrontEndPlugin,  ILabShell, ILayoutRestorer
} from '@jupyterlab/application';

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
  id: '@jupyterlab/pkginstaller-extension',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker, ILabShell, ILayoutRestorer, INotebookTracker],
  activate: (
    app: JupyterFrontEnd, 
    cellTools: INotebookTools, 
    notebookTracker: INotebookTracker,
    labShell: ILabShell,
    restorer: ILayoutRestorer,
  ) => {  
    let widget: Widget = new PInstallerWidget(notebookTracker);
    widget.id = '@jupyterlab-pkginstaller';
    widget.title.iconClass = 'jp-PackageInstaller-icon jp-SideBar-tabIcon';
    widget.title.caption = 'Package Installer';
    restorer.add(widget, widget.id);
    labShell.add(widget, 'left');
    const packageTool = new PackageTool(app, notebookTracker);
    cellTools.addItem({ tool: packageTool });
    notebookTracker.currentChanged.connect(() => {
      widget.update();
    });
  }
};

export default [
  pkginstaller 
];