import { style } from 'typestyle';

export namespace PackageBarStyleClasses {
  export const packageContainer = style({
    backgroundColor: '#F2F2F2',
    padding: '2em 1em',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '3px',
    margin: 'auto',
  });
  export const pipButton = style({
    backgroundColor: 'var(--md-blue-700)',
    color: '#f2f2f2',
    border: 'none',
    padding: '8px 0px',
    margin: 2,
    borderRadius: '2px',
  });
  export const packageInput = style({
    border: '1px solid var(--md-grey-400)',
    padding: 8,
    marginRight: 8,
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
  export const buttonContainer = style({
    marginTop: '0.5em',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '0.5em',
  });
}