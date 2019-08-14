import { Kernel, KernelMessage } from '@jupyterlab/services';

import React, { useState, useCallback } from 'react'; 

import StyleClasses from './style';

import { Dropdown } from './Dropdown';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

interface PackageSearcherProps {
  kernelId: string;
  kernelName: string;
}

//Determine which pip message to show on button click
function getPipMessage(install: boolean, messageSuccess: boolean, packageName: string): string {
  if (!messageSuccess) { 
    let baseMsg: string = packageName + ' could not ';
    install? baseMsg += 'install.' : baseMsg += 'uninstall.';
    return baseMsg;
  }
  let baseMsg: string = '✨ ';
  install ? baseMsg += 'Installed ' : baseMsg += 'Uninstalled ';
  return baseMsg + packageName + '!';
}

//Render a component to search for a package to install
export function PackageSearcher(props: PackageSearcherProps) {
  const [input, setInput] = useState('');
  const [packageName, setPackageName] = useState('');
  const [install, setInstall] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false)
  const [stdOut, setStdOut] = useState([]);
  
  //Parse stdout to determine status message
  function parseMessage(msg: KernelMessage.IStreamMsg): void {
    let msgContent = msg.content;
    if (msgContent.hasOwnProperty('text')) {
      stdOut.unshift({value: msgContent.text, label: msgContent.text});
      setStdOut(stdOut);
      if (msgContent.text.includes('Successfully') || msgContent.text.includes('already satisfied')) {
        setMessageSuccess(true);
      } else if (msgContent.text.includes('ERROR') || msgContent.text.includes('Skipping')) {
        setMessageSuccess(false);
      } 
      setShowMessage(true);
      setIsSending(false);
    }
  }
  const sendRequest = useCallback(async (input: string, install: boolean) => {
    setIsSending(true);
    setPackageName(input);
    let pipCommand: string = '';
    install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
    Kernel.listRunning().then(kernelModels => {
      const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === props.kernelId))[0]);
      kernel.requestExecute({
        code: pipCommand + input, silent: true
      }).onIOPub = msg => {parseMessage(msg as KernelMessage.IStreamMsg)}; 
    });
  }, [isSending]) 
  return (
    <div className={PackageBarStyleClasses.packageContainer}>
      <p className={PackageBarStyleClasses.title}>Install PyPI Packages</p>
      <p className={PackageBarStyleClasses.topBar}>Current Environment: {props.kernelName}</p>
      <div className={PackageBarStyleClasses.search}>
        <div className={PackageBarStyleClasses.heading}>
          <p className={PackageBarStyleClasses.searchTitle}>Search</p>
          {isSending && <p className={PackageBarStyleClasses.messageText}>Working... Please wait.</p>}
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
      {messageSuccess && showMessage && <p className={PackageBarStyleClasses.kernelPrompt}>You may need to update the kernel to see updated packages.</p>}
      {showMessage && <Dropdown stdOut={stdOut}/>}
    </div>
  );
}