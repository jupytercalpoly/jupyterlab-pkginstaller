import React, { useState } from 'react';

import Async from 'react-select';

import StyleClasses from './style';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

const customStyles = {
  option: (provided: JSON, state: JSON) => ({
    ...provided,
    backgroundColor: 'transparent',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 'var(--jp-ui-font-size1)',
    wordWrap: 'break-word',
  }),
  menu: () => ({
    border: 'var(--jp-border-width) solid var(--jp-border-color1)',
    borderRadius: 'var(--jp-border-radius)',
    boxShadow: 'inset 0 0 5px var(--jp-border-width) var(--jp-input-active-box-shadow-color)',
    marginTop: 40,
    position: 'relative',
    backgroundColor: 'var(--jp-ui-inverse-font-color0)',
  }),
  control: () => ({
    height: 0,
    width: 0,
  }),
  container: (provided: JSON, state: JSON) => ({
    ...provided,
    position: 'initial',
  })
}

interface DropdownProps {
  stdOut: Array<string>;
}

export function Dropdown(props: DropdownProps) {
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
        isOptionDisabled={(option: JSON) => true}
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