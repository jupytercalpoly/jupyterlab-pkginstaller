import { Kernel } from '@jupyterlab/services';

import React, { useState, useCallback } from 'react'; //useEffect

import StyleClasses from './style';

//import Select from 'react-select';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

//PyPI package scraper
// const getPackageData = () => {
//   const [packages, setPackages] = useState([]);
//   async function fetchData() {
//     const proxyurl = "https://cors-anywhere.herokuapp.com/";
//     const url = "https://pypi.org/simple/"; 
//     fetch(proxyurl + url).then(response => response.text())
//     .then(contents => {
//       var div = document.createElement("div");
//       div.innerHTML = contents;
//       var anchors = div.getElementsByTagName("a");
//       const options = [];
//       for (var i = 0; i < anchors.length; i++) {
//           const packageName = anchors[i].textContent;
//           options.push({value: packageName, label: packageName });
//       }
//       setPackages(options.slice(0, 5));
//     })
//   }
//   useEffect(() => {
//     fetchData();
//   });
//   return (
//     <div>
//       <Dropdown packages={packages}/>
//     </div>
//   );
// };

//Render dropdown input for packages
// const Dropdown = (props: any) => (
//   <div className="app">
//     <div className="container">
//       <Select options={props.packages} maxMenuHeight={100} placeholder={'Select package'} components={() => {return ''}} noOptionsMessage={()=> {return 'Try another package 😔'}}/>
//     </div>
//   </div>
// );

//Determine which pip message to show on button click
function getPipMessage(install: boolean, messageSuccess: boolean, packageName: string): string {
  if (!messageSuccess) {return packageName + ' could not be installed.';}
  let baseMsg: string = '✨ ';
  install ? baseMsg += 'Installed ' : baseMsg += 'Uninstalled ';
  return baseMsg + packageName + '!';
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

//Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  const [packageName, setPackageName] = useState('');
  const [install, setInstall] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  setInput;
  const [isSending, setIsSending] = useState(false)
  //Parse stdout message: returns 1 if successful change, 0 if no change, -1 if error
  function parseMessage(msgContent: any): void {
    if (msgContent.hasOwnProperty('text')) {
      if (msgContent.text.includes('Successfully') || msgContent.text.includes('already satisfied') || msgContent.text.includes('Skipping')) {
        setIsSending(false);
        setMessageSuccess(true);
      } else if (msgContent.text.includes('ERROR')) {
        setIsSending(false);
        setMessageSuccess(false);
      } 
    }
    setShowMessage(true);
  }
  const sendRequest = useCallback(async (input: string, install: boolean) => {
    // don't send again while we are sending
    setIsSending(true);
    setPackageName(input);
    let pipCommand: string = '';
    install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
    Kernel.listRunning().then(kernelModels => {
      const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === props.kernelId))[0]);
      kernel.requestExecute({ code: pipCommand + input, silent: true }).onIOPub = msg => {parseMessage(msg.content)}; //.done.then(() => {
        //
      //})
      //
    });
    // once the request is sent, update state again
  }, [isSending]) 

  return (
    <div className={PackageBarStyleClasses.packageContainer}>
      <p className={PackageBarStyleClasses.title}>Install PyPI Packages</p>
      <p className={PackageBarStyleClasses.topBar}>Current Environment: {props.kernelName}</p>
      <div className={PackageBarStyleClasses.search}>
        <div className={PackageBarStyleClasses.heading}>
          <p className={PackageBarStyleClasses.searchTitle}>Search</p>
          {isSending && showMessage && <p className={PackageBarStyleClasses.messageText}>Working... Please wait.</p>}
          {!isSending && showMessage && <p className={PackageBarStyleClasses.messageText}>{getPipMessage(install, messageSuccess, packageName)}</p>}
        </div>
        <input className={PackageBarStyleClasses.packageInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Package Name'
              type='text'
              name='packageName'
              required
            />
      </div>
      <div className={PackageBarStyleClasses.buttonContainer}>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {sendRequest(input, true); setInstall(true);}}>
          Install
        </button>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {sendRequest(input, false); setInstall(false);}}>
          Uninstall
        </button>
      </div>
      {!isSending && messageSuccess && <p className={PackageBarStyleClasses.restartPrompt}>You may need to restart the kernel to use updated packages.</p>}
    </div>
  );
}