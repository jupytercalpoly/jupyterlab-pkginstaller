import React, { useState } from 'react';
//import Select from 'react-select';
import StyleClasses from './style';
import Async from 'react-select';
const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '--jp-ui-inverse-font-color0',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 10,
    wordWrap: 'break-word',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 0,
    marginTop: 40,
    position: 'relative',
  }),
  control: () => ({
    height: 0,
    width: 0,
  }),
  container: (provided: any, state: any) => ({
    ...provided,
    position: 'initial',
  })
}

export function Dropdown(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  function toggleOpen() { 
    setIsOpen(!isOpen);
  }
  return (
    <div>
      <button className={PackageBarStyleClasses.logsButton} onClick={(e) => toggleOpen()}>See logs</button>
      <Async
        key={JSON.stringify(props.stdOut)}
        options={props.stdOut}
        defaultValue={{ label: '', value: '' }}
        maxMenuHeight={100}
        isOptionDisabled={(option: any) => true}
        styles={customStyles}
        isClearable={false}
        backspaceRemovesValue={false}
        isSearchable={false}
        components={{ DropdownIndicator: null }}
        menuIsOpen={isOpen}
      />
    </div>
  );
}