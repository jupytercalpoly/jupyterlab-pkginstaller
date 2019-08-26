'use strict';

import * as React from 'react';

import { VDomRenderer, Toolbar } from '@jupyterlab/apputils';

import { Kernel } from '@jupyterlab/services';

import { each } from '@phosphor/algorithm';

import { Widget, BoxLayout } from '@phosphor/widgets';

import { KernelSpyModel, ThreadIterator } from './model';

import '../style/index.css';

function Message(props: any): any {
  const msg = props.message;
  return <p>{msg.content.evalue}</p>;
}
export class MessageLogView extends VDomRenderer<KernelSpyModel> {
  constructor(model: KernelSpyModel) {
    super();
    this.model = model;
  }
  protected render(): React.ReactElement<any>[] {
    const model = this.model!;
    const elements: React.ReactElement<any>[] = [];
    let threads = new ThreadIterator(model.tree, this.collapsed);
    each(threads, ({args, hasChildren}) => {
      if (args.msg.header.msg_type=="error") {
        elements.push(Message({ 
          message: args.msg
        }));
      }
    });
    return elements;
  }
  protected collapsed: {[key: string]: boolean} = {};
}

export class KernelSpyView extends Widget {
  constructor(kernel: Kernel.IKernel) {
    super();
    this._model = new KernelSpyModel(kernel);
    this._messagelog = new MessageLogView(this._model);
    this.addClass('jp-kernelspy-view');
    this.id = `kernelspy-${kernel.id}`;
    this.title.label = 'Show errors';
    let layout = this.layout = new BoxLayout();
    this._toolbar = new Toolbar();
    this._toolbar.addClass('jp-kernelspy-toolbar');
    layout.addWidget(this._toolbar);
    layout.addWidget(this._messagelog);
    BoxLayout.setStretch(this._toolbar, 0);
    BoxLayout.setStretch(this._messagelog, 1);
  }
  get model(): KernelSpyModel {
    return this._model;
  }
  private _toolbar: Toolbar<Widget>;
  private _messagelog: MessageLogView;
  private _model: KernelSpyModel;
}
