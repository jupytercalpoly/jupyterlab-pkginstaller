import {
  JupyterFrontEnd, JupyterFrontEndPlugin,  ILabShell, ILayoutRestorer
} from '@jupyterlab/application';

//import { ReactWidget } from "@jupyterlab/apputils";
import { Widget } from '@phosphor/widgets';

import {
  INotebookTracker, INotebookTools //NotebookPanel // INotebookTools,
} from '@jupyterlab/notebook';

import PackageTool from './PackageTool';
import PInstallerWidget from './PackageInstaller';

import { KernelSpyModel } from './Model';

import { MessageLogView } from './Logs';
//import PackageSearcher from './PackageBar';
// import {
//   IStatusBar,
//   KernelStatus
// } from '@jupyterlab/statusbar';

// import { IClientSession } from '@jupyterlab/apputils';

// import { Title } from '@phosphor/widgets';
import { Kernel } from '@jupyterlab/services';
// import {
//   ConsolePanel,
//   IConsoleTracker
// } from '@jupyterlab/console';

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

  // Create a dataset with this URL
  //const newwidget = new PackageTool(app, notebookTracker); newwidget;
  // console.log(notebookTracker.currentWidget.session.kernel.id);
  let widget: Widget = new PInstallerWidget(notebookTracker);
  widget.id = "@jupyterlab-pkginstaller";
  widget.title.iconClass = "jp-PackageInstaller-icon jp-SideBar-tabIcon";
  widget.title.caption = "Package Installer";
  restorer.add(widget, widget.id);
  labShell.add(widget, "left");
  notebookTracker.currentChanged.connect(() => {
    console.log(notebookTracker);
    let session = notebookTracker.currentWidget.session;
    let model = new KernelSpyModel(session.kernel! as Kernel.IKernel);
    const view = new MessageLogView(model, session.kernel.id, session.kernelDisplayName);
    //layout.addWidget(view);
    view;
    widget.update();
  });

}

// /**
//  * A plugin that provides a kernel status item to the status bar.
//  */
// export const kernelStatus: JupyterFrontEndPlugin<void> = {
//   id: '@jupyterlab/statusbar-extension:kernel-status1',
//   autoStart: true,
//   requires: [IStatusBar, INotebookTracker, IConsoleTracker, ILabShell],
//   activate: (
//     app: JupyterFrontEnd,
//     statusBar: IStatusBar,
//     notebookTracker: INotebookTracker,
//     consoleTracker: IConsoleTracker,
//     labShell: ILabShell
//   ) => {
//     // When the status item is clicked, launch the kernel
//     // selection dialog for the current session.
//     let currentSession: IClientSession | null = null;
//     const changeKernel = async () => {
//       if (!currentSession) {
//         return;
//       }
//       await currentSession.selectKernel();
//     };

//     currentSession!.kernelChanged.connect(() => {
//       void currentSession.kernel.ready.then(() => {
//         console.log("kernel was changed");
//       });
//     });

//     // Create the status item.
//     const item = new KernelStatus({
//       onClick: changeKernel
//     });

//     // When the title of the active widget changes, update the label
//     // of the hover text.
//     const onTitleChanged = (title: Title<Widget>) => {
//       item.model!.activityName = title.label;
//       console.log(item.model!.session);
//     };

//     // Keep the session object on the status item up-to-date.
//     labShell.currentChanged.connect((_, change) => {
//       const { oldValue, newValue } = change;

//       // Clean up after the old value if it exists,
//       // listen for changes to the title of the activity
//       if (oldValue) {
//         oldValue.title.changed.disconnect(onTitleChanged);
//       }
//       if (newValue) {
//         newValue.title.changed.connect(onTitleChanged);
//       }

//       // Grab the session off of the current widget, if it exists.
//       if (newValue && consoleTracker.has(newValue)) {
//         currentSession = (newValue as ConsolePanel).session;
//       } else if (newValue && notebookTracker.has(newValue)) {
//         currentSession = (newValue as NotebookPanel).session;
//       } else {
//         currentSession = null;
//       }
//       item.model!.session = currentSession;
//     });

//     statusBar.registerStatusItem(
//       '@jupyterlab/statusbar-extension:kernel-status1',
//       {
//         item,
//         align: 'left',
//         rank: 1,
//         isActive: () => {
//           const current = labShell.currentWidget; 
//           return (
//             current &&
//             (notebookTracker.has(current) || consoleTracker.has(current))
//           );
//         }
//       }
//     );
//   }
// };

export default [
  panelly, pkginstaller//kernelStatus, //pkginstaller
];