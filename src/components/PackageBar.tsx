
import { Kernel } from '@jupyterlab/services';

import React, { useState } from 'react';

import StyleClasses from './styles';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

function printContent(msg: any) {
  console.log("Printed msg:", msg.content);
  return msg.content;
}
//Execute a silent pip install in the current active kernel using a line magic
function runPip(input: string, install: boolean, kernelId: string): any {
  let pipCommand: string = '';
  install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
  Kernel.listRunning().then(kernelModels => {
    const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === kernelId))[0]);
    kernel.requestExecute({ code: pipCommand + input, silent: true }).onIOPub = msg => {return printContent(msg)};
  });
}

// Check if the searched package is already installed to avoid duplicates
//function isInstalled(input: string, packages: Array<string>): boolean {
//  return packages.indexOf(input) >= 0; 
//}

// Scrape available packages on PyPI using CORS
// function getAvailablePackages(): any {
//   const proxyurl = "https://cors-anywhere.herokuapp.com/";
//   const url = "https://pypi.org/simple/"; // site that doesn’t send Access-Control-*
//   fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
//   .then(response => response.text())
//   .then(contents => {
//     var div = document.createElement("div");
//     div.innerHTML = contents;
//     var anchors = div.getElementsByTagName("a");
//     const options = [];
//     for (var i = 0; i < anchors.length; i++) {
//         const packageName = anchors[i].textContent;
//         options.push({value: packageName, label: packageName });
//     }
//     return options;
//   })
//   .catch(() => {console.log("Can’t access " + url + " response. Blocked by browser?"); return {};})
// }

// Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  const [progress, setProgress] = useState('');
  return (
    <div className={PackageBarStyleClasses.packageContainer}>
      <h2>Install Packages</h2>
      <label className={PackageBarStyleClasses.packageLabel}>Search</label>
      <input className={PackageBarStyleClasses.packageInput}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Package Name'
        type='text'
        name='packageName'
        required
      />
      <button className={PackageBarStyleClasses.pipButton}
      onClick={() => {setProgress(runPip(input, true, props.kernelId));}}>
        Install
      </button>
      <button className={PackageBarStyleClasses.pipButton}
      onClick={() => {setProgress(runPip(input, false, props.kernelId));}}>
        Uninstall
      </button>
      <p>Current kernel: {props.kernelId}</p>
      <p>Pro: {progress}</p>
    </div>
  );
}