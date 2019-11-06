// import * as React from 'react';
// import { ReactWidget } from '@jupyterlab/apputils';
// //import StyleClasses from './style';
// //import { PackageSearcher } from './PackageBar';
// import {Message} from '@phosphor/messaging';
// //const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

// export default class MyWidget extends ReactWidget {
//   constructor(randomInt: any) {
//     super();
//     this.randomInt = randomInt;
//     this.kernelId = null; 
//     this.kernelName = null;
//     console.log("UPDATE*********");
//   }
//   protected onUpdateRequest(msg: Message): void {
//     this.randomInt.currentWidget.session.ready.then(() => {
//       let session = this.randomInt.currentWidget.session;
//       this.kernelId = session.kernel.id;
//       this.kernelName = session.kernelDisplayName;
//       console.log(this.kernelId, this.kernelName);
//     });
//   }
//   render() {
//     return (
//       <p>{this.kernelId}</p>
//       // <div className={PackageBarStyleClasses.PIComponent}>
//       //   <PackageSearcher kernelId={null} kernelName={null} uninstalledPackage={null} moduleError={null} layouty={null}/>
//       // </div>
//     );
//   }
//   private randomInt: any;
//   private kernelId: any; 
//   private kernelName: any;
// }

import * as React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
//import StyleClasses from './style';
//import { PackageSearcher } from './PackageBar';
import {Message} from '@phosphor/messaging';
//const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

export default class MyWidget extends ReactWidget {
  constructor(randomInt: any) {
    super();
    this.randomInt = randomInt;
    this.num = "hiya";
    console.log(this.randomInt);
  }
  protected onUpdateRequest(msg: Message): void {
    this.num = this.num + "a";
  }
  render() {
    return (
      <p>{this.num}</p>
      // <div className={PackageBarStyleClasses.PIComponent}>
      //   <PackageSearcher kernelId={null} kernelName={null} uninstalledPackage={null} moduleError={null} layouty={null}/>
      // </div>
    );
  }
  private randomInt: any;
  private num: any;
}