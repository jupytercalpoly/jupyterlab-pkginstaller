import { Kernel, KernelMessage } from '@jupyterlab/services';

import React, { useState, useCallback,  } from 'react'; //useEffect

import StyleClasses from './style';

import { Dropdown } from './Dropdown';

import { Dialog, showDialog } from '@jupyterlab/apputils';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

interface PackageSearcherProps {
  kernelId: string;
  kernelName: string;
  uninstalledPackage: string;
}

//Determine which pip message to show on button click
function getPipMessage(install: boolean, successfulProcess: boolean, packageToProcess: string): string {
  if (!successfulProcess) { 
    let baseMsg: string = packageToProcess + ' could not ';
    install? baseMsg += 'install.' : baseMsg += 'uninstall.';
    return baseMsg;
  }
  let baseMsg: string = '✨ ';
  install ? baseMsg += 'Installed ' : baseMsg += 'Uninstalled ';
  return baseMsg + packageToProcess + '!';
}

//Render a component to search for a package to install
export function PackageSearcher(props: PackageSearcherProps) {
  const [input, setInput] = useState('');
  const [packageToProcess, setPackageToProcess] = useState('');
  const [install, setInstall] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [successfulProcess, setSuccessfulProcess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false)
  const [stdOut, setStdOut] = useState([]);
  const [moduleErrorOccurred, setModuleErrorOccurred] = useState(false);
  const [uninstalledPackageToProcess, setUninstalledPackageToProcess] = useState(null); setUninstalledPackageToProcess;

  //Parse stdout to determine status message
  function parseMessage(msg: KernelMessage.IStreamMsg): void {
    let msgContent = msg.content;
    if (msgContent.hasOwnProperty('text')) {
      stdOut.unshift({value: msgContent.text, label: msgContent.text});
      setStdOut(stdOut);
      if (msgContent.text.includes('Successfully') || msgContent.text.includes('already satisfied')) {
        setSuccessfulProcess(true);
      } else if (msgContent.text.includes('ERROR') || msgContent.text.includes('Skipping')) {
        setSuccessfulProcess(false);
      } 
      setShowMessage(true);
      setIsProcessing(false);
      setModuleErrorOccurred(false);
    }
  }

  //Process the package in input
  const sendRequest = useCallback(async (input: string, install: boolean) => {
    setIsProcessing(true);
    setPackageToProcess(input);
    let pipCommand: string = '';
    install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
    Kernel.listRunning().then(kernelModels => {
      const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === props.kernelId))[0]);
      kernel.requestExecute({
        code: pipCommand + input, silent: true
      }).onIOPub = msg => {parseMessage(msg as KernelMessage.IStreamMsg)}; 
    });
  }, [isProcessing]) 
  // function populatePackage(uninstalledPackage: string): void {
  //   const packageInput: HTMLInputElement = document.getElementById('result') as HTMLInputElement;
  //   packageInput.value = uninstalledPackage;
  // }

  //Display a dialog, called only when there is an import error
  function installDialog(chooseError: string) {
    let body = (
      <div>
        <p>Would you want to install <span className={PackageBarStyleClasses.uninstalledPackage}>{chooseError}</span> in this kernel?</p>
      </div>
    );
    return showDialog({
      title: 'Package Not Found',
      body,
      buttons: [
        Dialog.cancelButton(),
        Dialog.okButton({
          label: 'Install',
          caption: 'Install package in this kernel'
        })
      ]
    }).then(result => {
      // setpackageToProcess(packageToProcess);
      // setInput(uninstalledPackage);
      // setpackageToProcess(uninstalledPackage);
      // console.log("uninstalledPackage:", uninstalledPackageToProcess);
      // // console.log("input:", input);
      // // console.log("packageToProcess:", packageToProcess);
      // sendRequest(uninstalledPackageToProcess, true); 
      // setInstall(true);
      return result.button.accept;
    });
  }
  // useEffect(() => {
  //   console.log(uninstalledPackageToProcess);
  //   if (uninstalledPackageToProcess != null) {installDialog();}

  // }, [uninstalledPackageToProcess])

  function chooseerrorfunc(chooseError: string) {
    if (chooseError != null) {installDialog(chooseError);}
  }
  function handleError(): void {
    setModuleErrorOccurred(true); 
    let chooseError: string = ['names', 'pandas', 'time', 'asdaasd', '123'][Math.floor((Math.random() * 5))];
    console.log('random error', chooseError)
    setUninstalledPackageToProcess(chooseError);
    setInput(chooseError);
    chooseerrorfunc(chooseError);
    // installDialog(); 
    // populatePackage(uninstalledPackageToProcess);
  }

  return (
    <div className={PackageBarStyleClasses.packageContainer}>
      <button onClick={() => {handleError(); }}>
          Make error occur
      </button>
      <p className={PackageBarStyleClasses.title}>Install PyPI Packages</p>
      <p className={PackageBarStyleClasses.topBar}>Current Environment: {props.kernelName}</p>
      <div className={PackageBarStyleClasses.search}>
        <div className={PackageBarStyleClasses.heading}>
          <p className={PackageBarStyleClasses.searchTitle}>Package Name</p>
          {isProcessing && <p className={PackageBarStyleClasses.messageText}>Working... Please wait.</p>}
          {!isProcessing && showMessage && <p className={PackageBarStyleClasses.messageText}>{getPipMessage(install, successfulProcess, packageToProcess)}</p>}
        </div>
        {!moduleErrorOccurred && <input id='result' className={PackageBarStyleClasses.packageInput}
              value={input} // change to input 
              onChange={e => setInput(e.target.value)}
              //onClick={e => setInput((e.target as HTMLInputElement).value)}
              type='text'
              name='packageToProcess'
              required
        />}
        {moduleErrorOccurred && <input id='result' className={PackageBarStyleClasses.packageInput}
              value={uninstalledPackageToProcess} // change to input 
              onChange={e => setInput(e.target.value)}
              //onClick={e => setInput((e.target as HTMLInputElement).value)}
              type='text'
              name='packageToProcess'
              required
        />}
        <p>{input}</p>
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
      {successfulProcess && showMessage && !isProcessing && <p className={PackageBarStyleClasses.kernelPrompt}>You may need to update the kernel to see updated packages.</p>}
      {showMessage && <Dropdown stdOut={stdOut}/>}
    </div>
  );
}


