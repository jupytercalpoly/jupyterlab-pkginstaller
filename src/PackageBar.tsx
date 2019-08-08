import { Kernel } from '@jupyterlab/services';

import React, { useState, useEffect, useCallback } from 'react';//useEffect

import StyleClasses from './style';

import Select from 'react-select';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  planets;
  async function fetchData() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://pypi.org/simple/"; 
    fetch(proxyurl + url).then(response => response.text())
    .then(contents => {
      var div = document.createElement("div");
      div.innerHTML = contents;
      var anchors = div.getElementsByTagName("a");
      const options = [];
      for (var i = 0; i < anchors.length; i++) {
          const packageName = anchors[i].textContent;
          options.push({value: packageName, label: packageName });
      }
      setPlanets(options.slice(0, 5));
    })
  }
  useEffect(() => {
    fetchData();
  });
  return (
    <div>
      <App packages={planets}/>
    </div>
  );
};

const App = (props: any) => (
  <div className="app">
    <div className="container">
      <Select options={props.packages} maxMenuHeight={100} placeholder={'Select package'} components={() => {return ''}} noOptionsMessage={()=> {return 'Try another package 😔'}}/>
    </div>
  </div>
);

function getPipMessage(install: boolean): string {
  let baseMsg: string = 'Successfully ';
  install ? baseMsg += 'installed!' : baseMsg += 'uninstalled!';
  return baseMsg + ' ✨ You may need to restart the kernel to use updated packages.';
}

// async function runPip(input: string, install: boolean, kernelId: string) {
//   let pipCommand: string = '';
//   install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
//   Kernel.listRunning().then(kernelModels => {
//     const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === kernelId))[0]);
//     kernel.requestExecute({ code: pipCommand + input, silent: true }).done.then(() => {
//       console.log(getPipMessage(install));
//       return getPipMessage(install);
//     })
//     //.onIOPub = msg => {console.log(msg.content)};
//   });
// }


// Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  const [install, setInstall] = useState(true);
  setInput;
  const [isSending, setIsSending] = useState(false)
  const sendRequest = useCallback(async (input: string, install: boolean, kernelId: string) => {
    // don't send again while we are sending
    setIsSending(true);
    let pipCommand: string = '';
    install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
    Kernel.listRunning().then(kernelModels => {
      const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === kernelId))[0]);
      kernel.requestExecute({ code: pipCommand + input, silent: true }).done.then(() => {
        setIsSending(false);
      })
      //.onIOPub = msg => {console.log(msg.content)};
    });
    // once the request is sent, update state again
  }, [isSending]) // update the callback if the state changes

  return (
    <div className={PackageBarStyleClasses.packageContainer}>
      <p className={PackageBarStyleClasses.title}>Install Packages</p>
      <div className={PackageBarStyleClasses.search}>
         <p>Search</p>
          <Planets/>
            {/* <input className={PackageBarStyleClasses.packageInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Package Name'
              type='text'
              name='packageName'
              required
            /> */}
      </div>
      <div className={PackageBarStyleClasses.buttonContainer}>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {sendRequest(input, true, props.kernelId); setInstall(true);}}>
          Install
        </button>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {sendRequest(input, false, props.kernelId); setInstall(false);}}>
          Uninstall
        </button>
      </div>
      {isSending && <p>Packages in orbit...</p>}
      {!isSending && <p>{getPipMessage(install)}</p>}
      <p>Current kernel: {props.kernelId}</p>
      <p>{input}</p>
    </div>
  );
}