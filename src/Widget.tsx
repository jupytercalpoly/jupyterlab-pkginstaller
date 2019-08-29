'use strict';

import * as React from 'react';

import { VDomRenderer, Toolbar } from '@jupyterlab/apputils';

import { Kernel } from '@jupyterlab/services';

import { each } from '@phosphor/algorithm';

import { Widget, BoxLayout, PanelLayout } from '@phosphor/widgets';

import { KernelSpyModel, ThreadIterator } from './model';

import '../style/index.css';

import { PackageSearcher } from './PackageBar';

function Message(props: any): any {
  const msg = props.message;
  return (
    <PackageSearcher kernelId={props.kernelId} kernelName={props.kernelName} uninstalledPackage={msg.content.evalue.split("'")[1]} moduleError={props.moduleError} layouty={props.layouty}/>
  );
}

export class MessageLogView extends VDomRenderer<KernelSpyModel> {
  constructor(model: KernelSpyModel, kernelId: string, kernelName: string, layouty: PanelLayout) {
    super();
    this.model = model;
    this.kernelName = kernelName;
    this.kernelId = kernelId;
    this.layouty = this.layouty;
  }
  protected render(): React.ReactElement<any>[] {
    const model = this.model!;
    let elements: React.ReactElement<any>[] = [];
    let threads = new ThreadIterator(model.tree, this.collapsed);
    each(threads, ({args, hasChildren}) => {
      if (args.msg.header.msg_type=="error") {
        elements = [Message({ 
          message:args.msg, kernelName: this.kernelName, kernelId: this.kernelId, moduleError: true, layouty: this.layouty
        })];
      }
    });
    return [elements[0]];
  }
  protected collapsed: {[key: string]: boolean} = {};
  protected kernelName: string;
  protected kernelId: string;
  protected layouty: PanelLayout;
}

export class KernelSpyView extends Widget {
  constructor(kernel: Kernel.IKernel) {
    super();
    this._model = new KernelSpyModel(kernel);
    this.addClass('jp-kernelspy-view');
    this.id = `kernelspy-${kernel.id}`;
    this.title.label = 'Show errors';
    let layout = this.layout = new BoxLayout();
    this._toolbar = new Toolbar();
    this._toolbar.addClass('jp-kernelspy-toolbar');
    layout.addWidget(this._toolbar);
    BoxLayout.setStretch(this._toolbar, 0);
    
  }
  get messageLog(): MessageLogView {
    return this._messagelog;
  }

  get model(): KernelSpyModel {
    return this._model;
  }
  private _toolbar: Toolbar<Widget>;
  private _messagelog: MessageLogView;
  private _model: KernelSpyModel;
}
