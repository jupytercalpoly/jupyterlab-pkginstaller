import { PanelLayout } from '@phosphor/widgets';

import { Dialog, showDialog } from '@jupyterlab/apputils';

import { Kernel, KernelMessage } from '@jupyterlab/services';

import React, { useState, useCallback } from 'react'; 

import { Dropdown } from './Dropdown';

import StyleClasses from './style';

import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

import FormGroup from '@material-ui/core/FormGroup';

import Switch from '@material-ui/core/Switch';

import Grid from '@material-ui/core/Grid';


const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }),
)(Switch);

export default function CustomizedSwitches() {
  const [toggleDialog, setToggleDialog] = React.useState({
    dialogOn: false,
  });

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleDialog({ ...toggleDialog, [name]: event.target.checked });
    console.log(toggleDialog);
  };

  return (
    <FormGroup>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <AntSwitch
              checked={toggleDialog.dialogOn}
              onChange={handleChange('dialogOn')}
              value="dialogOn"
            />
          </Grid>
          <p className={PackageBarStyleClasses.switchText}>Enable PackageNotFound Dialogs <span className={PackageBarStyleClasses.switchAccent}>Experimental</span></p>
        </Grid>
    </FormGroup>
  );
}

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

interface PackageSearcherProps {
  kernelId: string;
  kernelName: string;
  uninstalledPackage: string;
  moduleError: boolean;
  layouty: PanelLayout;
}

/**
  * Return a human-friendly message indicating whether the installation 
  * or uninstallation process was successful.
  */
function getPipMessage(install: boolean, successfulProcess: boolean, packageToProcess: string): string {
  if (successfulProcess === true) {
    let baseMsg: string = '✨ ';
    install ? baseMsg += 'Installed ' : baseMsg += 'Uninstalled ';
    return baseMsg + packageToProcess + '!';
  } else if (successfulProcess === false) {
  let baseMsg: string = packageToProcess + ' could not ';
  install? baseMsg += 'install.' : baseMsg += 'uninstall.';
  return baseMsg;
  }
  return 'Working... Please wait.';
}

/**
  * Render a search-bar-and-buttons UI that allows
  * installation and uninstallation of packages.
  */
export function PackageSearcher(props: PackageSearcherProps) {
  const [input, setInput] = useState('');
  const [packageToProcess, setPackageToProcess] = useState('');
  const [install, setInstall] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [successfulProcess, setSuccessfulProcess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false)
  const [stdOut, setStdOut] = useState([]);
  const [moduleErrorOccurred, setModuleErrorOccurred] = useState(props.moduleError);
  const [toggleDialog, setToggleDialog] = React.useState({
    dialogOn: false,
  });

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleDialog({ ...toggleDialog, [name]: event.target.checked });
    console.log(toggleDialog);
  };


  /**
    * Parse stdout messages during the installation or uninstallation process to
    * determine if the process is successful.
    */
  function parseMessage(msg: KernelMessage.IStreamMsg): void {
    let msgContent = msg.content;
    if (msgContent.hasOwnProperty('text')) {
      stdOut.unshift({value: msgContent.text, label: msgContent.text});
      setStdOut(stdOut);
      if (msgContent.text.includes('Successfully') || 
        msgContent.text.includes('already satisfied')) {
        setSuccessfulProcess(true);
      } else if (msgContent.text.includes('ERROR') || 
        msgContent.text.includes('Skipping')) {
        setSuccessfulProcess(false);
      } 
      setIsProcessing(false);
      setShowMessage(true);
      setModuleErrorOccurred(false);
    }
  }

  /**
    * Execute an inline pip magic in the current active kernel's 
    * environment to install or uninstall a package.
    */
  const sendRequest = useCallback(async (input: string, install: boolean) => {
    setIsProcessing(true);
    setPackageToProcess(input);
    let pipCommand: string = '';
    install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
    Kernel.listRunning().then(kernelModels => {
      const kernel = Kernel.connectTo(
        (kernelModels.filter(kernelModel => kernelModel.id === props.kernelId))[0]
      );
      kernel.requestExecute({
        code: pipCommand + input, silent: true
      }).onIOPub = msg => {parseMessage(msg as KernelMessage.IStreamMsg); 
      }; 
    });
  }, [isProcessing]) 

  /**
    * Show a Package Not Found dialog if a ModuleNotFound error occurs.
    */
  function installDialog(chooseError: string) {
    let body = (
      <div>
        <p>
          Would you like to install <span className={PackageBarStyleClasses.uninstalledPackage}>{chooseError}</span> in this kernel?</p>
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
      if (result.button.accept) {
        sendRequest(chooseError, true); 
        setInstall(true);
      }
      return result.button.accept;
    });
  }
  if (moduleErrorOccurred && toggleDialog.dialogOn) { 
    let uninstalledPackage: string = props.uninstalledPackage;
    if (uninstalledPackage) {
      installDialog(uninstalledPackage);
    }
    setInput(uninstalledPackage);
    setModuleErrorOccurred(false);
  }
  return (
 
    
    <div className={PackageBarStyleClasses.packageContainer}>
      <p className={PackageBarStyleClasses.PIComponentHeader}>PyPI Package Installer</p>
      <p className={PackageBarStyleClasses.topBar}>Current Environment: {props.kernelName}</p>
      <div className={PackageBarStyleClasses.search}>
        <div className={PackageBarStyleClasses.heading}>
          <p className={PackageBarStyleClasses.searchTitle}>Package Name</p>
          {isProcessing && <p className={PackageBarStyleClasses.messageText}>Working... Please wait.</p>}
          {!isProcessing && showMessage && <p className={PackageBarStyleClasses.messageText}>{getPipMessage(install, successfulProcess, packageToProcess)}</p>}
        </div>
        {!moduleErrorOccurred && <input id='result' className={PackageBarStyleClasses.packageInput}
              value={input} 
              onChange={e => setInput(e.target.value)}
              type='text'
              name='packageToProcess'
              required
        />}
        {moduleErrorOccurred && <input id='result' className={PackageBarStyleClasses.packageInput}
              value={props.uninstalledPackage} 
              onChange={e => setInput(e.target.value)}
              type='text'
              name='packageToProcess'
              required
        />}
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
      <FormGroup>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <AntSwitch
              checked={toggleDialog.dialogOn}
              onChange={handleChange('dialogOn')}
              value="dialogOn"
            />
          </Grid>
          <p className={PackageBarStyleClasses.switchText}>Enable Dialogs <span className={PackageBarStyleClasses.switchAccent}>Experimental</span></p>
        </Grid>
      </FormGroup>
      {showMessage && <Dropdown stdOut={stdOut}/>}
      </div>
  
  );
}

