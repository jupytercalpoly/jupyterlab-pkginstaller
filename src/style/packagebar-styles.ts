import { style } from 'typestyle';

export namespace PackageBarStyleClasses {
  export const packageContainer = style({
    backgroundColor: '#F2F2F2',
    padding: '2em 1em 10em 1em',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '3px',
    margin: 'auto',
  });
  export const topBar = style({
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
  });
  export const kernelPrompt = style({
    paddingTop: 5,
  })
  export const pipButton = style({
    backgroundColor: 'var(--md-blue-700)',
    color: '#f2f2f2',
    border: 'none',
    padding: '8px 0px',
    margin: 0,
    borderRadius: '2px',
  });
  export const packageInput = style({
    border: '1px solid var(--md-grey-400)',
    padding: 8,
    boxSizing: 'border-box',
    fontSize: '1em',
  });
  export const logsButton = style({
    backgroundColor: 'none',
    color: 'var(--md-blue-700)',
    border: 'none',
    padding: '8px',
    margin: 0,
    marginTop: 4,
    borderRadius: 2,
    float: 'right',
  });
  export const packageLabel = style({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 10,
    paddingBottom: 2,
  });
  export const title = style({
    fontWeight: 'bold',
    fontSize: '18px',
    lineHeight: '21px',
    color: '#202020',
  });
  export const search = style({
    marginTop: '1em',
    display: 'flex',
    flexDirection: 'column',
  });
  export const messageText = style({
    color: '#4F4F4F',
    fontWeight: 'bold',
    fontSize: '10.88px',
    lineHeight: '13px',
    marginBottom: '0.75em',
  });
  export const searchTitle = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: '2.5em',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#4F4F4F',
    fontWeight: 'bold',
    fontSize: '10.88px',
    lineHeight: '13px',
    marginBottom: '0.75em',
  });
  export const heading = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: '2.5em',
  });
  export const buttonContainer = style({
    marginTop: '0.5em',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '0.5em',
  });
  export const loading = style({
    background: 'none',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX:'98%',
    backgroundPositionY: '50%',
    backgroundSize: '20px',
  });
}