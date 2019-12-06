import React from 'react';

import StyleClasses from './style';
const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const compStyle = {
  border: 'none',
  borderRadius: 'var(--jp-border-radius)',
  boxShadow: 'inset 0 0 3px var(--jp-border-width) var(--jp-input-active-box-shadow-color)',
  backgroundColor: 'var(--jp-ui-inverse-font-color0)',
  maxHeight: 200, 
  overflow: 'auto'
}
interface DropdownProps {
  stdOut: Array<string>;
}

/**
  * Render a toggleable dropdown of stdout logs from the installation process.
  */
export function Dropdown(props: DropdownProps) {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
      <button className={PackageBarStyleClasses.logsButton} 
          onClick={handleExpandClick}
        >See logs
        </button>
      <Card style={{boxShadow: 'none'}}>
        {expanded && <CardContent style={compStyle}>
          {props.stdOut.map(e => <p style={{wordBreak: 'break-word', fontSize: 10, padding: '4px 0px'}}>{Object.values(e)[0].toString()}</p>)}
        </CardContent>}
    </Card>
    </div>
  );
}