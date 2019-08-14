import React, { useState } from 'react';

import Async from 'react-select';

import StyleClasses from './style';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

const customStyles = {
  option: (provided: JSON, state: JSON) => ({
    ...provided,
    backgroundColor: 'var(--jp-ui-inverse-font-color0)',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 10,
    wordWrap: 'break-word',
  }),
  menu: (provided: JSON, state: JSON) => ({
    ...provided,
    borderRadius: 0,
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