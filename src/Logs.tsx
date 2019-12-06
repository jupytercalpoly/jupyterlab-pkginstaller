import { each } from '@phosphor/algorithm';

import { VDomRenderer } from '@jupyterlab/apputils';

import * as React from 'react';

import { KernelSpyModel, ThreadIterator } from './Model';

import { PackageInstaller } from './PackageInstaller';

import '../style/index.css';

/**
  * Return a PackageSearcher aware of the uninstalled package to process.
  */
function Message(props: any) {
  const parsedPackage = props.message.content.evalue.split("'")[1];
  const { ename } = props.message.content;
  return (
    <PackageInstaller 
      kernelId={props.kernelId} 
      kernelName={props.kernelName} 
      uninstalledPackage={parsedPackage} 
      moduleError={ename == "ModuleNotFoundError"} 
      nb={null}
    />
  );
}

/**
  * Render a PackageSearcher that responds to the current state of errorModule.
  */
export class MessageLogView extends VDomRenderer<KernelSpyModel> {
  constructor(model: KernelSpyModel, kernelId: string, kernelName: string){
    super();
    this.model = model;
    this.kernelId = kernelId;
    this.kernelName = kernelName;
  }
  protected render(): React.ReactElement<any> {
    const model = this.model!;
    let errorMessage: React.ReactElement<any>;
    let threads = new ThreadIterator(model.tree, this.collapsed);
    
    each(threads, ({args, hasChildren}) => {
      let { msg_type } = args.msg.header;
      if (msg_type == "error") {
        console.log("ERROR OCCURED");
        errorMessage = Message({ 
          message: args.msg, 
          kernelName: this.kernelName, 
          kernelId: this.kernelId, 
          moduleError: null
        });
      }
    });
    return errorMessage;
  }
  protected collapsed: {[key: string]: boolean} = {};
  protected kernelId: string;
  protected kernelName: string;
}

