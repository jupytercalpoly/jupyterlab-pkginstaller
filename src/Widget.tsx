'use strict';

import * as React from 'react';

import { VDomRenderer, Toolbar } from '@jupyterlab/apputils';

import { Kernel } from '@jupyterlab/services';

import { each } from '@phosphor/algorithm';

import { Widget, BoxLayout } from '@phosphor/widgets';

import { KernelSpyModel, ThreadIterator } from './model';

import '../style/index.css';
//import ReactDOM from 'react-dom';
// function Welcome() {
//   return <h1>{Math.random().toString(36).substring(7)}</h1>;
// }



function Message(props: any): any {
  const msg = props.message;
  const msgId = msg.header.msg_id;
  return <div key={`${msgId}`}>{msg.content.evalue}</div>;
}
// function Messagey(props: any): any {
//   return <div>asdasd</div>;
// }
export class MessageLogView extends VDomRenderer<KernelSpyModel> {
  constructor(model: KernelSpyModel) {
    super();
    this.model = model;
  }
  protected render(): React.ReactElement<any>[] {
    const model = this.model!;
    let elements: React.ReactElement<any>[] = [];
    let threads = new ThreadIterator(model.tree, this.collapsed);
    each(threads, ({args, hasChildren}) => {
      if (args.msg.header.msg_type=="error") {
        elements = [Message({ 
          message:args.msg
        })];
      }
    });
    // ReactDOM.render(
    //   element,
    //   this.node
    // );
    return [elements[0]];
  }
  // get elemento(): React.ReactElement<any>[] {
  //   return this.render();
  // }
  protected collapsed: {[key: string]: boolean} = {};
}

export class KernelSpyView extends Widget {
  constructor(kernel: Kernel.IKernel) {
    super();
    this._model = new KernelSpyModel(kernel);
    //log("Model log", this._model.log[this._model.log.length - 1]);
    this._messagelog = new MessageLogView(this._model);
    //console.log("Elemento", this._messagelog);
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
