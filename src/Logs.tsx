import { each } from '@phosphor/algorithm';

import { PanelLayout } from '@phosphor/widgets';

import { VDomRenderer } from '@jupyterlab/apputils';

import * as React from 'react';

import { KernelSpyModel, ThreadIterator } from './Model';

import { PackageSearcher } from './PackageBar';

import '../style/index.css';

/**
  * Return a PackageSearcher aware of the uninstalled package to process.
  */
function Message(props: any) {
  const packagefromMessage = props.message.content.evalue.split("'")[1];
  return (
    <PackageSearcher kernelId={props.kernelId} kernelName={props.kernelName} uninstalledPackage={packagefromMessage} moduleError={props.message.content.ename == "ModuleNotFoundError"} nb={null}/>//layouty={props.layouty} nb={null}/>
  );
}

/**
  * Render a PackageSearcher that responds to the current state of errorModule.
  */
export class MessageLogView extends VDomRenderer<KernelSpyModel> {
  constructor(model: KernelSpyModel, kernelId: string, kernelName: string){//, layouty: PanelLayout) {
    super();
    this.model = model;
    this.kernelId = kernelId;
    this.kernelName = kernelName;
    this.layouty = layouty;

  }
  protected render(): React.ReactElement<any> {
    const model = this.model!;
    let errorMessage: React.ReactElement<any>;
    let threads = new ThreadIterator(model.tree, this.collapsed);
    each(threads, ({args, hasChildren}) => {
      if (args.msg.header.msg_type=="error") {
        // let count = this.layouty.widgets.length;
        // if (count > 1) {
        //   this.layouty.widgets[count - 1].dispose();  
        // }
        errorMessage = Message({ 
          message:args.msg, kernelName: this.kernelName, kernelId: this.kernelId, moduleError: null//, layouty: this.layouty
        });
      }
    });
    console.log(errorMessage);
    return errorMessage;
  }
  protected collapsed: {[key: string]: boolean} = {};
  protected kernelId: string;
  protected kernelName: string;
  protected layouty: PanelLayout;
}

