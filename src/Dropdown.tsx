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
    border: 'none',
    borderRadius: 'var(--jp-border-radius)',
    boxShadow: 'inset 0 0 3px var(--jp-border-width) var(--jp-input-active-box-shadow-color)',
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

/**
  * Render a toggleable dropdown of stdout logs from the installation process.
  */
export function Dropdown(props: DropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  function toggleVisibility() { 
    setIsVisible(!isVisible);
  }
  props.stdOut.forEach(element => Object.values(element).forEach(msg => <p>{msg}</p>));
  return (
    <div>
      <button className={PackageBarStyleClasses.logsButton} 
        onClick={() => toggleVisibility()}>
        See logs
      </button>
      {}
      <Async
        key={JSON.stringify(props.stdOut)}
        options={props.stdOut}
        defaultValue={{ label: '', value: '' }}
        maxMenuHeight={100}
        isOptionDisabled={() => true}
        styles={customStyles}
        isClearable={false}
        backspaceRemovesValue={false}
        isSearchable={false}
        components={{ DropdownIndicator: null }}
        menuIsOpen={isVisible}
      />
    </div>
  );
}