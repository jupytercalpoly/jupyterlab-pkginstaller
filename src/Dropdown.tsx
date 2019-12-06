import React from 'react';

// import Async from 'react-select';

import StyleClasses from './style';
const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
// const customStyles = {
//   option: (provided: JSON, state: JSON) => ({
//     ...provided,
//     backgroundColor: 'transparent',
//     color: 'var(--jp-ui-font-color1)',
//     fontSize: 'var(--jp-ui-font-size1)',
//     wordWrap: 'break-word',
//   }),
//   menu: () => ({
//     border: 'none',
//     borderRadius: 'var(--jp-border-radius)',
//     boxShadow: 'inset 0 0 3px var(--jp-border-width) var(--jp-input-active-box-shadow-color)',
//     marginTop: 40,
//     position: 'relative',
//     backgroundColor: 'var(--jp-ui-inverse-font-color0)',
//   }),
//   control: () => ({
//     height: 0,
//     width: 0,
//   }),
//   container: (provided: JSON, state: JSON) => ({
//     ...provided,
//     position: 'initial',
//   })
// }

interface DropdownProps {
  stdOut: Array<string>;
}

/**
  * Render a toggleable dropdown of stdout logs from the installation process.
  */
export function Dropdown(props: DropdownProps) {
  //const [isVisible, setIsVisible] = useState(false);
  // function toggleVisibility() { 
  //   setIsVisible(!isVisible);
  // }
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // props.stdOut.forEach(element => Object.values(element).map(msg => <p>{msg}</p>));
  return (
    <div>
      {/* <button className={PackageBarStyleClasses.logsButton} 
        onClick={() => toggleVisibility()}>
        See logs
      </button> */}
      <Card>
      <CardActions disableSpacing>
        <button className={PackageBarStyleClasses.logsButton} 
          onClick={handleExpandClick}
        >See logs
        </button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {props.stdOut.map(e => <p style={{wordBreak: 'break-word', fontSize: 10, padding: '2px 0px'}}>{Object.values(e)[0].toString()}</p>)}
        </CardContent>
      </Collapse>
    </Card>
      {/* {props.stdOut.forEach(element => Object.values(element).forEach(msg => <p>{msg}</p>))} */}
{/*       
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
      /> */}
    </div>
  );
}