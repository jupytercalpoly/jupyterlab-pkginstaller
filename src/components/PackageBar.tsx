import { Kernel } from '@jupyterlab/services';

import React, { useState, useEffect } from 'react';//useEffect

import StyleClasses from './styles';

import Select from 'react-select';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;
// const scaryAnimals = [
//   { label: "Alligators", value: 1 },
//   { label: "Crocodiles", value: 2 },
//   { label: "Sharks", value: 3 },
//   { label: "Small crocodiles", value: 4 },
//   { label: "Smallest crocodiles", value: 5 },
//   { label: "Snakes", value: 6 },
// ];

// function MyComponent() {
//   const [movies, setMovies] = useState([{value: '1', label:'2'}]);

//     // Update the document title using the browser API
//     const proxyurl = "https://cors-anywhere.herokuapp.com/";
//     const url = "https://pypi.org/simple/"; // site that doesn’t send Access-Control-*
//     fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
//     .then(response => response.text())
//     .then(contents => {
//       var div = document.createElement("div");
//       div.innerHTML = contents;
//       var anchors = div.getElementsByTagName("a");
//       const options = [];
//       for (var i = 0; i < anchors.length; i++) {
//           const packageName = anchors[i].textContent;
//           options.push({value: packageName, label: packageName });
//       }
//       setMovies(options);
//     })
 
//   return (
//     <div>
//       {movies.map(movie => <p>{movie.value}</p>)}
//     </div>
//   )
// }

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  planets;
  async function fetchData() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://pypi.org/simple/"; // site that doesn’t send Access-Control-*
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

//Execute a silent pip install in the current active kernel using a line magic
function runPip(input: string, install: boolean, kernelId: string): any {
  let pipCommand: string = '';
  install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
  Kernel.listRunning().then(kernelModels => {
    
    const kernel = Kernel.connectTo((kernelModels.filter(kernelModel => kernelModel.id === kernelId))[0]);
    kernel.requestExecute({ code: pipCommand + input, silent: true }).done.then(() => {
      console.log(getPipMessage(install));
      return getPipMessage(install);
    })
    //.onIOPub = msg => {console.log(msg.content)};
  });
}

function getPipMessage(install: boolean): string {
  let baseMsg: string = 'Successfully ';
  install ? baseMsg += 'installed!' : baseMsg += 'uninstalled!';
  return baseMsg + ' ✨ You may need to restart the kernel to use updated packages.';
}




// Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  setInput;
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
        onClick={() => {runPip(input, true, props.kernelId);}}>
          Installa
        </button>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {runPip(input, false, props.kernelId);}}>
          Uninstall
        </button>
      </div>
      <p>Current kernel: {props.kernelId}</p>
      <p>{input}</p>
    </div>
  );
}